<template>
  <div class="manager-layout">
    
    <aside class="sidebar">
      <div class="sidebar-header">
        <h3>管理中心</h3>
      </div>
      <nav>
        <ul>
          <li 
            :class="{ active: $route.path === '/manager/dashboard' }"
            @click="router.push('/manager/dashboard')"
          >
            📊 儀表板
          </li>
          <li
            :class="{ active: $route.path === '/manager/products' }"
            @click="router.push('/manager/products')"
          >
            🛍️ 商品管理
          </li>
          <li
            :class="{ active: $route.path === '/manager/orders' }"
            @click="router.push('/manager/orders')"
          >
            📦 訂單管理
          </li>
          <li
            :class="{ active: $route.path === '/manager/users' }"
            @click="router.push('/manager/users')"
          >
            👥 使用者管理
          </li>
        </ul>
      </nav>
      <div class="sidebar-footer">
        <button @click="logout">登出</button>
      </div>
    </aside>

    <main class="content-area">
      <router-view />
    </main>

  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { onMounted } from 'vue';

const router = useRouter();
const route = useRoute(); 

// 組件掛載後，若路徑是 /manager (父路徑)，自動導向到 /manager/products
onMounted(() => {
  if (route.path === '/manager') {
    router.replace('/manager/products');
  }
});

// 登出功能
const logout = () => {
  if (confirm('確定要登出管理介面嗎?')) {
    // 實際登出邏輯 (清除 Token/Session 等)
    router.push('/login'); // 登出後導向登入頁
  }
};
</script>

<style scoped>
/* 保持原有的側邊欄/內容區樣式 */
.manager-layout {
  display: flex;
  min-height: 100vh; /* 讓側邊欄有高度 */
  height: 100%;
  background-color: #f7f7f7;
}
.sidebar {
  width: 250px;
  background-color: #34495e; 
  color: white;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.sidebar-header h3 {
  margin-top: 0;
  border-bottom: 2px solid #5a7b9c;
  padding-bottom: 10px;
  margin-bottom: 20px;
}
.sidebar nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.sidebar nav li {
  padding: 12px 10px;
  cursor: pointer;
  transition: background-color 0.3s, padding-left 0.3s;
  border-radius: 4px;
  margin-bottom: 5px;
}
.sidebar nav li:hover {
  background-color: #4a637a;
  padding-left: 15px;
}
.sidebar nav li.active {
  background-color: #2c3e50;
  font-weight: bold;
  border-left: 4px solid #42b983;
}
.sidebar-footer button {
  width: 100%;
  padding: 10px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
}
.content-area {
  flex-grow: 1;
  padding: 30px;
  background-color: white;
  height: 100%; 
  overflow-y: auto;
}
</style>