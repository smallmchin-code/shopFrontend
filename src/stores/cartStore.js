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
        // 確保庫存大於 0
        if (product.stock <= 0) {
            alert(`商品「${product.name}」已缺貨，無法加入購物車。`);
            return;
        }

        const existingItem = items.value.find(item => item.id == product.id);

        if (existingItem) {
            // 檢查是否超過庫存
            if (existingItem.quantity < product.stock) {
                existingItem.quantity++;
            } else {
                alert(`商品「${product.name}」庫存不足，目前最多只能購買 ${product.stock} 件。`);
            }
        } else {
            // 首次加入
            items.value.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        console.log('購物車內容:', items.value);
    }
    function removeFromCart(id) {
        const index = items.value.findIndex(item => item.id == id);
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