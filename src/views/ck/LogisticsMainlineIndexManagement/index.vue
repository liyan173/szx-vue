<template>
  <div class="p-2">
    <!-- 数据总览 -->
    <el-card shadow="never" class="mb-4">
      <template #header>
        <div class="section-header">
          <div class="header-title">
            <span class="title-bar"></span>
            <span class="title-text">数据总览</span>
            <span class="title-time">(最近更新时间: {{ overviewUpdateTime }})</span>
          </div>
          <el-button link type="primary" @click="handleEditOverview">
            <el-icon><Edit /></el-icon>
            编辑
          </el-button>
        </div>
      </template>

      <div class="overview-grid">
        <div class="overview-item">
          <div class="item-label">
            <span class="required-label">航班线路</span>
          </div>
          <div class="item-value">
            <el-input v-model="overviewData.flightRoutes" placeholder="2879" :disabled="!isEditingOverview" />
          </div>
        </div>

        <div class="overview-item">
          <div class="item-label">
            <span class="required-label">客机数量</span>
          </div>
          <div class="item-value">
            <el-input v-model="overviewData.passengerPlanes" placeholder="3768" :disabled="!isEditingOverview" />
          </div>
        </div>

        <div class="overview-item">
          <div class="item-label">
            <span class="required-label">航司数量</span>
          </div>
          <div class="item-value">
            <el-input v-model="overviewData.airlines" placeholder="1972" :disabled="!isEditingOverview" />
          </div>
        </div>

        <div class="overview-item">
          <div class="item-label">
            <span class="required-label">货机数量</span>
          </div>
          <div class="item-value">
            <el-input v-model="overviewData.cargoPlanes" placeholder="2817" :disabled="!isEditingOverview" />
          </div>
        </div>

        <div class="overview-item">
          <div class="item-label">
            <span class="required-label">班列数量</span>
          </div>
          <div class="item-value">
            <el-input v-model="overviewData.trainRoutes" placeholder="2163" :disabled="!isEditingOverview" />
          </div>
        </div>

        <div class="overview-item">
          <div class="item-label">
            <span class="required-label">总进出口品类</span>
          </div>
          <div class="item-value">
            <el-input v-model="overviewData.totalCategories" placeholder="580" :disabled="!isEditingOverview" />
          </div>
        </div>

        <div class="overview-item">
          <div class="item-label">
            <span class="required-label">国际物流公司</span>
          </div>
          <div class="item-value">
            <el-input v-model="overviewData.logisticsCompanies" placeholder="96" :disabled="!isEditingOverview" />
          </div>
        </div>

        <div class="overview-item">
          <div class="item-label">
            <span class="required-label">近一年出口品类</span>
          </div>
          <div class="item-value">
            <el-input v-model="overviewData.yearExportCategories" placeholder="479" :disabled="!isEditingOverview" />
          </div>
        </div>

        <div class="overview-item">
          <div class="item-label">
            <span class="required-label">货代公司数量</span>
          </div>
          <div class="item-value">
            <el-input v-model="overviewData.freightForwarders" placeholder="88" :disabled="!isEditingOverview" />
          </div>
        </div>

        <div class="overview-item">
          <div class="item-label">
            <span class="required-label">进出口货源地</span>
          </div>
          <div class="item-value">
            <el-input v-model="overviewData.originDestinations" placeholder="210" :disabled="!isEditingOverview" />
          </div>
        </div>
      </div>

      <div v-if="isEditingOverview" class="form-actions">
        <el-button type="primary" :loading="buttonLoading" @click="submitOverview">保存</el-button>
        <el-button @click="cancelEditOverview">取消</el-button>
      </div>
    </el-card>

    <!-- 数据内容展示 -->
    <el-card shadow="never" class="mb-4">
      <template #header>
        <div class="section-header">
          <div class="header-title">
            <span class="title-bar"></span>
            <span class="title-text">数据内容展示</span>
            <span class="title-time">(最近更新时间: {{ contentUpdateTime }})</span>
          </div>
          <el-button link type="primary" @click="handleEditContent">
            <el-icon><Edit /></el-icon>
            编辑
          </el-button>
        </div>
      </template>

      <el-table :data="contentData" border>
        <el-table-column label="序号" type="index" width="80" align="center" />
        <el-table-column label="数据类别" prop="category" align="center">
          <template #default="scope">
            <el-input v-if="isEditingContent" v-model="scope.row.category" />
            <span v-else>{{ scope.row.category }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数据值" prop="value" align="center">
          <template #default="scope">
            <el-input v-if="isEditingContent" v-model="scope.row.value" />
            <span v-else>{{ scope.row.value }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="handleEditRow(scope.row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button link type="primary" @click="handleDeleteRow(scope.row)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="isEditingContent" class="table-actions">
        <el-button type="primary" plain icon="Plus" @click="addContentRow">新增行</el-button>
      </div>

      <pagination
        v-show="contentTotal > 0"
        :total="contentTotal"
        v-model:page="contentParams.pageNum"
        v-model:limit="contentParams.pageSize"
        @pagination="handleContentPagination"
      />

      <div v-if="isEditingContent" class="form-actions">
        <el-button type="primary" :loading="buttonLoading" @click="submitContent">保存</el-button>
        <el-button @click="cancelEditContent">取消</el-button>
      </div>
    </el-card>

    <!-- 航空货运统计 -->
    <el-card shadow="never" class="mb-4">
      <template #header>
        <div class="section-header">
          <div class="header-title">
            <span class="title-bar"></span>
            <span class="title-text">航空货运统计</span>
            <span class="title-time">(最近更新时间: {{ airCargoUpdateTime }})</span>
          </div>
          <el-button link type="primary" @click="handleEditAirCargo">
            <el-icon><Edit /></el-icon>
            编辑
          </el-button>
        </div>
      </template>

      <el-table :data="airCargoData" border>
        <el-table-column label="序号" type="index" width="80" align="center" />
        <el-table-column label="航空公司" prop="airline" align="center">
          <template #default="scope">
            <el-input v-if="isEditingAirCargo" v-model="scope.row.airline" />
            <span v-else>{{ scope.row.airline }}</span>
          </template>
        </el-table-column>
        <el-table-column label="航班数量" prop="flightCount" align="center">
          <template #default="scope">
            <el-input v-if="isEditingAirCargo" v-model="scope.row.flightCount" />
            <span v-else>{{ scope.row.flightCount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="投放体积（㎡）" prop="volume" align="center">
          <template #default="scope">
            <el-input v-if="isEditingAirCargo" v-model="scope.row.volume" />
            <span v-else>{{ scope.row.volume }}</span>
          </template>
        </el-table-column>
        <el-table-column label="投放重量（吨）" prop="weight" align="center">
          <template #default="scope">
            <el-input v-if="isEditingAirCargo" v-model="scope.row.weight" />
            <span v-else>{{ scope.row.weight }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="isEditingAirCargo" label="操作" align="center" width="100">
          <template #default="scope">
            <el-button link type="danger" @click="deleteAirCargoRow(scope.$index)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="isEditingAirCargo" class="table-actions">
        <el-button type="primary" plain icon="Plus" @click="addAirCargoRow">新增行</el-button>
      </div>

      <pagination
        v-show="airCargoTotal > 0"
        :total="airCargoTotal"
        v-model:page="airCargoParams.pageNum"
        v-model:limit="airCargoParams.pageSize"
        @pagination="handleAirCargoPagination"
      />

      <div v-if="isEditingAirCargo" class="form-actions">
        <el-button type="primary" :loading="buttonLoading" @click="submitAirCargo">保存</el-button>
        <el-button @click="cancelEditAirCargo">取消</el-button>
      </div>
    </el-card>

    <!-- 国际行列时刻表 -->
    <el-card shadow="never">
      <template #header>
        <div class="section-header">
          <div class="header-title">
            <span class="title-bar"></span>
            <span class="title-text">国际行列时刻表</span>
            <span class="title-time">(最近更新时间: {{ scheduleUpdateTime }})</span>
          </div>
          <div class="header-actions">
            <el-button link type="primary" @click="handleImportSchedule">
              <el-icon><Edit /></el-icon>
              导入
            </el-button>
            <el-button link type="primary" @click="handleAddSchedule">
              <el-icon><CirclePlus /></el-icon>
              新增
            </el-button>
          </div>
        </div>
      </template>

      <el-table :data="scheduleData" border>
        <el-table-column label="序号" type="index" width="80" align="center" />
        <el-table-column label="线路" prop="route" align="center" />
        <el-table-column label="始发站" prop="startStation" align="center" />
        <el-table-column label="终点站" prop="endStation" align="center" />
        <el-table-column label="途径站点" prop="viaStations" align="center" />
        <el-table-column label="运行时长（h）" prop="duration" align="center" />
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="handleEditSchedule(scope.row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button link type="primary" @click="handleViewSchedule(scope.row)">
              <el-icon><View /></el-icon>
              查看
            </el-button>
            <el-button link type="primary" @click="handleDeleteSchedule(scope.row)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="scheduleTotal > 0"
        :total="scheduleTotal"
        v-model:page="scheduleParams.pageNum"
        v-model:limit="scheduleParams.pageSize"
        @pagination="getScheduleList"
      />
    </el-card>

    <!-- 新增/编辑时刻表对话框 -->
    <el-dialog v-model="scheduleDialogVisible" :title="scheduleDialogTitle" width="600px" append-to-body>
      <el-form ref="scheduleFormRef" :model="scheduleForm" :rules="scheduleRules" label-width="120px">
        <el-form-item label="线路" prop="route">
          <el-input v-model="scheduleForm.route" placeholder="请输入线路" />
        </el-form-item>
        <el-form-item label="始发站" prop="startStation">
          <el-input v-model="scheduleForm.startStation" placeholder="请输入始发站" />
        </el-form-item>
        <el-form-item label="终点站" prop="endStation">
          <el-input v-model="scheduleForm.endStation" placeholder="请输入终点站" />
        </el-form-item>
        <el-form-item label="途径站点" prop="viaStations">
          <el-input v-model="scheduleForm.viaStations" placeholder="请输入途径站点" />
        </el-form-item>
        <el-form-item label="运行时长（h）" prop="duration">
          <el-input v-model="scheduleForm.duration" placeholder="请输入运行时长" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" :loading="buttonLoading" @click="submitSchedule">确 定</el-button>
          <el-button @click="scheduleDialogVisible = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 查看时刻表对话框 -->
    <el-dialog v-model="viewDialogVisible" title="查看时刻表详情" width="600px" append-to-body>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="线路">{{ viewScheduleData.route }}</el-descriptions-item>
        <el-descriptions-item label="始发站">{{ viewScheduleData.startStation }}</el-descriptions-item>
        <el-descriptions-item label="终点站">{{ viewScheduleData.endStation }}</el-descriptions-item>
        <el-descriptions-item label="途径站点">{{ viewScheduleData.viaStations }}</el-descriptions-item>
        <el-descriptions-item label="运行时长（h）">{{ viewScheduleData.duration }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="viewDialogVisible = false">关 闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="LogisticsMainlineIndexManagement" lang="ts">
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

// 数据总览
const isEditingOverview = ref(false);
const overviewUpdateTime = ref('2024-03-14 20:13:14');
const overviewData = ref({
  flightRoutes: '2879',
  passengerPlanes: '3768',
  airlines: '1972',
  cargoPlanes: '2817',
  trainRoutes: '2163',
  totalCategories: '580',
  logisticsCompanies: '96',
  yearExportCategories: '479',
  freightForwarders: '88',
  originDestinations: '210'
});
const originalOverviewData = ref({ ...overviewData.value });

// 数据内容展示
const isEditingContent = ref(false);
const contentUpdateTime = ref('2024-03-14 20:13:14');
const contentTotal = ref(0);
const contentParams = ref({
  pageNum: 1,
  pageSize: 10
});

const allContentData = ref([
  { category: '国际物流公司', value: 'XXXXXXX有限公司' },
  { category: '货代公司', value: 'XXXXXXX有限公司' },
  { category: '总主要品类', value: '贵重物品' },
  { category: '总主要品类', value: '茶叶' },
  { category: '进出口货源地', value: '俄罗斯·罗兹·蒂尔堡' }
]);

const contentData = ref<any[]>([]);
const originalContentData = ref<any[]>([]);

// 航空货运统计
const isEditingAirCargo = ref(false);
const airCargoUpdateTime = ref('2024-03-14 20:13:14');
const airCargoTotal = ref(0);
const airCargoParams = ref({
  pageNum: 1,
  pageSize: 10
});

const allAirCargoData = ref([
  { airline: '国际航空', flightCount: '400', volume: '250', weight: '250' },
  { airline: '东方航空', flightCount: '300', volume: '400', weight: '400' },
  { airline: '四川航空', flightCount: '400', volume: '350', weight: '350' },
  { airline: '南方航空', flightCount: '300', volume: '450', weight: '450' },
  { airline: '其他', flightCount: '400', volume: '300', weight: '300' }
]);

const airCargoData = ref<any[]>([]);
const originalAirCargoData = ref<any[]>([]);

// 国际行列时刻表
const scheduleUpdateTime = ref('2024-03-14 20:13:14');
const scheduleData = ref([
  {
    id: 1,
    route: '成都-罗兹·蒂尔堡',
    startStation: '成都',
    endStation: '罗兹·蒂尔堡',
    viaStations: '21',
    duration: '145'
  },
  {
    id: 2,
    route: '成都-罗兹·蒂尔堡',
    startStation: '成都',
    endStation: '罗兹·蒂尔堡',
    viaStations: '21',
    duration: '145'
  },
  {
    id: 3,
    route: '成都-罗兹·蒂尔堡',
    startStation: '成都',
    endStation: '罗兹·蒂尔堡',
    viaStations: '21',
    duration: '145'
  },
  {
    id: 4,
    route: '成都-罗兹·蒂尔堡',
    startStation: '成都',
    endStation: '罗兹·蒂尔堡',
    viaStations: '21',
    duration: '145'
  },
  {
    id: 5,
    route: '成都-罗兹·蒂尔堡',
    startStation: '成都',
    endStation: '罗兹·蒂尔堡',
    viaStations: '21',
    duration: '145'
  }
]);

const scheduleTotal = ref(400);
const scheduleParams = ref({
  pageNum: 1,
  pageSize: 10
});

const buttonLoading = ref(false);
const scheduleDialogVisible = ref(false);
const scheduleDialogTitle = ref('');
const scheduleFormRef = ref<ElFormInstance>();
const viewDialogVisible = ref(false);
const viewScheduleData = ref<any>({});

const scheduleForm = ref({
  id: undefined,
  route: '',
  startStation: '',
  endStation: '',
  viaStations: '',
  duration: ''
});

const scheduleRules = ref({
  route: [{ required: true, message: '请输入线路', trigger: 'blur' }],
  startStation: [{ required: true, message: '请输入始发站', trigger: 'blur' }],
  endStation: [{ required: true, message: '请输入终点站', trigger: 'blur' }],
  viaStations: [{ required: true, message: '请输入途径站点', trigger: 'blur' }],
  duration: [{ required: true, message: '请输入运行时长', trigger: 'blur' }]
});

/** 编辑数据总览 */
const handleEditOverview = () => {
  isEditingOverview.value = true;
};

/** 取消编辑数据总览 */
const cancelEditOverview = () => {
  overviewData.value = { ...originalOverviewData.value };
  isEditingOverview.value = false;
};

/** 提交数据总览 */
const submitOverview = async () => {
  buttonLoading.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    proxy?.$modal.msgSuccess('保存成功');
    originalOverviewData.value = { ...overviewData.value };
    isEditingOverview.value = false;
  } catch (error) {
    console.error('保存失败:', error);
  } finally {
    buttonLoading.value = false;
  }
};

/** 获取数据内容列表 */
const getContentList = () => {
  const start = (contentParams.value.pageNum - 1) * contentParams.value.pageSize;
  const end = start + contentParams.value.pageSize;
  contentData.value = allContentData.value.slice(start, end);
  originalContentData.value = JSON.parse(JSON.stringify(contentData.value));
  contentTotal.value = allContentData.value.length;
};

/** 分页变化处理 */
const handleContentPagination = () => {
  if (isEditingContent.value) {
    const start = (contentParams.value.pageNum - 1) * contentParams.value.pageSize;
    contentData.value.forEach((item, index) => {
      const globalIndex = start + index;
      if (globalIndex < allContentData.value.length) {
        allContentData.value[globalIndex] = { ...item };
      }
    });
  }
  getContentList();
};

/** 编辑数据内容 */
const handleEditContent = () => {
  isEditingContent.value = true;
};

/** 取消编辑数据内容 */
const cancelEditContent = () => {
  getContentList();
  isEditingContent.value = false;
};

/** 提交数据内容 */
const submitContent = async () => {
  buttonLoading.value = true;
  try {
    const start = (contentParams.value.pageNum - 1) * contentParams.value.pageSize;
    contentData.value.forEach((item, index) => {
      const globalIndex = start + index;
      if (globalIndex < allContentData.value.length) {
        allContentData.value[globalIndex] = { ...item };
      } else {
        allContentData.value.push({ ...item });
      }
    });

    await new Promise(resolve => setTimeout(resolve, 1000));
    proxy?.$modal.msgSuccess('保存成功');
    contentTotal.value = allContentData.value.length;
    originalContentData.value = JSON.parse(JSON.stringify(contentData.value));
    isEditingContent.value = false;
  } catch (error) {
    console.error('保存失败:', error);
  } finally {
    buttonLoading.value = false;
  }
};

/** 新增内容行 */
const addContentRow = () => {
  contentData.value.push({
    category: '',
    value: ''
  });
};

/** 编辑行 */
const handleEditRow = (row: any) => {
  proxy?.$modal.msgInfo('编辑行功能');
};

/** 删除行 */
const handleDeleteRow = async (row: any) => {
  try {
    await proxy?.$modal.confirm('是否确认删除该数据？');
    proxy?.$modal.msgSuccess('删除成功');
    getContentList();
  } catch {
    // 用户取消
  }
};

/** 获取航空货运列表 */
const getAirCargoList = () => {
  const start = (airCargoParams.value.pageNum - 1) * airCargoParams.value.pageSize;
  const end = start + airCargoParams.value.pageSize;
  airCargoData.value = allAirCargoData.value.slice(start, end);
  originalAirCargoData.value = JSON.parse(JSON.stringify(airCargoData.value));
  airCargoTotal.value = allAirCargoData.value.length;
};

/** 航空货运分页处理 */
const handleAirCargoPagination = () => {
  if (isEditingAirCargo.value) {
    const start = (airCargoParams.value.pageNum - 1) * airCargoParams.value.pageSize;
    airCargoData.value.forEach((item, index) => {
      const globalIndex = start + index;
      if (globalIndex < allAirCargoData.value.length) {
        allAirCargoData.value[globalIndex] = { ...item };
      }
    });
  }
  getAirCargoList();
};

/** 编辑航空货运 */
const handleEditAirCargo = () => {
  isEditingAirCargo.value = true;
};

/** 取消编辑航空货运 */
const cancelEditAirCargo = () => {
  getAirCargoList();
  isEditingAirCargo.value = false;
};

/** 提交航空货运 */
const submitAirCargo = async () => {
  buttonLoading.value = true;
  try {
    const start = (airCargoParams.value.pageNum - 1) * airCargoParams.value.pageSize;
    airCargoData.value.forEach((item, index) => {
      const globalIndex = start + index;
      if (globalIndex < allAirCargoData.value.length) {
        allAirCargoData.value[globalIndex] = { ...item };
      } else {
        allAirCargoData.value.push({ ...item });
      }
    });

    await new Promise(resolve => setTimeout(resolve, 1000));
    proxy?.$modal.msgSuccess('保存成功');
    airCargoTotal.value = allAirCargoData.value.length;
    originalAirCargoData.value = JSON.parse(JSON.stringify(airCargoData.value));
    isEditingAirCargo.value = false;
  } catch (error) {
    console.error('保存失败:', error);
  } finally {
    buttonLoading.value = false;
  }
};

/** 新增航空货运行 */
const addAirCargoRow = () => {
  airCargoData.value.push({
    airline: '',
    flightCount: '',
    volume: '',
    weight: ''
  });
};

/** 删除航空货运行 */
const deleteAirCargoRow = (index: number) => {
  const start = (airCargoParams.value.pageNum - 1) * airCargoParams.value.pageSize;
  const globalIndex = start + index;

  if (globalIndex < allAirCargoData.value.length) {
    allAirCargoData.value.splice(globalIndex, 1);
  }

  airCargoData.value.splice(index, 1);
  airCargoTotal.value = allAirCargoData.value.length;

  if (airCargoData.value.length === 0 && airCargoParams.value.pageNum > 1) {
    airCargoParams.value.pageNum--;
    getAirCargoList();
  }
};

/** 导入时刻表 */
const handleImportSchedule = () => {
  proxy?.$modal.msgInfo('导入功能');
};

/** 新增时刻表 */
const handleAddSchedule = () => {
  scheduleForm.value = {
    id: undefined,
    route: '',
    startStation: '',
    endStation: '',
    viaStations: '',
    duration: ''
  };
  scheduleDialogTitle.value = '新增时刻表';
  scheduleDialogVisible.value = true;
};

/** 编辑时刻表 */
const handleEditSchedule = (row: any) => {
  scheduleForm.value = { ...row };
  scheduleDialogTitle.value = '编辑时刻表';
  scheduleDialogVisible.value = true;
};

/** 查看时刻表 */
const handleViewSchedule = (row: any) => {
  viewScheduleData.value = { ...row };
  viewDialogVisible.value = true;
};

/** 删除时刻表 */
const handleDeleteSchedule = async (row: any) => {
  try {
    await proxy?.$modal.confirm('是否确认删除该时刻表信息？');
    proxy?.$modal.msgSuccess('删除成功');
    getScheduleList();
  } catch {
    // 用户取消
  }
};

/** 提交时刻表 */
const submitSchedule = () => {
  scheduleFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        proxy?.$modal.msgSuccess(scheduleForm.value.id ? '修改成功' : '新增成功');
        scheduleDialogVisible.value = false;
        getScheduleList();
      } catch (error) {
        console.error('保存失败:', error);
      } finally {
        buttonLoading.value = false;
      }
    }
  });
};

/** 获取时刻表列表 */
const getScheduleList = async () => {
  console.log('获取时刻表列表', scheduleParams.value);
};

onMounted(() => {
  getContentList();
  getAirCargoList();
  getScheduleList();
});
</script>

<style lang="scss" scoped>
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;

  .header-title {
    display: flex;
    align-items: center;
    gap: 8px;

    .title-bar {
      width: 4px;
      height: 20px;
      background-color: #409eff;
      border-radius: 2px;
    }

    .title-text {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }

    .title-time {
      font-size: 14px;
      color: #909399;
      font-weight: normal;
    }
  }

  .header-actions {
    display: flex;
    gap: 16px;
  }
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px 40px;
  padding: 10px 0;

  .overview-item {
    display: flex;
    align-items: center;
    gap: 16px;

    .item-label {
      flex-shrink: 0;
      width: 150px;
      text-align: right;
      font-weight: 500;
    }

    .item-value {
      flex: 1;

      :deep(.el-input) {
        max-width: 400px;
      }
    }
  }
}

.form-actions {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
  text-align: center;
}

.required-label {
  &::before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
}

:deep(.el-input.is-disabled .el-input__wrapper) {
  background-color: #f5f7fa;
  box-shadow: 0 0 0 1px #e4e7ed inset;
}

.mb-4 {
  margin-bottom: 16px;
}

.table-actions {
  margin-top: 16px;
  text-align: left;
}
</style>
