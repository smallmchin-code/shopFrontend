import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import AllProducts from '../views/AllProducts.vue'; // 保留 import，但下面會調整用途
import Contact from '../views/Contact.vue';
import Cart from '../views/Cart.vue';
import Layout from '../views/Layout.vue';
// 移除舊的分類列表組件的 Import
// import Jackets from '@/views/productList/JacketsList.vue';
// import Pants from '@/views/productList/PantsList.vue';
// import Tops from '@/views/productList/TopsList.vue';

// import AddProduct from '@/views/AddProduct.vue';
import ProductDetail from '@/views/ProductDetail.vue';
// 引入新的通用列表組件
import ProductList from '@/views/ProductList.vue'; // 請確保路徑正確

const routes = [
  
  {
    path: '/home',
    component: Layout,
    children: [
      {
        // 修正路徑名稱為 /product/:id (小寫p)
        path: '/product/:id',
        name: 'ProductDetail',
        component: ProductDetail,
      },
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
        // 全部商品頁面 (/products)，使用新的統一組件
        path: '/products',
        name: 'AllProducts',
        // 建議直接使用 ProductList.vue 來顯示全部商品
        component: ProductList, 
      },
      {
        // 分類列表頁面 (/products/:category) - 動態路由
        path: '/products/:category',
        name: 'CategoryProducts',
        component: ProductList, // 使用統一的列表組件
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
      // 移除原有的單一分類路由
      // { path: '/jackets', name: 'Jackets', component: Jackets, },
      // { path: '/pants', name: 'Pants', component: Pants, },
      // { path: '/tops', name: 'Tops', component: Tops, }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;