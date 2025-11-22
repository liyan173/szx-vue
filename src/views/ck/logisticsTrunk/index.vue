<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="始发地" prop="origin">
              <el-input v-model="queryParams.origin" placeholder="请输入始发地" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="目的地" prop="destination">
              <el-input v-model="queryParams.destination" placeholder="请输入目的地" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="最低收费(元)" prop="minFee">
              <el-input v-model="queryParams.minFee" placeholder="请输入最低收费(元)" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="单价(元/KG)" prop="pricePerKg">
              <el-input v-model="queryParams.pricePerKg" placeholder="请输入单价(元/KG)" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['ck:logisticsTrunk:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['ck:logisticsTrunk:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['ck:logisticsTrunk:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['ck:logisticsTrunk:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="logisticsTrunkList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键ID" align="center" prop="id" v-if="true" />
        <el-table-column label="始发地" align="center" prop="origin" />
        <el-table-column label="目的地" align="center" prop="destination" />
        <el-table-column label="最低收费(元)" align="center" prop="minFee" />
        <el-table-column label="单价(元/KG)" align="center" prop="pricePerKg" />
        <el-table-column label="备注信息" align="center" prop="remark" />
        <el-table-column label="操作" align="center" fixed="right"  class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['ck:logisticsTrunk:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['ck:logisticsTrunk:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改物流干线配送服务对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="logisticsTrunkFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="始发地" prop="origin">
          <el-input v-model="form.origin" placeholder="请输入始发地" />
        </el-form-item>
        <el-form-item label="目的地" prop="destination">
          <el-input v-model="form.destination" placeholder="请输入目的地" />
        </el-form-item>
        <el-form-item label="最低收费(元)" prop="minFee">
          <el-input v-model="form.minFee" placeholder="请输入最低收费(元)" />
        </el-form-item>
        <el-form-item label="单价(元/KG)" prop="pricePerKg">
          <el-input v-model="form.pricePerKg" placeholder="请输入单价(元/KG)" />
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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
import { listLogisticsTrunk, getLogisticsTrunk, delLogisticsTrunk, addLogisticsTrunk, updateLogisticsTrunk } from '@/api/ck/logisticsTrunk';
import { LogisticsTrunkVO, LogisticsTrunkQuery, LogisticsTrunkForm } from '@/api/ck/logisticsTrunk/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const logisticsTrunkList = ref<LogisticsTrunkVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

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
}
const data = reactive<PageData<LogisticsTrunkForm, LogisticsTrunkQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    origin: undefined,
    destination: undefined,
    minFee: undefined,
    pricePerKg: undefined,
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
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询物流干线配送服务列表 */
const getList = async () => {
  loading.value = true;
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
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加物流干线配送服务";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: LogisticsTrunkVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getLogisticsTrunk(_id);
  Object.assign(form.value, res.data);
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
