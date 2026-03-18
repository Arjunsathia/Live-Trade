/**
 * Utility functions for formatting data across the LiveTrader platform.
 */

export const formatCurrency = (value, currency = '$', decimals = 2) => {
    const absValue = Math.abs(value).toFixed(decimals);
    const sign = value >= 0 ? '+' : '-';
    return `${sign}${currency}${absValue}`;
};

export const formatPrice = (value, decimals = 5) => {
    return value?.toFixed(decimals) || '0.00000';
};

export const formatPips = (pips, decimals = 1) => {
    if (pips === undefined || pips === null) return '0.0';
    const sign = pips >= 0 ? '+' : '';
    return `${sign}${pips.toFixed(decimals)}`;
};

export const formatTimeAgo = (timestamp, now = Date.now()) => {
    const diff = (now - timestamp) / 1000;
    if (diff < 60) return `${Math.round(diff)}s ago`;
    if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.round(diff / 3600)}h ago`;
    return `${Math.round(diff / 86400)}d ago`;
};
