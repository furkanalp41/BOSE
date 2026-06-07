package messaging

import (
	"encoding/json"
	"log"
	"os"
	"time"

	"bose-enes/config"
	"bose-enes/models"

	amqp "github.com/rabbitmq/amqp091-go"
)

const (
	ExchangeName = "bose.events"
	QueueName    = "bose.enes.user-registered"
	RoutingKey   = "user.registered"
)

// userRegistered mirrors the payload Furkan publishes on user.registered.
type userRegistered struct {
	UserID   uint   `json:"userId"`
	Email    string `json:"email"`
	FullName string `json:"fullName"`
	TS       string `json:"ts"`
}

// Start subscribes to user.registered and gives every new user a starter
// "Default" watchlist, so their dashboard isn't empty on first login.
func Start() {
	go run()
}

func run() {
	url := os.Getenv("RABBITMQ_URL")
	if url == "" {
		log.Println("⚠️  RABBITMQ_URL boş — user.registered consumer kapalı.")
		return
	}
	// Reconnect loop — rabbitmq may come up after this service under compose.
	for {
		if err := consume(url); err != nil {
			log.Println("RabbitMQ consumer hatası, 5sn sonra yeniden bağlanılacak:", err)
			time.Sleep(5 * time.Second)
			continue
		}
		return
	}
}

func consume(url string) error {
	conn, err := amqp.Dial(url)
	if err != nil {
		return err
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		return err
	}
	defer ch.Close()

	if err := ch.ExchangeDeclare(ExchangeName, "topic", true, false, false, false, nil); err != nil {
		return err
	}
	if _, err := ch.QueueDeclare(QueueName, true, false, false, false, nil); err != nil {
		return err
	}
	if err := ch.QueueBind(QueueName, RoutingKey, ExchangeName, false, nil); err != nil {
		return err
	}

	deliveries, err := ch.Consume(QueueName, "", true, false, false, false, nil)
	if err != nil {
		return err
	}
	log.Println("✅ (enes) RabbitMQ consumer bağlandı — queue:", QueueName)

	for d := range deliveries {
		var ev userRegistered
		if err := json.Unmarshal(d.Body, &ev); err != nil {
			continue
		}
		ensureDefaultWatchlist(ev)
	}
	return nil
}

// ensureDefaultWatchlist creates a "Default" watchlist for the new user unless
// one already exists. Idempotent so a redelivered event is harmless.
func ensureDefaultWatchlist(ev userRegistered) {
	if config.DB == nil || ev.UserID == 0 {
		return
	}
	var existing models.Watchlist
	if err := config.DB.
		Where("user_id = ? AND name = ?", ev.UserID, "Default").
		First(&existing).Error; err == nil {
		return // already has a Default list
	}
	config.DB.Create(&models.Watchlist{UserID: ev.UserID, Name: "Default"})
}
