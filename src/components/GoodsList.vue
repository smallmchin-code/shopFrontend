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
.goods-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.type-head {
  text-align: center;
  margin-top: 20px;
  padding: 15px;
  background-color: rgbc(210, 180, 140); 
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

</style>