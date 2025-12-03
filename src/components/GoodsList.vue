<template>
  <div class="goods-list-wrapper">
     <router-link class="type-head" to="/products">全部商品</router-link>
     <router-link class="type-head" to="/products/jacket"> 外套清單</router-link>
     <router-link class="type-head" to="/products/top">上衣清單</router-link>
     <router-link class="type-head" to="/products/pant">褲子清單</router-link>
    </div>
    <ProductList />
</template>
<script setup>
import ProductList from '@/views/ProductList.vue';
</script>

<style scoped>

.goods-list-wrapper{
  display: flex;
  white-space: nowrap;
  /* flex-direction: column;
  gap: 32px; */
}

.type-head {
  text-align: center;
  background: none; /* 移除現有背景 */
  border: none;
  padding: 10px 15px;
  margin: 0 10px;
  cursor: pointer;
  font-family: '微軟正黑體', sans-serif; /* 選擇一款現代字體 */
  font-size: 1.1em;
  transition: all 0.3s ease;
  flex-grow: 1;
  color: #000;
  border: none;
  /* 更大的圓角，與表單容器風格一致 */
  border-radius: 10px; 
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.1s;
  letter-spacing: 1px; 
}
.type-head:hover {
  background-color: #e0dcd5; /* 柔和的背景色 */
  transform: translateY(-2px); /* 輕微上移 */
}
.type-head:active {
  color: #000;
  font-weight: bold;
  border-bottom: 3px solid #000; /* 點擊時回到原位 */
}
</style>