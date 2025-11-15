<template>
   <div class="goods-list-wrapper">
     <router-link class="type-head" to="/jackets"> ------外套清單------</router-link>
     <JacketsList />
     <router-link class="type-head" to="/tops">------上衣清單------</router-link>
     <TopsList/>
     <router-link class="type-head" to="/pants">------褲子清單------</router-link>
     <PantsList/>
  </div>
</template>
<script setup>
import JacketsList from '@/views/productList/JacketsList.vue';
import PantsList from '@/views/productList/PantsList.vue';
import TopsList from '@/views/productList/TopsList.vue';
</script>

<style scoped>

.goods-list-wrapper{
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.goods-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.type-head {
  text-align: center;
  color: #1b2c79;
  text-decoration: none;
  background-color: rgba(255, 255, 255, 0);
}

</style>



