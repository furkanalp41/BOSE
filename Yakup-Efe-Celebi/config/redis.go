package config

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/redis/go-redis/v9"
)

var (
	Redis    *redis.Client
	RedisCtx = context.Background()
)

func ConnectRedis() {
	url := os.Getenv("REDIS_URL")
	if url == "" {
		log.Println("⚠️  REDIS_URL boş — price cache devre dışı.")
		return
	}
	opt, err := redis.ParseURL(url)
	if err != nil {
		log.Println("⚠️  REDIS_URL parse hatası:", err)
		return
	}
	Redis = redis.NewClient(opt)
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	if err := Redis.Ping(ctx).Err(); err != nil {
		log.Println("⚠️  Redis ping başarısız:", err)
		Redis = nil
		return
	}
	log.Println("✅ (efe) Redis hazır — prices:latest cache aktif.")
}
