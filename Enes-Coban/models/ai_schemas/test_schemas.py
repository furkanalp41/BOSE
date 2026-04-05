"""
AI Query Schema Doğrulama Testi.

Tüm Pydantic modellerin oluşturma, validation ve JSON seri/deseri testleri.
Çalıştırma: python3 test_schemas.py
"""

import sys
import json
from datetime import datetime
from uuid import uuid4

# ai_schemas paketinin üst dizinini path'e ekle
sys.path.insert(0, "/home/enes/Desktop/BOSE/BOSE/Enes-Coban")

from models.ai_schemas import (
    # Base
    AssetType, RiskLevel, AnalysisLanguage, AnalysisDepth,
    StockItemSchema, PortfolioHolding, UserContext, AIResponseBase,
    # Portfolio
    PortfolioAnalysisQuery, PortfolioAnalysisResponse,
    # Watchlist
    WatchlistAnalysisType, WatchlistAnalysisQuery,
    WatchlistItemAnalysis, WatchlistAnalysisResponse,
    # Transaction
    TransactionType, TransactionRecord,
    TransactionAnalysisQuery, BehaviorPattern, TransactionAnalysisResponse,
    # Chat
    ChatRole, ChatMessage, SuggestedAction, ChatQuery, ChatResponse,
)
from pydantic import ValidationError


PASS = 0
FAIL = 0


def test(name: str, fn):
    global PASS, FAIL
    try:
        fn()
        print(f"  ✅ {name}")
        PASS += 1
    except Exception as e:
        print(f"  ❌ {name}: {e}")
        FAIL += 1


# ─── Base Tests ──────────────────────────────────────
print("\n📦 Base Models")


def test_stock_item_valid():
    s = StockItemSchema(id=1, name="THYAO.IS", price=10.5, desc="Airlines", risk_score=6)
    assert s.name == "THYAO.IS"
    assert s.risk_score == 6

test("StockItemSchema — valid", test_stock_item_valid)


def test_stock_item_risk_overflow():
    try:
        StockItemSchema(id=1, name="X", price=1, risk_score=11)
        assert False, "Should have raised"
    except ValidationError:
        pass

test("StockItemSchema — risk_score > 10 rejected", test_stock_item_risk_overflow)


def test_portfolio_holding():
    stock = StockItemSchema(id=1, name="AAPL", price=175.5)
    h = PortfolioHolding(stock=stock, quantity=50, avg_buy_price=160.0)
    assert h.quantity == 50
    assert h.avg_buy_price == 160.0

test("PortfolioHolding — valid", test_portfolio_holding)


def test_user_context():
    ctx = UserContext(risk_preference=3, display_name="Alice")
    assert ctx.risk_preference == 3
    assert ctx.user_id is not None

test("UserContext — valid with auto-generated UUID", test_user_context)


def test_user_context_risk_overflow():
    try:
        UserContext(risk_preference=15)
        assert False
    except ValidationError:
        pass

test("UserContext — risk > 10 rejected", test_user_context_risk_overflow)


# ─── Portfolio Tests ─────────────────────────────────
print("\n📊 Portfolio Models")


def test_portfolio_query():
    ctx = UserContext(risk_preference=2)
    stock = StockItemSchema(id=7, name="BND", price=72.1, desc="Bond ETF", risk_score=1)
    h = PortfolioHolding(stock=stock, quantity=100)
    q = PortfolioAnalysisQuery(user_context=ctx, holdings=[h])
    assert len(q.holdings) == 1
    assert q.analysis_depth == AnalysisDepth.STANDARD

test("PortfolioAnalysisQuery — valid", test_portfolio_query)


def test_portfolio_query_empty_holdings():
    try:
        ctx = UserContext(risk_preference=2)
        PortfolioAnalysisQuery(user_context=ctx, holdings=[])
        assert False
    except ValidationError:
        pass

test("PortfolioAnalysisQuery — empty holdings rejected", test_portfolio_query_empty_holdings)


def test_portfolio_response():
    r = PortfolioAnalysisResponse(
        alignment_score=85,
        overall_risk=RiskLevel.LOW,
        portfolio_risk_score=2.5,
        analysis_content="Portföy risk tercihinizle uyumlu.",
        recommendations=["BND pozisyonunu koruyun"],
    )
    assert r.alignment_score == 85
    assert r.request_id is not None

test("PortfolioAnalysisResponse — valid", test_portfolio_response)


def test_portfolio_json_roundtrip():
    ctx = UserContext(risk_preference=5, user_id=uuid4())
    stock = StockItemSchema(id=1, name="AAPL", price=175.5, risk_score=4)
    q = PortfolioAnalysisQuery(
        user_context=ctx,
        holdings=[PortfolioHolding(stock=stock, quantity=10)],
    )
    json_str = q.model_dump_json()
    q2 = PortfolioAnalysisQuery.model_validate_json(json_str)
    assert q2.user_context.risk_preference == 5
    assert q2.holdings[0].stock.name == "AAPL"

test("PortfolioAnalysisQuery — JSON roundtrip", test_portfolio_json_roundtrip)


# ─── Watchlist Tests ─────────────────────────────────
print("\n👀 Watchlist Models")


