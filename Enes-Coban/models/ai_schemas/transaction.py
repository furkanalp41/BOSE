"""
İşlem Geçmişi Analizi Query/Response Modelleri.

Kullanıcının al/sat geçmişinden davranış kalıpları çıkartıp
yatırım alışkanlıklarını iyileştirme raporu üretir.
"""

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field

from ai_schemas.base import (
    AIResponseBase,
    AnalysisDepth,
    AnalysisLanguage,
    AssetType,
    UserContext,
)


class TransactionType(str, Enum):
    """İşlem tipi."""
    BUY = "buy"               # Alış
    SELL = "sell"              # Satış
    BUY_LIMIT = "buy_limit"   # Limitli alış emri
    SELL_LIMIT = "sell_limit"  # Limitli satış emri


class TransactionRecord(BaseModel):
    """
    Tek bir işlem kaydı.

    Kullanım:
        tx = TransactionRecord(
            symbol="THYAO.IS",
            tx_type=TransactionType.BUY,
            quantity=50,
            price=9.80,
            executed_at=datetime(2026, 1, 15, 10, 30),
        )
    """
    symbol: str = Field(..., description="İşlem yapılan varlık sembolü")
    asset_type: AssetType = Field(
        default=AssetType.STOCK,
        description="Varlık tipi",
    )
    tx_type: TransactionType = Field(..., description="İşlem tipi (AL/SAT)")
    quantity: int = Field(..., gt=0, description="İşlem adedi")
    price: float = Field(..., gt=0, description="İşlem fiyatı")
    total_value: Optional[float] = Field(
        default=None,
        ge=0,
        description="Toplam işlem tutarı (otomatik hesaplanabilir)",
    )
    executed_at: datetime = Field(..., description="İşlem tarihi ve saati")
    order_id: Optional[str] = Field(
        default=None,
        description="Emir ID'si (varsa)",
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "symbol": "THYAO.IS",
                    "asset_type": "stock",
                    "tx_type": "buy",
                    "quantity": 50,
                    "price": 9.80,
                    "total_value": 490.0,
                    "executed_at": "2026-01-15T10:30:00",
                    "order_id": "ORD-001",
                }
            ]
        }
    }


class TransactionAnalysisQuery(BaseModel):
    """
    İşlem geçmişi analiz isteği.

    Kullanıcının belirli bir dönemdeki alım-satım hareketlerini
    analiz etmek için kullanılır.
    """
    user_context: UserContext = Field(
        ...,
        description="Kullanıcı bağlamı",
    )
    transactions: list[TransactionRecord] = Field(
        ...,
        min_length=1,
        description="Analiz edilecek işlem kayıtları",
    )
    period_label: Optional[str] = Field(
        default=None,
        description="Analiz dönemi etiketi (ör: 'Son 30 gün', '2026 Q1')",
    )
    analysis_depth: AnalysisDepth = Field(
        default=AnalysisDepth.STANDARD,
        description="Analiz derinliği",
    )
    language: AnalysisLanguage = Field(
        default=AnalysisLanguage.TR,
        description="Yanıt dili",
    )
    focus_areas: list[str] = Field(
        default_factory=lambda: ["timing", "diversification", "risk_management"],
        description=(
            "Odaklanılacak analiz alanları. "
            "ör: timing, diversification, risk_management, profit_loss"
        ),
    )


class BehaviorPattern(BaseModel):
    """AI tarafından tespit edilen bir davranış kalıbı."""
    pattern_name: str = Field(
        ...,
        description="Kalıp adı (ör: 'Panik Satışı', 'Trend Takibi')",
    )
    description: str = Field(
        ...,
        description="Kalıp açıklaması",
    )
    frequency: int = Field(
        ...,
        ge=0,
        description="Bu kalıbın gözlemlenme sayısı",
    )
    impact: str = Field(
        ...,
        description="Kalıbın portföy üzerindeki etkisi (pozitif/negatif/nötr)",
    )
    suggestion: str = Field(
        ...,
        description="AI'nın iyileştirme önerisi",
    )


class TransactionAnalysisResponse(AIResponseBase):
    """İşlem geçmişi analizi AI yanıtı."""
    total_transactions: int = Field(
        ...,
        ge=0,
        description="Analiz edilen toplam işlem sayısı",
    )
    total_buy_volume: float = Field(
        default=0,
        ge=0,
        description="Toplam alış hacmi",
    )
    total_sell_volume: float = Field(
        default=0,
        ge=0,
        description="Toplam satış hacmi",
    )
    win_rate: Optional[float] = Field(
        default=None,
        ge=0,
        le=100,
        description="Kârlı işlem oranı (%)",
    )
    analysis_content: str = Field(
        ...,
        description="AI'nın genel değerlendirme metni",
    )
    behavior_patterns: list[BehaviorPattern] = Field(
        default_factory=list,
        description="Tespit edilen davranış kalıpları",
    )
    recommendations: list[str] = Field(
        default_factory=list,
        description="Yatırım alışkanlığı iyileştirme önerileri",
    )
    most_traded_symbol: Optional[str] = Field(
        default=None,
        description="En çok işlem yapılan varlık",
    )
