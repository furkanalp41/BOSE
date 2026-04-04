"""
AI Sohbet (Chatbot) Query/Response Modelleri.

AI, kullanıcının portföyü ve watchlist'ine hakim olacak şekilde
bağlam bilgisiyle donatılarak sohbet eder.
"""

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field

from .base import (
    AIResponseBase,
    AnalysisLanguage,
    PortfolioHolding,
    StockItemSchema,
    UserContext,
)


class ChatRole(str, Enum):
    """Sohbet mesaj rolü."""
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class ChatMessage(BaseModel):
    """Tek bir sohbet mesajı."""
    role: ChatRole = Field(..., description="Mesaj rolü")
    content: str = Field(..., min_length=1, description="Mesaj içeriği")
    timestamp: Optional[datetime] = Field(
        default=None,
        description="Mesaj zamanı",
    )


class SuggestedAction(BaseModel):
    """AI'nın sohbet sırasında önerdiği eylem."""
    action_type: str = Field(
        ...,
        description="Eylem tipi (ör: 'buy', 'sell', 'add_to_watchlist', 'analyze')",
    )
    symbol: Optional[str] = Field(
        default=None,
        description="İlgili varlık sembolü",
    )
    description: str = Field(
        ...,
        description="Eylem açıklaması",
    )
    confidence: int = Field(
        default=50,
        ge=0,
        le=100,
        description="Önerinin güven seviyesi (%)",
    )


class ChatQuery(BaseModel):
    """
    AI sohbet isteği.

    AI'ya kullanıcının portföy ve watchlist bilgisi context olarak verilir.
    Böylece AI, kullanıcının yatırım durumuna hakim olarak yanıt verir.

    Kullanım:
        query = ChatQuery(
            user_context=UserContext(risk_preference=5),
            messages=[
                ChatMessage(role=ChatRole.USER, content="Portföyüm hakkında ne düşünüyorsun?"),
            ],
            portfolio_summary=[...],
            watchlist_summary=[...],
        )
    """
    user_context: UserContext = Field(
        ...,
        description="Kullanıcı bağlamı",
    )
    messages: list[ChatMessage] = Field(
        ...,
        min_length=1,
        description="Sohbet geçmişi mesajları (en yeni en sonda)",
    )
    portfolio_summary: list[PortfolioHolding] = Field(
        default_factory=list,
        description=(
            "Kullanıcının mevcut portföy özeti. "
            "AI bu bilgiyle bağlam kazanır."
        ),
    )
    watchlist_summary: list[StockItemSchema] = Field(
        default_factory=list,
        description=(
            "Kullanıcının watchlist özeti. "
            "AI bu bilgiyle bağlam kazanır."
        ),
    )
    language: AnalysisLanguage = Field(
        default=AnalysisLanguage.TR,
        description="Yanıt dili",
    )
    max_response_tokens: int = Field(
        default=1024,
        gt=0,
        le=4096,
        description="Maksimum yanıt uzunluğu (token sayısı)",
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "user_context": {
                        "user_id": "123e4567-e89b-12d3-a456-426614174000",
                        "risk_preference": 5,
                    },
                    "messages": [
                        {
                            "role": "user",
                            "content": "THYAO hissesi hakkında ne düşünüyorsun?",
                        }
                    ],
                    "portfolio_summary": [
                        {
                            "stock": {
                                "id": 5,
                                "name": "THYAO.IS",
                                "price": 10.50,
                                "desc": "Airlines",
                                "asset_type": "stock",
                                "risk_score": 6,
                            },
                            "quantity": 200,
                            "avg_buy_price": 8.75,
                        }
                    ],
                    "watchlist_summary": [],
                    "language": "tr",
                    "max_response_tokens": 1024,
                }
            ]
        }
    }


class ChatResponse(AIResponseBase):
    """AI sohbet yanıtı."""
    reply: str = Field(
        ...,
        description="AI'nın yanıt mesajı",
    )
    referenced_symbols: list[str] = Field(
        default_factory=list,
        description="Yanıtta referans edilen varlık sembolleri",
    )
    suggested_actions: list[SuggestedAction] = Field(
        default_factory=list,
        description="AI'nın önerdiği eylemler",
    )
    follow_up_questions: list[str] = Field(
        default_factory=list,
        description="AI'nın önerdiği takip soruları",
    )
    context_used: bool = Field(
        default=False,
        description="Portföy/watchlist bağlamının yanıta etkisi olup olmadığı",
    )
