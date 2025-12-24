<template>
  <div class="manager-layout">
    <header class="top-navbar">
      <div class="nav-brand">
        <h3>管理中心</h3>
      </div>
      
      <nav class="nav-menu">
        <ul>
          <li
            :class="{ active: $route.path.includes('/manager/products') }"
            @click="router.push('/manager/products')"
          >
           商品管理
          </li>
          <li
            :class="{ active: $route.path.includes('/manager/orders') }"
            @click="router.push('/manager/orders')"
          >
           訂單管理
          </li>
          <li
            :class="{ active: $route.path.includes('/manager/users') }"
            @click="router.push('/manager/users')"
          >
            使用者管理
          </li>
        </ul>
      </nav>

      <div class="nav-footer">
        <button class="logout-btn" @click="logout">登出</button>
      </div>
    </header>

    <main class="content-area">
      <div class="content-container">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { onMounted } from 'vue';
import { useStore } from '@/stores/usestore'; 

const usestore = useStore();
const router = useRouter();
const route = useRoute(); 

onMounted(() => {
  if (route.path === '/manager') {
    router.replace('/manager/products');
  }
});

async function logout (){
  if (confirm('確定要登出管理介面嗎?')) {
    await usestore.logoutUser();
    alert('您已登出');
    router.push('/login'); 
  }
};
</script>

<style scoped>
.manager-layout {
  display: flex;
  flex-direction: column;
  /* 使用 dvh (Dynamic Viewport Height) 確保在手機瀏覽器上不被網址列遮擋 */
  height: 100vh;
  height: 100dvh; 
  /* 鎖定外層，不讓整頁滑動，只讓內容區滑動 */
  overflow: hidden; 
  background-color: #f4f4f2;
}

/* 頂部導航列 */
.top-navbar {
  height: 70px;
  flex-shrink: 0; /* 強制固定高度，不被內容擠壓 */
  background-color: #457b9d; 
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  z-index: 100;
}

/* 關鍵修正：內容區域 */
.content-area {
  flex: 1; /* 自動填滿剩餘高度 */
  overflow-y: auto; /* 允許垂直捲動 */
  -webkit-overflow-scrolling: touch; /* 優化 iOS 滑動順暢度 */
  padding: 30px;
  background-color: #f4f4f2;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  background-color: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  /* 移除原本的 min-height: calc(100% - 10px)，避免高度計算錯誤 */
  margin-bottom: 20px; /* 增加底部留白，確保最後一項內容看得到 */
}

/* 導航文字樣式 */
.nav-brand h3 {
  margin: 0;
  color: #ffffff;
  font-weight: 600;
  letter-spacing: 1px;
}

.nav-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 15px;
}

.nav-menu li {
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 6px;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
}

.nav-menu li:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.nav-menu li.active {
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-weight: 600;
  border-bottom: 3px solid #8e9775; 
  border-radius: 6px 6px 0 0;
}

/* 登出按鈕 */
.logout-btn {
  padding: 8px 20px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
  font-weight: bold;
}

.logout-btn:hover {
  background-color: #c0392b;
}

/* 手機版適應：修正手機版高度問題 */
@media (max-width: 768px) {
  .top-navbar {
    flex-direction: column;
    height: auto; /* 手機版導航高度改為自動 */
    padding: 15px;
  }
  .nav-menu {
    margin: 10px 0;
  }
  .content-area {
    padding: 15px;
  }
}
</style>