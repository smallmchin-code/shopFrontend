// fileName: Contact.vue (優化版本)
<template>
  <div class="contact-page">
    <header class="contact-header">
      <h1 class="page-title">
        <span class="icon"></span> 聯繫我們
      </h1>
      <p class="slogan">
        我們隨時在這裡，準備好為您解答任何疑問。
      </p>
    </header>

    <div class="contact-sections">
      <section class="info-card primary">
        <h2 class="card-title">   立即與我們聯繫</h2>
        <p class="description">請透過以下最快速的方式與我們取得聯繫：</p>
        <ul class="contact-list">
          <li>
            <span class="label">電話客服</span>
            <span class="value">0800-000-000</span>
          </li>
          <li>
            <span class="label">電子郵件</span>
            <span class="value">service@example.com</span>
          </li>
        </ul>
        <p class="service-hours">
          <span class="icon">🕒</span> 服務時間：週一至週五 9:00 - 18:00
        </p>
      </section>

      <section class="info-card social">
        <h2 class="card-title">    追蹤我們的社群</h2>
        <p class="description">
          別忘了追蹤我們的社群媒體，獲取最新的穿搭靈感與優惠資訊！
        </p>
        <ul class="contact-list social-links">
          <li>
            <span class="label">Instagram</span>
            <a href="https://www.instagram.com/yakon_tw/" target="_blank" class="value link-ig">@SHAO</a>
          </li>
          <li>
            <span class="label">Facebook</span>
            <a href="https://www.facebook.com/success.rich.happycming" target="_blank" class="value link-fb">嗯嗯嗯嗯</a>
          </li>
        </ul>
      </section>
    </div>
    
    <div class="faq-note">
        
    </div>

  </div>
</template>

<script setup>
// 無需額外邏輯
</script>

<style scoped>
/* ----------- 聯繫頁面整體樣式 ----------- */
.contact-page {
  max-width: 900px;
  margin: 40px auto;
  padding: 30px;
  background-color: #f7f7f7; /* 輕微的背景色 */
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

/* 標題與口號 */
.contact-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 2.5em;
  color: #333;
  margin-bottom: 10px;
  font-weight: 700;
}

.slogan {
  color: #777;
  font-size: 1.1em;
}

/* ----------- 資訊卡片區塊 ----------- */
.contact-sections {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
}

.info-card {
  flex: 1;
  padding: 30px;
  border-radius: 8px;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.info-card:hover {
    transform: translateY(-3px);
}

/* 主要聯繫資訊卡片風格 */
.info-card.primary {
    background-color: #ffffff; 
    border-left: 5px solid #4a6365; /* 採用您的品牌顏色 */
}

/* 社群媒體卡片風格 */
.info-card.social {
    background-color: #f0f8ff; /* 略微不同的背景色 */
    border-left: 5px solid #a89f8a;
}

.card-title {
  font-size: 1.5em;
  /* color: #4a6365; */

  margin-top: 0;
  margin-bottom: 15px;
}

.description {
  margin-bottom: 20px;
  color: #555;
}

/* 聯繫列表 */
.contact-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.contact-list li {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px dashed #ddd;
}

.contact-list li:last-child {
  border-bottom: none;
}

.label {
  font-weight: 600;
  color: #333;
}

.value {
  color: #4a6365;
  font-weight: 500;
}

.link-ig {
    color: #e4405f; /* IG 顏色 */
}

.link-fb {
    color: #4267b2; /* FB 顏色 */
}

/* 服務時間 */
.service-hours {
    margin-top: 25px;
    padding-top: 15px;
    border-top: 1px solid #eee;
    color: #777;
    font-style: italic;
    text-align: center;
}

/* 常見問題提示 */
.faq-note {
    text-align: center;
    padding: 15px;
    background-color: #fff3cd;
    border: 1px solid #ffeeba;
    border-radius: 4px;
    color: #856404;
}

.faq-note a {
    color: #856404;
    font-weight: bold;
    text-decoration: underline;
}

/* 響應式調整 */
@media (max-width: 768px) {
  .contact-sections {
    flex-direction: column;
  }
}
</style>