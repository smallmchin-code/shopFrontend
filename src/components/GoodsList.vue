<template>
   <div class="goods-list-wrapper">
     <router-link class="type-head" to="/products/jacket"> ------外套清單------</router-link>
     <router-link class="type-head" to="/products/top">------上衣清單------</router-link>
     <router-link class="type-head" to="/products/pant">------褲子清單------</router-link>
     <router-link class="type-head" to="/products">------全部商品------</router-link>
    <ProductList />
  </div>
</template>
<script setup>
import ProductList from '@/views/ProductList.vue';
// 移除所有 import (JacketsList, PantsList, TopsList)
</script>

<style scoped>

.goods-list-wrapper{
  /* 樣式保持不變 */
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.goods-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.type-head {
  text-align: center;
  color: #1b2c79;
  text-decoration: none;
  background-color: rgba(255, 255, 255, 0);
  font-weight: bold; /* 增加粗體以強調連結 */
  padding: 5px 0; /* 增加點擊區域 */
}

</style>