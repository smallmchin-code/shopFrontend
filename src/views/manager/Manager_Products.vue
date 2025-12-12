<template>
  <div class="manager-products">
    <h2>🛍️ 商品管理</h2>
    <p class="intro">在這裡您可以查看、新增、編輯或刪除商店中的所有商品資訊、調整庫存和價格。</p>
    
    <button class="add-button" @click="router.push('/addproduct');">
      + 新增商品
    </button>
    
    <div class="product-list-container">
      <h3>商品列表 (共 {{ allGoods.length }} 項)</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>圖片</th>
            <th>名稱</th>
            <th>分類</th>
            <th>價格</th>
            <th>庫存</th>
            <th>描述 (Snippet)</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in allGoods" :key="product.id">
            <td>{{ product.id }}</td>
            <td><img :src="getProductImageUrl(product)" :alt="product.name" class="product-thumb"></td>
            <td>{{ product.name }}</td>
            <td>{{ product.category }}</td>
            <td>${{ product.price }}</td>
            <td :class="{'stock-low': product.stock === 1, 'stock-out': product.stock === 0}">
              {{ product.stock }}
            </td>
            <td>{{ product.description.substring(0, 20) + '...' }}</td>
            <td>
              <button class="edit" @click="editProduct(product.id)">編輯</button>
              <button class="delete" @click="handleDelete(product.id)">刪除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'; // 引入 onMounted 和 ref
import router from '@/router';
import { useProductStore } from '@/stores/productStore.js';

const productStore = useProductStore();
const allGoods = computed(() => productStore.goods);


const getProductImageUrl = (product) => {
    const imageId = product.images?.[0]?.id; 
    
    if (imageId) { 
        return `http://localhost:8080/api/products/images/${imageId}`; 
    }
    return '/path/to/default-image.png'; 
};

// --- 新增狀態管理 ---
const isLoading = ref(true); // 載入狀態
const isDeleting = ref(false); // 刪除操作鎖定狀態

// --- 3. 組件掛載後載入資料 ---
onMounted(async () => {
    try {
        await productStore.fetchAllGoods();
    } catch (error) {
        console.error("載入商品資料失敗:", error);
        alert("載入商品資料失敗，請檢查網路連線或伺服器。");
    } finally {
        isLoading.value = false;
    }
});


// 模擬函式：實際會導航到編輯頁面
const editProduct = (productId) => {
  // 您可能需要導航到 /editproduct/:id
  router.push(`/manager/edit-product/${productId}`);
};

// --- 4. 修改 handleDelete 函式為異步操作 ---
const handleDelete = async (id) => {
  const productToDelete = productStore.allGoods.find(p => p.id === id);
  const productName = productToDelete ? productToDelete.name : `ID ${id} 的商品`;

  if (confirm(`確定要刪除 ${productName} 嗎？`)) {
    isDeleting.value = true;
    try {
        // 呼叫 Pinia Store 的異步刪除函式
        await productStore.deleteProduct(id);
        alert(`${productName} 已刪除。`);
    } catch (error) {
        console.error(`刪除商品 ID ${id} 失敗:`, error);
        alert(`刪除失敗：無法從伺服器刪除 ${productName}。`);
    } finally {
        isDeleting.value = false;
    }
  }
};
</script>

<style scoped>
.intro {
  color: #666;
  margin-bottom: 20px;
}
.add-button {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 30px;
}
.product-list-container {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  overflow-x: auto; /* 確保表格在小螢幕上可以捲動 */
}
table {
  width: 100%;
  min-width: 800px; /* 設定最小寬度 */
  border-collapse: collapse;
  margin-top: 15px;
}
th, td {
  border: 1px solid #eee;
  padding: 12px;
  text-align: left;
  vertical-align: middle;
}
th {
  background-color: #f2f2f2;
}
.product-thumb {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}
.edit {
  background-color: #007bff;
}
.delete {
  background-color: #dc3545;
}
.edit, .delete {
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  margin-right: 5px;
  border-radius: 4px;
  font-size: 0.85rem;
}
.stock-low {
  color: orange;
  font-weight: bold;
}
.stock-out {
  color: red;
  font-weight: bold;
  background-color: #fdd;
}
</style>