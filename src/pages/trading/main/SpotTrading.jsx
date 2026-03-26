import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WatchlistPanel } from '../../features/trading/components/WatchlistPanel';
import { ChartPanel }      from '../../features/trading/components/ChartPanel';
import { OrderBookPanel }  from '../../features/trading/components/OrderBookPanel';
import { OrderPanel }      from '../../features/trading/components/OrderPanel';
import { BottomPanel }     from '../../features/trading/components/BottomPanel';

export function SpotTrading() {
    const [activeMode, setActiveMode] = useState('spot');
    const navigate = useNavigate();

    const handleModeChange = (m) => {
        setActiveMode(m);
        navigate(`/trade/${m}`, { replace: true });
    };

    return (
        <div
            className="flex-1 min-h-0 w-full overflow-hidden animate-fade-in"
            style={{
                display: 'grid',
                gridTemplateColumns: '280px 1fr 320px',
                gridTemplateRows: '1fr 260px',
                gridTemplateAreas: `
                    "watchlist chart sidebar"
                    "bottom    bottom  sidebar"
                `,
                gap: '6px',
                padding: '6px',
            }}
        >
            <div style={{ gridArea: 'watchlist' }} className="min-h-0 overflow-hidden">
                <WatchlistPanel />
            </div>
            <div style={{ gridArea: 'chart' }} className="min-h-0 overflow-hidden">
                <ChartPanel mode={activeMode} onModeChange={handleModeChange} />
            </div>
            <div style={{ gridArea: 'sidebar' }} className="min-h-0 overflow-hidden flex flex-col gap-[6px]">
                <div className="flex-1 min-h-0 overflow-hidden">
                    <OrderBookPanel />
                </div>
                <div className="shrink-0 h-[380px] overflow-hidden">
                    <OrderPanel type={activeMode} />
                </div>
            </div>
            <div style={{ gridArea: 'bottom' }} className="min-h-0 overflow-hidden">
                <BottomPanel />
            </div>
        </div>
    );
}
