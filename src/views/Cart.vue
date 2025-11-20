// fileName: Cart.vue
<template>
  <div class="cart-container">
    <h1>購物車</h1>
    
    <div v-if="cartItems.length === 0" class="empty-cart">
      <p>您的購物車是空的。</p>
      <router-link to="/">前往首頁逛逛</router-link>
    </div>
    
    <div v-else class="cart-items-list">
      <div v-for="item in cartItems" :key="item.id" class="cart-item">
        <img :src="item.image" :alt="item.name" class="item-image" />
        
        <div class="item-info">
          <h4 class="item-name">{{ item.name }}</h4>
          <p class="item-price">NT$ {{ item.price }} x {{ item.quantity }}</p>
          <p class="item-subtotal">小計: NT$ {{ (item.price * item.quantity).toLocaleString() }}</p>
        </div>
        
        <button @click="removeFromCart(item.id)" class="delete-btn">
          刪除
        </button>
      </div>
      
      <div class="cart-summary">
        總計商品數: {{ totalItems }} | 總金額: NT$ {{ totalPrice.toLocaleString() }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCart } from '@/composables/useCart.js'; // 引入購物車邏輯

const { cartItems, removeFromCart, totalItems, totalPrice } = useCart();
</script>

<style scoped>
.cart-container {
  max-width: 800px;
  margin: 30px auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}

.empty-cart {
  text-align: center;
  padding: 50px;
  border: 1px dashed #ccc;
  margin-top: 20px;
}

.cart-items-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}

.cart-item {
  display: flex;
  align-items: center;
  border: 1px solid #eee;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.item-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-right: 20px;
  border-radius: 4px;
}

.item-info {
  flex-grow: 1;
}

.item-name {
  margin: 0 0 5px 0;
  font-size: 1.2em;
}

.item-price, .item-subtotal {
  margin: 0;
  color: #555;
}

.item-subtotal {
  font-weight: bold;
  color: #d84848;
}

.delete-btn {
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.delete-btn:hover {
  background-color: #d4380d;
}

.cart-summary {
  margin-top: 30px;
  padding: 15px;
  border-top: 2px solid #333;
  font-size: 1.2em;
  font-weight: bold;
  text-align: right;
}
</style>