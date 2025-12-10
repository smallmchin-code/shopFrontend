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
          :image-id="good.images && good.images.length > 0 ? good.images[0].id : null"
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
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import GoodsItem from '@/components/GoodsItem.vue'
import { useProductStore } from '@/stores/productStore.js'

const route = useRoute()
const productStore = useProductStore()

// 產品資料直接來自 store
const products = computed(() => productStore.goods)

// 取得當前分類
const currentCategorySlug = computed(() => route.params.category || 'all')

// 中文分類名稱
const categoryName = computed(() => {
  const mapping = {
    jacket: '外套清單',
    top: '上衣清單',
    pant: '褲子清單',
    all: '全部商品',
  }
  return mapping[currentCategorySlug.value] || '商品列表'
})

// 會去打後端 API
async function loadProducts() {
  await productStore.fetchFilteredGoods(currentCategorySlug.value)
}

// 當分類改變 → 重新載入
watch(currentCategorySlug, () => {
  loadProducts()
}, { immediate: true })
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