import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import AllProducts from '../views/AllProducts.vue';
import Contact from '../views/Contact.vue';
import Cart from '../views/Cart.vue';
import Layout from '../views/Layout.vue';
import ProductDetail from '@/views/ProductDetail.vue';
import Jackets from '@/views/productList/JacketsList.vue';
import Pants from '@/views/productList/PantsList.vue';
import Tops from '@/views/productList/TopsList.vue';


const routes = [
  
  {
    path: '/home',
    component: Layout,
    children: [
      {
    path: '/',
    name: 'Login',
    component: Login,
  },
      {
        path: '',
        name: 'Home',
        component: Home,
      },
      {
        path: '/products',
        name: 'AllProducts',
        component: AllProducts,
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
      {
        path: '/product',
        name: 'Product',
        component: ProductDetail,
      },
      {
        path: '/jackets',
        name: 'Jackets',
        component: Jackets,
      },
      {
        path: '/pants',
        name: 'Pants',
        component: Pants,
      },
      {
        path: '/tops',
        name: 'Tops',
        component: Tops,
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
