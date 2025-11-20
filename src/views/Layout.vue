<template>
  <div class="layout-wrapper">
    <div class="home-top">
      <!-- 左側：漢堡選單按鈕 -->
      <div class="menu-icon" @click="toggleMenu">
        &#9776;
      </div>

      <!-- 中間：網站標題 -->

      <div class="site-title">
        <router-link to="/">Sean Shop</router-link>
      </div>
      <!-- <img :src="logo" class="site-title" alt=""> -->

      <!-- 右側：導覽列 -->
      <ul :class="{ active: isMenuOpen }">
        <li @click="closeMenu"><router-link to="/login">註冊/登入</router-link></li>
        <li @click="closeMenu"><router-link to="/">首頁</router-link></li>
        <li @click="closeMenu"><router-link to="/products">所有商品</router-link></li>
        <li @click="closeMenu"><router-link to="/contact">聯繫客服</router-link></li>
        <li @click="closeMenu"><router-link to="/cart">購物車</router-link></li>
        <li @click="logout">登出</li>
      </ul>
    </div>

    <div class="home-page-container">
      <router-view />
    </div>
    <ul class="footer">
    <li>地址：新北坪林區大路523號</li>
    <li>EMAIL：seanhappy@yahoo.com.tw</li>
    <li></li>
    <li></li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';


const router = useRouter();
const isMenuOpen = ref(false);

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

function closeMenu() {
  isMenuOpen.value = false;
}
function logout() {
  router.push('/');
}
</script>

<style scoped>
/* 整體結構 */
.layout-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* --- 頂部導覽列 --- */
.home-top {
  background-color: black;
  color: white;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

/* --- 左邊的漢堡按鈕 --- */
.menu-icon {
  font-size: 24px;
  cursor: pointer;
  display: none;
}

/* --- 中間網站名稱 --- */
.site-title a{
  flex-grow: 1;
  /* text-align: center; */
  font-weight: bold;
  font-size: 20px;
   color: white;
  text-decoration: none;
}

/* --- 導覽列 --- */
.home-top ul {
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0;
  padding: 0;
  transition: all 0.3s ease;
}

.home-top li a {
  color: white;
  text-decoration: none;
}


/* --- 手機版展開狀態 --- */
@media (max-width: 768px) {
.menu-icon {
  font-size: 24px;
  cursor: pointer;
  display: flex;
}
.site-title {
  flex-grow: 1;
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  
}

  .home-top ul {
    position: absolute;
    top: 50px;
    left: 0;
    
    width: 50%;
    flex-direction: column;
    background-color: black;
    text-align: center;
    display: none; /* 預設不顯示 */
    padding: 10px 0;
  }

  .home-top ul.active {
    display: flex; /* 展開時顯示 */
    opacity: 0.8;
  }

  .home-top li {
    padding: 10px 0;
  }
}

/* --- 內容區域 --- */
.home-page-container {
  flex-grow: 1;
  background-color: rgba(255, 255, 255, 0);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.footer{
  list-style: none;
 background-color: black;
  color: white;
  padding: 10px 15px;
  
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}
</style>
