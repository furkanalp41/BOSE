"""
BOSE AI Query Schemas
=====================
AI analiz katmanı için Pydantic veri yapıları.

Kullanım:
    from ai_schemas import PortfolioAnalysisQuery, ChatQuery, ...
    
    # veya tüm modelleri import et:
    from ai_schemas import *
"""

from ai_schemas.base import (
    AssetType,
    RiskLevel,
    AnalysisLanguage,
    AnalysisDepth,
    StockItemSchema,
    PortfolioHolding,
    UserContext,
    AIResponseBase,
)
from ai_schemas.portfolio import (
    PortfolioAnalysisQuery,
    PortfolioAnalysisResponse,
)
from ai_schemas.watchlist import (
    WatchlistAnalysisType,
    WatchlistAnalysisQuery,
    WatchlistItemAnalysis,
    WatchlistAnalysisResponse,
)
from ai_schemas.transaction import (
    TransactionType,
    TransactionRecord,
    TransactionAnalysisQuery,
    BehaviorPattern,
    TransactionAnalysisResponse,
)
from ai_schemas.chat import (
    ChatRole,
    ChatMessage,
    SuggestedAction,
    ChatQuery,
    ChatResponse,
)

__all__ = [
    # Base
    "AssetType",
    "RiskLevel",
    "AnalysisLanguage",
    "AnalysisDepth",
    "StockItemSchema",
    "PortfolioHolding",
    "UserContext",
    "AIResponseBase",
    # Portfolio
    "PortfolioAnalysisQuery",
    "PortfolioAnalysisResponse",
    # Watchlist
    "WatchlistAnalysisType",
    "WatchlistAnalysisQuery",
    "WatchlistItemAnalysis",
    "WatchlistAnalysisResponse",
    # Transaction
    "TransactionType",
    "TransactionRecord",
    "TransactionAnalysisQuery",
    "BehaviorPattern",
    "TransactionAnalysisResponse",
    # Chat
    "ChatRole",
    "ChatMessage",
    "SuggestedAction",
    "ChatQuery",
    "ChatResponse",
]
