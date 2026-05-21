package models

import "time"

// ChatMessage mirrors the chat_messages table owned by the Salih service.
// Defined here only so Yakup's DELETE /ai/history can purge rows.
type ChatMessage struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	UserID    uint      `json:"userId"`
	Role      string    `json:"role"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"createdAt"`
}

func (ChatMessage) TableName() string { return "chat_messages" }
