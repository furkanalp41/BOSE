"""
Ortak temel tipler, enum'lar ve base modeller.

Go backend'indeki StockItem, Person yapılarıyla uyumludur.
"""

from datetime import datetime
from enum import Enum
from typing import Optional
from uuid import UUID, uuid4

from pydantic import BaseModel, Field


# ──────────────────────────────────────────────
# Enum'lar
# ──────────────────────────────────────────────

class AssetType(str, Enum):
    """Varlık tipi."""
    STOCK = "stock"     # BİST hissesi
    CRYPTO = "crypto"   # Kripto para


class RiskLevel(str, Enum):
    """Risk seviyesi kategorisi."""
    LOW = "low"              # Düşük risk (0-3)
    MEDIUM = "medium"        # Orta risk (4-6)
    HIGH = "high"            # Yüksek risk (7-8)
    VERY_HIGH = "very_high"  # Çok yüksek risk (9-10)


class AnalysisLanguage(str, Enum):
    """AI yanıt dili."""
    TR = "tr"
    EN = "en"


class AnalysisDepth(str, Enum):
    """Analiz derinliği."""
    BRIEF = "brief"        # Kısa özet (2-3 cümle)
    STANDARD = "standard"  # Standart analiz
    DETAILED = "detailed"  # Detaylı rapor


# ──────────────────────────────────────────────
# Ortak Veri Modelleri
# ──────────────────────────────────────────────

class StockItemSchema(BaseModel):
    """
    Varlık bilgisi modeli.
    
    Go karşılığı: models.StockItem
    """
    id: int = Field(..., description="Varlık benzersiz kimliği")
    name: str = Field(..., description="Sembol adı (ör: AAPL, THYAO.IS, BTCUSDT)")
    price: float = Field(..., ge=0, description="Güncel fiyat")
    desc: str = Field(default="", description="Varlık açıklaması (kategori vb.)")
    asset_type: AssetType = Field(default=AssetType.STOCK, description="Varlık tipi")
    risk_score: int = Field(
        default=5,
        ge=0,
        le=10,
        description="Risk skoru (0=en güvenli, 10=en riskli)",
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "id": 1,
                    "name": "THYAO.IS",
                    "price": 10.50,
                    "desc": "Airlines",
                    "asset_type": "stock",
                    "risk_score": 6,
                },
                {
                    "id": 2,
                    "name": "BTCUSDT",
                    "price": 67500.00,
                    "desc": "Bitcoin / USDT",
                    "asset_type": "crypto",
                    "risk_score": 9,
                },
            ]
        }
    }


class PortfolioHolding(BaseModel):
    """
    Portföydeki tek bir pozisyon.

    Go karşılığı: Portfolio map[*StockItem]int16 içindeki her entry.
    """
    stock: StockItemSchema = Field(..., description="Pozisyondaki varlık")
    quantity: int = Field(..., gt=0, description="Adet")
    avg_buy_price: Optional[float] = Field(
        default=None,
        ge=0,
        description="Ortalama alış fiyatı (biliniyorsa)",
    )


class UserContext(BaseModel):
    """
    Her AI query'sinde taşınan kullanıcı bağlamı.
    
    AI, kullanıcının risk tercihine ve kimliğine bu yapı üzerinden erişir.
    Go karşılığı: Person.ID + Person.Preference
    """
    user_id: UUID = Field(
        default_factory=uuid4,
        description="Kullanıcı benzersiz kimliği",
    )
    risk_preference: int = Field(
        ...,
        ge=0,
        le=10,
        description="Kullanıcının tercih ettiği risk seviyesi (0-10)",
    )
    display_name: Optional[str] = Field(
        default=None,
        description="Kullanıcı görünen adı",
    )


class AIResponseBase(BaseModel):
    """
    Tüm AI yanıtlarında ortak olan base alanlar.
    """
    request_id: UUID = Field(
        default_factory=uuid4,
        description="İstek takip kimliği",
    )
    model_used: str = Field(
        default="gemini-2.5-flash",
        description="Kullanılan AI modeli",
    )
    language: AnalysisLanguage = Field(
        default=AnalysisLanguage.TR,
        description="Yanıt dili",
    )
    created_at: datetime = Field(
        default_factory=datetime.now,
        description="Yanıt oluşturulma zamanı",
    )
    processing_time_ms: Optional[int] = Field(
        default=None,
        ge=0,
        description="İşlem süresi (milisaniye)",
    )
