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
            <span class="required-label">城配企业数</span>
          </div>
          <div class="item-value">
            <el-input v-model="overviewData.companyCount" placeholder="37" :disabled="!isEditingOverview" />
          </div>
        </div>

        <div class="overview-item">
          <div class="item-label">
            <span class="required-label">配送车辆数</span>
          </div>
          <div class="item-value">
            <el-input v-model="overviewData.vehicleCount" placeholder="64" :disabled="!isEditingOverview" />
          </div>
        </div>

        <div class="overview-item">
          <div class="item-label">
            <span class="required-label">配送中心数</span>
          </div>
          <div class="item-value">
            <el-input v-model="overviewData.centerCount" placeholder="48" :disabled="!isEditingOverview" />
          </div>
        </div>

        <div class="overview-item">
          <div class="item-label">
            <span class="required-label">城配覆盖区域（%）</span>
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

    <!-- 企业分布 -->
    <el-card shadow="never">
      <template #header>
        <div class="section-header">
          <div class="header-title">
            <span class="title-bar"></span>
            <span class="title-text">企业分布</span>
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
        <el-table-column label="企业性质" prop="companyType" align="center" />
        <el-table-column label="业务类型" prop="businessType" align="center" />
        <el-table-column label="企业规模" prop="companyScale" align="center" />
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

    <!-- 新增/编辑企业分布对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px" append-to-body>
      <el-form ref="distributionFormRef" :model="distributionForm" :rules="distributionRules" label-width="150px">
        <el-form-item label="企业名称" prop="companyName">
          <el-input v-model="distributionForm.companyName" placeholder="请输入企业名称" />
        </el-form-item>
        <el-form-item label="统一社会信用代码" prop="creditCode">
          <el-input v-model="distributionForm.creditCode" placeholder="请输入统一社会信用代码" />
        </el-form-item>
        <el-form-item label="企业性质" prop="companyType">
          <el-select v-model="distributionForm.companyType" placeholder="请选择企业性质" class="w-full">
            <el-option label="民营" value="民营" />
            <el-option label="国营" value="国营" />
            <el-option label="外资" value="外资" />
            <el-option label="合资" value="合资" />
          </el-select>
        </el-form-item>
        <el-form-item label="业务类型" prop="businessType">
          <el-select v-model="distributionForm.businessType" placeholder="请选择业务类型" class="w-full">
            <el-option label="运输型" value="运输型" />
            <el-option label="仓储型" value="仓储型" />
            <el-option label="综合型" value="综合型" />
          </el-select>
        </el-form-item>
        <el-form-item label="企业规模" prop="companyScale">
          <el-select v-model="distributionForm.companyScale" placeholder="请选择企业规模" class="w-full">
            <el-option label="大型" value="大型" />
            <el-option label="中型" value="中型" />
            <el-option label="小型" value="小型" />
          </el-select>
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

<script setup name="UrbanDistributionIndexManagement" lang="ts">
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const buttonLoading = ref(false);

// 数据总览
const isEditingOverview = ref(false);
const overviewUpdateTime = ref('2024-03-14 20:13:14');
const overviewData = ref({
  companyCount: '37',
  vehicleCount: '64',
  centerCount: '48',
  coverageRate: '52'
});
const originalOverviewData = ref({ ...overviewData.value });

// 企业分布
const distributionUpdateTime = ref('2024-03-14 20:13:14');
const distributionData = ref([
  {
    id: 1,
    companyName: 'XXXXX有限公司',
    creditCode: '9510YGFTMNBGI986',
    companyType: '民营',
    businessType: '运输型',
    companyScale: '中型'
  },
  {
    id: 2,
    companyName: 'XXXXX有限公司',
    creditCode: '9510YGFTMNBGI986',
    companyType: '民营',
    businessType: '运输型',
    companyScale: '中型'
  },
  {
    id: 3,
    companyName: 'XXXXX有限公司',
    creditCode: '9510YGFTMNBGI986',
    companyType: '民营',
    businessType: '运输型',
    companyScale: '中型'
  },
  {
    id: 4,
    companyName: 'XXXXX有限公司',
    creditCode: '9510YGFTMNBGI986',
    companyType: '民营',
    businessType: '运输型',
    companyScale: '中型'
  },
  {
    id: 5,
    companyName: 'XXXXX有限公司',
    creditCode: '9510YGFTMNBGI986',
    companyType: '民营',
    businessType: '运输型',
    companyScale: '中型'
  }
]);

const total = ref(400);
const queryParams = ref({
  pageNum: 1,
  pageSize: 10
});

const dialogVisible = ref(false);
const dialogTitle = ref('');
const distributionFormRef = ref<ElFormInstance>();

const distributionForm = ref({
  id: undefined,
  companyName: '',
  creditCode: '',
  companyType: '',
  businessType: '',
  companyScale: ''
});

const distributionRules = ref({
  companyName: [
    { required: true, message: '请输入企业名称', trigger: 'blur' }
  ],
  creditCode: [
    { required: true, message: '请输入统一社会信用代码', trigger: 'blur' }
  ],
  companyType: [
    { required: true, message: '请选择企业性质', trigger: 'change' }
  ],
  businessType: [
    { required: true, message: '请选择业务类型', trigger: 'change' }
  ],
  companyScale: [
    { required: true, message: '请选择企业规模', trigger: 'change' }
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
    companyType: '',
    businessType: '',
    companyScale: ''
  };
  dialogTitle.value = '新增企业分布';
  dialogVisible.value = true;
};

/** 编辑 */
const handleEdit = (row: any) => {
  distributionForm.value = { ...row };
  dialogTitle.value = '编辑企业分布';
  dialogVisible.value = true;
};

/** 删除 */
const handleDelete = async (row: any) => {
  try {
    await proxy?.$modal.confirm('是否确认删除该企业分布信息？');
    proxy?.$modal.msgSuccess('删除成功');
    getDistributionList();
  } catch {
    // 用户取消删除
  }
};

/** 提交企业分布表单 */
const submitDistribution = () => {
  distributionFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      try {
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

/** 获取企业分布列表 */
const getDistributionList = async () => {
  console.log('获取企业分布列表', queryParams.value);
};

onMounted(() => {
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

.w-full {
  width: 100%;
}
</style>
