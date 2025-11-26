import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useStore as useUserStore } from '@/stores/usestore'; // 引入使用者 Store
import { useCartStore } from '@/stores/cartStore'; // 引入購物車 Store (請確保路徑正確)

export const useOrderStore = defineStore('order', () => {
    // 狀態 (State)
    const orders = ref([]); // 模擬儲存所有訂單

    // Getter
    const totalOrders = computed(() => orders.value.length);

    // 【新增】只返回當前登入使用者訂單的 Getter
    const userOrders = computed(() => {
        const userStore = useUserStore();
        const currentUsername = userStore.currentUser?.username;
        
        if (!currentUsername) return []; // 如果未登入，返回空列表
        
        // 過濾出屬於當前用戶的所有訂單
        return orders.value.filter(order => order.userId === currentUsername);
    });
    /**
     * 動作 (Actions)
     * 創建新訂單：將購物車內容轉換為訂單
     * @returns {Object} 包含 success 和 message 的結果物件
     */
    function createOrder() {
        const userStore = useUserStore();
        const cartStore = useCartStore();

        if (!userStore.currentUser) {
            return { success: false, message: '請先登入才能結帳。' };
        }

        if (cartStore.totalItems === 0) {
            return { success: false, message: '購物車內沒有商品，無法結帳。' };
        }

        // 模擬生成訂單 ID 和時間
        const orderId = Date.now().toString().slice(-6); // 簡單模擬 ID
        const orderDate = new Date().toLocaleString('zh-TW');
        
        // 創建訂單物件
        const newOrder = {
            id: orderId,
            userId: userStore.currentUser.username, // 記錄下單用戶
            items: JSON.parse(JSON.stringify(cartStore.items)), // 深度複製購物車商品
            totalPrice: cartStore.totalPrice,
            date: orderDate,
            status: '待處理' // 初始狀態
        };

        // 將新訂單加入列表
        orders.value.unshift(newOrder); // 放在最前面

        // 清空購物車
        cartStore.clearCart(); 

        return { success: true, message: `訂單 ${orderId} 成立成功！` };
    }

    /**
     * 更新訂單狀態 (管理員使用)
     * @param {string} id - 訂單 ID
     * @param {string} newStatus - 新的狀態 ('待處理', '已發貨', '已完成', '已取消')
     */
    function updateOrderStatus(id, newStatus) {
        const order = orders.value.find(o => o.id === id);
        if (order) {
            order.status = newStatus;
            return { success: true, message: `訂單 ${id} 狀態已更新為 ${newStatus}` };
        }
        return { success: false, message: `找不到訂單 ${id}` };
    }
    
    return { orders, totalOrders,userOrders, createOrder, updateOrderStatus };
});