import { ref, computed } from 'vue';

// 購物車狀態，存儲所有商品
const cartItems = ref([]);

// 尋找商品是否存在購物車中
const findItemInCart = (product) => {
    return cartItems.value.find(item => item.id === product.id);
};

// 加入購物車
const addToCart = (product) => {
    const existingItem = findItemInCart(product);
    if (existingItem) {
        // 如果商品已存在，增加數量
        existingItem.quantity += 1;
    } else {
        // 否則，新增商品到購物車，並設定數量為 1
        cartItems.value.push({ 
            ...product, 
            quantity: 1 
        });
    }
    console.log(`[購物車] 商品 ${product.name} 已加入。`);
};

// 從購物車移除商品
const removeFromCart = (itemId) => {
    const index = cartItems.value.findIndex(item => item.id === itemId);
    if (index !== -1) {
        cartItems.value.splice(index, 1);
        console.log(`[購物車] 商品 ID ${itemId} 已移除。`);
    }
};

// 計算總商品數量 (用於購物車圖標/總結)
const totalItems = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + item.quantity, 0);
});

// 計算總金額
const totalPrice = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});


export function useCart() {
    return {
        cartItems,
        addToCart,
        removeFromCart,
        totalItems,
        totalPrice
    };
}