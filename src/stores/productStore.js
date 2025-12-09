import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

const BASE_URL = "http://localhost:8080/api/products"

export const useProductStore = defineStore('product', () => {

    // --- STATE ---
    const goods = ref([])  // 原本是 initialGoods → 變成後端載入

    // --- GETTERS ---
    const allGoods = computed(() => goods.value)

    // --- ACTIONS ---

    // ① 從後端載入所有商品
    async function fetchAllGoods() {
        const res = await axios.get(BASE_URL)
        goods.value = res.data
    }

    // ② 取得單一商品
    async function fetchProductById(id) {
        const res = await axios.get(`${BASE_URL}/${id}`)
        return res.data
    }

    // ③ 依分類取得商品
    async function fetchFilteredGoods(category) {
        const res = await axios.get(`${BASE_URL}?category=${category}`)
        goods.value = res.data
    }

    // ④ 刪除商品
    async function deleteProduct(id) {
        await axios.delete(`${BASE_URL}/${id}`)
        goods.value = goods.value.filter(p => p.id != id)
    }

    // ⑤ 用名稱查商品（後端可加 endpoint，不然前端自己查）
    function findGoodsByName(name) {
        const lower = name.toLowerCase().trim()
        return goods.value.find(g => g.name.toLowerCase().trim() === lower)
    }
    // ⑥ 【新增】從後端 API 依名稱搜尋商品 (建議的優化)
    async function searchGoodsByName(name) {
        if (!name.trim()) {
            await fetchAllGoods(); // 如果搜尋詞為空，載入所有商品
            return;
        }
        
        try {
            // 假設後端 API 支援 ?name= 參數來進行模糊或精確查詢
            const res = await axios.get(`${BASE_URL}?name=${name}`); 
            goods.value = res.data; // 🎯 將搜尋結果覆蓋到 goods.value
            
        } catch (error) {
            console.error('從後端搜尋商品失敗:', error);
            // 錯誤時，將商品列表清空或保持原狀
            goods.value = [];
            throw error;
        }
    }
    async function updateProduct(product) {
        // 假設後端 API 使用 PUT 請求來更新指定 ID 的商品
        const res = await axios.put(`${BASE_URL}/${product.id}`, product)
        
        // [選填] 同步更新 Store 中 goods 列表的資料，讓 Manager_Products 頁面 (若已載入) 能立即看到更新
        const index = goods.value.findIndex(p => p.id == product.id)
        if (index !== -1) {
            goods.value[index] = res.data // 假設後端返回更新後的商品資料
        }
        
        return res.data // 返回更新後的商品資料
    }

    async function createProduct(productData) {
        try {
            const res = await axios.post(BASE_URL, productData, {
                headers: {
                    'Content-Type': 'multipart/form-data' 
                }
            })
            const createdProduct = res.data

            goods.value.push(createdProduct) 
            
            return createdProduct 
            
        } catch (error) {
            console.error('新增商品失敗:', error)
            throw error 
        }
    }

    return {
        goods,
        allGoods,
        fetchAllGoods,
        fetchProductById,
        fetchFilteredGoods,
        deleteProduct,
        findGoodsByName,
        searchGoodsByName,
        updateProduct,
        createProduct
    }
})
