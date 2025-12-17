
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

      <button class="checkout-btn" @click="handleCheckout">
          結帳 (購買)
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cartStore.js'; 
import { useOrderStore } from '@/stores/orderStore';
import { storeToRefs } from 'pinia';

const router = useRouter();
const cartStore = useCartStore();
const orderStore = useOrderStore()
const { items: cartItems, totalItems, totalPrice } = storeToRefs(cartStore);
// 4. 直接解構 Action (Action 只是函式，本身不需 storeToRefs)
const { removeFromCart } = cartStore;

async function handleCheckout() {
    if (totalItems.value === 0) {
        alert('您的購物車是空的，無法結帳。');
        return;
    }

    if (confirm('確定要送出訂單並結帳嗎？')) {
        // 呼叫 Order Store 的異步建立訂單 Action，並使用 await 等待結果
        const result = await orderStore.createOrder(); // 👈 使用 await

        alert(result.message);

        if (result.success) {
            // 成功後導向我的訂單頁面會更合適
            router.push('/topay'); 
        }
    } else {
        alert('您已取消送出訂單。');
    }
}
</script>

<style scoped>
.cart-container {
  max-width: 800px;
  margin: 30px auto;
  padding: 20px;
  /* background-color: rgba(2, 1, 19, 0.5); */
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
  background: #56d65edd;
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
.checkout-btn {
    width: 100%;
    padding: 15px;
    margin-top: 20px;
    background-color: #529256; /* 綠色，代表結帳 */
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.2rem;
    font-weight: bold;
    transition: background-color 0.3s;
    box-shadow: 0 4px #06590a; /* 陰影讓按鈕有立體感 */
}

.checkout-btn:active {
    background-color: #388E3C;
    box-shadow: 0 2px #388E3C;
    transform: translateY(2px);
}
</style>