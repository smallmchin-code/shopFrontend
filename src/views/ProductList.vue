// fileName: ProductList.vue
<template>
  <div class="product-list-container">
    <h2>------{{ categoryName }}------ </h2>

    <div v-if="products.length" class="goods-list">
      <router-link 
        v-for="good in products" 
        :key="good.id" 
        :to="`/product/${good.id}`" 
        class="goods-link"
      > 
        <GoodsItem 
          :id="good.id" 
          :name="good.name" 
          :image="good.image" 
          :price="good.price" 
          :stock="good.stock" 
        />
      </router-link>
    </div>
    <div v-else class="empty-list-message">
      此分類目前沒有商品。
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import GoodsItem from '@/components/GoodsItem.vue'; 
// 引入 Pinia Store
import { useProductStore } from '@/stores/productStore.js'; // <-- 引入 Product Store

const route = useRoute();
const productStore = useProductStore(); // <-- 取得 Product Store 實例
const products = ref([]);

// 獲取當前分類 Slug，如果沒有參數，則預設為 'all' (全部商品)
const currentCategorySlug = computed(() => route.params.category || 'all');

// ... (categoryName computed property remains the same)
const categoryName = computed(() => {
  const mapping = {
    'jacket': '外套清單',
    'top': '上衣清單',
    'pant': '褲子清單',
    'all': '全部商品',
    'products': '全部商品' // 為了兼容 /products 路由
  };
  return mapping[currentCategorySlug.value] || '商品列表';
});
// 核心資料獲取邏輯：現在從 Pinia Store 獲取
const loadProducts = () => {
  // 調用 Store 的 Action/Getter
  products.value = productStore.getFilteredGoods(currentCategorySlug.value); // <-- 調用 Store
};

watch(currentCategorySlug, (newCategory) => {
  loadProducts();
}, { immediate: true }); 
</script>


<style>
h2{
  text-align: center;
  margin: 20px 0;
     background-color: #4a6365;
    opacity: 0.75;
    color: #fff;
    /* 更大的圓角，營造有機、舒適的感覺 */
    border-radius: 20px; 
    box-shadow: 0 8px 25px rgba(217, 207, 17, 0.15); 
}
.goods-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}
.goods-link {
  text-decoration: none;
  color: inherit;
  display: block;
}
.empty-list-message {
  text-align: center;
  padding: 50px;
  color: #888;
}
</style>