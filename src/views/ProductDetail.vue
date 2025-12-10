
<template>
  <div v-if="product" class="product-card" :class="{ 'out-of-stock': product.stock === 0 }">    
    <div class="product-image-container">
      <img :src="productImageUrl" :alt="product.name" class="product-image" />
      <div v-if="product.stock === 0" class="stock-overlay">
        已售罄 (Out of Stock)
      </div>
    </div>
    
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-category">分類: {{ product.category }}</p>

      <div class="product-price">
      </div>
      
      <div class="product-details">
        <span class="detail-tag">尺寸: {{ product.size }}</span>
        <span class="detail-tag" :class="{ 'low-stock': product.stock <= 5 && product.stock > 0 }">
          庫存: {{ product.stock }}
        </span>
      </div>

      <div class="product-description">
        <p>
          {{ displayDescription }}
        </p>
        <button v-if="requiresExpansion" @click="toggleDescription" class="read-more-button">
          {{ isExpanded ? '收起 ▲' : '查看更多 ▼' }}
        </button>
      </div>

      <div class="product-actions">
        <button 
          @click="handleAddToCart" :disabled="product.stock === 0" 
          class="add-to-cart-btn"
        >
          {{ product.stock > 0 ? '加入購物車' : '缺貨中' }}
        </button>
        <button class="favorite-btn">❤</button>
      </div>
    </div>
  </div>
  <div v-else class="loading-state">
    商品載入中，或此商品不存在...
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router'; 
import { useProductStore } from '@/stores/productStore.js'; 
import { useCartStore } from '@/stores/cartStore.js'; 

const route = useRoute();
const productStore = useProductStore(); // <-- 取得 Product Store 實例
const cartStore = useCartStore(); 
const product = ref(null); 


const productImageUrl = computed(() => {
    // 1. 檢查商品數據和圖片列表是否存在
    if (product.value && product.value.images && product.value.images.length > 0) {
        // 2. 假設我們只需要第一張圖 (Main Image 或 Images[0])
        const imageId = product.value.images[0].id;
        return `http://localhost:8080/api/products/images/${imageId}`;
    }
    
    // 如果沒有圖片或圖片列表為空，使用預設圖
    return '/path/to/default-image.png'; // 請替換成您實際的預設圖路徑
});

onMounted(async () => {
  const productId = route.params.id; // 假設您的路由設定為 /product/:id
  if (productId) {
    try {
      // 呼叫異步 Action 取得商品資料
      const fetchedProduct = await productStore.fetchProductById(productId);
      if (fetchedProduct.variants && fetchedProduct.variants.length > 0) {
          fetchedProduct.size = fetchedProduct.variants[0].size;
          fetchedProduct.stock = fetchedProduct.variants[0].stock;
      }
      product.value = fetchedProduct; // 將取得的資料存入本地 ref
    } catch (error) {
      console.error(`載入商品 ID ${productId} 失敗:`, error);
      product.value = null; // 載入失敗時清空或顯示錯誤
      alert('找不到該商品，或伺服器連線失敗。');
    }
  }
});


// ----------------------------------------------------
// 2. 狀態與計算屬性 (使用 product.value)

// ----------------------------------------------------

// 處理描述文字的展開/收起
const isExpanded = ref(false);
const maxDescriptionLength = 70; 

// 判斷是否需要「查看更多」按鈕
const requiresExpansion = computed(() => {
  // 必須檢查 product.value 是否存在
  return product.value?.description && product.value.description.length > maxDescriptionLength;
});

// 實際顯示的描述文字
const displayDescription = computed(() => {
  if (!product.value) return '載入中...';
  if (isExpanded.value || !requiresExpansion.value) {
    return product.value.description;
  }
  return product.value.description.substring(0, maxDescriptionLength) + '...';
});

// 將價格格式化
const formattedPrice = computed(() => {
  return product.value ? product.value.price.toLocaleString('en-US') : 'N/A';
});

// ----------------------------------------------------
// 3. 方法 (Methods)
// ----------------------------------------------------
const toggleDescription = () => {
  isExpanded.value = !isExpanded.value;
};

// 新增加入購物車的方法
function handleAddToCart() {
  if (!product.value) {
    alert('商品資訊尚未載入。');
    return;
  }
  if (product.value.stock === 0) {
    alert('此商品已售罄，無法加入購物車。');
    return;
  }
  
  // 呼叫 cartStore 的 addToCart Action，傳入完整的商品物件
  cartStore.addToCart(product.value); 
  alert(`商品「${product.value.name}」已加入購物車！`);
}
</script>
<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Playfair+Display:wght@400;700&display=swap'); 

.product-card {
  /* ------------------- 整體卡片容器 ------------------- */
  font-family: 'Merriweather', serif; /* 復古襯線字體 */
  background-color: #fcf8f0; /* 舊紙張或米白色 */
  border: 2px solid #a89f8a; /* 粗糙的邊框 */
  box-shadow: 8px 8px 0px 0px rgba(0, 0, 0, 0.25); 
  border-radius: 4px;
  padding: 25px;
  max-width: 800px;
  margin: 50px auto;
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  color: #3e3e3e; /* 復古深色文字 */
}

