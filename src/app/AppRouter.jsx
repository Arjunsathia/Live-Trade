import { createHashRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { Placeholder } from '../components/ui/Placeholder';
import { ProtectedRoute } from '../components/ui/ProtectedRoute';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';

export const appRouter = createHashRouter(
  [
    {
      path: '/login',
      element: <Navigate to="/" replace />,
    },
    {
      path: '/register',
      element: <Navigate to="/" replace />,
    },
    {
      path: '/',
      element: <ProtectedRoute />,
      children: [
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
              path: 'trade/*',
              element: <Placeholder name="Trading Terminal" />,
            },
            {
              path: 'markets/*',
              element: <Placeholder name="Markets" />,
            },
            {
              path: 'copy/*',
              element: <Placeholder name="Copy Trading Hub" />,
            },
            {
              path: 'portfolio/*',
              element: <Placeholder name="Portfolio" />,
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