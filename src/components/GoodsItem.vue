<template>
  <div class="goods-item">
    <div class="image-container"> 
      <img :src="imageUrl" :alt="name" class="product-image" />
    </div>
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
  /* 為了讓子元素(圖片容器)的絕對定位能參考到它 */
  position: relative; 
  /* 確保商品項目在內容較少時也不會太小 */
  min-height: 400px; 
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 讓內容/按鈕置底，保持視覺統一 */
}

.image-container {
  width: 100%;
  /* 使用 padding-top 實現寬高比。100% 代表寬高相等 (1:1) */
  /* 如果想要 3:4 的高，請使用 padding-top: calc(4 / 3 * 100%); */
  padding-top: 100%; 
  position: relative; /* 讓圖片可以絕對定位 */
  margin-bottom: 10px; /* 圖片和文字間隔 */
  overflow: hidden; /* 確保裁切不會露出邊界 */
}

/* === 關鍵：圖片填滿容器並裁切 (保持比例不變形) === */
.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  
  /* 確保圖片填滿容器並裁切，不會拉伸變形 */
  object-fit: cover; 
}
h3 {
    min-height: 1.2em; /* 確保標題即使只有一行也不會跳動 */
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