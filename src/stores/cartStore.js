// stores/cartStore.js

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCartStore = defineStore('cart', () => {
    // 狀態 (State)
    // 購物車項目，包含商品物件和數量
    const items = ref([]); 

    // Getter
    // 購物車總數量
    const totalItems = computed(() => items.value.reduce((total, item) => total + item.quantity, 0));

    // Actions
    /**
     * 加入商品到購物車
     * @param {Object} product - 要加入的商品物件 (需包含 id, name, price, stock)
     */
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

    return { items, totalItems,totalPrice, addToCart ,removeFromCart};
});