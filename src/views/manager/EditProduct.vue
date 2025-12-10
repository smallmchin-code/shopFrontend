<script setup>
import { ref, onMounted ,computed } from 'vue';
import { useRoute, useRouter } from 'vue-router'; // 👈 引入 useRouter
import { useProductStore } from '@/stores/productStore';

const route = useRoute();
const router = useRouter(); // 👈 初始化 Router 實例
const productStore = useProductStore();


const productImageUrl = computed(() => {
    // 假設第一個圖片是主圖，或者至少是管理頁面要顯示的圖
    const imageId = product.value.images && product.value.images.length > 0 
                  ? product.value.images[0].id 
                  : null;
                  
    if (imageId) {
        return `http://localhost:8080/api/products/images/${imageId}`;
    }
    return '/path/to/default-image.png'; // 預設圖片
});
const product = ref({
    // ... (保持不變)
    name: '',
    image: '',
    price: 0,
    size: '',
    description: '',
    stock: 1,
    category: ''
});

onMounted(async () => {
    const rawProductId = route.params.id;
    
    // 2. 🌟 核心修正：嘗試將 ID 轉換為整數
    const productId = Number(rawProductId); 

    // 3. 檢查 ID 是否有效
    if (isNaN(productId) || productId <= 0) {
        console.error("無效的商品 ID:", rawProductId);
        alert("無效的商品 ID，無法載入編輯頁面。");
        router.push('/manager/products'); // 導回列表頁
        return; 
    }

    try {
        // 🌟 傳遞轉換後的數字 ID
        const fetchedProduct = await productStore.fetchProductById(productId);
        
        // ... (其餘載入邏輯保持不變)
        const mainVariant = fetchedProduct.variants && fetchedProduct.variants.length > 0 
                               ? fetchedProduct.variants[0] 
                               : { stock: 0, size: 'OneSize' }; 
                               
        product.value = { 
            ...fetchedProduct,
            price: Number(fetchedProduct.price),
            stock: Number(mainVariant.stock),
            size: mainVariant.size 
        };
        
    } catch (error) {
        console.error("載入商品資料失敗:", error);
        alert(`載入商品 ID ${productId} 資料失敗，請檢查網路或 ID。`);
    }
});

// 實作異步提交函式
const submitForm = async () => {
    // 提交前再次確保 price 和 stock 是數字類型
    product.value.price = Number(product.value.price);
    product.value.stock = Number(product.value.stock);
    
    console.log('Updating product:', product.value);
    
    try {
        // 呼叫 Pinia Store 中的更新函式
        await productStore.updateProduct(product.value);
        alert(`商品 ${product.value.name} (${product.value.id}) 更新成功！`);
        
        // 更新成功後，導航回商品列表頁面
        router.push('/manager/products'); 
        
    } catch (error) {
        console.error("更新商品資料失敗:", error);
        alert(`更新商品 ${product.value.name} 資料失敗，請檢查輸入或伺服器。`);
    }
};
</script>

<template>
  <form @submit.prevent="submitForm" class="edit_form">
    <h2>✏️ 編輯商品 ✏️</h2>
    
    <label for="name">商品名稱</label>
    <input type="text" id="name" v-model="product.name">
   
        <label for="current_image">目前封面圖片</label>
    <div v-if="productImageUrl && productImageUrl !== '/path/to/default-image.png'">
        <img :src="productImageUrl" alt="目前圖片" style="max-width: 150px; border-radius: 4px; margin-bottom: 10px;">
    </div>
        
    <label for="price">商品價格 ($)</label>
    <input type="number" id="price" v-model="product.price" min="0">
    
    <label for="size">商品尺寸</label>
    <select id="size" v-model="product.size">
        <option value="XS">XS (特小)</option>
        <option value="S">S (小)</option>
        <option value="M">M (中)</option>
        <option value="L">L (大)</option>
        <option value="XL">XL (特大)</option>
        <option value="OneSize">均碼</option>
    </select>
    
    <label for="description">商品描述</label>
    <textarea id="description" v-model="product.description"></textarea>
    
    <label for="stock">商品庫存量</label>
    <input type="number" id="stock" v-model="product.stock" min="1">
    
    <label for="category">商品分類</label>
    <select id="category" v-model="product.category">
        <option value="jacket">jacket(外套)</option>
        <option value="top">top(上衣)</option>
        <option value="pant">pant(褲子)</option>
    </select>
    
    <button type="submit">💾 更新商品資訊</button>
  </form>
</template>

<style scoped>
.edit_form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    max-width: 500px;
    margin: 40px auto;
    padding: 35px;
    background: #f7f5ef;
    border-radius: 20px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border: 1px solid #e0dcd5;
    font-family: '微軟正黑體', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

h2 {
    text-align: center;
    background-color: #457b9d;
    color: #f7f5ef;
    margin-bottom: 25px;
    font-size: 1.8rem;
    font-weight: 600;
    border-bottom: 2px solid #a8dadc;
    padding-bottom: 10px;
}

label {
    font-weight: bold;
    color: #5d5d5d;
    font-size: 1.05rem;
    margin-top: 5px;
}

input[type="text"],
input[type="number"],
select,
textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
    background-color: #ffffff;
    transition: border-color 0.3s, box-shadow 0.3s;
    box-sizing: border-box;
}

textarea {
    min-height: 100px;
    resize: vertical;
}

input:focus,
select:focus,
textarea:focus {
    border-color: #e63946;
    box-shadow: 0 0 5px rgba(230, 57, 70, 0.3);
    outline: none;
}

button {
    margin-top: 20px;
    padding: 15px;
    background-color: #457b9d;
    color: #fff;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1.1rem;
    font-weight: bold;
    transition: background-color 0.3s, transform 0.1s;
    letter-spacing: 1px;
}

button:hover {
    background-color: #1d3557;
}

button:active {
    transform: scale(0.98);
}
</style>
