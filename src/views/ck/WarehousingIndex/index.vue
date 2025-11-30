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
            <span class="required-label">仓储企业数量</span>
          </div>
          <div class="item-value">
            <el-input v-model="overviewData.companyCount" placeholder="3723" :disabled="!isEditingOverview" />
          </div>
        </div>

        <div class="overview-item">
          <div class="item-label">
            <span class="required-label">仓储总面积（㎡）</span>
          </div>
          <div class="item-value">
            <el-input v-model="overviewData.totalArea" placeholder="40000" :disabled="!isEditingOverview" />
          </div>
        </div>

        <div class="overview-item">
          <div class="item-label">
            <span class="required-label">仓储中心数量</span>
          </div>
          <div class="item-value">
            <el-input v-model="overviewData.centerCount" placeholder="1180" :disabled="!isEditingOverview" />
          </div>
        </div>

        <div class="overview-item">
          <div class="item-label">
            <span class="required-label">仓储覆盖面积（%）</span>
          </div>
          <div class="item-value">
            <el-input v-model="overviewData.coverageRate" placeholder="52" :disabled="!isEditingOverview" />
          </div>
        </div>
      </div>

      <div v-if="isEditingOverview" class="form-actions">
        <el-button type="primary" :loading="buttonLoading" @click="submitOverview">保存</el-button>
        <el-button @click="cancelEditOverview">取消</el-button>
      </div>
    </el-card>

    <!-- 数据统计 -->
    <el-card shadow="never" class="mb-4">
      <template #header>
        <div class="section-header">
          <div class="header-title">
            <span class="title-bar"></span>
            <span class="title-text">数据统计</span>
            <span class="title-time">(最近更新时间: {{ statisticsUpdateTime }})</span>
          </div>
          <el-button link type="primary" @click="handleEditStatistics">
            <el-icon><Edit /></el-icon>
            编辑
          </el-button>
        </div>
      </template>

      <el-table :data="statisticsData" border>
        <el-table-column label="序号" type="index" width="80" align="center" />
        <el-table-column label="统计类别" prop="category" align="center">
          <template #default="scope">
            <el-input v-if="isEditingStatistics" v-model="scope.row.category" />
            <span v-else>{{ scope.row.category }}</span>
          </template>
        </el-table-column>
        <el-table-column label="统计项" prop="item" align="center">
          <template #default="scope">
            <el-input v-if="isEditingStatistics" v-model="scope.row.item" />
            <span v-else>{{ scope.row.item }}</span>
          </template>
        </el-table-column>
        <el-table-column label="仓库总面积（㎡）" prop="totalArea" align="center">
          <template #default="scope">
            <el-input v-if="isEditingStatistics" v-model="scope.row.totalArea" />
            <span v-else>{{ scope.row.totalArea }}</span>
          </template>
        </el-table-column>
        <el-table-column label="平均出租价格（元/m²·日）" prop="avgPrice" align="center">
          <template #default="scope">
            <el-input v-if="isEditingStatistics" v-model="scope.row.avgPrice" />
            <span v-else>{{ scope.row.avgPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="isEditingStatistics" label="操作" align="center" width="100">
          <template #default="scope">
            <el-button link type="danger" @click="deleteStatisticsRow(scope.$index)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="isEditingStatistics" class="table-actions">
        <el-button type="primary" plain icon="Plus" @click="addStatisticsRow">新增行</el-button>
      </div>

      <pagination
        v-show="statisticsTotal > 0"
        :total="statisticsTotal"
        v-model:page="statisticsParams.pageNum"
        v-model:limit="statisticsParams.pageSize"
        @pagination="handleStatisticsPagination"
      />

      <div v-if="isEditingStatistics" class="form-actions">
        <el-button type="primary" :loading="buttonLoading" @click="submitStatistics">保存</el-button>
        <el-button @click="cancelEditStatistics">取消</el-button>
      </div>
    </el-card>

    <!-- 仓储分布 -->
    <el-card shadow="never">
      <template #header>
        <div class="section-header">
          <div class="header-title">
            <span class="title-bar"></span>
            <span class="title-text">仓储分布</span>
            <span class="title-time">(最近更新时间: {{ distributionUpdateTime }})</span>
          </div>
          <div class="header-actions">
            <el-button link type="primary" @click="handleImport">
              <el-icon><Edit /></el-icon>
              导入
            </el-button>
            <el-button link type="primary" @click="handleAdd">
              <el-icon><CirclePlus /></el-icon>
              新增
            </el-button>
          </div>
        </div>
      </template>

      <el-table :data="distributionData" border>
        <el-table-column label="序号" type="index" width="80" align="center" />
        <el-table-column label="企业名称" prop="companyName" align="center" />
        <el-table-column label="统一社会信用代码" prop="creditCode" align="center" />
        <el-table-column label="仓库所属区域" prop="areaName" align="center" />
        <el-table-column label="详细地址" prop="address" align="center" />
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="handleEdit(scope.row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button link type="primary" @click="handleDelete(scope.row)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getDistributionList"
      />
    </el-card>

    <!-- 新增/编辑仓储分布对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px" append-to-body>
      <el-form ref="distributionFormRef" :model="distributionForm" :rules="distributionRules" label-width="150px">
        <el-form-item label="企业名称" prop="companyName">
          <el-input v-model="distributionForm.companyName" placeholder="请输入企业名称" />
        </el-form-item>
        <el-form-item label="统一社会信用代码" prop="creditCode">
          <el-input v-model="distributionForm.creditCode" placeholder="请输入统一社会信用代码" />
        </el-form-item>
        <el-form-item label="仓库所属区域" prop="areaName">
          <el-input v-model="distributionForm.areaName" placeholder="请输入仓库所属区域" />
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="distributionForm.address" placeholder="请输入详细地址" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" :loading="buttonLoading" @click="submitDistribution">确 定</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="WarehousingIndex" lang="ts">
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

// 数据总览
const isEditingOverview = ref(false);
const overviewUpdateTime = ref('2024-03-14 20:13:14');
const overviewData = ref({
  companyCount: '3723',
  totalArea: '40000',
  centerCount: '1180',
  coverageRate: '52'
});
const originalOverviewData = ref({ ...overviewData.value });

// 数据统计
const isEditingStatistics = ref(false);
const statisticsUpdateTime = ref('2024-03-14 20:13:14');
const statisticsTotal = ref(0);
const statisticsParams = ref({
  pageNum: 1,
  pageSize: 10
});

// 完整的数据统计数据（模拟所有数据）
const allStatisticsData = ref([
  {
    category: '仓库类别',
    item: '单层仓库',
    totalArea: '30,000',
    avgPrice: '25'
  },
  {
    category: '仓库类别',
    item: '立体仓库',
    totalArea: '30,000',
    avgPrice: '40'
  },
  {
    category: '区域',
    item: '锦江区',
    totalArea: '30,000',
    avgPrice: '25'
  },
  {
    category: '区域',
    item: '成华区',
    totalArea: '30,000',
    avgPrice: '40'
  },
  {
    category: '区域',
    item: '高新区',
    totalArea: '30,000',
    avgPrice: '25'
  },
  {
    category: '区域',
    item: '武侯区',
    totalArea: '28,000',
    avgPrice: '30'
  },
  {
    category: '区域',
    item: '青羊区',
    totalArea: '25,000',
    avgPrice: '28'
  },
  {
    category: '仓库类别',
    item: '冷链仓库',
    totalArea: '20,000',
    avgPrice: '50'
  },
  {
    category: '仓库类别',
    item: '恒温仓库',
    totalArea: '22,000',
    avgPrice: '45'
  },
  {
    category: '区域',
    item: '双流区',
    totalArea: '35,000',
    avgPrice: '22'
  },
  {
    category: '区域',
    item: '龙泉驿区',
    totalArea: '32,000',
    avgPrice: '20'
  },
  {
    category: '仓库类别',
    item: '普通仓库',
    totalArea: '40,000',
    avgPrice: '18'
  }
]);

// 当前页显示的数据
const statisticsData = ref<any[]>([]);
const originalStatisticsData = ref<any[]>([]);

// 仓储分布
const distributionUpdateTime = ref('2024-03-14 20:13:14');
const distributionData = ref([
  {
    id: 1,
    companyName: 'XXXX科技股份有限公司',
    creditCode: '9510YGFTMNBGI986',
    areaName: '成都市金牛区',
    address: 'XXXX街道XXXX号'
  },
  {
    id: 2,
    companyName: 'XXXX科技股份有限公司',
    creditCode: '9510YGFTMNBGI986',
    areaName: '成都市金牛区',
    address: 'XXXX街道XXXX号'
  },
  {
    id: 3,
    companyName: 'XXXX科技股份有限公司',
    creditCode: '9510YGFTMNBGI986',
    areaName: '成都市金牛区',
    address: 'XXXX街道XXXX号'
  },
  {
    id: 4,
    companyName: 'XXXX科技股份有限公司',
    creditCode: '9510YGFTMNBGI986',
    areaName: '成都市金牛区',
    address: 'XXXX街道XXXX号'
  },
  {
    id: 5,
    companyName: 'XXXX科技股份有限公司',
    creditCode: '9510YGFTMNBGI986',
    areaName: '成都市金牛区',
    address: 'XXXX街道XXXX号'
  }
]);

const total = ref(400);
const queryParams = ref({
  pageNum: 1,
  pageSize: 10
});

const buttonLoading = ref(false);
const dialogVisible = ref(false);
const dialogTitle = ref('');
const distributionFormRef = ref<ElFormInstance>();

const distributionForm = ref({
  id: undefined,
  companyName: '',
  creditCode: '',
  areaName: '',
  address: ''
});

const distributionRules = ref({
  companyName: [
    { required: true, message: '请输入企业名称', trigger: 'blur' }
  ],
  creditCode: [
    { required: true, message: '请输入统一社会信用代码', trigger: 'blur' }
  ],
  areaName: [
    { required: true, message: '请输入仓库所属区域', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请输入详细地址', trigger: 'blur' }
  ]
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
    // TODO: 调用API保存数据
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

/** 获取数据统计列表 */
const getStatisticsList = () => {
  // 计算分页
  const start = (statisticsParams.value.pageNum - 1) * statisticsParams.value.pageSize;
  const end = start + statisticsParams.value.pageSize;

  // 获取当前页数据
  statisticsData.value = allStatisticsData.value.slice(start, end);
  originalStatisticsData.value = JSON.parse(JSON.stringify(statisticsData.value));
  statisticsTotal.value = allStatisticsData.value.length;
};

/** 分页变化处理 */
const handleStatisticsPagination = () => {
  if (isEditingStatistics.value) {
    // 如果正在编辑，需要先保存当前页的修改到 allStatisticsData
    const start = (statisticsParams.value.pageNum - 1) * statisticsParams.value.pageSize;
    statisticsData.value.forEach((item, index) => {
      const globalIndex = start + index;
      if (globalIndex < allStatisticsData.value.length) {
        allStatisticsData.value[globalIndex] = { ...item };
      }
    });
  }
  getStatisticsList();
};

/** 编辑数据统计 */
const handleEditStatistics = () => {
  isEditingStatistics.value = true;
};

/** 取消编辑数据统计 */
const cancelEditStatistics = () => {
  // 重新加载当前页数据
  getStatisticsList();
  isEditingStatistics.value = false;
};

/** 提交数据统计 */
const submitStatistics = async () => {
  buttonLoading.value = true;
  try {
    // 保存当前页的修改到 allStatisticsData
    const start = (statisticsParams.value.pageNum - 1) * statisticsParams.value.pageSize;
    statisticsData.value.forEach((item, index) => {
      const globalIndex = start + index;
      if (globalIndex < allStatisticsData.value.length) {
        allStatisticsData.value[globalIndex] = { ...item };
      } else {
        // 新增的数据
        allStatisticsData.value.push({ ...item });
      }
    });

    // TODO: 调用API保存数据
    await new Promise(resolve => setTimeout(resolve, 1000));
    proxy?.$modal.msgSuccess('保存成功');

    // 更新总数和当前页数据
    statisticsTotal.value = allStatisticsData.value.length;
    originalStatisticsData.value = JSON.parse(JSON.stringify(statisticsData.value));
    isEditingStatistics.value = false;
  } catch (error) {
    console.error('保存失败:', error);
  } finally {
    buttonLoading.value = false;
  }
};

/** 新增统计行 */
const addStatisticsRow = () => {
  statisticsData.value.push({
    category: '',
    item: '',
    totalArea: '',
    avgPrice: ''
  });
};

/** 删除统计行 */
const deleteStatisticsRow = (index: number) => {
  const start = (statisticsParams.value.pageNum - 1) * statisticsParams.value.pageSize;
  const globalIndex = start + index;

  // 从 allStatisticsData 中删除
  if (globalIndex < allStatisticsData.value.length) {
    allStatisticsData.value.splice(globalIndex, 1);
  }

  // 从当前页数据中删除
  statisticsData.value.splice(index, 1);

  // 更新总数
  statisticsTotal.value = allStatisticsData.value.length;

  // 如果当前页没有数据了，且不是第一页，则跳转到上一页
  if (statisticsData.value.length === 0 && statisticsParams.value.pageNum > 1) {
    statisticsParams.value.pageNum--;
    getStatisticsList();
  }
};

/** 导入 */
const handleImport = () => {
  proxy?.$modal.msgInfo('导入功能');
};

/** 新增 */
const handleAdd = () => {
  distributionForm.value = {
    id: undefined,
    companyName: '',
    creditCode: '',
    areaName: '',
    address: ''
  };
  dialogTitle.value = '新增仓储分布';
  dialogVisible.value = true;
};

/** 编辑 */
const handleEdit = (row: any) => {
  distributionForm.value = { ...row };
  dialogTitle.value = '编辑仓储分布';
  dialogVisible.value = true;
};

/** 删除 */
const handleDelete = async (row: any) => {
  try {
    await proxy?.$modal.confirm('是否确认删除该仓储分布信息？');
    proxy?.$modal.msgSuccess('删除成功');
    getDistributionList();
  } catch {
    // 用户取消删除
  }
};

/** 提交仓储分布表单 */
const submitDistribution = () => {
  distributionFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      try {
        // TODO: 调用API保存数据
        await new Promise(resolve => setTimeout(resolve, 1000));
        proxy?.$modal.msgSuccess(distributionForm.value.id ? '修改成功' : '新增成功');
        dialogVisible.value = false;
        getDistributionList();
      } catch (error) {
        console.error('保存失败:', error);
      } finally {
        buttonLoading.value = false;
      }
    }
  });
};

/** 获取仓储分布列表 */
const getDistributionList = async () => {
  // TODO: 调用API获取数据
  console.log('获取仓储分布列表', queryParams.value);
};

onMounted(() => {
  getStatisticsList();
  getDistributionList();
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
      width: 180px;
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
