<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search-container mb-[10px]">
        <el-form ref="queryFormRef" :model="queryParams" :inline="true" class="search-form">
          <div class="search-row">
            <el-form-item label="提交日期" prop="submissionDate">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="始发地" prop="origin">
              <el-input v-model="queryParams.origin" placeholder="输入始发地" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="目的地" prop="destination">
              <el-input v-model="queryParams.destination" placeholder="输入目的地" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <div class="search-buttons">
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
              <el-button type="primary" icon="Search" @click="handleQuery">查询</el-button>
            </div>
          </div>
        </el-form>
      </div>
    </transition>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button plain icon="Plus" @click="handleAdd" v-hasPermi="['ck:logisticsTrunk:add']">新建</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button plain icon="Upload" @click="handleImport" v-hasPermi="['ck:logisticsTrunk:import']">批量导入</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-card shadow="never">
      <el-table v-loading="loading" :data="logisticsTrunkList" @selection-change="handleSelectionChange">
        <el-table-column label="序号" type="index" width="80" align="center" />
        <el-table-column label="始发地" align="center" prop="origin" />
        <el-table-column label="目的地" align="center" prop="destination" />
        <el-table-column label="最低收费(元)" align="center" prop="minFee" />
        <el-table-column label="单价(元/KG)" align="center" prop="pricePerKg" />
        <el-table-column label="提交时间" align="center" prop="createTime" />
        <el-table-column label="操作" align="center" fixed="right"  class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" @click="handleUpdate(scope.row)" v-hasPermi="['ck:logisticsTrunk:edit']">编辑</el-button>
            <el-button link type="primary" @click="handleDelete(scope.row)" v-hasPermi="['ck:logisticsTrunk:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改物流干线配送服务对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="600px" append-to-body>
      <el-form ref="logisticsTrunkFormRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="始发地" prop="origin" required>
          <div class="address-select">
            <el-select v-model="form.originProvince" placeholder="省" class="address-item">
              <el-option label="省" value=""></el-option>
            </el-select>
            <el-select v-model="form.originCity" placeholder="市" class="address-item">
              <el-option label="市" value=""></el-option>
            </el-select>
            <el-select v-model="form.originDistrict" placeholder="区" class="address-item">
              <el-option label="区" value=""></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="目的地" prop="destination" required>
          <div class="address-select">
            <el-select v-model="form.destProvince" placeholder="省" class="address-item">
              <el-option label="省" value=""></el-option>
            </el-select>
            <el-select v-model="form.destCity" placeholder="市" class="address-item">
              <el-option label="市" value=""></el-option>
            </el-select>
            <el-select v-model="form.destDistrict" placeholder="区" class="address-item">
              <el-option label="区" value=""></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="最低收费(元)" prop="minFee" required>
          <el-input v-model="form.minFee" placeholder="300.00" />
        </el-form-item>
        <el-form-item label="单价(元/KG)" prop="pricePerKg" required>
          <el-input v-model="form.pricePerKg" placeholder="0.99" />
        </el-form-item>
        <el-form-item label="备注信息" prop="remark" required>
            <el-input v-model="form.remark" type="textarea" placeholder="暂无" :rows="4" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="LogisticsTrunk" lang="ts">
import { listCompany } from '@/api/ck/company';
import { CompanyVO, CompanyQuery, CompanyForm } from '@/api/ck/company/types';
import { listLogisticsTrunk, getLogisticsTrunk, delLogisticsTrunk, addLogisticsTrunk, updateLogisticsTrunk } from '@/api/ck/logisticsTrunk';
import { LogisticsTrunkVO, LogisticsTrunkQuery, LogisticsTrunkForm } from '@/api/ck/logisticsTrunk/types';

const { proxy, nextTick } = getCurrentInstance() as ComponentInternalInstance;

const logisticsTrunkList = ref<LogisticsTrunkVO[]>([]);
const companyList = ref<CompanyVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const dateRange = ref<[DateModelType, DateModelType]>(['', '']);

const queryFormRef = ref<ElFormInstance>();
const logisticsTrunkFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: LogisticsTrunkForm = {
  id: undefined,
  origin: undefined,
  destination: undefined,
  minFee: undefined,
  pricePerKg: undefined,
  remark: undefined,
  companyId: undefined,
  originProvince: undefined,
  originCity: undefined,
  originDistrict: undefined,
  destProvince: undefined,
  destCity: undefined,
  destDistrict: undefined,
}

const data = reactive<PageData<LogisticsTrunkForm, LogisticsTrunkQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    origin: undefined,
    destination: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "主键ID不能为空", trigger: "blur" }
    ],
    origin: [
      { required: true, message: "始发地不能为空", trigger: "blur" }
    ],
    destination: [
      { required: true, message: "目的地不能为空", trigger: "blur" }
    ],
    pricePerKg: [
      { required: true, message: "单价(元/KG)不能为空", trigger: "blur" }
    ],
    // 恢复companyId的必填验证
    companyId: [
      { required: true, message: "请选择所属企业", trigger: "change" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询企业信息列表 */
const getCompanyList = async () => {
  const res = await listCompany({ pageNum: 1, pageSize: 9999 });
  companyList.value = res.rows;
}

/** 查询物流干线配送服务列表 */
const getList = async () => {
  loading.value = true;
  proxy?.addDateRange(queryParams.value, dateRange.value, 'CreateTime');
  const res = await listLogisticsTrunk(queryParams.value);
  logisticsTrunkList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  logisticsTrunkFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  dateRange.value = ['', ''];
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: LogisticsTrunkVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = async () => {
  reset();
  await getCompanyList();
  dialog.visible = true;
  dialog.title = "添加物流干线配送服务";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: LogisticsTrunkVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getLogisticsTrunk(_id);
  await getCompanyList();
  
  // 确保所有ID都是字符串类型，以保证与el-option的value类型匹配
  if (res.data) {
    const data = { ...res.data };
    if (data.companyId !== undefined && data.companyId !== null) {
      data.companyId = String(data.companyId);
    }
    Object.assign(form.value, data);
  }
  
  dialog.visible = true;
  dialog.title = "修改物流干线配送服务";
}

/** 提交按钮 */
const submitForm = () => {
  logisticsTrunkFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateLogisticsTrunk(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addLogisticsTrunk(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: LogisticsTrunkVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除物流干线配送服务编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delLogisticsTrunk(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 批量导入操作 */
const handleImport = () => {
  proxy?.$modal.msgWarning("批量导入功能待开发");
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('ck/logisticsTrunk/export', {
    ...queryParams.value
  }, `logisticsTrunk_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>

<style lang="scss" scoped>
.search-container {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 5px;
}

.search-form {
  .search-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;

    .el-form-item {
      margin-bottom: 0;
      margin-right: 20px;
    }

    .search-buttons {
      margin-left: auto;

      .el-button {
        margin-left: 10px;
      }
    }
  }
}

:deep(.el-table__header-wrapper th) {
    background-color: #f8f9fa;
}

.address-select {
  display: flex;
  gap: 10px;
  width: 100%;

  .address-item {
    flex: 1;
  }
}
</style>
