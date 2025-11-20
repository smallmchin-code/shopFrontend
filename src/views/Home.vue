<template>
  <div>
    <div class="home-main-head">
      <div></div>
      <form class="search" action="">
        <input type="text" placeholder="輸入想要的商品名稱">
        <input type="submit" value="查詢">
      </form>
      <div class="add-product-container">
        <router-link to="/addproduct">想要新增商品</router-link>
      </div>
      
    </div>
    <div class="home-main">
      <div class="image-carousel-container">
        <transition name="fade" mode="out-in">
          <img 
            :key="currentIndex" 
            :src="images[currentIndex]" 
            :alt="'Home Main Image ' + (currentIndex + 1)" 
            class="carousel-image"
          >
        </transition>
      </div>
    </div>
    <div>
      <GoodsList />
    </div>
  </div>
  
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import GoodsList from '../components/GoodsList.vue';
import Main1 from '@/assets/goods/Home-main1.png';
import Main2 from '@/assets/goods/Home-main2.png';

const images = [Main1, Main2];

const currentIndex = ref(0); 
let intervalId = null;       

// 2. 實現切換邏輯
const nextImage = () => {
  // 循環切換索引 (0 -> 1 -> 0...)
  currentIndex.value = (currentIndex.value + 1) % images.length;
};

// 3. 組件生命週期控制
onMounted(() => {
  // 組件掛載後啟動自動輪播 (每 3 秒)
  intervalId = setInterval(nextImage, 3000); 
});

onUnmounted(() => {
  // 組件卸載前清除定時器，避免記憶體洩漏
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<style scoped>
/* 搜尋列和標題樣式 */
h3{
  font-size: 30px;
}
.home-main-head {
display: flex;
  /* 讓子元素之間有空間，但我們主要用 flex-basis 控制寬度 */
  justify-content: space-between; 
  align-items: center; /* 垂直居中對齊 */
  padding: 15px 20px;
  
  border-bottom: 2px solid #a89f8a; 
  margin-bottom: 30px;
}

/* 搜尋表單容器 */
.search {
  /* 讓表單佔據約三分之一的寬度 */
  flex-basis: 10%; 
  display: flex;
  gap: 5px;
}

/* 新增商品容器 */
.add-product-container {
  /* 讓連結容器佔據約三分之一的寬度 */
  flex-basis: 10%; 
  background-color: #f0f0e8; /* 搭配復古風格的淺色背景 */
  text-align: center; /* 讓連結靠右 */
}
.add-product-container a {
  /* 讓連結容器佔據約三分之一的寬度 */
  text-decoration: none;
  color: #000;
  background-color: #f0f0e8; /* 搭配復古風格的淺色背景 */
  text-align: center; /* 讓連結靠右 */
}
.search>input{
  height: 40px;
}
.search input[type="text"] {
  width: 300px; /* 調整輸入框寬度 */
}
.search input[type="submit"] {
  cursor: pointer;
}

/* 圖片輪播區塊樣式 (home-main) */
.home-main{
  padding: 20px;
  /* 設置容器讓圖片在其中定位 */
  display: flex;
  justify-content: center; /* 圖片在容器中居中 */
}

.image-carousel-container {
  /* 輪播圖容器：設定尺寸和相對定位 */
  position: relative;
  width: 100%; /* 或設定一個固定的寬度，例如 800px */
  max-width: 1000px; 
  height: 500px; /* 圖片高度 */
  overflow: hidden;
  border-radius: 8px; /* 圓角 (可選) */
}

.carousel-image {
  /* 圖片樣式：絕對定位，佔滿容器 */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* 保持圖片比例並覆蓋整個容器 */
}

/* === Vue Transition 動畫樣式 (淡入淡出) === */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease; /* 設定動畫時長，例如 0.8 秒 */
}

.fade-enter-from, /* 新元素進入時的起始狀態 */
.fade-leave-to {   /* 舊元素離開時的最終狀態 */
  opacity: 0;
}

.fade-enter-to, /* 新元素進入時的最終狀態 */
.fade-leave-from { /* 舊元素離開時的起始狀態 */
  opacity: 1;
}
</style>