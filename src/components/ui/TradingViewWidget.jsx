import { useEffect, useRef, useId, memo } from 'react';

const TradingViewWidget = ({ symbol = "FX:EURUSD", theme = "dark", hideToolbar = false }) => {
    const container = useRef();
    // useId guarantees a unique container id even when multiple widgets exist on the page
    const id = useId().replace(/:/g, '_');

    useEffect(() => {
        if (!container.current) return;
        container.current.innerHTML = '';

        const wrapper = document.createElement('div');
        wrapper.className = 'tradingview-widget-container__widget';
        wrapper.style.height = '100%';
        wrapper.style.width = '100%';
        container.current.appendChild(wrapper);

        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
        script.type = 'text/javascript';
        script.async = true;

        const config = {
            autosize: true,
            symbol,
            interval: '15',
            timezone: 'Etc/UTC',
            theme,
            style: '1',
            locale: 'en',
            // Digital Obsidian surface: #0b1326  — exact match to --bg token
            backgroundColor: 'rgba(11, 19, 38, 1)',
            // outline_variant (#424754) at 5% opacity — per DESIGN.md spec
            gridColor: 'rgba(66, 71, 84, 0.05)',
            hide_top_toolbar: hideToolbar,
            hide_side_toolbar: false,
            hide_legend: false,
            withdateranges: true,
            save_image: false,
            allow_symbol_change: true,
            container_id: `tv_widget_${id}`,
            support_host: 'https://www.tradingview.com',
        };

        script.innerHTML = JSON.stringify(config);
        wrapper.appendChild(script);
    }, [symbol, theme, hideToolbar, id]);

    return (
        <div
            ref={container}
            id={`tv_widget_${id}`}
            className="tradingview-widget-container h-full w-full"
        />
    );
};

export default memo(TradingViewWidget);
