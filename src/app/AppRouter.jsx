import { createHashRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';

import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { Placeholder } from '../components/ui/Placeholder';
import { ProtectedRoute } from '../components/ui/ProtectedRoute';
import { LoginPage } from '../pages/auth/login/LoginPage';
import { RegisterPage } from '../pages/auth/register/RegisterPage';
import { ProChartPage } from '../pages/trading/chart/ProChartPage';
import { TerminalPage } from '../pages/terminal/TerminalPage';
import { TradeOverviewPage } from '../pages/trading/overview/TradeOverviewPage';
import { TradingOrdersPage }    from '../pages/trading/orders/TradingOrdersPage';
import { TradingPositionsPage } from '../pages/trading/positions/TradingPositionsPage';
import { TradingHistoryPage }   from '../pages/trading/history/TradingHistoryPage';

import { WatchlistPage } from '../pages/markets/watchlist/WatchlistPage';
import { OpenOrdersPage } from '../pages/portfolio/orders/OpenOrdersPage';
import { PositionsPage } from '../pages/portfolio/positions/PositionsPage';
import { TradeHistoryPage } from '../pages/portfolio/history/TradeHistoryPage';

import { TradingPage } from '../pages/trading/main/TradingPage';
export const appRouter = createHashRouter(
  [
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/register',
      element: <RegisterPage />,
    },
    {
      path: '/',
      element: <ProtectedRoute />,
      children: [
        {
          // ── Standalone full-screen terminal (no sidebar/topbar) ──
          path: 'terminal',
          element: <TerminalPage />,
        },
        {
          path: '/',
          element: <MainLayout />,
          children: [
            {
              index: true,
              element: <Navigate to="/dashboard" replace />,
            },
            {
              path: 'dashboard',
              element: <DashboardPage />,
            },
            {
              path: 'markets/*',
              element: <Navigate to="/markets/watchlist" replace />,
            },
            {
              path: 'markets/watchlist',
              element: <WatchlistPage />,
            },
            {
              path: 'copy/*',
              element: <Placeholder name="Copy Trading Hub" />,
            },
            {
              path: 'portfolio/*',
              element: <Navigate to="/portfolio/positions" replace />,
            },
            {
              path: 'portfolio/positions',
              element: <PositionsPage />,
            },
            {
              path: 'portfolio/history',
              element: <TradeHistoryPage />,
            },
            {
              path: 'trade/open-orders',
              element: <OpenOrdersPage />,
            },
            {
              path: 'wallet/*',
              element: <Placeholder name="Wallet" />,
            },
            {
              path: 'analytics/*',
              element: <Placeholder name="Analytics" />,
            },
            {
              path: 'settings/*',
              element: <Placeholder name="Settings" />,
            },
            {
              path: 'trade',
              children: [
                {
                  index: true,
                  element: <Navigate to="/trade/overview" replace />,
                },
                {
                  path: 'overview',
                  element: <TradeOverviewPage />,
                },
                {
                  path: 'chart',
                  element: <ProChartPage />,
                },
                {
                  path: 'orders',
                  element: <TradingOrdersPage />,
                },
                {
                  path: 'positions',
                  element: <TradingPositionsPage />,
                },
                {
                  path: 'history',
                  element: <TradingHistoryPage />,
                },
                {
                  path: 'spot',
                  element: <Navigate to="/trade/overview" replace />,
                },
                {
                  path: 'margin',
                  element: <Navigate to="/trade/overview" replace />,
                },
                {
                  path: 'futures',
                  element: <Navigate to="/trade/overview" replace />,
                },
              ]
            },
          ],
        },
      ]
    },
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ]
);