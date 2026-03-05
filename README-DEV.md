# Developer README — Forex & Copy-Trading Dashboard

## Stack

- **React 18** + **Vite**
- **Tailwind CSS v4**
- **Recharts** or **Lightweight Charts** (TradingView) for candlesticks
- **Zustand** (recommended for order/position state)
- **React Query** for REST polling + caching
- **native WebSocket** API (or `socket.io-client` if backend uses it)

---

## Suggested File Structure

```
src/
├── assets/               # Logos, icons
├── components/
│   ├── atoms/            # Badge, Pill, Spinner, Tooltip
│   ├── molecules/
│   │   ├── WatchlistRow.jsx
│   │   ├── PositionRow.jsx
│   │   ├── ActivityItem.jsx
│   │   └── ProviderCard.jsx
│   └── organisms/
│       ├── Sidebar.jsx
│       ├── Topbar.jsx
│       ├── ChartWidget.jsx        # Candlestick container
│       ├── OrderEntry.jsx         # Buy/Sell form
│       ├── PositionsTable.jsx     # Live open trades
│       ├── Watchlist.jsx
│       ├── ActivityFeed.jsx
│       ├── Leaderboard.jsx        # Copy-trading provider list
│       └── ProviderModal.jsx      # Copy onboarding drawer
├── pages/
│   └── Dashboard/
│       └── Dashboard.jsx          # Main 1440px layout assembly
├── hooks/
│   ├── useWebSocket.js            # WS connection + message dispatch
│   ├── usePositions.js            # Positions state + realtime updates
│   └── useMarket.js               # OHLC fetch + tick subscription
├── services/
│   ├── api.js                     # Axios instance + REST helpers
│   └── ws.js                      # WebSocket singleton
├── stores/
│   └── tradingStore.js            # Zustand: account, positions, orders
├── styles/
│   └── index.css                  # Global CSS variables + Tailwind
└── fixtures/                      # Dev mock data (from /fixtures folder)
```

---

## Dashboard Layout (1440px)

```
┌──────────────────────────────────────────────────────────────────┐
│  Topbar (64px height)                                            │
├────────┬────────────────────────────────────┬────────────────────┤
│        │                                    │                    │
│ Side   │  ChartWidget (Candlestick + Vol)   │   OrderEntry       │
│ -bar   │  (flex-1, min-h: 480px)            │   (380px)          │
│        │                                    │                    │
│ 240px  ├────────────────────────────────────┤                    │
│ (icon  │  PositionsTable (open trades)      ├────────────────────┤
│  64px  │                                    │   Leaderboard      │
│ coll.) │  ActivityFeed (fills + copy feed)  │   (Copy-trading)   │
│        │                                    │                    │
└────────┴────────────────────────────────────┴────────────────────┘
```

---

## Sample JSX: BalanceCard

```jsx
// src/components/molecules/BalanceCard.jsx
import { TrendingUp } from "lucide-react";

export function BalanceCard({
  balance,
  equity,
  unrealizedPnl,
  currency = "USD",
}) {
  const isPositive = unrealizedPnl >= 0;

  const fmt = (n) =>
    n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="bg-surface rounded-lg p-5 border border-border flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <span className="text-body-small text-text-muted uppercase tracking-wider">
          Equity
        </span>
        <span
          className={`flex items-center gap-1 text-body-small font-semibold px-2 py-0.5 rounded-md
          ${isPositive ? "bg-brand-muted text-brand" : "bg-system-negative/10 text-system-negative"}`}
        >
          <TrendingUp size={12} />
          {isPositive ? "+" : ""}
          {fmt(unrealizedPnl)} {currency}
        </span>
      </div>
      <div className="font-mono text-display text-text leading-none tracking-tight">
        {fmt(equity)}
        <span className="text-text-muted text-heading ml-2 font-medium">
          {currency}
        </span>
      </div>
      <div className="text-body text-text-muted">
        Balance:{" "}
        <span className="text-text font-semibold">
          {fmt(balance)} {currency}
        </span>
      </div>
    </div>
  );
}
```

---

## WebSocket Wiring Notes

### 1. Singleton ws.js

```js
// src/services/ws.js
let socket = null;
const listeners = new Map();

export function connectWS(token) {
  if (socket?.readyState === WebSocket.OPEN) return;

  socket = new WebSocket(`wss://ws.yourdomain.com/v1`);

  socket.onopen = () => {
    socket.send(JSON.stringify({ type: "auth", token }));
  };

  socket.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    const handlers = listeners.get(msg.type) || [];
    handlers.forEach((fn) => fn(msg));
  };
}

export function subscribe(type, handler) {
  if (!listeners.has(type)) listeners.set(type, []);
  listeners.get(type).push(handler);
  return () => {
    const updated = listeners.get(type).filter((h) => h !== handler);
    listeners.set(type, updated);
  };
}
```

### 2. useMarket hook (OHLC + tick subscription)

```js
// src/hooks/useMarket.js
import { useEffect, useState } from "react";
import { subscribe } from "../services/ws";
import { api } from "../services/api";

export function useMarket(symbol, resolution = "1h") {
  const [bars, setBars] = useState([]);
  const [latestTick, setLatestTick] = useState(null);

  useEffect(() => {
    // Initial REST fetch
    api
      .get("/market/ohlc", {
        params: {
          symbol,
          resolution,
          from: Date.now() - 86400000,
          to: Date.now(),
        },
      })
      .then((res) => setBars(res.data));

    // Subscribe to live ticks
    const unsub = subscribe("tick", (msg) => {
      if (msg.symbol !== symbol) return;
      setLatestTick(msg);
      // Append/update the last bar in bars array here
    });

    return unsub;
  }, [symbol, resolution]);

  return { bars, latestTick };
}
```

---

## Chart Integration (Lightweight Charts — TradingView)

```jsx
// src/components/organisms/ChartWidget.jsx
import { createChart } from "lightweight-charts";
import { useEffect, useRef } from "react";
import { useMarket } from "../../hooks/useMarket";

export function ChartWidget({ symbol }) {
  const chartRef = useRef(null);
  const { bars, latestTick } = useMarket(symbol, "1h");

  useEffect(() => {
    const chart = createChart(chartRef.current, {
      layout: {
        background: { color: "#12171A" },
        textColor: "#A1B0B8",
      },
      grid: {
        vertLines: { color: "rgba(255, 255, 255, 0.03)" },
        horzLines: { color: "rgba(255, 255, 255, 0.03)" },
      },
      crosshair: { mode: 1 },
      rightPriceScale: { borderColor: "rgba(255, 255, 255, 0.06)" },
      timeScale: { borderColor: "rgba(255, 255, 255, 0.06)" },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#39FF14",
      downColor: "#FF4560",
      borderUpColor: "#39FF14",
      borderDownColor: "#FF4560",
      wickUpColor: "#39FF14",
      wickDownColor: "#FF4560",
    });

    candleSeries.setData(
      bars.map((b) => ({
        time: b.t / 1000,
        open: b.o,
        high: b.h,
        low: b.l,
        close: b.c,
      })),
    );

    return () => chart.remove();
  }, [bars]);

  return <div ref={chartRef} className="w-full h-[480px]" />;
}
```

---

## Responsive Collapse Rules

| Breakpoint     | Sidebar          | Right Rail         |
| -------------- | ---------------- | ------------------ |
| `≥ 1440px`     | Full (240px)     | Docked (380px)     |
| `992px–1439px` | Icon-only (64px) | Docked (340px)     |
| `640px–991px`  | Hidden / drawer  | Stacked below main |
| `< 640px`      | Mobile drawer    | Full-width stacked |
