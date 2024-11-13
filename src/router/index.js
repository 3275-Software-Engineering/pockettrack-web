import { createRouter, createWebHistory } from 'vue-router';
import HomeComponent from '@/views/HomeComponent.vue';
import LoginComponent from '@/components/LoginComponent.vue';
import RegisterComponent from '@/components/RegisterComponent.vue';
import BudgetPage from '@/components/BudgetReportComponent.vue'; // Import your BudgetPage component


const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeComponent,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginComponent,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterComponent,
  },
  {
    path: '/budget',
    name: 'Budget',
    component: BudgetPage, // Add your BudgetPage route here
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
