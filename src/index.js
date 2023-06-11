import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Root, {loader as rootLoader} from './routes/root';
import Article, {loader as articleLoader} from './routes/article'
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// TODO add error page
const router = createBrowserRouter([
  {
    path: "/",
    loader: rootLoader,
    element: <Root />,
  },
  {
    path: "/article/:articleId",
    loader: articleLoader,
    element: <Article />,
  }
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
