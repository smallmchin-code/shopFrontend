// stores/cartStore.js

import { defineStore } from 'pinia';
import { ref, computed , watch} from 'vue';
const CART_STORAGE_KEY = 'my_shop_cart';
export const useCartStore = defineStore('cart', () => {
    const initialItems = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    const items = ref(initialItems); 
    // Getter
    // 購物車總數量
    const totalItems = computed(() => items.value.reduce((total, item) => total + item.quantity, 0));

    const totalPrice = computed(() =>
        items.value.reduce((total, item) => total + (item.price * item.quantity), 0)
    );

    function addToCart(product) {
        // 1. 強制確保數量是數字 (避免變成字串拼接)
    const qtyToAdd = Number(product.quantity) || 1;
        const existingItem = items.value.find(item => 
            item.id === product.id && item.variantId === product.variantId
        );

        if (existingItem) {
            if (existingItem.quantity + qtyToAdd <= product.stock) {
                existingItem.quantity += qtyToAdd;
            } else {
                alert(`庫存不足，目前最多只能購買 ${product.stock} 件。`);
            }
        } else {
            // 首次加入：儲存完整規格資訊
            items.value.push({
                id: product.id,
                variantId: product.variantId, // 🌟 新增規格 ID
                name: product.name,
                price: product.price,
                image: product.image,
                size: product.size,           // 🌟 記錄選中的尺寸名稱
                quantity: qtyToAdd,   // 🌟 傳入選擇的數量
                stock: product.stock          // 🌟 紀錄該規格的最大庫存
            });
        }
    }
    function removeFromCart(id ,variantId) {
        const index = items.value.findIndex( item => item.id === id && item.variantId === variantId);
        if (index !== -1) {
            items.value.splice(index, 1);
        }
    }
    // 可以在這裡新增 removeFromCart, updateQuantity 等 action

    function clearCart() {
        items.value = [];
    }

watch(items, (newItems) => {
        // 將 items 陣列轉換為 JSON 字串並儲存
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
        console.log('購物車已存儲到 localStorage');
    }, { 
        deep: true // 深度監聽，確保 items 陣列中的物件屬性變化（如 quantity 增加）也能觸發儲存
    });

    return { items, totalItems,totalPrice, addToCart ,removeFromCart,clearCart};
});