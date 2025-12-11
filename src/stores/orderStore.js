import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useStore as useUserStore } from '@/stores/usestore'; // 引入使用者 Store
import { useCartStore } from '@/stores/cartStore'; // 引入購物車 Store (請確保路徑正確)
import axios from 'axios';

const BASE_URL = "http://localhost:8080/api/orders";

export const useOrderStore = defineStore('order', () => {
    // 狀態 (State)
    const orders = ref([]); // 模擬儲存所有訂單

    // Getter
    const totalOrders = computed(() => orders.value.length);

    // 【新增】只返回當前登入使用者訂單的 Getter
    const userOrders = computed(() => orders.value);
   

    async function fetchAllOrders() {
        try {
            const res = await axios.get(BASE_URL); 
            orders.value = res.data; // 將後端返回的列表賦值給 orders
        } catch (error) {
            console.error('載入所有訂單失敗:', error);
            throw error;
        }
    }

    /**
     * ② 取得當前使用者訂單 (客戶使用: GET /api/orders/myorders 或類似)
     */
    async function fetchUserOrders() {
        const userStore = useUserStore();
        if (!userStore.isLoggedIn) {
            orders.value = [];
            return;
        }
        
        try {
            // 假設後端會根據當前用戶的 Session/Token 來過濾訂單
            const res = await axios.get(`${BASE_URL}/myorders`); // 假設這個 endpoint 專門給客戶
            orders.value = res.data; // 覆寫 orders 狀態
        } catch (error) {
            console.error('載入使用者訂單失敗:', error);
            orders.value = [];
            throw error;
        }
    }

    async function createOrder() {
        const userStore = useUserStore();
        const cartStore = useCartStore();

        if (!userStore.currentUser) {
            return { success: false, message: '請先登入才能結帳。' };
        }

        if (cartStore.totalItems === 0) {
            return { success: false, message: '購物車內沒有商品，無法結帳。' };
        }

        // 模擬生成訂單 ID 和時間
        const orderData = {
            userId: userStore.currentUser.id, 
            items: cartStore.items.map(item => ({ 
                // 傳遞足夠的資訊讓後端知道下了哪些商品
                productId: item.id, 
                quantity: item.quantity, 
                price: item.price,
                name: item.name 
            })),
            totalPrice: cartStore.totalPrice,
            // ... 其他需要的資訊，例如地址
        };

        try {
            const res = await axios.post(BASE_URL, orderData); // 👈 使用 axios.post 傳送
            const newOrder = res.data; // 假設後端返回新建立的訂單物件
            cartStore.clearCart(); 
            
            // [可選] 如果您希望在結帳後立即看到這筆訂單，可以將其添加到 orders.value 中
            // orders.value.unshift(newOrder);

            return { success: true, message: `訂單 ${newOrder.id || '已成功'} 成立成功！` };
        } catch (error) {
            console.error('創建訂單失敗:', error.response?.data || error.message);
            return { success: false, message: `結帳失敗：${error.response?.data?.message || '伺服器錯誤'}` };
        }
    }
    /**
     * 更新訂單狀態 (管理員使用)
     * @param {string} id - 訂單 ID
     * @param {string} newStatus - 新的狀態 ('待處理', '已發貨', '已完成', '已取消')
     */
    async function updateOrderStatus(id, newStatus) { // 👈 修正為 async
        try {
            // 發送 PATCH 請求到後端更新狀態
            await axios.patch(`${BASE_URL}/${id}`, { status: newStatus }); 
            
            // 成功後更新本地狀態，以響應式更新 UI
            const order = orders.value.find(o => o.id === id);
            if (order) {
                order.status = newStatus;
            }
            
            return { success: true, message: `訂單 ${id} 狀態已更新為 ${newStatus}` };
        } catch (error) {
            console.error('更新訂單狀態失敗:', error.response?.data || error.message);
            return { success: false, message: `更新失敗：${error.response?.data?.message || '伺服器錯誤'}` };
        }
    }
    
    return { 
        orders, 
        totalOrders,
        userOrders, 
        createOrder, 
        updateOrderStatus,
        fetchAllOrders, 
        fetchUserOrders 
    };
});