
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useStore = defineStore( 'user',() => {
  // 狀態 (State)
  const users = ref([]); // 模擬儲存所有註冊用戶
  const currentUser = ref(null); // 當前登入的使用者
  
  // Getter
  const isLoggedIn = computed(() => currentUser.value !== null);

  // 動作 (Actions)
  
  // 註冊
  function registerUser({ username, password, email }) {
    if (users.value.find(user => user.username === username)) {
      return { success: false, message: '使用者名稱已存在' };
    }
    
    const newUser = { username, password, email };
    users.value.push(newUser);
    return { success: true, message: '註冊成功' };
  }

  // 登入
  function loginUser({ username, password }) {
    const user = users.value.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      // 模擬登入成功，將用戶資訊存入
      currentUser.value = { 
        username: user.username, 
        email: user.email,
        role: user.username.toLowerCase().includes('admin') ? 'admin' : 'user' // 簡單模擬 admin 角色判斷
      }; 
      return { success: true, message: '登入成功' };
    } else {
      return { success: false, message: '使用者名稱或密碼錯誤' };
    }
  }

  // 登出
  function logoutUser() {
    currentUser.value = null;
    // 在實際應用中，您可能還需要清除 localStorage/sessionStorage 中的 token
  }

  return { 
    users, 
    currentUser, 
    isLoggedIn, 
    registerUser, 
    loginUser, 
    logoutUser 
  };
});