package messaging

import (
	"encoding/json"
	"log"
	"os"
	"time"

	"bose-salih/config"
	"bose-salih/models"

	amqp "github.com/rabbitmq/amqp091-go"
)

const (
	ExchangeName = "bose.events"
	QueueName    = "bose.salih.price-tick"
	RoutingKey   = "price.tick"
)

type priceTick struct {
	Symbol string  `json:"symbol"`
	Price  float64 `json:"price"`
}

// Start subscribes to the price.tick stream and evaluates active alerts
// against every incoming tick. Triggered alerts are marked inactive
// with a triggeredAt timestamp.
func Start() {
	go run()
}

func run() {
	url := os.Getenv("RABBITMQ_URL")
	if url == "" {
		log.Println("⚠️  RABBITMQ_URL boş — alert consumer kapalı.")
		return
	}

	// Lightweight reconnect loop — Docker compose may bring rabbitmq up
	// after this service, so we keep retrying.
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
	log.Println("✅ (salih) RabbitMQ consumer bağlandı — queue:", QueueName)

	for d := range deliveries {
		var tick priceTick
		if err := json.Unmarshal(d.Body, &tick); err != nil {
			continue
		}
		evaluateAlerts(tick)
	}
	return nil
}

// evaluateAlerts checks every active alert for the tick's symbol and
// marks any that match as triggered.
func evaluateAlerts(tick priceTick) {
	if config.DB == nil {
		return
	}
	var alerts []models.PriceAlert
	config.DB.
		Where("symbol = ? AND is_active = ?", tick.Symbol, true).
		Find(&alerts)

	for _, a := range alerts {
		triggered := false
		switch a.Condition {
		case "GREATER_THAN":
			triggered = tick.Price >= a.TargetPrice
		case "LESS_THAN":
			triggered = tick.Price <= a.TargetPrice
		}
		if !triggered {
			continue
		}
		now := time.Now()
		a.TriggeredAt = &now
		a.IsActive = false
		config.DB.Save(&a)
	}
}
