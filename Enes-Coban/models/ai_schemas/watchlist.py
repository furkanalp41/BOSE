"""
Watchlist (İzleme Listesi) Analizi Query/Response Modelleri.

Kullanıcının takip ettiği varlıkların teknik/temel analizini AI'ya yaptırır.
"""

from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field

from .base import (
    AIResponseBase,
    AnalysisDepth,
    AnalysisLanguage,
    RiskLevel,
    StockItemSchema,
    UserContext,
)


class WatchlistAnalysisType(str, Enum):
    """Watchlist analiz tipi."""
    TECHNICAL = "technical"      # Teknik analiz (trend, destek/direnç)
    FUNDAMENTAL = "fundamental"  # Temel analiz (F/K, bilanço)
    BOTH = "both"                # Her ikisi


class WatchlistAnalysisQuery(BaseModel):
    """
    Watchlist analiz isteği.

    Kullanım:
        query = WatchlistAnalysisQuery(
            user_context=UserContext(risk_preference=5),
            watchlist_name="Hisselerim",
            items=[
                StockItemSchema(id=1, name="AAPL", price=175.50, risk_score=4),
                StockItemSchema(id=5, name="THYAO.IS", price=10.50, risk_score=6),
            ],
        )
    """
    user_context: UserContext = Field(
        ...,
        description="Kullanıcı bağlamı",
    )
    watchlist_name: Optional[str] = Field(
        default=None,
        description="İzleme listesinin adı (ör: 'Favorilerim')",
    )
    watchlist_id: Optional[str] = Field(
        default=None,
        description="İzleme listesi ID'si",
    )
    items: list[StockItemSchema] = Field(
        ...,
        min_length=1,
        description="Watchlist'teki varlıklar",
    )
    analysis_type: WatchlistAnalysisType = Field(
        default=WatchlistAnalysisType.BOTH,
        description="Analiz tipi",
    )
    analysis_depth: AnalysisDepth = Field(
        default=AnalysisDepth.STANDARD,
        description="Analiz derinliği",
    )
    language: AnalysisLanguage = Field(
        default=AnalysisLanguage.TR,
        description="Yanıt dili",
    )


class WatchlistItemAnalysis(BaseModel):
    """Watchlist'teki tek bir varlığın analiz sonucu."""
    symbol: str = Field(..., description="Varlık sembolü")
    risk_level: RiskLevel = Field(..., description="Varlık risk kategorisi")
    signal: str = Field(
        ...,
        description="AI sinyali (ör: 'AL', 'SAT', 'TUT', 'İZLE')",
    )
    confidence: int = Field(
        ...,
        ge=0,
        le=100,
        description="AI'nın sinyal güven seviyesi (%)",
    )
    summary: str = Field(
        ...,
        description="Varlık için kısa analiz özeti",
    )
    target_price: Optional[float] = Field(
        default=None,
        ge=0,
        description="AI'nın tahmin ettiği hedef fiyat",
    )
    support_price: Optional[float] = Field(
        default=None,
        ge=0,
        description="Destek seviyesi",
    )
    resistance_price: Optional[float] = Field(
        default=None,
        ge=0,
        description="Direnç seviyesi",
    )


class WatchlistAnalysisResponse(AIResponseBase):
    """Watchlist analizi AI yanıtı."""
    watchlist_name: Optional[str] = Field(
        default=None,
        description="Analiz edilen watchlist adı",
    )
    overall_summary: str = Field(
        ...,
        description="Genel piyasa ve watchlist değerlendirmesi",
    )
    item_analyses: list[WatchlistItemAnalysis] = Field(
        ...,
        description="Her varlık için bireysel analiz",
    )
    top_pick: Optional[str] = Field(
        default=None,
        description="AI'nın en çok önerdiği varlık sembolü",
    )
    risk_warning: Optional[str] = Field(
        default=None,
        description="Genel risk uyarısı (varsa)",
    )
