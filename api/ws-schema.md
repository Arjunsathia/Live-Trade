# WebSocket Schema — Forex & Copy-Trading

WebSocket endpoint: `wss://ws.yourdomain.com/v1`

Authentication: Send a `subscribe` message with your JWT immediately after connect.

---

## 1. Connection & Authentication

```json
// Client → Server (immediately on connect)
{
  "type": "auth",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}

// Server → Client (confirms auth)
{
  "type": "auth_ok",
  "userId": "usr_abc123",
  "timestamp": 1709551200000
}
```

---

## 2. Channel Subscriptions

```json
// Client → Server (subscribe to a symbol tick stream)
{
  "type": "subscribe",
  "channel": "ticks",
  "symbol": "EURUSD"
}

// Client → Server (subscribe to account-level order events)
{
  "type": "subscribe",
  "channel": "orders",
  "accountId": "acc_xyz789"
}

// Client → Server (subscribe to copy trade events)
{
  "type": "subscribe",
  "channel": "copy_events",
  "accountId": "acc_xyz789"
}
```

---

## 3. `tick_stream` — Live Price Tick (Bid/Ask)

_Used by:_ Main Chart (real-time candle updates), Watchlist prices, Order Entry spread display.

```json
// Server → Client (example 1: EURUSD tick)
{
  "type": "tick",
  "symbol": "EURUSD",
  "bid": 1.08526,
  "ask": 1.08529,
  "spread": 0.3,
  "timestamp": 1709551200123,
  "change": 0.0012,
  "changePct": 0.11
}

// Server → Client (example 2: XAUUSD tick)
{
  "type": "tick",
  "symbol": "XAUUSD",
  "bid": 2038.45,
  "ask": 2038.85,
  "spread": 0.4,
  "timestamp": 1709551200456,
  "change": -5.20,
  "changePct": -0.25
}
```

---

## 4. `order_event` — Order Status Update

_Used by:_ Positions table P&L updates, Activity Feed, order fill notifications.

```json
// Server → Client (example 1: order filled successfully)
{
  "type": "order_event",
  "event": "filled",
  "orderId": "ord_11abc",
  "symbol": "EURUSD",
  "side": "buy",
  "volume": 0.5,
  "fillPrice": 1.08530,
  "timestamp": 1709551202000,
  "accountId": "acc_xyz789"
}

// Server → Client (example 2: position closed, final P&L)
{
  "type": "order_event",
  "event": "position_closed",
  "positionId": "pos_55xyz",
  "symbol": "GBPUSD",
  "side": "sell",
  "volume": 1.0,
  "openPrice": 1.26780,
  "closePrice": 1.26340,
  "realizedPnl": 44.00,
  "pips": 44.0,
  "timestamp": 1709551205300,
  "accountId": "acc_xyz789"
}
```

---

## 5. `copy_event` — Copy Trade Execution

_Used by:_ Copy Activity Feed, notifications.

```json
// Server → Client (example 1: copy order placed)
{
  "type": "copy_event",
  "event": "copy_open",
  "providerId": "prv_top01",
  "providerName": "AlphaFX_Pro",
  "symbol": "USDJPY",
  "side": "buy",
  "masterVolume": 2.0,
  "copiedVolume": 0.4,
  "copyPrice": 149.82,
  "timestamp": 1709551210000
}

// Server → Client (example 2: provider closed, copy auto-closed)
{
  "type": "copy_event",
  "event": "copy_close",
  "providerId": "prv_top01",
  "providerName": "AlphaFX_Pro",
  "symbol": "USDJPY",
  "realizedPnl": 18.60,
  "pips": 46.5,
  "timestamp": 1709551290000
}
```

---

## 6. `position_update` — Real-time P&L Feed

_Used by:_ Positions table to show live floating P&L without full REST refetch.

```json
{
  "type": "position_update",
  "positionId": "pos_22abc",
  "currentPrice": 1.08564,
  "unrealizedPnl": 19.0,
  "pips": 3.8,
  "timestamp": 1709551220000
}
```

---

## Frontend Wiring Notes

| Widget                          | Data Source                          |
| ------------------------------- | ------------------------------------ |
| Main Chart (historical candles) | REST `GET /market/ohlc`              |
| Main Chart (live candle append) | WS `tick` channel                    |
| Watchlist                       | REST seed + WS `tick` updates        |
| Order Entry                     | `POST /orders` REST on submit        |
| Positions Table (initial)       | REST `GET /accounts/:id/positions`   |
| Positions Table (live P&L)      | WS `position_update` + `order_event` |
| Activity Feed                   | WS `order_event` + `copy_event`      |
| Copy Leaderboard                | REST `GET /providers` (polled 30s)   |
