import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// 模擬圖片資源 (假設您已將其放入 public 或 assets/goods)
// 請注意：在實際專案中，Pinia Store 不適合直接匯入 assets，
// 這裡僅為模擬您的資料結構。
import baconTshirt from '@/assets/goods/baconTshirt.jpg';
import jacketimage from '@/assets/goods/OIP.webp';
import pantImage from '@/assets/goods/pant.webp';

// 模擬的商品資料 (與您提供的 useGoods.js 內容一致)
const initialGoods = [
    { 
        id: 1, 
        name: 'T-shirt', 
        image: baconTshirt, 
        price: 3000, 
        size: 'X', 
        category : 'top',
        description: '經典款式純棉T恤，舒適透氣，適合日常穿著。無明顯污漬或損壞。',
        stock: 5 
    },
    { 
        id: 2, 
        name: 'Sean jacket', 
        image: jacketimage, 
        price: 3000, 
        size: 'M', 
        category : 'jacket',
        description: '復古風格皮衣外套，二手商品，狀況良好，只有輕微使用痕跡。非常適合秋冬穿搭。',
        stock: 1 
    },
    { 
        id: 3, 
        name: 'Sean pant', 
        image: pantImage, 
        price: 1200, 
        size: 'L', 
        category : 'pant',
        description: '寬鬆牛仔褲，腰部有彈性設計，舒適百搭。' ,
        stock: 0 
    }
];

export const useProductStore = defineStore('product', () => {
    // 狀態 (State)
    const goods = ref(initialGoods); // 所有的商品資料

    // Getter
    // 獲取所有商品（供 Manager_Products.vue 使用）
    const allGoods = computed(() => goods.value); 

    // Actions
    /**
     * 根據 ID 獲取單個商品 (替換 getProductById)
     * @param {number | string} id - 商品ID
     * @returns {Object | undefined} - 單個商品物件
     */
    function getProductById(id) {
        // 使用 == 進行非嚴格比較，以匹配路由參數通常為字串的狀況
        return goods.value.find(good => good.id == id);
    }

    /**
     * 獲取過濾後的商品列表 (替換 getFilteredGoods)
     * @param {string} category - 分類名稱 ('all', 'jacket', 'top', 'pant')
     * @returns {Array} - 過濾後的商品列表
     */
    function getFilteredGoods(category) {
        if (category === 'all' || category === 'products') {
            return goods.value;
        }
        // 本地模擬過濾
        return goods.value.filter(good => good.category === category);
    }

    /**
     * 模擬刪除商品 (供 Manager_Products.vue 使用)
     * @param {number | string} id - 商品ID
     */
    function deleteProduct(id) {
        const index = goods.value.findIndex(p => p.id === id);
        if (index !== -1) {
            goods.value.splice(index, 1);
            return true;
        }
        return false;
    }
    function findGoodsByName(name) {
        // 將名稱轉換為小寫，並去除前後空白，以進行不區分大小寫且精確的比較
        const lowerCaseName = name.toLowerCase().trim();
        
        return goods.value.find(good => 
            good.name.toLowerCase().trim() === lowerCaseName
        );
    }
    // 可以在這裡新增 addProduct 和 updateProduct 的 action

    return { goods, allGoods, getProductById, getFilteredGoods, deleteProduct,findGoodsByName };
});