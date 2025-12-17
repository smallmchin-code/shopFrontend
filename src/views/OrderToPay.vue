<template>
  <div class="payment-container">
    <div class="payment-card">
      <div class="header">
        <i class="fas fa-credit-card"></i>
        <h2>訂單付款確認</h2>
      </div>

      <div class="info-group">
        <p><strong>訂單編號:</strong> #{{ orderId }}</p>
        <p><strong>交易編號:</strong> {{ merchantTradeNo }}</p>
        <p><strong>應付金額:</strong> ${{ amount.toFixed(2) }} TWD</p>
      </div>

      <div class="redirect-message">
        <div class="spinner"></div>
        <p>
          正在安全地導向綠界科技金流服務...
          <br />
          請稍候，頁面將會**自動跳轉**。
        </p>
      </div>

      <form
        id="ecpayForm"
        :action="ecpayApiUrl"
        method="POST"
        style="display: none;"
      >
        <div v-for="(value, key) in ecpayParams" :key="key">
          <input type="hidden" :name="key" :value="value" />
        </div>
        <input type="submit" value="前往綠界付款" />
      </form>

      <button @click="manualSubmit" class="manual-button">
        若 5 秒內未跳轉，請點擊此處
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted ,onBeforeUnmount, computed} from 'vue';
import { storeToRefs } from 'pinia';
import { useOrderStore } from '@/stores/orderStore.js'; // 確保路徑正確
import { useRouter } from 'vue-router';

const orderStore = useOrderStore();
const router = useRouter();

// 1. 從 Store 中讀取最新訂單響應 (包含綠界參數)
const { latestOrderResponse } = storeToRefs(orderStore);

// 2. 創建 Computed 屬性以映射到模板，並提供預設值
const orderId = computed(() => latestOrderResponse.value?.orderId || 0);
const amount = computed(() => latestOrderResponse.value?.amount || 0.00);
const merchantTradeNo = computed(() => latestOrderResponse.value?.merchantTradeNo || 'N/A');

// 💡 注意：ecpayApiUrl 和 ecpayParams 是後端 OrderResponse 傳回的欄位名稱
const ecpayApiUrl = computed(() => latestOrderResponse.value?.ecpayApiUrl || ''); 
const ecpayParams = computed(() => latestOrderResponse.value?.ecpayParams || {});

let submitTimer = null;

const autoSubmit = () => {
  const form = document.getElementById('ecpayForm');
  if (form) {
    submitTimer = setTimeout(() =>{
      form.submit();
    }, 100);
  }else {
    alert('付款表單元素未找到，請重新嘗試結帳。');
    router.push('/cart');
  } 
};

const manualSubmit = () => {
  if (submitTimer) {
    clearTimeout(submitTimer);
  }
  autoSubmit();
};

// 3. 組件生命週期：使用 onMounted
onMounted(() => {
  if (ecpayApiUrl.value && Object.keys(ecpayParams.value).length > 0) { // <--- 修正這一行
      console.log('偵測到綠界參數，準備自動跳轉...');
      // 延遲 500ms 執行提交
      setTimeout(() => {
           autoSubmit();
      }, 500);
   } else {
      console.error('缺少綠界金流參數，無法進行跳轉。請檢查後端回傳數據。');
      alert('付款參數遺失，無法跳轉，將導回首頁。');
      router.push('/');
   }
});


onBeforeUnmount(() => {
  if (submitTimer) {
    clearTimeout(submitTimer);
    console.log('Clearing auto submit timer before component unmount.');
  }
});

</script>

<style scoped>
/* 整體容器和置中 */
.payment-container {
  display: flex;
  justify-content: center;
  align-items: flex-start; /* 讓內容靠上一些 */
  min-height: 100vh;
  padding-top: 50px;
  background-color: #f4f6f9; /* 柔和的淺灰色背景 */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* 核心卡片風格 */
.payment-card {
  width: 100%;
  max-width: 450px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  text-align: center;
  transition: transform 0.3s ease;
}

.payment-card:hover {
    transform: translateY(-3px);
}

/* 標頭樣式 */
.header {
  margin-bottom: 25px;
  border-bottom: 1px solid #eeeeee;
  padding-bottom: 15px;
}

.header i {
  font-size: 36px;
  color: #007bff; /* 品牌藍色 */
  margin-bottom: 10px;
}

.header h2 {
  font-size: 24px;
  color: #333333;
  font-weight: 600;
  margin: 0;
}

/* 訂單資訊組 */
.info-group {
  text-align: left;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 30px;
  border-left: 4px solid #007bff;
}

.info-group p {
  margin: 8px 0;
  font-size: 16px;
  color: #555555;
}

.info-group strong {
  color: #333333;
  display: inline-block;
  min-width: 90px;
}

/* 跳轉訊息 */
.redirect-message {
  padding: 20px;
  margin-bottom: 20px;
  color: #007bff;
}

.redirect-message p {
  font-size: 15px;
  line-height: 1.6;
  color: #555555;
}

.redirect-message strong {
  color: #cc0000; /* 提醒顏色 */
}

/* 旋轉動畫 (Spinner) */
.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #007bff;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 手動提交按鈕 (備用) */
.manual-button {
  background-color: #f0f0f0;
  color: #333333;
  border: 1px solid #dddddd;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.manual-button:hover {
  background-color: #e0e0e0;
}
</style>

