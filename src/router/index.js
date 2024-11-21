import { createRouter, createWebHistory } from 'vue-router';
import HomeComponent from '@/views/HomeComponent.vue';
import LoginComponent from '@/components/LoginComponent.vue';
import RegisterComponent from '@/components/RegisterComponent.vue';
import BudgetPage from '@/components/BudgetReportComponent.vue'; // Import your BudgetPage component
import Home from "../components/HomeView.vue";  // Home 组件是布局容器
import Dashboard from "../components/DashboardCharts";
import TransactionComponent from '@/components/TransactionComponent.vue'; 

// Judge login or not
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
    path: '/home',
    name: 'home',
    component: Home,
    children: [
      {
        path: 'dashboard',  // /home/dashboard
        name: 'Dashboard',
        component: Dashboard,
      },
      {
        path: 'transaction',
        name: 'Transaction',
        component: TransactionComponent, 
      },
      {
           path: 'savingGoals',  // /home/savingGoals
           name: 'SavingGoals',
           component: SavingGoals,
       },
       {
           path: 'budget',  // /home/budgets
           name: 'Budget',
           component: BudgetPage, // Add your BudgetPage route here
       },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),// Use createWebHistory
  routes,
});

export default router;
