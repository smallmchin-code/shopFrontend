<template>
  <div class="goods-item">
    <img :src="imageUrl" :alt="name" />
    <h3>{{ name }}</h3>
    <p>${{ price }}</p>
    
    <button 
      @click.prevent="handleAddToCart" 
      :disabled="stock === 0" 
      class="add-to-cart-btn-list"
    >
      {{ stock > 0 ? '加入購物車' : '缺貨中' }}
    </button>

  </div>
</template>


<script setup>
import { computed } from 'vue';
import { useCartStore } from '@/stores/cartStore.js'; // <-- 引入 Pinia Store

// 取得 Store 實例
const cartStore = useCartStore(); 

const props = defineProps ({
  id: [String, Number], // 新增 id (商品唯一識別)
  name: String,
  imageId: [String, Number],
  price: Number,
  stock: Number, // 新增 stock (判斷是否缺貨)
  size: String,
  description : String,
  category : String,
})

const imageUrl = computed(() => {
    if (props.imageId) {
        return `http://localhost:8080/api/products/images/${props.imageId}`
    }
    return '/path/to/default-image.png' // 請替換為您自己的預設圖路徑
})

const handleAddToCart = () => {
  // 直接調用 Store 的 Action
  cartStore.addToCart({ // <-- 改為調用 cartStore 的 action
    id: props.id,
    name: props.name,
    image: imageUrl.value,
    price: props.price,
    stock: props.stock, 
  });
};
</script>


<style scoped>
.goods-item {
  border: 0px solid #ccc;
  padding: 16px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.8);
}

.goods-item img {
  max-width: 100%;
  height: auto;
}

/* 新增：按鈕樣式 */
.add-to-cart-btn-list {
  background-color: #5e7a7d;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  font-weight: bold;
  transition: background-color 0.2s;
}
.add-to-cart-btn-list:hover:not(:disabled) {
  background-color: #4a6365;
}
.add-to-cart-btn-list:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}
</style>