/**
 * Mock data for the LiveTrader dashboard and trading features.
 * Replace with real API/WebSocket data in production.
 */

export const mockPositions = [
    { id: 'pos_1', symbol: 'EURUSD', side: 'buy', volume: 0.5, openPrice: 1.08430, currentPrice: 1.08526, stopLoss: 1.08200, takeProfit: 1.08900, unrealizedPnl: 48.00, pips: 9.6 },
    { id: 'pos_2', symbol: 'USDJPY', side: 'sell', volume: 1.0, openPrice: 150.20, currentPrice: 149.82, stopLoss: 150.80, takeProfit: 149.00, unrealizedPnl: 25.36, pips: 38.0 },
    { id: 'pos_3', symbol: 'XAUUSD', side: 'buy', volume: 0.1, openPrice: 2031.50, currentPrice: 2038.45, stopLoss: 2020.00, takeProfit: 2060.00, unrealizedPnl: 69.50, pips: 695.0 },
];

export const mockLeaderboard = [
    { id: 'prv_001', name: 'AlphaFX_Pro', roi30d: 14.8, roiAllTime: 187.3, winRate: 72.4, maxDrawdown: 8.2, followers: 3421, performanceFee: 20, isFollowing: true, equityCurve: [100, 103, 108, 106, 115, 122, 118, 130, 128, 142, 155, 163, 187] },
    { id: 'prv_002', name: 'QuantEdge_FX', roi30d: 9.2, roiAllTime: 94.5, winRate: 68.1, maxDrawdown: 5.4, followers: 1847, performanceFee: 15, isFollowing: false, equityCurve: [100, 101, 105, 103, 108, 111, 110, 115, 112, 118, 124, 130, 135, 142, 149, 155] },
    { id: 'prv_003', name: 'SniperScalper', roi30d: 6.7, roiAllTime: 312.0, winRate: 64.9, maxDrawdown: 18.5, followers: 5108, performanceFee: 30, isFollowing: false, equityCurve: [100, 108, 120, 110, 125, 140, 130, 160, 145, 200, 230, 280, 265, 312] },
    { id: 'prv_004', name: 'SwingMaster_EU', roi30d: 3.1, roiAllTime: 41.2, winRate: 71.0, maxDrawdown: 3.8, followers: 892, performanceFee: 10, isFollowing: false, equityCurve: [100, 102, 104, 103, 107, 110, 108, 112, 115, 119, 122, 125, 128, 131, 137, 141] },
];

export const mockActivity = [
    { type: 'copy_event', event: 'copy_open', providerId: 'prv_001', providerName: 'AlphaFX_Pro', symbol: 'EURUSD', side: 'buy', copiedVolume: 0.4, timestamp: Date.now() - 2 * 60000 },
    { type: 'order_event', event: 'filled', symbol: 'EURUSD', side: 'buy', fillPrice: 1.08430, timestamp: Date.now() - 4 * 60000 },
    { type: 'copy_event', event: 'copy_close', providerId: 'prv_001', providerName: 'AlphaFX_Pro', symbol: 'XAUUSD', realizedPnl: 18.60, pips: 46.5, timestamp: Date.now() - 12 * 60000 },
    { type: 'order_event', event: 'position_closed', symbol: 'GBPUSD', side: 'sell', realizedPnl: 210.00, pips: 42.0, timestamp: Date.now() - 32 * 60000 },
];
