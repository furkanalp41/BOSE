package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID             uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	FullName       string         `gorm:"not null" json:"fullName"`
	Email          string         `gorm:"uniqueIndex;not null" json:"email"`
	Password       string         `gorm:"not null" json:"-"` // JSON'da şifre gizlenir
	Phone          string         `gorm:"default:''" json:"phone"`
	VirtualBalance float64        `gorm:"type:decimal(18,2);default:100000.00" json:"virtualBalance"`
	CreatedAt      time.Time      `json:"createdAt"`
	UpdatedAt      time.Time      `json:"updatedAt"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"` // Soft delete için (Kullanıcı silindiğinde veritabanında kalır ama sorgularda gelmez)
}

// --- KULLANICI METOTLARI (Senin İstediğin Getter/Setter ve İşlem Fonksiyonları) ---

// UpdateBalance: Başka endpointlerden (örn: Order) bakiyeyi güncellemek için
func (u *User) UpdateBalance(amount float64, db *gorm.DB) error {
	u.VirtualBalance += amount
	return db.Save(u).Error
}

// GetProfileData: Sadece güvenli verileri döndürmek için
func (u *User) GetProfileData() map[string]interface{} {
	return map[string]interface{}{
		"id":             u.ID,
		"fullName":       u.FullName,
		"email":          u.Email,
		"virtualBalance": u.VirtualBalance,
	}
}

// DTO'lar (Dışarıdan gelen verileri karşılayan yapılar)
type RegisterDTO struct {
	FullName string `json:"fullName"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginDTO struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UpdateUserDTO struct {
	FullName string `json:"fullName"`
	Phone    string `json:"phone"`
}
