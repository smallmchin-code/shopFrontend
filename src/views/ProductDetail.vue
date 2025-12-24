<template>
  <div v-if="product" class="product-card" :class="{ 'out-of-stock': !selectedVariant || selectedVariant.stock === 0 }">    
    <div class="product-image-container">
      <img :src="currentImageUrl" :alt="product.name" class="product-image" />
      
      <div v-if="product.images?.length > 1" class="carousel-controls">
        <button @click="prevImg" class="arrow-btn left">❮</button>
        <button @click="nextImg" class="arrow-btn right">❯</button>
      </div>

      <div class="image-counter" v-if="product.images?.length > 1">
        {{ currentImgIndex + 1 }} / {{ product.images.length }}
      </div>
      <div v-if="selectedVariant && selectedVariant.stock === 0" class="stock-overlay">
        已售罄 (Out of Stock)
      </div>
    </div>
    
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-category">分類: {{ product.category }}</p>

      <div class="product-price">
        <p class="price-tag">價格: ${{ product.price }}</p>
      </div>
      
      <div class="variant-selector-section">
        <p class="section-title">選擇尺寸：</p>
        <div class="size-options">
          <button 
            v-for="v in product.variants" 
            :key="v.id"
            class="size-btn"
            :class="{ 'active': selectedVariant?.id === v.id, 'disabled': v.stock === 0 }"
            :disabled="v.stock === 0"
            @click="onSizeSelect(v)"
          >
            {{ v.size }}
          </button>
        </div>
      </div>

      <div class="product-details">
        <span class="detail-tag" v-if="selectedVariant">目前尺寸: {{ selectedVariant.size }}</span>
        <span class="detail-tag" :class="{ 'low-stock': selectedVariant?.stock <= 5 && selectedVariant?.stock > 0 }">
          庫存: {{ selectedVariant ? selectedVariant.stock : '請選擇' }}
        </span>
      </div>

      <div class="product-description">
        <p>{{ displayDescription }}</p>
        <button v-if="requiresExpansion" @click="toggleDescription" class="read-more-button">
          {{ isExpanded ? '收起 ▲' : '查看更多 ▼' }}
        </button>
      </div>

      <div class="product-actions">
        <button 
          class="add-to-cart-btn" 
          :disabled="!selectedVariant || selectedVariant.stock === 0"
          @click="handleAddToCart"
        >
          {{ !selectedVariant ? '請選擇尺寸' : (selectedVariant.stock > 0 ? '加入購物車' : '已售罄') }}
        </button>
      </div>
    </div>
  </div>
  <div v-else class="loading-state">載入中...</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useProductStore } from '@/stores/productStore';
import { useCartStore } from '@/stores/cartStore';

const route = useRoute();
const productStore = useProductStore();
const cartStore = useCartStore();

const product = ref(null);
const selectedVariant = ref(null);
const isExpanded = ref(false);

onMounted(async () => {
  const id = route.params.id;
  const data = await productStore.fetchProductById(id);
  product.value = data;
  
  // 初始化：選中第一個有庫存的尺寸
  if (data?.variants?.length > 0) {
    selectedVariant.value = data.variants.find(v => v.stock > 0) || data.variants[0];
  }
});

const onSizeSelect = (v) => {
  selectedVariant.value = v;
};

// 圖片處理
const currentImgIndex = ref(0);

// 計算當前顯示的圖片 URL
const currentImageUrl = computed(() => {
  if (product.value?.images?.length > 0) {
    const imgId = product.value.images[currentImgIndex.value].id;
    return `http://localhost:8080/api/products/images/${imgId}`;
  }
  return '/path/to/default.png';
});

// 輪播邏輯
const nextImg = () => {
  if (currentImgIndex.value < product.value.images.length - 1) {
    currentImgIndex.value++;
  } else {
    currentImgIndex.value = 0; // 循環回到第一張
  }
};

const prevImg = () => {
  if (currentImgIndex.value > 0) {
    currentImgIndex.value--;
  } else {
    currentImgIndex.value = product.value.images.length - 1; // 循環到最後一張
  }
};
// 描述文字長度控制
const displayDescription = computed(() => {
  if (!product.value?.description) return "";
  return isExpanded.value ? product.value.description : product.value.description.slice(0, 100) + "...";
});
const requiresExpansion = computed(() => product.value?.description?.length > 100);
const toggleDescription = () => isExpanded.value = !isExpanded.value;

