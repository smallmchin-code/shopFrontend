// fileName: Manager_Users.vue (Pinia 整合版本)

<template>
  <div class="manager-users">
    <h2>👥 使用者管理介面</h2>
    <p class="intro">
      在這裡您可以查看所有註冊使用者，並管理其帳號。
      <br>

    </p>

    <div class="user-list-container">
      <h3>註冊使用者列表 (共 {{ allUsers.length }} 人)</h3>
      
      <div v-if="allUsers.length === 0" class="empty-message">
        目前沒有任何註冊使用者。
      </div>

      <table v-else>
        <thead>
          <tr>
            <th>使用者名稱 (ID)</th>
            <th>電子郵件 (Email)</th>
            <th>權限/角色</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in allUsers" :key="user.username">
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td :class="{'role-admin': user.role === 'admin'}">
              {{ getRole(user.username) === 'admin' ? '管理員 (Admin)' : '一般用戶' }}
            </td>
            <td>
              <button 
                class="delete-btn" 
                @click="handleDelete(user.username)"
                :disabled="getRole(user.username) === 'admin'"
              >
                刪除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from '@/stores/usestore.js'; // 引入您的 Pinia User Store
import { storeToRefs } from 'pinia';

const userStore = useStore();

// 1. 使用 storeToRefs 確保 Pinia State/Getter (allUsers) 保持響應性
const { allUsers } = storeToRefs(userStore); 

// 2. 直接解構 Action
const { deleteUser } = userStore;

/**
 * 根據您的 Store 邏輯，重新判斷角色的 computed property
 * 這是因為您的 users ref 初始沒有 role 欄位，但登入時會判斷 role。
 * 為了在列表中正確顯示，我們需要這個輔助函式。
 * @param {string} username - 使用者名稱
 */
const getRole = (username) => {
    return username.toLowerCase().includes('admin') ? 'admin' : 'user';
};


/**
 * 處理刪除使用者的邏輯
 * @param {string} username - 要刪除的使用者名稱
 */
const handleDelete = (username) => {
  // 防止刪除管理員
  if (getRole(username) === 'admin') {
      alert('為了安全起見，不允許在介面中刪除管理員帳號！');
      return;
  }
  
  if (confirm(`確定要刪除使用者帳號「${username}」嗎？ (此操作不可逆)`)) {
    
    // 檢查是否為當前登入者 (防止刪除自己)
    if (userStore.currentUser && userStore.currentUser.username === username) {
        alert('您不能刪除當前登入中的帳號！請先登出。');
        return;
    }
    
    const success = deleteUser(username);
    
    if (success) {
      alert(`使用者「${username}」已成功刪除。`);
    } else {
      alert(`刪除失敗：找不到使用者「${username}」。`);
    }
  }
};
</script>

<style scoped>
/* ----------- 樣式沿用自上次優化版本，讓介面保持一致性 ----------- */
.manager-users {
  max-width: 1000px;
  margin: 40px auto;
  padding: 30px;
  background-color: #fcf8f0; /* 復古淺色背景 */
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 1.5em;
  /* color: #4a6365; */
  text-align: center;
  margin-bottom: 10px;
}

.intro {
  text-align: center;
  color: #777;
  margin-bottom: 30px;
  line-height: 1.6;
}

.user-list-container {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
}

h3 {
    border-bottom: 2px solid #a89f8a;
    padding-bottom: 10px;
    margin-bottom: 20px;
    color: #4a6365;
}

.empty-message {
    text-align: center;
    padding: 50px;
    color: #888;
    border: 1px dashed #ccc;
    border-radius: 4px;
}

/* ----------- 表格樣式 ----------- */
table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th, td {
  padding: 12px 15px;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f0f0e8;
  color: #333;
  font-weight: bold;
  text-transform: uppercase;
}

tbody tr:hover {
  background-color: #fffaf0; /* 輕微的 hover 效果 */
}

/* 角色高亮 */
.role-admin {
  font-weight: bold;
  color: #d84848; /* 醒目的管理員顏色 */
  background-color: #ffcccc30;
  padding: 2px 8px;
  border-radius: 4px;
}

/* 刪除按鈕 */
.delete-btn {
  padding: 8px 15px;
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.delete-btn:hover:not(:disabled) {
  background-color: #d4380d;
}

.delete-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    color: #888;
}
</style>