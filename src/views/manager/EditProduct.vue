<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'; // 👈 引入 useRouter
import { useProductStore } from '@/stores/productStore';

const route = useRoute();
const router = useRouter(); // 👈 初始化 Router 實例
const productStore = useProductStore();

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
    const productId = route.params.id;
    try {
        // 修正：使用 Pinia Store 中定義的 fetchProductById
        const fetchedProduct = await productStore.fetchProductById(productId);
        
        // 修正：將返回的資料賦值給 product.value
        // 確保 price 和 stock 是 Number 類型，避免表單綁定錯誤
        product.value = { 
            ...fetchedProduct,
            price: Number(fetchedProduct.price),
            stock: Number(fetchedProduct.stock)
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
    
    <label for="image">商品封面</label>
    <input type="text" id="image" v-model="product.image">
    
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
