package models

import "time"

// Announcement: Admin tarafından oluşturulan sistem duyurusu
type Announcement struct {
	ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Title     string    `gorm:"type:varchar(200);not null" json:"title"`
	Content   string    `gorm:"type:text;not null" json:"content"`
	CreatedAt time.Time `json:"created_at"`
}

func (Announcement) TableName() string {
	return "announcements"
}

type CreateAnnouncementInput struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}
