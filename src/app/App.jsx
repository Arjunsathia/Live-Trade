import { RouterProvider } from 'react-router-dom';
import { appRouter } from './AppRouter';

export default function App() {
  return <RouterProvider router={appRouter} />;
}
