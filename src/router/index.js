import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Contact from '../views/Contact.vue';
import Cart from '../views/Cart.vue';
import Layout from '../views/Layout.vue';
import AddProduct from '@/views/manager/AddProduct.vue';
import ProductDetail from '@/views/ProductDetail.vue';
import ProductList from '@/views/ProductList.vue'; // 請確保路徑正確

// manager
import Manager from '../views/manager/Manager.vue'
import Manager_Products from '@/views/manager/Manager_Products.vue';
import Manager_Orders from '@/views/manager/Manager_Orders.vue';
import Manager_Users from '@/views/manager/Manager_Users.vue';

const routes = [
  
  {
    path: '/manager', 
    name: 'Manager',
    component: Manager,
    children: [
      {
        path: 'products', // /manager/products
        name: 'ManagerProducts',
        component: Manager_Products,
      },
      {
        path: '/addproduct',
        name: 'AddProduct',
        component: AddProduct,
      },
      {
        path: 'orders', // /manager/orders
        name: 'ManagerOrders',
        component: Manager_Orders,
      },
      {
        path: 'users', // /manager/users
        name: 'ManagerUsers',
        component: Manager_Users,
      },
    ]      
  },
  {
    path: '/home',
    component: Layout,
    children: [
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