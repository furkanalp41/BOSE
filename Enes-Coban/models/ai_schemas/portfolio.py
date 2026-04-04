"""
Portföy Analizi Query/Response Modelleri.

Go karşılığı: models.AnalysisReq → PortfolioAnalysisQuery
              models.AnalysisItem → PortfolioAnalysisResponse
"""

from typing import Optional

from pydantic import BaseModel, Field

from ai_schemas.base import (
    AIResponseBase,
    AnalysisDepth,
    AnalysisLanguage,
    PortfolioHolding,
    RiskLevel,
    UserContext,
)


class PortfolioAnalysisQuery(BaseModel):
    """
    Portföy analiz isteği.

    Kullanıcının mevcut portföyünü AI'ya gönderip risk/getiri raporu almak için kullanılır.

    Kullanım:
        query = PortfolioAnalysisQuery(
            user_context=UserContext(risk_preference=3),
            holdings=[
                PortfolioHolding(stock=StockItemSchema(id=1, name="THYAO.IS", price=10.5), quantity=200),
                PortfolioHolding(stock=StockItemSchema(id=2, name="BND", price=72.1), quantity=100),
            ],
        )
    """
    user_context: UserContext = Field(
        ...,
        description="Kullanıcı bağlamı (ID, risk tercihi)",
    )
    holdings: list[PortfolioHolding] = Field(
        ...,
        min_length=1,
        description="Portföydeki pozisyonlar listesi",
    )
    analysis_depth: AnalysisDepth = Field(
        default=AnalysisDepth.STANDARD,
        description="Analiz derinliği",
    )
    language: AnalysisLanguage = Field(
        default=AnalysisLanguage.TR,
        description="Yanıt dili",
    )
    include_recommendations: bool = Field(
        default=True,
        description="AI'nın alım/satım önerileri içerip içermeyeceği",
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "user_context": {
                        "user_id": "123e4567-e89b-12d3-a456-426614174000",
                        "risk_preference": 2,
                        "display_name": "Alice",
                    },
                    "holdings": [
                        {
                            "stock": {
                                "id": 7,
                                "name": "BND",
                                "price": 72.10,
                                "desc": "Vanguard Total Bond Market ETF",
                                "asset_type": "stock",
                                "risk_score": 1,
                            },
                            "quantity": 100,
                            "avg_buy_price": 70.50,
                        }
                    ],
                    "analysis_depth": "standard",
                    "language": "tr",
                    "include_recommendations": True,
                }
            ]
        }
    }


class PortfolioAnalysisResponse(AIResponseBase):
    """
    Portföy analizi AI yanıtı.

    Go karşılığı: models.AnalysisItem (genişletilmiş versiyon)
    """
    alignment_score: int = Field(
        ...,
        ge=0,
        le=100,
        description=(
            "Portföyün kullanıcının risk tercihiyle uyum skoru. "
            "100 = mükemmel uyum."
        ),
    )
    overall_risk: RiskLevel = Field(
        ...,
        description="Portföyün genel risk kategorisi",
    )
    portfolio_risk_score: float = Field(
        ...,
        ge=0,
        le=10,
        description="Portföyün ağırlıklı ortalama risk skoru (0-10)",
    )
    total_value: Optional[float] = Field(
        default=None,
        ge=0,
        description="Portföy toplam değeri",
    )
    analysis_content: str = Field(
        ...,
        description="AI'nın ürettiği analiz metni",
    )
    recommendations: list[str] = Field(
        default_factory=list,
        description="AI tarafından önerilen eylemler listesi",
    )
    diversification_score: Optional[int] = Field(
        default=None,
        ge=0,
        le=100,
        description="Çeşitlendirme skoru (0-100)",
    )
