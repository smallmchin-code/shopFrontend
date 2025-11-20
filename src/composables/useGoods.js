import { ref } from 'vue'; // 移除 computed 的 import

import baconTshirt from '@/assets/goods/baconTshirt.jpg';
import jacketimage from '@/assets/goods/OIP.webp';
import pantImage from '@/assets/goods/pant.webp';


// 為模擬詳細頁面，增加了 description, stock, size 欄位
const goods = ref([
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
]);


export function useGoods() {
    /**
     * 獲取過濾後的商品列表。未來這裡將呼叫後端 API：/api/products?category=...
     * @param {string} category - 分類名稱 ('all', 'jacket', 'top', 'pant')
     * @returns {Array} - 過濾後的商品列表
     */
    const getFilteredGoods = (category) => {
        // if (category === 'all') return axios.get('/api/products');
        
        if (category === 'all' || category === 'products') {
            return goods.value;
        }

        // 本地模擬過濾
        return goods.value.filter(good => good.category === category);
    };

    /**
     * 根據 ID 獲取單個商品。未來這裡將呼叫後端 API：/api/products/{id}
     * @param {number} id - 商品ID
     * @returns {Object | undefined} - 單個商品物件
     */
    const getProductById = (id) => {
      // return axios.get(`/api/products/${id}`);
      // 使用 == 進行非嚴格比較，以匹配路由參數通常為字串的狀況
      return goods.value.find(good => good.id == id);
    }
    
    return {
        // allGoods: goods, // 可以移除或保留，但建議統一使用 getFilteredGoods
        getFilteredGoods, 
        getProductById
    };
}

