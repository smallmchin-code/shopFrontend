<template>
  <div class="my-orders-page">
    <h2 class="page-title">📦 我的訂單追蹤</h2>
    
    <div v-if="!userStore.isLoggedIn" class="not-logged-in-message">
      您尚未登入，請先 <router-link to="/login">登入</router-link> 以查看您的訂單。
    </div>

    <div v-else-if="userOrders.length === 0" class="empty-orders">
      <p>您目前沒有任何訂單紀錄。</p>
      <router-link to="/">前往購物</router-link>
    </div>

    <div v-else class="orders-content">
      <div class="status-tabs">
        <button 
          @click="currentStatusFilter = 'all'" 
          :class="{ active: currentStatusFilter === 'all' }"
        >
          全部訂單 ({{ userOrders.length }})
        </button>
        <button 
          v-for="(group, key) in groupedOrders"
          :key="key"
          @click="currentStatusFilter = key"
          :class="{ active: currentStatusFilter === key }"
        >
          {{ statusMap[key] }} ({{ group.length }})
        </button>
      </div>
      
      <div class="order-list">
        <div v-for="order in filteredOrders" :key="order.id" class="order-card">
          <div class="order-header">
            <span class="order-id">訂單編號: #{{ order.id }}</span>
            <span :class="['status-tag', 'status-' + statusClass(order.status)]">
                {{ order.status }}
            </span>
          </div>
          
          <div class="order-body">
            <ul class="item-summary">
              <li v-for="(item, index) in order.items" :key="item.id">
                <span class="item-name">{{ item.name }}</span>
                <span class="item-qty">x {{ item.quantity }}</span>
                <span v-if="index < 1" class="more-items">
                    <span v-if="order.items.length > 1"> (共 {{ order.items.length }} 項)</span>
                </span>
              </li>
            </ul>
            
            <div class="order-footer">
              <p class="order-date">下單日期: {{ order.date }}</p>
              <p class="order-total">總金額: <strong>NT$ {{ order.totalPrice.toLocaleString() }}</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useOrderStore } from '@/stores/orderStore';
import { useStore as useUserStore } from '@/stores/usestore'; // 假設使用者 Store 導出 useStore
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const orderStore = useOrderStore();
const { userOrders } = storeToRefs(orderStore);

// ---------------- 狀態與邏輯 ----------------

const currentStatusFilter = ref('all');

// 狀態映射表 (用於顯示名稱)
const statusMap = {
    '待處理': '待出貨', // 待處理 = 待出貨
    '已發貨': '已出貨',
    '已完成': '已送達', // 已完成 = 已送達
    '已取消': '已取消'
};

// 狀態類別映射 (用於 CSS)
const statusClass = (status) => {
    return status.replace(/[^a-z0-9]/gi, '').toLowerCase();
};

// 1. 將用戶訂單依狀態分組
const groupedOrders = computed(() => {
    const groups = {
        '待處理': [],
        '已發貨': [],
        '已完成': [],
        '已取消': []
    };
    
    // 遍歷用戶訂單，按狀態歸類
    userOrders.value.forEach(order => {
        if (groups[order.status]) {
            groups[order.status].push(order);
        }
    });
    return groups;
});


// 2. 根據當前篩選狀態顯示訂單
const filteredOrders = computed(() => {
    if (currentStatusFilter.value === 'all') {
        return userOrders.value;
    }
    
    // 返回該狀態組的訂單
    return groupedOrders.value[currentStatusFilter.value] || [];
});

</script>

<style scoped>
.my-orders-page {
  max-width: 1000px;
  margin: 40px auto;
  padding: 30px;
  background-color: #fcf8f0;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.page-title {
  font-size: 2.2em;
  /* color: #4a6365; */
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 3px solid #a89f8a;
}

.not-logged-in-message, .empty-orders {
    text-align: center;
    padding: 50px;
    border: 1px dashed #ccc;
    border-radius: 8px;
    margin-top: 30px;
    color: #777;
    font-size: 1.1em;
}

.not-logged-in-message a {
    color: #4a6365;
    font-weight: bold;
    text-decoration: underline;
}

/* 狀態標籤 */
.status-tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
    overflow-x: auto;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
}

.status-tabs button {
    padding: 10px 15px;
    background-color: #e0e0e0;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s, color 0.2s;
    white-space: nowrap;
}

.status-tabs button.active {
    background-color: #4a6365;
    color: white;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* 訂單卡片 */
.order-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.order-card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
    background-color: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s;
}

.order-card:hover {
    transform: translateY(-2px);
}

.order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background-color: #f7f7f7;
    border-bottom: 1px solid #e0e0e0;
    font-weight: bold;
}

.order-id {
    color: #555;
    font-size: 0.9em;
}

/* 訂單狀態標籤 */
.status-tag {
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 0.9em;
}

.status-待處理 { background-color: #ffe082; color: #8d6e63; } /* 待出貨 */
.status-已發貨 { background-color: #81c784; color: #1b5e20; } /* 已出貨 */
.status-已完成 { background-color: #4db6ac; color: #004d40; } /* 已送達/完成 */
.status-已取消 { background-color: #ef9a9a; color: #b71c1c; } /* 已取消 */


.order-body {
    padding: 15px;
}

.item-summary {
    list-style: none;
    padding: 0;
    margin: 0 0 15px 0;
}

.item-summary li {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
    border-bottom: 1px dotted #f0f0f0;
}

.item-name {
    flex-grow: 1;
}

.item-qty {
    margin-left: 10px;
    color: #777;
}

.order-footer {
    display: flex;
    justify-content: space-between;
    border-top: 1px dashed #eee;
    padding-top: 10px;
    font-size: 1.1em;
}

.order-date {
    color: #888;
    font-size: 0.9em;
}

.order-total strong {
    color: #d84848;
}
</style>