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
            <td><img :src="product.image" :alt="product.name" class="product-thumb"></td>
            <td>{{ product.name }}</td>
            <td>{{ product.category }}</td>
            <td>${{ product.price }}</td>
            <td :class="{'stock-low': product.stock === 1, 'stock-out': product.stock === 0}">
              {{ product.stock }}
            </td>
            <td>{{ product.description.substring(0, 20) + '...' }}</td>
            <td>
              <button class="edit" @click="editProduct(product.id)">編輯</button>
              <button class="delete" @click="deleteProduct(product.id)">刪除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
// 從 useGoods.js 引入我們導出的所有商品資料 (ref 響應式物件)
import { allGoods } from '@/composables/useGoods.js'; 
import router from '@/router';

// 模擬函式：實際會導航到新增頁面
const addNewProduct = () => {
  router.push('/manager/addproduct');
//   alert('功能：導航到新增商品頁面，路徑：/manager/products/add');
};

// 模擬函式：實際會導航到編輯頁面
const editProduct = (id) => {
  alert(`功能：導航到商品 ID ${id} 的編輯頁面`);
};

// 模擬函式：本地刪除商品
const deleteProduct = (id) => {
  const productToDelete = allGoods.value.find(p => p.id === id);
  if (confirm(`確定要刪除商品 ID ${id}：${productToDelete.name} 嗎？ (本地模擬刪除)`)) {
    // 實際刪除邏輯 (本地模擬)
    const index = allGoods.value.findIndex(p => p.id === id);
    if (index !== -1) {
      allGoods.value.splice(index, 1);
      alert(`商品 ID ${id} 已刪除。`);
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