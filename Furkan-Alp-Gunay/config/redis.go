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

// ConnectRedis dials the shared Redis instance. If REDIS_URL is empty
// the service still boots, but session caching is disabled (logged once).
func ConnectRedis() {
	url := os.Getenv("REDIS_URL")
	if url == "" {
		log.Println("⚠️  REDIS_URL boş — session cache devre dışı.")
		return
	}

	opt, err := redis.ParseURL(url)
	if err != nil {
		log.Println("⚠️  REDIS_URL parse hatası: ", err)
		return
	}

	Redis = redis.NewClient(opt)
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	if err := Redis.Ping(ctx).Err(); err != nil {
		log.Println("⚠️  Redis ping başarısız, cache pas geçilecek: ", err)
		Redis = nil
		return
	}
	log.Println("✅ Redis bağlantısı hazır — session cache aktif.")
}
