<template>
  <div class="goods-list">
    <router-link v-for="good in filterPantGoods" :key="good.id" :to="`/product/${good.id}`" class="goods-link"> 
    <GoodsItem :name="good.name" :image="good.image" :price="good.price" />
    </router-link>
</div>
    
</template>

<script setup>

import { useGoods } from '@/composables/useGoods.js'; 

const { filterPantGoods } = useGoods();
import GoodsItem from '../../components/GoodsItem.vue';
</script>
<style>
.goods-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;

}
</style>