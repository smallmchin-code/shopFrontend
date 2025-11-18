<template>
  <div>
    <div class="home-main-head">
      <form class="search" action="">
        <input type="text" placeholder="輸入想要的商品名稱">
        <input type="submit" value="查詢">
      </form>
      <div>
        <router-link to="/addProduct">我想新增商品</router-link>
      </div>
      <div class="home-main">
        <h3>商品總覽 </h3>
      </div>
    </div>
    <div>
      <!-- 記得參考蝦皮放分類 -->
      <GoodsList />
    </div>
    <!-- 未來內容將會放在這裡 -->
  </div>
  
</template>

<script setup>
import GoodsList from '../components/GoodsList.vue';
</script>

<style scoped>
h3{
  font-size: 30px;
}
.home-main-head {
  text-align: center;
  padding-top: 50px;
}
.search>input{
  height: 40px;

}
.searchinput{
  height: 40px;
  
}
.home-main{
  padding: 20px;
}

  
  
</style>

