package messaging

import (
	"encoding/json"
	"log"
	"os"
	"time"

	"bose-furkan/config"
	"bose-furkan/models"

	amqp "github.com/rabbitmq/amqp091-go"
)

const (
	orderQueue = "bose.furkan.order-filled"
	orderKey   = "order.filled"
)

// orderFilled mirrors the payload Cem publishes on order.filled.
type orderFilled struct {
	OrderID  uint    `json:"orderId"`
	UserID   uint    `json:"userId"`
	Symbol   string  `json:"symbol"`
	Side     string  `json:"side"`
	Quantity float64 `json:"quantity"`
	Price    float64 `json:"price"`
	TS       string  `json:"ts"`
}

// StartOrderConsumer subscribes to order.filled and writes an audit row to
// order_logs for every filled order. It intentionally does NOT touch the
// user's balance — Cem's order service already debits/credits it atomically,
// so re-applying it here would double-count.
func StartOrderConsumer() {
	go runOrderConsumer()
}

func runOrderConsumer() {
	url := os.Getenv("RABBITMQ_URL")
	if url == "" {
		log.Println("⚠️  RABBITMQ_URL boş — order.filled consumer kapalı.")
		return
	}
	// Reconnect loop — rabbitmq may come up after this service under compose.
	for {
		if err := consumeOrders(url); err != nil {
			log.Println("RabbitMQ order consumer hatası, 5sn sonra yeniden bağlanılacak:", err)
			time.Sleep(5 * time.Second)
			continue
		}
		return
	}
}

func consumeOrders(url string) error {
	c, err := amqp.Dial(url)
	if err != nil {
		return err
	}
	defer c.Close()

	ch, err := c.Channel()
	if err != nil {
		return err
	}
	defer ch.Close()

	if err := ch.ExchangeDeclare(ExchangeName, ExchangeKind, true, false, false, false, nil); err != nil {
		return err
	}
	if _, err := ch.QueueDeclare(orderQueue, true, false, false, false, nil); err != nil {
		return err
	}
	if err := ch.QueueBind(orderQueue, orderKey, ExchangeName, false, nil); err != nil {
		return err
	}

	deliveries, err := ch.Consume(orderQueue, "", true, false, false, false, nil)
	if err != nil {
		return err
	}
	log.Println("✅ (furkan) RabbitMQ consumer bağlandı — queue:", orderQueue)

	for d := range deliveries {
		var ev orderFilled
		if err := json.Unmarshal(d.Body, &ev); err != nil {
			continue
		}
		logOrder(ev)
	}
	return nil
}

// logOrder records a filled order as an audit row. Idempotent on OrderID so a
// redelivered message doesn't create duplicate rows.
func logOrder(ev orderFilled) {
	if config.DB == nil || ev.OrderID == 0 {
		return
	}
	entry := models.OrderLog{
		OrderID:  ev.OrderID,
		UserID:   ev.UserID,
		Symbol:   ev.Symbol,
		Side:     ev.Side,
		Quantity: ev.Quantity,
		Price:    ev.Price,
	}
	config.DB.Where(models.OrderLog{OrderID: ev.OrderID}).FirstOrCreate(&entry)
}
