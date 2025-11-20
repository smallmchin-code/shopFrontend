<template>
  <div class="goods-item">
    <img :src="image" :alt="name" />
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
import { useCart } from '@/composables/useCart.js'; // 引入購物車邏輯
const { addToCart } = useCart();

const props = defineProps ({
  id: [String, Number], // 新增 id (商品唯一識別)
  name: String,
  image: String,
  price: Number,
  stock: Number, // 新增 stock (判斷是否缺貨)
  size: String,
  description : String,
  category : String,
})

const handleAddToCart = () => {
  // 將 GoodsItem 的 props 傳遞給購物車 Composable
  addToCart({
    id: props.id,
    name: props.name,
    image: props.image,
    price: props.price,
    stock: props.stock, // 傳遞足夠資訊
  });
};
</script>

<style scoped>
.goods-item {
  border: 0px solid #ccc;
  padding: 16px;
  text-align: center;
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