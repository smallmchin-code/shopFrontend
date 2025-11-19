<template>
  <div v-if="product" class="product-card" :class="{ 'out-of-stock': product.stock === 0 }">
    
    <div class="product-image-container">
      <img :src="product.image" :alt="product.name" class="product-image" />
      <div v-if="product.stock === 0" class="stock-overlay">
        已售罄 (Out of Stock)
      </div>
    </div>
    
    <div class="product-info">
      
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-category">分類: {{ product.category }}</p>

      <div class="product-price">
        NT$ {{ formattedPrice }}
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
          @click="$emit('addToCart', product)" 
          :disabled="product.stock === 0" 
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
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router'; // 引入路由 hook
import { useGoods } from '@/composables/useGoods.js'; // 引入數據邏輯

const route = useRoute();
const { getProductById } = useGoods(); // 使用新的獲取單個商品函數

// ----------------------------------------------------
// 1. 移除 props 定義，將 product 轉為內部狀態
// ----------------------------------------------------
// 移除原有的 const props = defineProps({...});

const product = ref(null); // 單個商品數據
defineEmits(['addToCart']);


const productId = computed(() => route.params.id);

const loadProductDetail = () => {
  // 獲取商品資料
  const foundProduct = getProductById(productId.value);
  
  if (foundProduct) {
    // 成功找到商品，設定 product 狀態
    product.value = foundProduct; 
  } else {
    product.value = null; 
  }
};

// 首次載入時執行
onMounted(loadProductDetail);
// 監聽 ID 變化，確保從商品 A 跳轉到商品 B 時會重新載入
watch(productId, loadProductDetail);


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
</script>