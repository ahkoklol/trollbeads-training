import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import App from './App.tsx'
import Home from './pages/Home.tsx';
import './index.css'

const router = createBrowserRouter(createRoutesFromElements(

  <Route path="/" element={<App />}>
    <Route index={true} element={<Home />} />
  </Route>

));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
