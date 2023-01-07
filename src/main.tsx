import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import KaKaoLoginCallback from './components/Login/KakaoLoginCallback';
import './index.css';
import Cart from './pages/Cart';
import Home from './pages/Home';
import Join from './pages/Join';
import Login from './pages/Login';
import NewProduct from './pages/NewProduct';
import NewReview from './pages/NewReview';
import NotFound from './pages/NotFound';
import Oders from './pages/Oders';
import OrderForm from './pages/OrderForm';
import ProductDetail from './pages/ProductDetail';
import Products from './pages/Products';
import SellerConfirm from './pages/SellerConfirm';
import UserInfoEdit from './pages/UserInfoEdit';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'join', element: <Join /> },
      { path: 'tent', element: <Products category='tent' /> },
      { path: 'cook', element: <Products category='cook' /> },
      { path: 'accessory', element: <Products category='accessory' /> },
      { path: 'products/:keyword', element: <Products /> },
      { path: 'products/detail/:id', element: <ProductDetail /> },
      { path: 'products/new', element: <NewProduct /> },
      { path: 'products/update/:productId', element: <NewProduct /> },
      { path: 'review/new', element: <NewReview /> },
      { path: 'cart', element: <Cart /> },
      { path: 'order', element: <OrderForm /> },
      { path: 'mypage/orders', element: <Oders /> },
      { path: 'mypage/products', element: <Products /> },
      { path: 'kakaoLoginCallback', element: <KaKaoLoginCallback /> },
      { path: 'sellerConfirm', element: <SellerConfirm /> },
      { path: 'userInfo/edit', element: <UserInfoEdit /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
