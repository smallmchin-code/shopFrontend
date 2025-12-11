<template>
  <div class="login-page-wrapper">
    <!-- 註冊表單 -->
    <div v-if="!isLogin" class="container">
      <h1>Hello, Friend!</h1>
      <h3>註冊</h3>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="username">使用者名稱:</label>
          <input type="text" id="username" v-model="username" required>
        </div>
        <div class="form-group">
          <label for="password">密碼:</label>
          <input type="password" id="password" v-model="password" required>
        </div>
        <div class="form-group">
          <label for="email">電子郵件:</label>
          <input type="email" id="email" v-model="email" required>
        </div>
        <button type="submit">註冊</button>
      </form>
      <p>已經有帳號了? <a href="#" @click="toggleForm">點此登入</a></p>
    </div>

    <!-- 登入表單 -->
    <div v-else class="container">
      <h2>登入</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="login-username">使用者名稱:</label>
          <input type="text" id="login-username" v-model="loginUsername" required>
        </div>
        <div class="form-group">
          <label for="login-password">密碼:</label>
          <input type="password" id="login-password" v-model="loginPassword" required>
        </div>
        <button type="submit">登入</button>
      </form>
      <p>還沒有帳號? <a href="#" @click="toggleForm">點此註冊</a></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router';
import { useStore } from '@/stores/usestore';

const router = useRouter();
const usestore = useStore();
// --- 狀態管理 ---
const isLogin = ref(true);

// --- 表單模型 ---
const username = ref('');
const password = ref('');
const email = ref('');
const loginUsername = ref('');
const loginPassword = ref('');


// --- 函式 ---
function toggleForm() {
  isLogin.value = !isLogin.value;
}

async function handleRegister() {
  const result = await usestore.registerUser({
    username: username.value,
    password: password.value,
    email: email.value
  });


  if (result.success) {
    // 註冊成功後自動切換到登入表單
    isLogin.value = true; 
    // 清空表單
    username.value = '';
    password.value = '';
    email.value = '';
  }
}

// 處理登入邏輯
async function handleLogin() {
  const result = await usestore.loginUser({
    username: loginUsername.value,
    password: loginPassword.value
  });

  alert(result.message);

  if (result.success) {
    if (usestore.currentUser.username === 'admin') {
      router.push('manager/products'); 
    } else {
      router.push('/'); 
    }
  }
  loginPassword.value = ''; 
}
</script>

<style scoped>
.login-page-wrapper {
  /* position: fixed; 使用 fixed 確保覆蓋整個視窗 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* background-color: rgba(255, 255, 255, 0.8); 設置一個半透明的背景，覆蓋 main.css 的背景圖 */
  z-index: 1000; /* 確保在最上層 */
}

/* --- 表單容器 --- */
.container {
  width: 90%;
  max-width: 400px;
  padding: 40px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  z-index: 1;
  box-sizing: border-box;
  text-align: center;
}

.form-container {
  width: 100%;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #4c5968;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}

p {
  margin-top: 20px;
}

a {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

a:hover {
  text-decoration: underline;
}
</style>

