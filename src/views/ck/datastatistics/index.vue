<template>
  <div class="p-4 bg-gray-100">
    <!-- Top Stats Cards -->
    <el-row :gutter="20">
      <el-col v-for="card in statsCards" :key="card.title" :span="6" class="mb-4">
        <el-card shadow="hover" body-class="flex items-center p-4">
          <div class="flex-shrink-0">
            <!-- Placeholder for 3D Icon -->
            <div class="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
              <el-icon :size="40" color="#409EFC"><component :is="card.icon" /></el-icon>
            </div>
          </div>
          <div class="ml-4">
            <div class="text-gray-500">{{ card.title }}</div>
            <div class="text-2xl font-bold">{{ card.value.toLocaleString() }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Middle Charts -->
    <el-row :gutter="20" class="mt-5">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="font-bold">各园区企业数量统计</div>
          </template>
          <div ref="pieChart1" style="height: 300px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="font-bold">各业务领域企业数统计</div>
          </template>
          <div ref="pieChart2" style="height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Bottom Chart -->
    <el-row class="mt-5">
      <el-col :span="24">
        <el-card shadow="hover">
          <template #header>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="近一年企业入驻数统计" name="bar1"></el-tab-pane>
              <el-tab-pane label="近一年仓库出租数统计" name="bar2"></el-tab-pane>
            </el-tabs>
          </template>
          <div ref="barChart" style="height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import * as echarts from 'echarts';
import {
  TrendCharts,
  Grid,
  DataAnalysis,
  Service,
  Postcard,
  MessageBox,
  OfficeBuilding,
  HomeFilled,
  Warning,
  Avatar
} from '@element-plus/icons-vue';

// --- Reactive Data ---
const statsCards = ref([
  { title: '企业总数 (个)', value: 267801, icon: OfficeBuilding },
  { title: '仓库总面积 (m²)', value: 210678, icon: TrendCharts },
  { title: '仓库出租服务数 (个)', value: 788632, icon: HomeFilled },
  { title: '仓库租赁需求数', value: 963765, icon: Postcard },
  { title: '安全设施配套数', value: 788632, icon: Warning },
  { title: '反馈信息数 (个)', value: 267801, icon: MessageBox },
  { title: '线上咨询总数 (个)', value: 267801, icon: Service },
  { title: '服务人员配置数', value: 963765, icon: Avatar },
  { title: '售后服务数 (个)', value: 210678, icon: Postcard },
  { title: '仓库滞留库存数 (个)', value: 210678, icon: Grid },
]);

const activeTab = ref('bar1');

// Chart instances
const pieChart1 = ref<HTMLElement | null>(null);
const pieChart2 = ref<HTMLElement | null>(null);
const barChart = ref<HTMLElement | null>(null);

// --- Chart Options ---

const getPieOption = (title: string, data: any[]) => {
  return {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'right',
    },
    series: [
      {
        name: title,
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{d}%'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: true
        },
        data: data
      }
    ]
  };
};

const getBarOption = (data: any[]) => {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '入驻',
        type: 'bar',
        barWidth: '60%',
        data: data
      }
    ]
  };
};


// --- Lifecycle Hooks ---

onMounted(() => {
  nextTick(() => {
    // Init Pie Chart 1
    const pie1Instance = echarts.init(pieChart1.value);
    const pie1Data = [
        { value: 1048, name: '火车南站园区' },
        { value: 735, name: '天府新区园区' },
        { value: 580, name: '锦江园区' },
        { value: 484, name: '成华园区' }
    ];
    pie1Instance.setOption(getPieOption('各园区企业数量统计', pie1Data));

    // Init Pie Chart 2
    const pie2Instance = echarts.init(pieChart2.value);
    const pie2Data = [
        { value: 820, name: '业务1' },
        { value: 650, name: '业务2' },
        { value: 430, name: '业务3' },
        { value: 300, name: '业务4' }
    ];
    pie2Instance.setOption(getPieOption('各业务领域企业数统计', pie2Data));

    // Init Bar Chart
    const barInstance = echarts.init(barChart.value);
    const barData = [25, 30, 38, 45, 48, 38, 25, 22, 38, 39, 32, 38];
    barInstance.setOption(getBarOption(barData));

    // Resize charts on window resize
    window.addEventListener('resize', () => {
        pie1Instance.resize();
        pie2Instance.resize();
        barInstance.resize();
    });
  });
});
</script>

<style scoped>
/* Using UnoCSS utility classes, so scoped styles are minimal. */
/* You can add custom styles here if needed. */
.el-card {
  border-radius: 10px;
}
</style>
