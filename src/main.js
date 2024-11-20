import {createApp} from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

import LoginComponent from '@/components/LoginComponent.vue'; // 更新为新名称
import RegisterComponent from '@/components/RegisterComponent.vue'; // 更新为新名称
import BudgetReportComponent from '@/components/BudgetReportComponent.vue'; // 更新为新名称
import '@/assets/css/global.css'
import '@/assets/css/iconfont/iconfont.css'
import '@/assets/css/theme/index.css'

createApp(App)
    .use(router)
    .use(ElementPlus, {size: 'small'})
    .component('LoginComponent', LoginComponent)
    .component('RegisterComponent', RegisterComponent)
    .component('BudgetReportComponent', BudgetReportComponent)
    .mount('#app');