const handleAddToCart = () => {
  if (!selectedVariant.value) {
    alert('請選擇規格');
    return;
  }
  
  cartStore.addToCart({
    id: product.value.id,
    variantId: selectedVariant.value.id,
    name: product.value.name,
    price: product.value.price,
    image: currentImageUrl.value,
    size: selectedVariant.value.size,
    stock: selectedVariant.value.stock,
    quantity: 1
  });
  alert(`已將 ${product.value.name} (${selectedVariant.value.size}) 加入購物車`);
};
</script>

<style scoped>
/* Base Layout */
.product-image-container {
  position: relative; /* 確保箭頭定位正確 */
}

.carousel-controls {
  position: absolute;
  top: 50%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
  padding: 0 10px;
  box-sizing: border-box;
  pointer-events: none; /* 防止遮擋圖片點擊 */
}

.arrow-btn {
  pointer-events: auto; /* 讓按鈕可以點擊 */
  background: rgba(255, 255, 255, 0.6);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: background 0.3s;
}

.arrow-btn:hover {
  background: rgba(255, 255, 255, 0.9);
}

.image-counter {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.8rem;
}
.product-card {
  display: flex;
  max-width: 960px;
  margin: 2rem auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  overflow: hidden;
  position: relative;
  transition: opacity 0.3s ease;
}

.product-card.out-of-stock {
  opacity: 0.7;
}

.loading-state {
  text-align: center;
  padding: 4rem;
  font-size: 1.2em;
  color: #888;
}

/* Image Section */
.product-image-container {
  flex: 1 1 50%;
  position: relative;
  background-color: #f7f7f7;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.stock-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
  font-weight: bold;
}

/* Info Section */
.product-info {
  flex: 1 1 50%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 2em;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: #333;
}

.product-category {
  font-size: 0.9em;
  color: #888;
  margin-bottom: 1rem;
}

.product-price {
  margin-bottom: 1.5rem;
}

.price-tag {
  font-size: 1.8em;
  font-weight: 500;
  color: #5e7a7d;
}

/* Variant Selector */
.variant-selector-section {
  margin: 1rem 0;
}

.section-title {
  font-size: 1em;
  font-weight: 500;
  color: #555;
  margin-bottom: 0.75rem;
}

.size-options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.size-btn {
  padding: 8px 18px;
  border: 1px solid #5e7a7d;
  background-color: transparent;
  color: #5e7a7d;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  font-weight: bold;
}

.size-btn:hover:not(.disabled):not(.active) {
  background-color: #f0f4f4;
  transform: translateY(-2px);
}

.size-btn.active {
  background-color: #5e7a7d;
  color: #fcf8f0;
  border-color: #5e7a7d;
}

.size-btn.disabled {
  border-color: #ccc;
  color: #ccc;
  background-color: #f9f9f9;
  text-decoration: line-through;
  cursor: not-allowed;
}

/* Product Details */
.product-details {
  margin: 1rem 0;
  display: flex;
  gap: 10px;
}

.detail-tag {
  display: inline-block;
  padding: 6px 14px;
  background-color: #fcf8f0;
  border: 1px solid #e0d9c7;
  border-radius: 4px;
  font-size: 0.9em;
  color: #555;
}

.low-stock {
  color: #d9534f;
  font-weight: bold;
  border-color: #d9534f;
}

/* Description */
.product-description {
  font-size: 0.95em;
  color: #666;
  line-height: 1.6;
  margin: 1rem 0;
  flex-grow: 1; /* Pushes actions to the bottom */
}

.read-more-button {
  background: none;
  border: none;
  color: #5e7a7d;
  font-weight: bold;
  cursor: pointer;
  padding: 0.25rem 0;
  margin-top: 0.5rem;
}

/* Actions */
.product-actions {
  margin-top: auto; /* Pushes to the bottom */
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.add-to-cart-btn {
  width: 100%;
  padding: 12px;
  background-color: #5e7a7d;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.add-to-cart-btn:hover:not(:disabled) {
  background-color: #4a6163;
}

.add-to-cart-btn:disabled {
  background-color: #b0c4c6;
  cursor: not-allowed;
}
</style>