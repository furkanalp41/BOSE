package messaging

import (
	"context"
	"encoding/json"
	"log"
	"os"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

const (
	ExchangeName = "bose.events"
	ExchangeKind = "topic"
)

var (
	conn    *amqp.Connection
	channel *amqp.Channel
)

// Connect dials RabbitMQ and declares the shared bose.events topic exchange.
// Safe to call once at startup; degrades silently if RABBITMQ_URL is unset.
func Connect() {
	url := os.Getenv("RABBITMQ_URL")
	if url == "" {
		log.Println("⚠️  RABBITMQ_URL boş — user.registered publisher kapalı.")
		return
	}
	c, err := amqp.Dial(url)
	if err != nil {
		log.Println("⚠️  RabbitMQ dial hatası:", err)
		return
	}
	ch, err := c.Channel()
	if err != nil {
		log.Println("⚠️  RabbitMQ channel hatası:", err)
		_ = c.Close()
		return
	}
	if err := ch.ExchangeDeclare(ExchangeName, ExchangeKind, true, false, false, false, nil); err != nil {
		log.Println("⚠️  exchange declare hatası:", err)
		_ = ch.Close()
		_ = c.Close()
		return
	}
	conn = c
	channel = ch
	log.Println("✅ (furkan) RabbitMQ publisher hazır — exchange:", ExchangeName)
}

// Publish marshals payload as JSON and sends it to bose.events under routingKey.
// Returns nil silently when the publisher is not connected.
func Publish(routingKey string, payload interface{}) error {
	if channel == nil {
		return nil
	}
	body, err := json.Marshal(payload)
	if err != nil {
		return err
	}
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()
	return channel.PublishWithContext(ctx, ExchangeName, routingKey, false, false, amqp.Publishing{
		ContentType: "application/json",
		Body:        body,
		Timestamp:   time.Now(),
	})
}
