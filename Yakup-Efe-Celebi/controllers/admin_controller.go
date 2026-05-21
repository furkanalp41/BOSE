package controllers

import (
	"context"
	"time"

	"bose-efe/config"
	"bose-efe/messaging"

	"github.com/gofiber/fiber/v2"
)

// GetSystemHealth pings Postgres, Redis, and RabbitMQ and returns
// {database, redis, rabbitmq} status. Mirrors the OpenAPI HealthStatus.
func GetSystemHealth(c *fiber.Ctx) error {
	status := fiber.Map{
		"database": "DOWN",
		"redis":    "DOWN",
		"rabbitmq": "DOWN",
	}

	if config.DB != nil {
		sqlDB, err := config.DB.DB()
		if err == nil {
			ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
			defer cancel()
			if err := sqlDB.PingContext(ctx); err == nil {
				status["database"] = "UP"
			}
		}
	}

	if config.Redis != nil {
		ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
		defer cancel()
		if err := config.Redis.Ping(ctx).Err(); err == nil {
			status["redis"] = "UP"
		}
	}

	if messaging.Ping() {
		status["rabbitmq"] = "UP"
	}

	overall := "UP"
	for _, v := range status {
		if v == "DOWN" {
			overall = "DEGRADED"
			break
		}
	}
	return c.JSON(fiber.Map{
		"status":   overall,
		"services": status,
		"ts":       time.Now().Format(time.RFC3339),
	})
}
