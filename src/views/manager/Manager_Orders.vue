<template>
  <div class="manager-orders">
    <h2>📋 訂單管理</h2>
    <p class="intro">在這裡您可以查看所有客戶的訂單、追蹤發貨進度和更改訂單狀態。</p>
    
    <div class="order-list-container">
      <h3>訂單列表 (共 {{ totalOrders }} 筆)</h3>
      
      <div v-if="orders.length === 0" class="empty-message">
        目前沒有任何訂單。
      </div>

      <table v-else>
        <thead>
          <tr>
            <th>ID</th>
            <th>用戶 ID</th>
            <th>總金額</th>
            <th>訂單日期</th>
            <th>狀態</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.userId }}</td>
            <td>NT$ {{ order.totalPrice.toLocaleString() }}</td>
            <td>{{ order.date }}</td>
            <td>
                <span :class="['status-tag', 'status-' + order.status.replace(/[^a-z0-9]/gi, '').toLowerCase()]">
                    {{ order.status }}
                </span>
            </td>
            <td>
              <button class="detail-btn" @click="viewOrderDetails(order)">查看詳情</button>
              <select 
                :value="order.status" 
                @change="handleStatusChange(order.id, $event.target.value)"
                class="status-select"
              >
                <option value="待處理">待處理</option>
                <option value="已發貨">已發貨</option>
                <option value="已完成">已完成</option>
                <option value="已取消">已取消</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="selectedOrder" class="order-detail-modal-overlay" @click.self="selectedOrder = null">
      <div class="order-detail-modal">
        <h3>訂單詳情 #{{ selectedOrder.id }}</h3>
        <p><strong>用戶：</strong> {{ selectedOrder.userId }}</p>
        <p><strong>日期：</strong> {{ selectedOrder.date }}</p>
        <p><strong>總價：</strong> NT$ {{ selectedOrder.totalPrice.toLocaleString() }}</p>
        <p><strong>狀態：：</strong> 
            <span :class="['status-tag', 'status-' + selectedOrder.status.replace(/[^a-z0-9]/gi, '').toLowerCase()]">
                {{ selectedOrder.status }}
            </span>
        </p>

        <h4>商品列表</h4>
        <ul>
          <li v-for="item in selectedOrder.items" :key="item.id">
            {{ item.name }} ({{ item.quantity }} 個) - NT$ {{ (item.price * item.quantity).toLocaleString() }}
          </li>
        </ul>

        <button @click="selectedOrder = null" class="close-btn">關閉</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref ,onMounted } from 'vue';
import { useOrderStore } from '@/stores/orderStore';
import { storeToRefs } from 'pinia';

const orderStore = useOrderStore();
// 通過 storeToRefs 獲取響應式狀態
const { orders, totalOrders } = storeToRefs(orderStore);
const { updateOrderStatus } = orderStore;

const selectedOrder = ref(null);

onMounted(async () => {
    try {
        await fetchAllOrders(); 
    } catch (error) {
        alert('載入所有訂單列表失敗，請檢查伺服器連線。');
        console.error('Fetch all orders failed:', error);
    }
});

function viewOrderDetails(order) {
  selectedOrder.value = order;
}

async function handleStatusChange(id, newStatus) { // 👈 修正為 async
  if (confirm(`確定要將訂單 ${id} 的狀態更改為「${newStatus}」嗎？`)) {
    // 呼叫異步更新 Action，並使用 await 等待結果
    const result = await updateOrderStatus(id, newStatus); // 👈 使用 await
    
    if (result.success) {
        alert(result.message);
    } else {
        alert('狀態更新失敗：' + result.message);
    }
  }
}
</script>

<style scoped>
.manager-orders {
  max-width: 1200px;
  margin: 40px auto;
  padding: 20px;
  background-color: #fcf8f0;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.intro {
  color: #666;
  margin-bottom: 30px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 15px;
}

.order-list-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

th {
  background-color: #5e7a7d;
  color: white;
}

tr:nth-child(even) {
  background-color: #f5f5f5;
}

.status-tag {
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: bold;
    font-size: 0.9em;
}

/* 狀態顏色標籤 */
.status-tag.status-待處理 { background-color: #ffe082; color: #8d6e63; }
.status-tag.status-已發貨 { background-color: #81c784; color: #1b5e20; }
.status-tag.status-已完成 { background-color: #4db6ac; color: #004d40; }
.status-tag.status-已取消 { background-color: #ef9a9a; color: #b71c1c; }


.detail-btn {
  padding: 6px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  transition: background-color 0.2s;
}
.detail-btn:hover {
    background-color: #0056b3;
}

.status-select {
    padding: 6px;
    border-radius: 4px;
    border: 1px solid #ccc;
}

.empty-message {
    text-align: center;
    padding: 30px;
    border: 1px dashed #ccc;
    color: #666;
}

/* Modal Styles */
.order-detail-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* 確保在最上層 */
}

.order-detail-modal {
    background-color: white;
    padding: 30px;
    border-radius: 8px;
    width: 90%;
    max-width: 600px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.order-detail-modal h4 {
    margin-top: 15px;
    border-top: 1px dashed #eee;
    padding-top: 10px;
}

.order-detail-modal ul {
    list-style: none;
    padding: 0;
}

.order-detail-modal li {
    padding: 5px 0;
    border-bottom: 1px dotted #f0f0f0;
}

.close-btn {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #5e7a7d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
</style>