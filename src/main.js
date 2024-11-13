import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import LoginComponent from '@/components/LoginComponent.vue'; // 更新为新名称
import RegisterComponent from '@/components/RegisterComponent.vue'; // 更新为新名称
import BudgetReportComponent from '@/components/BudgetReportComponent.vue'; // 更新为新名称

createApp(App)
  .use(router)
  .component('LoginComponent', LoginComponent)
  .component('RegisterComponent', RegisterComponent)
  .component('BudgetReportComponent', BudgetReportComponent)
  .mount('#app');
