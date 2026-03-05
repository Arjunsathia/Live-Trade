# Entity-Relationship Diagram — Core Trading Models

```mermaid
erDiagram
    USER {
        string id PK
        string email
        string passwordHash
        string name
        string avatar
        datetime createdAt
    }

    ACCOUNT {
        string id PK
        string userId FK
        string currency
        float balance
        float equity
        float margin
        string type "demo | live"
        datetime createdAt
    }

    ORDER {
        string id PK
        string accountId FK
        string symbol
        enum side "buy | sell"
        enum type "market | limit | stop"
        float volume
        float price
        float stopLoss
        float takeProfit
        enum status "pending | filled | cancelled | rejected"
        datetime createdAt
        datetime filledAt
    }

    POSITION {
        string id PK
        string accountId FK
        string orderId FK
        string symbol
        enum side "buy | sell"
        float volume
        float openPrice
        float currentPrice
        float stopLoss
        float takeProfit
        float unrealizedPnl
        datetime openedAt
        datetime closedAt
    }

    TRADE {
        string id PK
        string positionId FK
        float openPrice
        float closePrice
        float realizedPnl
        float pips
        float commission
        datetime closedAt
    }

    PROVIDER {
        string id PK
        string userId FK
        string name
        string bio
        float roiAllTime
        float roi30d
        float winRate
        float maxDrawdown
        int followers
        float performanceFee
        datetime joinedAt
    }

    COPY_RELATION {
        string id PK
        string followerId FK "Account ID"
        string providerId FK
        float riskMultiplier
        float maxDrawdown
        float copyBudget
        boolean isActive
        datetime startedAt
        datetime stoppedAt
    }

    COPY_EVENT {
        string id PK
        string copyRelationId FK
        string masterPositionId FK
        string copiedPositionId FK
        float masterVolume
        float copiedVolume
        enum status "open | closed"
        float realizedPnl
        datetime createdAt
    }

    USER ||--o{ ACCOUNT : "has"
    ACCOUNT ||--o{ ORDER : "places"
    ORDER ||--|| POSITION : "opens"
    POSITION ||--o{ TRADE : "generates"
    USER ||--o| PROVIDER : "can become"
    ACCOUNT ||--o{ COPY_RELATION : "follows"
    PROVIDER ||--o{ COPY_RELATION : "is followed by"
    COPY_RELATION ||--o{ COPY_EVENT : "generates"
```

## API Endpoint Summary

| Method | Endpoint                      | Description              |
| ------ | ----------------------------- | ------------------------ |
| POST   | `/auth/login`                 | Login, get tokens        |
| POST   | `/auth/refresh`               | Refresh access token     |
| GET    | `/accounts/:id`               | Account snapshot         |
| GET    | `/market/ohlc`                | Historical OHLC bars     |
| GET    | `/market/watchlist`           | User watchlist + quotes  |
| POST   | `/orders`                     | Place market/limit/stop  |
| GET    | `/orders`                     | Order history            |
| DELETE | `/orders/:id`                 | Cancel pending order     |
| GET    | `/accounts/:id/positions`     | Current open positions   |
| DELETE | `/accounts/:id/positions/:id` | Close position at market |
| GET    | `/providers`                  | Provider leaderboard     |
| GET    | `/providers/:id`              | Provider detail          |
| POST   | `/copy/:providerId/follow`    | Start copying            |
| DELETE | `/copy/:providerId/unfollow`  | Stop copying             |
