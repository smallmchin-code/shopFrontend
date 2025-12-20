<template>
  <div>
    <div class="home-main-head">
      <div>
      </div>
      <form class="search" @submit.prevent="handleSearch">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="輸入完整的商品名稱"
        >
        <input type="submit" value="查詢">
      </form>
      <div class="my_orders">
        <router-link to="/myorders">想看我的訂單!!</router-link>
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
import { useRouter } from 'vue-router';
import { useProductStore } from '@/stores/productStore.js';

const router = useRouter();
const productStore = useProductStore();
const { searchGoodsByName , fetchAllGoods } = productStore;

const images = [Main1, Main2];
const currentIndex = ref(0); 
let intervalId = null;       
const searchQuery = ref('');
const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % images.length;
};

const handleSearch = async () => { // 👈 修正為 async
    const query = searchQuery.value.trim();    
    if (query) {
        try {
            const results = await searchGoodsByName(query); 
            
            if (results && results.length > 0) {
                // 💡 邏輯：如果只找到一個結果，直接跳轉到該商品的詳情頁
                if (results.length === 1) {
                    router.push(`/product/${results[0].id}`);
                } else {
                    // 如果有多個結果，留在本頁，GoodsList 會自動更新顯示這些結果
                    alert(`找到 ${results.length} 個相關商品`);
                }
            } else {
                alert(`找不到與「${query}」相關的商品。`);
            }
            
        } catch (error) {
            alert('搜尋失敗，請檢查網路或伺服器。');
        }
    } else {
        await fetchAllGoods();
    }
    searchQuery.value = '';// 清空搜尋框
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

/* 莫蘭迪色系按鈕樣式 */
.my_orders {
  /* 使用莫蘭迪灰綠色作為背景 (例如：#ACB9B9) */
  background-color: #aebdbd; /* 柔和的灰藍綠色 */
  flex-basis: 30%; 
  text-align: center; 
  /* 增加內邊距，讓按鈕看起來更舒適 */
  padding: 10px 15px; 
  border-radius: 8px; /* 柔和的圓角 */
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1); /* 輕微的陰影 */
  transition: background-color 0.3s, box-shadow 0.3s;
}

.my_orders:hover {
  /* Hover 時稍微變深，增加互動感 */
  background-color: #9aa8a8;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.15);
}

.my_orders a {
  /* 文本使用深灰或深棕色，與低飽和背景形成優雅對比 */
  color: #3f4f4f; 
  text-decoration: none;
  font-weight: bold; /* 讓文字更清晰 */
  display: block; /* 確保連結佔滿容器 */
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