<template>
  <div class="cart-wrapper">
    <div class="cart-container">
      <header class="cart-header">
        <h1>購物清單</h1>
        <span class="item-count">共 {{ totalItems }} 件商品</span>
      </header>
      
      <div v-if="cartItems.length === 0" class="empty-cart">
        <div class="empty-icon">📂</div>
        <p>您的購物車目前是空的</p>
        <router-link to="/" class="back-home">回到商店首頁</router-link>
      </div>
      
      <div v-else class="cart-form">
        <div class="cart-items-list">
          <div v-for="item in cartItems" :key="item.id" class="cart-item">
            <div class="item-visual">
              <img :src="item.image" :alt="item.name" class="item-image" />
            </div>
            
            <div class="item-details">
              <h4 class="item-name">{{ item.name }}</h4>
              <div class="item-meta">
                <span class="unit-price">單價: NT$ {{ item.price.toLocaleString() }}</span>
                <span class="quantity">數量: {{ item.quantity }}</span>
              </div>
              <p class="item-subtotal">小計: NT$ {{ (item.price * item.quantity).toLocaleString() }}</p>
            </div>
            
            <button @click="cartStore.removeFromCart(item.id, item.variantId)" class="delete-btn" title="移除商品">
              <span class="delete-icon">✕</span>
            </button>
          </div>
        </div>
        
        <div class="cart-footer">
          <div class="summary-box">
            <div class="summary-row">
              <span>商品總計</span>
              <span>NT$ {{ totalPrice.toLocaleString() }}</span>
            </div>
            <div class="summary-row total">
              <span>應付總額</span>
              <span class="total-amount">NT$ {{ totalPrice.toLocaleString() }}</span>
            </div>
          </div>
          <div class="action-group">
            <router-link to="/" class="secondary-btn">
              返回首頁
            </router-link>
            <button class="checkout-btn" @click="handleCheckout">
              確認訂單並結帳
            </button>

          </div>
        </div>
      </div>
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
const orderStore = useOrderStore();
const { items: cartItems, totalItems, totalPrice } = storeToRefs(cartStore);
const { removeFromCart } = cartStore;

async function handleCheckout() {
    if (totalItems.value === 0) {
        alert('您的購物車是空的，無法結帳。');
        return;
    }

    console.log('購物車內容：', cartStore.items);
    const invalidItems = cartStore.items.filter(item => !item.variantId);
    if (invalidItems.length > 0) {
        alert('購物車中有商品缺少規格資訊，請重新加入購物車');
        return;
    }

    if (confirm('確定要送出訂單並結帳嗎？')) {
        const result = await orderStore.createOrder();
        alert(result.message);
        if (result.success) {
            router.push('/topay'); 
        }
    } else {
        alert('您已取消送出訂單。');
    }
}
</script>

<style scoped>
/* 莫蘭迪色系定義 */
:refer {
  --morandi-bg: #f2f2f2;
  --morandi-primary: #8e9775; /* 豆沙綠 */
  --morandi-secondary: #95a2b3; /* 霧霾藍 */
  --morandi-text: #5b5b5b;
  --morandi-border: #d1d9d9;
  --morandi-accent: #b8a99a; /* 奶茶咖啡 */
  --morandi-danger: #a68a8a; /* 藕粉紅 */
}

.cart-wrapper {
  
}

.cart-container {
  max-width: 700px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.cart-header {
  padding: 30px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fdfdfd;
}

h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 500;
  color: #7d8491;
  letter-spacing: 2px;
}

.item-count {
  font-size: 0.9rem;
  color: #95a2b3;
}

/* 購物清單樣式 */
.cart-form {
  padding: 20px 30px;
}

.cart-items-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #fcfcfc;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  transition: transform 0.2s;
}

.cart-item:hover {
  border-color: #d1d9d9;
}

.item-visual {
  flex-shrink: 0;
}

.item-image {
  width: 85px;
  height: 85px;
  object-fit: cover;
  border-radius: 6px;
  background-color: #eee;
}

.item-details {
  flex-grow: 1;
  margin-left: 20px;
}

.item-name {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  color: #6b705c; /* 莫蘭迪綠黑 */
}

.item-meta {
  font-size: 0.85rem;
  color: #95a2b3;
  margin-bottom: 5px;
}

.item-meta span {
  margin-right: 15px;
}

.item-subtotal {
  margin: 0;
  font-weight: 600;
  color: #a68a8a; /* 藕粉色小計 */
}

/* 刪除按鈕 */
.delete-btn {
  background: transparent;
  color: #ccc;
  border: 1px solid #eee;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.delete-btn:hover {
  background-color: #a68a8a;
  color: white;
  border-color: #a68a8a;
}

/* 底部總計與結帳 */
.cart-footer {
  margin-top: 40px;
  border-top: 1px solid #eee;
  padding-top: 25px;
}

.summary-box {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 25px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  color: #95a2b3;
}

.summary-row.total {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed #d1d9d9;
  color: #5b5b5b;
  font-weight: bold;
}

.total-amount {
  font-size: 1.4rem;
  color: #8e9775;
}

/* 按鈕群組佈局 */
.action-group {
  display: flex;
  gap: 15px; /* 按鈕之間的間距 */
  margin-top: 20px;
}

/* 結帳按鈕 (維持原有的豆沙綠，但調整寬度以適應並排) */
.checkout-btn {
  flex: 2; /* 結帳按鈕較寬，佔 2 份比重 */
  padding: 16px;
  background-color: #8e9775;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  letter-spacing: 2px;
  transition: all 0.3s ease;
}

/* 回首頁按鈕 (莫蘭迪霧霾藍) */
.secondary-btn {
  flex: 1; /* 回首頁按鈕較窄，佔 1 份比重 */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background-color: #95a2b3; /* 莫蘭迪藍灰色 */
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.secondary-btn:hover {
  background-color: #8491a3;
  box-shadow: 0 4px 12px rgba(149, 162, 179, 0.3);
}

.checkout-btn:hover {
  background-color: #7a8265;
  box-shadow: 0 4px 12px rgba(142, 151, 117, 0.3);
}

/* 行動裝置適應：在手機上改為上下堆疊 */
@media (max-width: 480px) {
  .action-group {
    flex-direction: column-reverse; /* 手機上回首頁在下，結帳在上 */
  }
}

.checkout-btn:active {
  transform: translateY(1px);
}

/* 空購物車樣式 */
.empty-cart {
  padding: 80px 40px;
  text-align: center;
  color: #95a2b3;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.back-home {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 25px;
  color: #8e9775;
  text-decoration: none;
  border: 1px solid #8e9775;
  border-radius: 20px;
  transition: all 0.3s;
}

.back-home:hover {
  background-color: #8e9775;
  color: white;
}

@media (max-width: 600px) {
  .cart-item {
    flex-direction: column;
    text-align: center;
  }
  .item-details {
    margin: 15px 0;
  }
  .delete-btn {
    align-self: flex-end;
  }
}
</style>