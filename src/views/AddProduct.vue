<script setup></script>

<template>
    <form action="" class="add_form">
    <h2>輸入要新增的商品名稱</h2>
    <input type="text" placeholder="商品名稱"><br>
    <h2>輸入要新增的商品圖片網址</h2>
    <input type="text" placeholder="商品圖片網址"><br>
    <h2>輸入要新增的商品價格</h2>
    <input type="number" placeholder="商品價格"><br>
    <h2>輸入要新增的商品尺寸</h2>
    <input type="text" placeholder="商品尺寸"><br>
    <h2>輸入要新增的商品描述</h2>
    <input type="text" placeholder="商品描述"><br>
    <h2>輸入要新增的商品庫存量</h2>
    <input type="number" placeholder="商品庫存量"><br>
    <h2>輸入要新增的商品分類</h2>
    <input type="text" placeholder="商品分類"><br>
    <button type="submit">新增商品</button>
    </form>
    <div></div>
</template>

<style scoped>
.add_form{
    .product-form {
    max-width: 600px; /* 限制表單寬度，使其在螢幕中央更易於閱讀 */
    margin: 40px auto; /* 居中 */
    padding: 30px;
    background: #fff; /* 白色背景讓表單內容突出 */
    border-radius: 12px; /* 圓角 */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* 輕微陰影，增加立體感 */
}
}
</style>