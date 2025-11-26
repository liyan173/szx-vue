<template>
  <div class="dashboard-container">
    <!-- 顶部公司信息 -->
    <div class="company-header">
      <div class="company-info">
        <div class="company-icon">
          <el-icon :size="32" color="#409EFF"><OfficeBuilding /></el-icon>
        </div>
        <div class="company-details">
          <div class="company-name-row">
            <span class="company-name">成都XXXX股份有限公司</span>
            <el-tag type="primary" size="small" class="vip-tag">会员</el-tag>
            <el-tag type="info" size="small">未认证企业</el-tag>
            <el-link type="primary" :underline="false">申请认证</el-link>
          </div>
          <div class="company-rating">
            <el-rate v-model="rating" disabled />
          </div>
        </div>
      </div>
      <el-link type="primary" :underline="false">
        查看详情 <el-icon><ArrowRight /></el-icon>
      </el-link>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-cards">
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon blue">
            <el-icon :size="40"><House /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-label">企业总数 <el-icon><Top /></el-icon></div>
            <div class="stat-value">267,801</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon cyan">
            <el-icon :size="40"><Files /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-label">仓库总面积 <span class="unit">(㎡)</span></div>
            <div class="stat-value">210,678</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon purple">
            <el-icon :size="40"><Document /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-label">仓库出租服务费 <el-icon><Top /></el-icon></div>
            <div class="stat-value">788,632</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon pink">
            <el-icon :size="40"><Goods /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-label">仓库租赁需求费 <el-icon><Top /></el-icon></div>
            <div class="stat-value">963,765</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="charts-row">
      <!-- 折线图 -->
      <el-col :span="16">
        <div class="chart-card">
          <div class="chart-header">
            <div>
              <span class="chart-title">企业入驻数据变化趋势</span>
              <span class="chart-subtitle">（最近更新时间：2024-03-14 20:13:14）</span>
            </div>
            <el-link type="primary" :underline="false">
              查看详情 <el-icon><ArrowRight /></el-icon>
            </el-link>
          </div>
          <div ref="lineChartRef" class="chart-content"></div>
        </div>
      </el-col>

      <!-- 饼图 -->
      <el-col :span="8">
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title">各园区企业数量统计</span>
            <el-link type="primary" :underline="false">
              查看详情 <el-icon><ArrowRight /></el-icon>
            </el-link>
          </div>
          <div ref="pieChartRef" class="chart-content"></div>
        </div>
      </el-col>
    </el-row>

    <!-- 柱状图 -->
    <el-row>
      <el-col :span="24">
        <div class="chart-card">
          <div class="chart-header">
            <el-tabs v-model="activeTab" class="chart-tabs">
              <el-tab-pane label="近一年企业入驻数统计" name="entry"></el-tab-pane>
              <el-tab-pane label="近一年仓库出租数统计" name="rent"></el-tab-pane>
            </el-tabs>
          </div>
          <div ref="barChartRef" class="chart-content"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="Index" lang="ts">
import * as echarts from 'echarts';
import { onMounted, ref, onBeforeUnmount } from 'vue';
import { OfficeBuilding, ArrowRight, House, Files, Document, Goods, Top } from '@element-plus/icons-vue';

const rating = ref(3);
const activeTab = ref('entry');

const lineChartRef = ref<HTMLElement>();
const pieChartRef = ref<HTMLElement>();
const barChartRef = ref<HTMLElement>();

let lineChart: echarts.ECharts | null = null;
let pieChart: echarts.ECharts | null = null;
let barChart: echarts.ECharts | null = null;

// 初始化折线图
const initLineChart = () => {
  if (!lineChartRef.value) return;

  lineChart = echarts.init(lineChartRef.value);
  const option = {
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['入驻', '退出'],
      right: 20,
      top: 0
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '入驻',
        type: 'line',
        data: [250, 280, 350, 600, 250, 300],
        smooth: true,
        itemStyle: { color: '#5470c6' },
        lineStyle: { width: 3 }
      },
      {
        name: '退出',
        type: 'line',
        data: [150, 150, 200, 280, 120, 150],
        smooth: true,
        itemStyle: { color: '#ee6666' },
        lineStyle: { width: 3 }
      }
    ]
  };
  lineChart.setOption(option);
};

// 初始化饼图
const initPieChart = () => {
  if (!pieChartRef.value) return;

  pieChart = echarts.init(pieChartRef.value);
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      itemGap: 20
    },
    series: [
      {
        type: 'pie',
        radius: ['50%', '70%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 25, name: '火车南站园区', itemStyle: { color: '#5470c6' } },
          { value: 25, name: '天府新区园区', itemStyle: { color: '#5ec8f5' } },
          { value: 25, name: '锦江园区', itemStyle: { color: '#f254c5' } },
          { value: 25, name: '成华园区', itemStyle: { color: '#ee6666' } }
        ]
      }
    ]
  };
  pieChart.setOption(option);
};

// 初始化柱状图
const initBarChart = () => {
  if (!barChartRef.value) return;

  barChart = echarts.init(barChartRef.value);
  const option = {
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['入驻', '退出'],
      right: 20,
      top: 0
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '入驻',
        type: 'bar',
        data: [220, 280, 350, 500, 480, 380, 220, 180, 350, 380, 280, 350],
        itemStyle: { color: '#5470c6' },
        barWidth: 20
      },
      {
        name: '退出',
        type: 'bar',
        data: [80, 90, 120, 180, 180, 120, 80, 80, 120, 120, 100, 120],
        itemStyle: { color: '#ee6666' },
        barWidth: 20
      }
    ]
  };
  barChart.setOption(option);
};

// 窗口大小改变时重新渲染图表
const handleResize = () => {
  lineChart?.resize();
  pieChart?.resize();
  barChart?.resize();
};

onMounted(() => {
  initLineChart();
  initPieChart();
  initBarChart();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  lineChart?.dispose();
  pieChart?.dispose();
  barChart?.dispose();
});
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 84px);
}

// 公司信息头部
.company-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  .company-info {
    display: flex;
    gap: 15px;
    align-items: center;

    .company-icon {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .company-details {
      .company-name-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 8px;

        .company-name {
          font-size: 18px;
          font-weight: 600;
          color: #303133;
        }

        .vip-tag {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          color: white;
        }
      }

      .company-rating {
        :deep(.el-rate__icon) {
          font-size: 16px;
        }
      }
    }
  }
}

// 统计卡片
.stats-cards {
  margin-bottom: 20px;

  .stat-card {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    gap: 15px;
    transition: transform 0.3s, box-shadow 0.3s;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .stat-icon {
      width: 70px;
      height: 70px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;

      &.blue {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      &.cyan {
        background: linear-gradient(135deg, #5ec8f5 0%, #36a9e1 100%);
      }

      &.purple {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }

      &.pink {
        background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      }
    }

    .stat-content {
      flex: 1;

      .stat-label {
        font-size: 14px;
        color: #909399;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 4px;

        .unit {
          font-size: 12px;
        }
      }

      .stat-value {
        font-size: 26px;
        font-weight: 600;
        color: #303133;
      }
    }
  }
}

// 图表卡片
.charts-row {
  margin-bottom: 20px;
}

.chart-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .chart-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }

    .chart-subtitle {
      font-size: 12px;
      color: #909399;
      margin-left: 10px;
    }

    .chart-tabs {
      :deep(.el-tabs__header) {
        margin: 0;
      }

      :deep(.el-tabs__nav-wrap::after) {
        display: none;
      }
    }
  }

  .chart-content {
    width: 100%;
    height: 350px;
  }
}
</style>
