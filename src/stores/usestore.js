
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/users'
export const useStore = defineStore('user', () => {
  // 狀態 (State)
  const users = ref([]); // 模擬儲存所有註冊用戶
  const currentUser = ref(null); // 當前登入的使用者

  // Getter
  const isLoggedIn = computed(() => currentUser.value !== null);

  const allUsers = computed(() => users.value);
  // 動作 (Actions)

  // 註冊 (POST /api/users)
  async function registerUser({ username, password, email }) {
    try {
      // 發送 POST 請求到後端 /api/users 進行註冊
      const response = await axios.post(BASE_URL, { username, password, email });
      console.log('註冊成功:', response.data);
      // 假設後端返回 { success: true, message: '...' }
      return response.data;
    } catch (error) {
      console.error('註冊失敗:', error);
      // 處理 HTTP 錯誤 (例如 409 Conflict)
      return { success: false, message: error.response?.data?.message || '註冊失敗，伺服器錯誤' };
    }
  }

  // 登入 (POST /api/users/login)
  async function loginUser({ username, password }) {
    try {
      // 發送 POST 請求到後端 /api/users/login 進行登入驗證
      const response = await axios.post(`${BASE_URL}/login`, { username, password });

      // 假設後端成功返回用戶資訊 (包含 role)
      const user = response.data;

      // 將用戶資訊存入 Pinia Store
      currentUser.value = {
        username: user.username,
        email: user.email,
        role: user.role // 角色資訊應由後端返回
      };

      return { success: true, message: '登入成功' };
    } catch (error) {
      console.error('登入失敗:', error);
      // 處理 HTTP 錯誤 (例如 401 Unauthorized)
      return { success: false, message: error.response?.data?.message || '使用者名稱或密碼錯誤' };
    }
  }

  // 登出 (POST /api/users/logout)
  async function logoutUser() {
    try {
      // 發送 POST/GET 請求通知伺服器清除 Session/Token
      await axios.post(`${BASE_URL}/logout`);
    } catch (error) {
      console.warn('登出時發生錯誤 (可能不影響前端登出):', error);
    } finally {
      currentUser.value = null;
    }
  }

  // 刪除使用者 (DELETE /api/users/{username})
  async function deleteUser(username) {
    try {
      // 發送 DELETE 請求
      await axios.delete(`${BASE_URL}/${username}`);

      // [可選] 如果您需要管理前端的 users 列表，則在這裡更新
      // users.value = users.value.filter(user => user.username !== username);

      return { success: true, message: '刪除成功' };
    } catch (error) {
      console.error('刪除失敗:', error);
      return { success: false, message: error.response?.data?.message || '刪除失敗' };
    }
  }

  return {
    users,
    currentUser,
    isLoggedIn,
    allUsers,
    registerUser,
    loginUser,
    logoutUser,
    deleteUser,
  };
});