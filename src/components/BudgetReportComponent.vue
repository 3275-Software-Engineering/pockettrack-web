<template>
  <div class="container">
    <!-- 页面标题 -->
    <h1 class="page-title">Budget Management</h1>
    
    <!-- Year and Month Input -->
    <!-- 年份和月份输入 -->
    <!-- 绑定月份，改变时调用 fetchReport 方法 -->
    <div class="filter-section">
      <div class="filter-item">
        <label for="year">Year:</label>
        <input type="number" v-model="year" @change="fetchReport" />
      </div>
      <div class="filter-item">
        <label for="month">Month:</label>
        <input type="number" v-model="month" @change="fetchReport" />
      </div>
    </div>

    <!-- Report Table and Chart -->
    <!-- 报表表格和图表 -->
    <div v-if="report" class="report-section">
      <!-- Chart Section -->
      <!-- 图表区域 -->
      <div class="chart-container">
        <canvas id="budgetChart"></canvas>
      </div>

      <!-- Budget Table Section -->
      <!-- 预算表格区域 -->
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Budget Amount</th>
              <th>Actual Amount</th>
              <th>Variance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- 遍历 report 中的每个类别 -->
            <tr v-for="(category, index) in report.parsedCategories" :key="category.name">
              <td>{{ category.name }}</td>
              <td>{{ category.budget }}</td>
              <td>{{ category.spent }}</td>
              <td>{{ category.budget - category.spent }}</td>
              <td>
                <!-- 编辑和删除按钮 -->
                <button @click="prepareEditBudget(index)" class="btn btn-edit">Edit</button>
                <button @click="confirmDeleteBudget(index)" class="btn btn-delete">Delete</button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td><strong>Total</strong></td>
              <td><strong>{{ report.totalBudget }}</strong></td>
              <td><strong>{{ report.totalSpent }}</strong></td>
              <td><strong>{{ report.variance }}</strong></td>
              <td></td>
            </tr>
          </tfoot>
        </table>

        <!-- 表单标题 -->
        <h2>{{ isEditing ? 'Update Budget' : 'Add Budget' }}</h2>
        <div class="form-container">
          <!-- Align elements in one row -->
          <div class="form-row">
            <!-- 类别选择框 -->
            <select v-model="currentCategory.name" class="form-select">
              <option v-for="category in availableCategories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
            <!-- 预算金额输入框 -->
            <input v-model="currentCategory.budget" type="number" placeholder="Budget Amount" class="form-input" />
            
            <!-- 操作按钮区域 -->
            <div class="action-buttons">
              <button 
                v-if="!isEditing"
                @click="addBudget" 
                class="btn btn-add">
                Add Budget
              </button>
              
              <button 
                v-if="isEditing"
                @click="updateBudget"
                class="btn btn-update">
                Update Budget
              </button>
              
              <button 
                v-if="isEditing"
                @click="cancelEdit"
                class="btn btn-cancel">
                Cancel Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { ref, onMounted, watch, nextTick } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default {
  setup() {
    // 报表数据
    const report = ref(null);
    // 可用的类别
    const availableCategories = ref([]);
    const year = ref(2024);
    const month = ref(10);
    const userId = localStorage.getItem('userId'); 
    // 当前编辑的类别数据
    const currentCategory = ref({ name: '', budget: 0 });
    const isEditing = ref(false);
    let chartInstance = null;

    // 获取报表数据
    const fetchReport = async () => {
      const response = await fetch(`http://localhost:8080/api/budgets/report/${userId}/${year.value}/${month.value}`);
      if (response.ok) {
        report.value = await response.json();
        parseCategories();
        nextTick(() => createChart());
      } else {
        console.error('Failed to fetch report');
      }
    };

     watch([year, month], fetchReport);

    // 解析类别数据
    const parseCategories = () => {
      const parsedCategories = [];
      for (const key in report.value.categoryTotals) {
        const match = key.match(/(.+)(totalBudget|totalSpent|totalvariance)/);
        if (match) {
          const category = match[1].trim();
          const type = match[2];

          let entry = parsedCategories.find(item => item.name === category);
          if (!entry) {
            entry = { name: category, budget: 0, spent: 0, variance: 0 };
            parsedCategories.push(entry);
          }

          if (type === 'totalBudget') {
            entry.budget = report.value.categoryTotals[key] || 0;
          } else if (type === 'totalSpent') {
            entry.spent = report.value.categoryTotals[key] || 0;
          }
        }
      }
      report.value.parsedCategories = parsedCategories;
      availableCategories.value = parsedCategories.map(c => c.name);
    };

    // 创建图表
    const createChart = () => {
      const ctx = document.getElementById('budgetChart').getContext('2d');
      if (chartInstance) chartInstance.destroy();

      const categories = report.value.parsedCategories.map(category => category.name);
      const budgetData = report.value.parsedCategories.map(category => category.budget);
      const spentData = report.value.parsedCategories.map(category => category.spent);

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: categories,
          datasets: [
            {
              label: 'Budget Amount',
              data: budgetData,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
            {
              label: 'Actual Amount',
              data: spentData,
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Amount' },
            },
            x: { title: { display: true, text: 'Categories' } },
          },
          plugins: {
            legend: { display: true, position: 'top' },
          },
        },
      });
    };

   // 添加预算
    const addBudget = async () => {
      if (!currentCategory.value.name || currentCategory.value.budget <= 0) return;

      const budgetData = {
        userId,
        periodType: 'monthly',
        periodDate: `${year.value}-${month.value.toString().padStart(2, '0')}-01`,
        categoryName: currentCategory.value.name,
        budgetAmount: currentCategory.value.budget.toFixed(2),
      };

      const response = await fetch(`http://localhost:8080/api/budgets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(budgetData),
      });

      if (response.ok) {
        resetCurrentCategory();
        fetchReport();
      } else {
        console.error('Failed to add budget');
      }
    };

    // 准备编辑预算
    const prepareEditBudget = (index) => {
      const category = report.value.parsedCategories[index];
      currentCategory.value.name = category.name;
      currentCategory.value.budget = category.budget;
      isEditing.value = true;
    };

   // 更新预算
    const updateBudget = async () => {
      const periodDate = `${year.value}-${month.value.toString().padStart(2, '0')}-01`;

      const response = await fetch(`http://localhost:8080/api/budgets/${userId}?categoryName=${currentCategory.value.name}&periodDate=${periodDate}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budgetAmount: currentCategory.value.budget }),
      });

      if (response.ok) {
        resetCurrentCategory();
        fetchReport();
      } else {
        console.error('Failed to update budget');
      }
    };

    // 确认删除预算
    const confirmDeleteBudget = (index) => {
      const categoryName = report.value.parsedCategories[index].name;
      if (window.confirm(`Are you sure you want to delete the budget for ${categoryName}?`)) {
        deleteBudget(index);
      }
    };

    // 删除预算
    const deleteBudget = async (index) => {
      const categoryName = report.value.parsedCategories[index].name;
      try {
        const response = await fetch(
          `http://localhost:8080/api/budgets/${userId}/${encodeURIComponent(categoryName)}/${year.value}/${month.value}`,
          { method: 'DELETE' }
        );

        if (response.ok) {
          alert('Budget deleted successfully!');
          fetchReport();
        } else {
          console.error('Failed to delete budget');
        }
      } catch (error) {
        console.error('Error deleting budget:', error);
      }
    };

    const cancelEdit = () => {
      resetCurrentCategory();
    };

    const resetCurrentCategory = () => {
      currentCategory.value = { name: '', budget: 0 };
      isEditing.value = false;
    };

    onMounted(() => fetchReport());

    return {
      report,
      availableCategories,
      year,
      month,
      currentCategory,
      isEditing,
      addBudget,
      prepareEditBudget,
      updateBudget,
      confirmDeleteBudget,
      cancelEdit,
    };
  },
};
</script>

