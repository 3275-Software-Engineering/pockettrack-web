<template>
  <canvas ref="chartCanvas"></canvas>
</template>

<script>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default {
  name: 'BudgetChart',
  props: {
    budgetData: {
      type: Array,
      required: true,
    },
    spentData: {
      type: Array,
      required: true,
    },
    categories: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const chartCanvas = ref(null);
    let chartInstance = null;

    // 创建图表的函数
    const createChart = () => {
      const ctx = chartCanvas.value.getContext('2d');
      
      // 销毁已有的图表实例
      if (chartInstance) {
        chartInstance.destroy();
      }

      // 创建新的图表实例
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: props.categories,
          datasets: [
            {
              label: 'Budget Amount',
              data: props.budgetData,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
            {
              label: 'Actual Amount',
              data: props.spentData,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,           // 启用响应式
          maintainAspectRatio: false, // 允许纵横比变化
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      // 手动触发图表尺寸调整
      chartInstance.resize();
    };

    // 在组件挂载时创建图表
    onMounted(createChart);

    // 监听 props 中的数据变化并更新图表
    watch(
      () => [props.budgetData, props.spentData, props.categories],
      createChart
    );

    // 在组件销毁前销毁图表实例
    onBeforeUnmount(() => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    });

    return {
      chartCanvas,
    };
  },
};
</script>

<style>
canvas {
  width: 100%;  /* 使画布宽度为100% */
  height: 100%; /* 使画布高度为100%，可以填充父容器 */
}
</style>
