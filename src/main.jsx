import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.jsx';
import Home from './pages/Home.jsx';
import CardConfig from './pages/CardConfig.jsx';
import CardSetup from './pages/CardSetup.jsx';
import Card from './pages/Card.jsx';
import CardWelcome from './pages/CardWelcome.jsx';
import NotFound from './pages/NotFound.jsx'

import 'bootstrap-icons/font/bootstrap-icons.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "config", element: <CardConfig /> },
      { path: "setup", element: <CardSetup /> },
      { path: "card/:code", element: <CardWelcome /> },
      { path: "view", element: <Card /> },
      { path: "404", element: <NotFound /> },
      {path:"*",
        element: <NotFound />
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);