<style>
/* 设置整体容器样式 */
.container {
  max-width: 1200px; 
  margin: 0 auto;
  padding: 30px;
  background-color: #f4f4f9;
}

.page-title {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 20px;
}

.filter-section {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center;     /* 垂直居中 */
  margin-bottom: 30px;
}

.filter-item label {
  font-weight: bold;
  margin-right: 10px;
}

.filter-item input {
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.report-section {
  display: flex;
  flex-direction: column;
}

.chart-container {
  height: 400px;
  margin-bottom: 30px;
}

.table-container {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 30px;
}

.table-container table {
  width: 100%;
  border-collapse: collapse;
}

.table-container th, .table-container td {
  padding: 12px 15px;
  text-align: center;
}

.table-container th {
  background-color: #f4f4f4;
  color: #333;
}


.table-container td {
  font-size: 1rem;
}

  th, td {
    border: 1px solid #ddd; /* 为表格单元格添加灰色边框 */
    padding: 8px; /* 给单元格内的内容添加一些内边距 */
    text-align: left; /* 让文本左对齐 */
  }

.table-container td button {
  padding: 8px 12px;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-edit {
  background-color: #ffa500;
  color: white;
  border: none;
}

.btn-delete {
  background-color: #f44336;
  color: white;
  border: none;
}

.form-container {
  margin-top: 20px;
}

.form-row {
  display: flex;
  justify-content: space-between; /* Align elements horizontally */
  gap: 15px; /* Space between the form elements */
  align-items: center;
}

.form-select, .form-input {
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.form-select {
  width: 200px;
}

.form-input {
  width: 250px;
}

.action-buttons button {
  padding: 10px 20px;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-add {
  background-color: #4caf50;
}

.btn-update {
  background-color: #2196f3;
}

.btn-cancel {
  background-color: #9e9e9e;
}
</style>
