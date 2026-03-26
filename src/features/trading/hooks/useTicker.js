import { useState, useEffect } from 'react';

export function useTicker(symbol = 'EUR/USD', basePrice = 1.0845) {
    const [ticker, setTicker] = useState({
        price: basePrice,
        change: 0.12,
        changePercent: 0.12,
        high: basePrice + 0.0025,
        low: basePrice - 0.0015,
        volume: '142.5B',
        up: true
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setTicker(prev => {
                const fluctuation = (Math.random() - 0.5) * 0.00015;
                const newPrice = prev.price + fluctuation;
                const diff = (newPrice - basePrice);
                const percent = (diff / basePrice) * 100;
                
                return {
                    ...prev,
                    price: newPrice,
                    change: diff,
                    changePercent: percent,
                    up: newPrice >= prev.price
                };
            });
        }, 1200);

        return () => clearInterval(interval);
    }, [basePrice]);

    return ticker;
}
