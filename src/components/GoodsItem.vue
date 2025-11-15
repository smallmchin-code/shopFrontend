<template>
  <div class="goods-item">
    <img :src="image" :alt="name" />
    <h3>{{ name }}</h3>
    <p>${{ price }}</p>

  </div>
</template>

<script setup>
const props = defineProps ({
  name: String,
  image: String,
  price: Number,
  size: String,
  quantity: Number,
  type: String,
})
</script>

<style scoped>
.goods-item {
  border: 0px solid #ccc;
  padding: 16px;
  text-align: center;
}

.goods-item img {
  max-width: 100%;
  height: auto;
}
</style>
