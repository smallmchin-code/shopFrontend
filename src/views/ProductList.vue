<template>
  <div class="product-list-container">
    <h2>{{ categoryName }} 商品清單</h2>

    <div v-if="products.length" class="goods-list">
      <router-link 
        v-for="good in products" 
        :key="good.id" 
        :to="`/product/${good.id}`" 
        class="goods-link"
      > 
        <GoodsItem :name="good.name" :image="good.image" :price="good.price" />
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
// 假設 GoodsItem 在 components 目錄
import GoodsItem from '@/components/GoodsItem.vue'; 
// 引入修改後的 useGoods
import { useGoods } from '@/composables/useGoods.js'; 

const route = useRoute();
const { getFilteredGoods } = useGoods(); 
const products = ref([]);

// 獲取當前分類 Slug，如果沒有參數，則預設為 'all' (全部商品)
const currentCategorySlug = computed(() => route.params.category || 'all');

// 顯示用的中文名稱
const categoryName = computed(() => {
  const mapping = {
    'jacket': '外套',
    'top': '上衣',
    'pant': '褲子',
    'all': '全部商品' 
  };
  return mapping[currentCategorySlug.value] || '商品列表';
});

// 核心資料獲取邏輯：在未來，這裡將是您的 API 呼叫點
const loadProducts = () => {
  // 呼叫 useGoods 中統一的獲取函數
  products.value = getFilteredGoods(currentCategorySlug.value);
};

// 監聽路由參數變化，當用戶切換分類時自動重新載入資料
watch(currentCategorySlug, (newCategory) => {
  loadProducts();
}, { immediate: true }); 
// immediate: true 確保在組件初始化時也執行一次 loadProducts
</script>

<style>
/* 繼承原 JacketsList, TopsList, PantsList 的樣式 */
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