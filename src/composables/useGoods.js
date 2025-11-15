// src/composables/useGoods.js

import { ref, computed } from 'vue';


import baconTshirt from '@/assets/goods/baconTshirt.jpg';
import jacketimage from '@/assets/goods/OIP.webp';
import pantImage from '@/assets/goods/pant.webp';


const goods = ref([
    { id: 1, name: ' T-shirt' , image: baconTshirt , price:3000 , size:'X', type: 'top'},
    { id: 2, name: 'Sean jacket' , image: jacketimage , price:3000, size:'X', type: 'jacket'},
    { id: 3, name: ' Sean pant' , image: pantImage , price:1200 , size:'L', type: 'pant'}
]);


export function useGoods() {
    const allGoods = goods; 
 
    const filterJacketGoods = computed(() => {
        return goods.value.filter(good => good.type === 'jacket');
    });

    const filterTopGoods = computed(() => {
        return goods.value.filter(good => good.type === 'top');
    });

    const filterPantGoods = computed(() => {
        return goods.value.filter(good => good.type === 'pant');
    });

    return {
        allGoods,
        filterJacketGoods,
        filterTopGoods,
        filterPantGoods,
    };
}