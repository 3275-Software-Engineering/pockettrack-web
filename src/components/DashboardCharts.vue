<template>
  <div style="margin-right:4px">
    <el-card>
      <div class="card-content" >
        <el-row :gutter="40" type="flex" justify="center" >
          <el-col :span="4">
            <div class="value-box">Balance: {{ dashboardData.balance }}</div>
          </el-col>
          <el-col :span="4">
            <div class="value-box">Total Income: {{ dashboardData.totalIncome }}</div>
          </el-col>
          <el-col :span="4">
            <div class="value-box">Total Expense: {{ dashboardData.totalExpense }}</div>
          </el-col>
          <el-col :span="4">
            <div class="value-box">Saving Goal: {{ dashboardData.savingGoal }}</div>
          </el-col>
          <el-col :span="4">
            <div class="value-box">Budget Goal: {{ dashboardData.budgetGoal }}</div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
 <div style="display: flex; flex-direction: row; width: 100%; justify-content: space-between;margin-top: 2px">
   <el-row :gutter="5" type="flex" style="display: flex; flex-wrap: wrap; width: 100%">
     <el-col :span="12" >
       <el-card >
         <div style="min-width: 100%; height: 230px;" id="line"></div>
       </el-card>
     </el-col>
     <el-col :span="12" >
       <el-card >
         <div style="min-width: 100%; height: 230px" id="bar"></div>
       </el-card>
     </el-col>
   </el-row>
   </div>
  <div style="margin-top: 2px;">
   <el-row :gutter="5" style = "width: 100%;">
     <el-col :span="24">
       <el-card>
         <div style="width: 100%; height: 230px;" id="pie"></div>
       </el-card>
     </el-col>
   </el-row>
</div>

</template>


<script>
import * as echarts from 'echarts';
import DashboardService from "@/services/DashboardService";

export default {
  name: "DashboardCharts",
  components: {},

  data(){
    return{
      dashboardData:{
        "balance": 0,
        "totalIncome": 0,
        "totalExpense": 0,
        "savingGoal": 0,
        "budgetGoal": 0,
        "incomeByCategory": {},
        "expenseByCategory": {},
        "incomeByMonth": {},
        "expenseByMonth": {}
      },
      dates:[]
    }
  },
  mounted() {
    let lineDom = document.getElementById('line');
    let lineChart = echarts.init(lineDom);

    let barDom = document.getElementById('bar');
    let barChart = echarts.init(barDom);

    let pieDom = document.getElementById('pie');
    let pieChart = echarts.init(pieDom);

    this.retrieveDashboardInfo(lineChart, barChart, pieChart);
  },
  methods:{

    retrieveDashboardInfo(lineChart, barChart, pieChart) {
      let uid = localStorage.getItem('userId');

      DashboardService.get(encodeURIComponent(uid))
          .then(response => {
            if (response && response.data) {
              this.dashboardData = response.data;
              console.log(this.dashboardData);

              // 合并日期值
              this.dates = [
                ...new Set([
                  ...Object.keys(this.dashboardData.incomeByMonth),
                  ...Object.keys(this.dashboardData.expenseByMonth)
                ])
              ]
                  .sort((a, b) => new Date(a) - new Date(b)); // 按日期升序排序
              
              // 更新图表配置
              this.updateCharts(lineChart, barChart, pieChart);

            } else {
              console.log("Response data is null");
            }
          })
          .catch(error => {
            console.log(error);
          })
    },
    updateCharts(lineChart, barChart, pieChart) {
      // 更新图表的 option 配置
      const option = {
        title: {
          text: 'income & expense',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['Income By Month', 'Expense By Month'],
          top: '10%',
          left: 'center'
        },
        xAxis: {
          type: 'category',
          data: this.dates, // 这里会用到已经更新后的 this.dates
          axisLabel: {
            interval: 0, // 确保所有标签都显示
            rotate: 45, // 如果标签过长，可以旋转一定角度
            fontSize: 12 // 可以调整字体大小
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'Income By Month',
            data: this.dates.map(date => this.dashboardData.incomeByMonth[date] || 0),
            type: 'line',
            smooth: true
          },
          {
            name: 'Expense By Month',
            data: this.dates.map(date => this.dashboardData.expenseByMonth[date] || 0),
            type: 'line',
            smooth: true
          }
        ],
        grid: {
          left: '15%', // 调整左边距
          right: '5%', // 调整右边距
          bottom: '26%'
        }
      };

      //sort by desc
      const sortedCategories = Object.entries(this.dashboardData.expenseByCategory)
          .sort((a, b) => b[1] - a[1]);
      //mapping to get the value
      const sortedCategoryNames = sortedCategories.map(item => item[0]);
      const sortedCategoryValues = sortedCategories.map(item => item[1]);

      const option1 = {
        title: {
          text: 'Expense By Category',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            let category = params[0].name;
            let value = params[0].value;
            return `${category}: ${value}`;
          }
        },
        xAxis: {
          type: 'category',
          data: sortedCategoryNames,
          axisLabel: {
            interval: 0, // 确保所有标签都显示
            rotate: 30, // 可以旋转标签以适应长文本
            fontSize: 12 // 可以调整字体大小
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'Expense',
            data:sortedCategoryValues,
            type: 'bar',
            smooth: true
          }
        ],
        grid: {
          left: '13%',
          right: '5%',
          bottom: '26%'
        }
      };

      const option2 = {
        title: {
          text: 'Income By Category',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'  // 显示名称、值和百分比
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top: '10%',  // 设置legend的位置
          data: Object.keys(this.dashboardData.incomeByCategory)
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            center: ['50%', '60%'],
            radius: '50%',
            data: Object.entries(this.dashboardData.incomeByCategory).map(item => ({
              name: item[0],
              value: item[1]
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };

      lineChart.setOption(option);
      barChart.setOption(option1);
      pieChart.setOption(option2);
    },
    watch:{
      dashboardData() {
        this.retrieveDashboardInfo();
      }}
  },
}
</script>

<style>

.value-box {
  display: inline-block;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  text-align: center; /* 水平居中 */
  font-weight: bold;  /* 加粗 */
  background-color: #f9f9f9;
  font-size: 16px; /* 可以根据需求调整字体大小 */
  white-space: nowrap;
  width: 180px; /* 固定宽度 */
}
.el-col {
  padding: 0 15px; /* 左右间距 */
}
</style>
