
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

axios.defaults.withCredentials = true;
const BASE_URL = 'http://localhost:8080/api/users'
export const useStore = defineStore('user', () => {
  // 狀態 (State)
  const users = ref([]); // 模擬儲存所有註冊用戶
  const currentUser = ref(null); // 當前登入的使用者

  // Getter
  const isLoggedIn = computed(() => currentUser.value !== null);

  

  const allUsers = computed(() => users.value);

  // 註冊 (POST /api/users)
  async function registerUser({ username, password, email }) {
    try {
      const response = await axios.post(BASE_URL, { username, password, email });
      console.log('註冊成功:', response.data);
      return response.data;
    } catch (error) {
      console.error('註冊失敗:', error);
      return { success: false, message: error.response?.data?.message || '註冊失敗，伺服器錯誤' };
    }
  }

  // 登入 (POST /api/users/login)
  async function loginUser({ username, password }) {
    try {   
      const response = await axios.post(`${BASE_URL}/login`, { username, password });
      const user = response.data;
      if (!user || user === null) {
        throw new Error('無效的使用者資料');
      }
      currentUser.value = {
        username: user.username,
        email: user.email,
        id: user.id 
      };
      //localStorage.setItem('user_id', user.id);
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
      //localStorage.removeItem('user_id');
    }
  }

  // 刪除使用者 (DELETE /api/users/{username})
  async function deleteUser(username) {
    try {
      // 發送 DELETE 請求
      const userToDelete = users.value.find(u => u.username === username);

      if (!userToDelete) {
        throw new Error('找不到該使用者');
      }
      await axios.delete(`${BASE_URL}/${username}`);

      // [可選] 如果您需要管理前端的 users 列表，則在這裡更新
      users.value = users.value.filter(user => user.username !== username);

      return { success: true, message: '刪除成功' };
    } catch (error) {
      console.error('刪除失敗:', error);
      return { success: false, message: error.response?.data?.message || '刪除失敗' };
    }
  }

  async function fetchAllUsers() {
    try {
      const response = await axios.get(BASE_URL); // BASE_URL = 'http://localhost:8080/api/users'
      // 假設後端返回 List<User>
      users.value = response.data; 
      return { success: true, message: '使用者列表載入成功' };
    } catch (error) {
      console.error('載入使用者列表失敗:', error);
      // 載入失敗時，將列表清空
      users.value = [];
      return { success: false, message: error.response?.data?.message || '載入使用者列表失敗' };
    }
  }

async function initializeAuth() {
    //const userId = localStorage.getItem('user_id');   
      try {
        const response = await axios.get(`${BASE_URL}/me`); 
        const user = response.data;

        // 恢復 currentUser 狀態
        currentUser.value = {
          username: user.username,
          email: user.email,
          id: user.id 
        };
        console.log('Auth initialized: Restored login state from localStorage.');
      } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log('Auth initialized: No active session found (Expected 401).');
        } else {
            console.error('Auth initialization failed due to server error:', error);
        }
        //localStorage.removeItem('user_id');
        currentUser.value = null;
      }

  }

  // 💡 立即執行檢查以恢復狀態
  initializeAuth();

  return {
    
    users,
    currentUser,
    isLoggedIn,
    allUsers,
    registerUser,
    loginUser,
    logoutUser,
    deleteUser,
    fetchAllUsers
  };
});