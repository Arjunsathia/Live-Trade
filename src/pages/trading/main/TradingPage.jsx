import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { WatchlistPanel }  from '../../../features/trading/components/WatchlistPanel';
import { ChartPanel }       from '../../../features/trading/components/ChartPanel';
import { OrderBookPanel }   from '../../../features/trading/components/OrderBookPanel';
import { OrderPanel }       from '../../../features/trading/components/OrderPanel';
import { BottomPanel }      from '../../../features/trading/components/BottomPanel';

export function TradingPage() {
    const { mode } = useParams();
    const navigate  = useNavigate();
    const [activeMode, setActiveMode] = useState(mode || 'spot');

    const handleModeChange = (m) => {
        setActiveMode(m);
        navigate(`/trade/${m}`, { replace: true });
    };

    return (
        <div
            className="flex-1 min-h-0 w-full overflow-hidden animate-fade-in bg-bg"
            style={{
                display: 'grid',
                gridTemplateColumns: '260px 1fr 300px',
                gridTemplateRows: '1fr 240px',
                gridTemplateAreas: `
                    "watchlist chart sidebar"
                    "bottom    bottom  sidebar"
                `,
                gap: '8px',
                padding: '8px',
            }}
        >
            {/* Zone 1: Watchlist */}
            <div style={{ gridArea: 'watchlist' }} className="min-h-0 overflow-hidden">
                <WatchlistPanel />
            </div>

            {/* Zone 2: Chart */}
            <div style={{ gridArea: 'chart' }} className="min-h-0 overflow-hidden">
                <ChartPanel mode={activeMode} onModeChange={handleModeChange} />
            </div>

            {/* Zone 3: Right sidebar (full height) */}
            <div style={{ gridArea: 'sidebar' }} className="min-h-0 overflow-hidden flex flex-col gap-[8px]">
                <div className="flex-1 min-h-0 overflow-hidden">
                    <OrderBookPanel />
                </div>
                <div className="shrink-0 h-[380px] overflow-hidden">
                    <OrderPanel type={activeMode} />
                </div>
            </div>

            {/* Zone 4: Bottom panel */}
            <div style={{ gridArea: 'bottom' }} className="min-h-0 overflow-hidden">
                <BottomPanel />
            </div>
        </div>
    );
}