def test_watchlist_query():
    ctx = UserContext(risk_preference=5)
    items = [
        StockItemSchema(id=1, name="AAPL", price=175.5, risk_score=4),
        StockItemSchema(id=5, name="THYAO.IS", price=10.5, risk_score=6),
    ]
    q = WatchlistAnalysisQuery(
        user_context=ctx,
        watchlist_name="Favorilerim",
        items=items,
        analysis_type=WatchlistAnalysisType.TECHNICAL,
    )
    assert len(q.items) == 2
    assert q.analysis_type == WatchlistAnalysisType.TECHNICAL

test("WatchlistAnalysisQuery — valid", test_watchlist_query)


def test_watchlist_response():
    r = WatchlistAnalysisResponse(
        overall_summary="Watchlist'inizde güçlü momentum var.",
        item_analyses=[
            WatchlistItemAnalysis(
                symbol="AAPL",
                risk_level=RiskLevel.MEDIUM,
                signal="AL",
                confidence=72,
                summary="Güçlü temel göstergeler.",
                target_price=195.0,
            ),
        ],
        top_pick="AAPL",
    )
    assert r.item_analyses[0].signal == "AL"
    assert r.top_pick == "AAPL"

test("WatchlistAnalysisResponse — valid", test_watchlist_response)


# ─── Transaction Tests ───────────────────────────────
print("\n📈 Transaction Models")


def test_transaction_record():
    tx = TransactionRecord(
        symbol="THYAO.IS",
        tx_type=TransactionType.BUY,
        quantity=50,
        price=9.80,
        executed_at=datetime(2026, 1, 15, 10, 30),
    )
    assert tx.symbol == "THYAO.IS"
    assert tx.tx_type == TransactionType.BUY

test("TransactionRecord — valid", test_transaction_record)


def test_transaction_query():
    ctx = UserContext(risk_preference=7)
    tx = TransactionRecord(
        symbol="GME", tx_type=TransactionType.BUY,
        quantity=100, price=15.3,
        executed_at=datetime(2026, 2, 1),
    )
    q = TransactionAnalysisQuery(user_context=ctx, transactions=[tx])
    assert len(q.transactions) == 1
    assert "timing" in q.focus_areas

test("TransactionAnalysisQuery — valid with defaults", test_transaction_query)


def test_transaction_response():
    r = TransactionAnalysisResponse(
        total_transactions=25,
        total_buy_volume=15000.0,
        total_sell_volume=8000.0,
        win_rate=64.0,
        analysis_content="İşlem geçmişiniz agresif alım eğilimi gösteriyor.",
        behavior_patterns=[
            BehaviorPattern(
                pattern_name="Trend Takibi",
                description="Yükseliş trendlerinde alım yapıyorsunuz.",
                frequency=8,
                impact="pozitif",
                suggestion="Trend kırılımlarında stop-loss kullanın.",
            )
        ],
        recommendations=["Portföyü çeşitlendirin"],
    )
    assert r.win_rate == 64.0
    assert len(r.behavior_patterns) == 1

test("TransactionAnalysisResponse — valid", test_transaction_response)


# ─── Chat Tests ──────────────────────────────────────
print("\n💬 Chat Models")


def test_chat_query():
    ctx = UserContext(risk_preference=5)
    msgs = [
        ChatMessage(role=ChatRole.USER, content="Portföyüm hakkında ne düşünüyorsun?"),
    ]
    stock = StockItemSchema(id=5, name="THYAO.IS", price=10.5, risk_score=6)
    q = ChatQuery(
        user_context=ctx,
        messages=msgs,
        portfolio_summary=[PortfolioHolding(stock=stock, quantity=200)],
    )
    assert len(q.messages) == 1
    assert len(q.portfolio_summary) == 1

test("ChatQuery — valid with portfolio context", test_chat_query)


def test_chat_response():
    r = ChatResponse(
        reply="THYAO hisseniz iyi performans gösteriyor.",
        referenced_symbols=["THYAO.IS"],
        suggested_actions=[
            SuggestedAction(
                action_type="analyze",
                symbol="THYAO.IS",
                description="Detaylı portföy analizi çalıştırın",
                confidence=80,
            )
        ],
        follow_up_questions=["Watchlist'inize de bakmamı ister misiniz?"],
        context_used=True,
    )
    assert r.context_used is True
    assert "THYAO.IS" in r.referenced_symbols

test("ChatResponse — valid", test_chat_response)


def test_chat_json_roundtrip():
    ctx = UserContext(risk_preference=3, user_id=uuid4())
    q = ChatQuery(
        user_context=ctx,
        messages=[ChatMessage(role=ChatRole.USER, content="Merhaba")],
    )
    json_str = q.model_dump_json()
    q2 = ChatQuery.model_validate_json(json_str)
    assert q2.messages[0].content == "Merhaba"

test("ChatQuery — JSON roundtrip", test_chat_json_roundtrip)


# ─── JSON Schema Export Test ─────────────────────────
print("\n📋 JSON Schema Export")


def test_json_schema_export():
    for cls in [
        PortfolioAnalysisQuery, PortfolioAnalysisResponse,
        WatchlistAnalysisQuery, WatchlistAnalysisResponse,
        TransactionAnalysisQuery, TransactionAnalysisResponse,
        ChatQuery, ChatResponse,
    ]:
        schema = cls.model_json_schema()
        assert "properties" in schema, f"{cls.__name__} schema has no properties"

test("All models — JSON schema export", test_json_schema_export)


# ─── Summary ─────────────────────────────────────────
print(f"\n{'='*50}")
print(f"Sonuç: {PASS} geçti, {FAIL} başarısız")
print(f"{'='*50}\n")

if FAIL > 0:
    sys.exit(1)