/* 缺貨時，整體卡片略微褪色 */
.out-of-stock {
    opacity: 0.7;
    filter: grayscale(0.2);
}

/* ------------------- 圖片區塊 ------------------- */
.product-image-container {
  flex: 1 1 350px; /* 彈性佈局，最小寬度 350px */
  position: relative;
  overflow: hidden;
  border: 1px solid #7c7365;
  background-color: #fff;
}

.product-image {
  width: 100%;
  height: auto;
  display: block;
}

.stock-overlay {
  /* 售罄標籤樣式 */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-10deg); /* 旋轉角度增加手寫感 */
  width: 120%;
  background-color: rgba(181, 73, 59, 0.8);
  color: #f7f3e9;
  padding: 15px 0;
  text-align: center;
  font-size: 1.8em;
  font-weight: 700;
  border: 3px dashed #f7f3e9; /* 虛線邊框 */
  letter-spacing: 2px;
}

/* ------------------- 商品資訊 ------------------- */
.product-info {
  flex: 1 1 350px;
  padding: 10px 0;
}

.product-name {
  font-family: 'Playfair Display', serif; /* 標題使用更有特色的字體 */
  font-size: 2.8em;
  font-weight: 700;
  color: #4a4a4a;
  margin-bottom: 5px;
  border-bottom: 2px solid #5e7a7d; /* 復古藍綠色的底線 */
  display: inline-block;
  padding-bottom: 5px;
}

.product-category {
  font-size: 0.95em;
  color: #7b7b7b;
  margin-bottom: 20px;
  font-style: italic;
}

.product-price {
  font-family: 'Playfair Display', serif;
  font-size: 3.2em;
  font-weight: 700;
  color: #b5493b; /* 復古紅棕色 */
  margin-bottom: 25px;
  padding: 5px 0;
}

/* ------------------- 詳細標籤 ------------------- */
.product-details {
  display: flex;
  gap: 12px;
  margin-bottom: 25px;
}

.detail-tag {
  background-color: #e0d9c4; /* 淺米色背景 */
  color: #5d5d5d;
  padding: 7px 14px;
  border-radius: 0; /* 方角 */
  font-size: 0.9em;
  border: 1px solid #c7bca6;
  font-weight: bold;
  box-shadow: 1px 1px 0px 0px rgba(0, 0, 0, 0.1);
}

.low-stock {
  background-color: #f0ad4e; /* 橙色警告 */
  color: #fff;
  border-color: #d19a45;
}

/* ------------------- 描述區塊 ------------------- */
.product-description {
  margin-bottom: 30px;
  padding-top: 15px;
  border-top: 1px dashed #c7bca6; /* 虛線分隔 */
  color: #5d5d5d;
  line-height: 1.7;
}

.read-more-button {
  background-color: #5e7a7d; /* 復古藍綠色 */
  color: #fcf8f0;
  border: none;
  padding: 10px 18px;
  border-radius: 3px;
  cursor: pointer;
  margin-top: 15px;
  font-family: 'Merriweather', serif;
  font-size: 0.9em;
  box-shadow: 2px 2px 0px 0px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.read-more-button:hover {
  background-color: #4a6365;
  box-shadow: 1px 1px 0px 0px rgba(0, 0, 0, 0.1);
  transform: translate(1px, 1px);
}

/* ------------------- 動作按鈕 ------------------- */
.product-actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #a89f8a;
}

.add-to-cart-btn,
.favorite-btn {
  padding: 12px 25px;
  font-size: 1.1em;
  font-weight: bold;
  border: 2px solid #5e7a7d; /* 粗邊框 */
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Playfair Display', serif;
  box-shadow: 3px 3px 0px 0px rgba(0, 0, 0, 0.2);
}

.add-to-cart-btn {
  background-color: #5e7a7d; 
  color: #fcf8f0; 
  flex-grow: 1;
}

.add-to-cart-btn:hover:not(:disabled) {
  background-color: #4a6365;
  box-shadow: 1px 1px 0px 0px rgba(0, 0, 0, 0.1);
  transform: translate(2px, 2px);
}

.add-to-cart-btn:disabled {
  background-color: #a89f8a; /* 缺貨時的顏色 */
  border-color: #a89f8a;
  cursor: not-allowed;
  opacity: 0.7;
  box-shadow: none;
  transform: none;
}

.favorite-btn {
  background-color: #fcf8f0; /* 背景和卡片顏色一致 */
  color: #b5493b; /* 復古紅棕色心形 */
  width: 50px;
  height: 50px;
  border-radius: 50%; /* 圓形按鈕 */
  font-size: 1.8em;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #b5493b;
}

.favorite-btn:hover {
  background-color: #b5493b;
  color: #fcf8f0;
  box-shadow: 1px 1px 0px 0px rgba(0, 0, 0, 0.1);
  transform: translate(2px, 2px);
}

.loading-state {
    text-align: center;
    margin-top: 50px;
    font-size: 1.2em;
    color: #a89f8a;
}
</style>
