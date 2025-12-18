<script setup>
import { ref } from 'vue';
import { useProductStore } from '@/stores/productStore'; // 確保路徑正確
// import { useRouter } from 'vue-router'; // 建議：提交成功後跳轉頁面

const variants = ref([{ size: '', stock: 0 }]);
const addVariant = () => {
    variants.value.push({ size: '', stock: 0 });
};
const removeVariant = (index) => {
    variants.value.splice(index, 1);
};
const productStore = useProductStore()

const isMoreImgs = ref(false);
const toggleMoreImgs = () => {
    isMoreImgs.value = !isMoreImgs.value;
};

const handleSubmit = async (event) => {
    event.preventDefault(); 
    const formData = new FormData(event.target);
    formData.append('variantsJson', JSON.stringify(variants.value));
    try {
        await productStore.createProduct(formData);
        alert("商品新增成功！");
    } catch (error) {
        console.error(error);
    }
};
</script>

<template>
  <form @submit="handleSubmit" class="add_form" >
    <h2>👗 新增商品👗</h2>
    
    <label for="name">商品名稱</label>
    <input type="text" id="name" name="name" placeholder="例如：復古碎花洋裝、簡約白T恤">
    
    <label for="image">商品封面</label>
    <input type="file" accept=".jpg, .jpeg, .png" id="image" name="imageismain" placeholder="貼上清晰的商品圖片" >
    
    <button @click="toggleMoreImgs" v-if="!isMoreImgs">有兩張(含)以上圖片</button>
    <div v-else>
        <label for="image" >商品圖片</label>
        <input type="file" accept=".jpg, .jpeg, .png" id="image" name="imagedata" placeholder="貼上清晰的商品圖片" multiple>
    </div>
    
    <label for="price">商品價格 ($)</label>
    <input type="number" id="price" name="price" placeholder="請輸入合理的價格" min="0">
    
    <div class="form-group">
    <label>商品規格 (尺寸與庫存):</label>
    <div v-for="(variant, index) in variants" :key="index" class="variant-row">
        <input type="text" v-model="variant.size" placeholder="尺寸 (如: M)" required>
        <input type="number" v-model="variant.stock" placeholder="庫存" required>
        <button type="button" @click="removeVariant(index)" v-if="variants.length > 1">刪除</button>
    </div>
    <button type="button" @click="addVariant" class="btn-add">＋ 新增尺寸</button>
</div>
   
    <label for="description">商品描述</label>
    <textarea id="description" name="description" placeholder="請詳細描述材質、磨損狀況、新舊程度等..."></textarea>
    
    <label for="category">商品分類</label>
    <select id="category" name="category">
        <option value="" disabled selected>請選擇分類</option>
        <option value="jacket">jacket(外套)</option>
        <option value="top">top(上衣)</option>
        <option value="pant">pant(褲子)</option>
    </select>
    
    <button type="submit">✨ 提交商品資訊</button>
  </form>
  <div></div>
</template>

<style scoped>
/* 核心容器樣式：柔和、有質感的背景 */
.add_form {
    display: flex; /* 使用 Flexbox 讓排版更靈活 */
    flex-direction: column; /* 垂直堆疊元素 */
    gap: 15px; /* 增加元素間的間距 */
    
    max-width: 500px;
    margin: 40px auto;
    padding: 35px;
    
    /* 柔和的米白色或淺灰色背景，增加二手/環保感 */
    background: #f7f5ef; 
    /* 更大的圓角，營造有機、舒適的感覺 */
    border-radius: 20px; 
    /* 較深的陰影，但更柔和，像手工藝品 */
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15); 
    /* 邊框增加質感，類似牛皮紙 */
    border: 1px solid #e0dcd5; 
    font-family: '微軟正黑體', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

/* 標題樣式：更簡潔、強調內容 */
h2 {
    text-align: center;
    background-color: #457b9d;
    color: #f7f5ef; /* 深灰色，比純黑柔和 */
    margin-bottom: 25px;
    font-size: 1.8rem;
    font-weight: 600;
    border-bottom: 2px solid #a8dadc; /* 增加一個清新的底部線條 */
    padding-bottom: 10px;
}

/* 標籤樣式：讓使用者知道輸入欄位的用途 */
label {
    font-weight: bold;
    color: #5d5d5d;
    font-size: 1.05rem;
    margin-top: 5px;
}

/* 輸入框和下拉選單樣式：統一、簡潔、舒適 */
input[type="file"], 
input[type="text"], 
input[type="number"],
select,
textarea {
    width: 100%;
    padding: 12px;
    /* 柔和的邊框顏色 */
    border: 1px solid #ccc; 
    /* 輕微圓角 */
    border-radius: 8px; 
    font-size: 1rem;
    /* 讓輸入框背景與表單背景區隔 */
    background-color: #ffffff; 
    transition: border-color 0.3s, box-shadow 0.3s;
    box-sizing: border-box; /* 確保 padding 和 border 不會增加元素總寬度 */
}

/* 描述框樣式：提供足夠的空間 */
textarea {
    min-height: 100px;
    resize: vertical; /* 允許垂直調整大小 */
}

/* 輸入框聚焦時的樣式：增加互動反饋 */
input:focus,
select:focus,
textarea:focus {
    border-color: #e63946; /* 點綴色：使用一個溫暖的、復古的紅色 */
    box-shadow: 0 0 5px rgba(230, 57, 70, 0.3);
    outline: none; /* 移除瀏覽器預設的藍色外框 */
}

/* 按鈕樣式：突出行動呼籲，使用溫暖/復古色系 */
button {
    margin-top: 20px;
    padding: 15px;
    /* 復古/溫暖的色調，例如磚紅或深綠 */
    background-color: #457b9d; 
    color: #fff;
    border: none;
    /* 更大的圓角，與表單容器風格一致 */
    border-radius: 10px; 
    cursor: pointer;
    font-size: 1.1rem;
    font-weight: bold;
    transition: background-color 0.3s, transform 0.1s;
    letter-spacing: 1px;
}

/* 按鈕懸停樣式：增加互動感 */
button:hover {
    background-color: #1d3557; /* 懸停時變深 */
}

/* 按鈕點擊樣式：提供物理反饋 */
button:active {
    transform: scale(0.98);
}
</style>