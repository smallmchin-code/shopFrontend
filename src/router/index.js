import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Contact from '../views/Contact.vue';
import Cart from '../views/Cart.vue';
import Layout from '../views/Layout.vue';
import AddProduct from '@/views/AddProduct.vue';
import ProductDetail from '@/views/ProductDetail.vue';
import ProductList from '@/views/ProductList.vue'; // 請確保路徑正確

const routes = [
  
  {
    path: '/home',
    component: Layout,
    children: [
      {
        path: '/addproduct',
        name: 'AddProduct',
        component: AddProduct,
      },
      {
        path: '/product/:id',
        name: 'ProductDetail',
        component: ProductDetail,
      },
      {
        path: '/login',
        name: 'Login',
        component: Login,
      },
      {
        path: '/',
        name: 'Home',
        component: Home,
      },
      {
        path: '/products',
        name: 'AllProducts',
        component: ProductList, 
      },
      {
        path: '/products/:category',
        name: 'CategoryProducts',
        component: ProductList, 
      },
      {
        path: '/contact',
        name: 'Contact',
        component: Contact,
      },
      {
        path: '/cart',
        name: 'Cart',
        component: Cart,
      },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;