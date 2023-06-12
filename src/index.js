import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Root, {loader as rootLoader} from './routes/root';
import Article, {loader as articleLoader} from './routes/article'
import Login from './routes/login';
import Signup from './routes/signup';

// TODO add error page
const router = createBrowserRouter([
  {
    path: "/",
    loader: rootLoader,
    element: <Root />,
  },
  {
    path: "/article/:article_id",
    loader: articleLoader,
    element: <Article />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
