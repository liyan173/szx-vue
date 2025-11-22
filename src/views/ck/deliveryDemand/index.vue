<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="专人服务(元/人/次)" prop="personalServiceFee">
              <el-input v-model="queryParams.personalServiceFee" placeholder="请输入专人服务(元/人/次)" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="送货上楼(元/人/次)" prop="upstairsFee">
              <el-input v-model="queryParams.upstairsFee" placeholder="请输入送货上楼(元/人/次)" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="贴标(是/否)" prop="labeling">
              <el-input v-model="queryParams.labeling" placeholder="请输入贴标(是/否)" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="卸货(是/否)" prop="unloading">
              <el-input v-model="queryParams.unloading" placeholder="请输入卸货(是/否)" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="拆箱/换拖(是/否)" prop="unpacking">
              <el-input v-model="queryParams.unpacking" placeholder="请输入拆箱/换拖(是/否)" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['ck:deliveryDemand:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['ck:deliveryDemand:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['ck:deliveryDemand:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['ck:deliveryDemand:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="deliveryDemandList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键ID" align="center" prop="id" v-if="true" />
        <el-table-column label="专人服务(元/人/次)" align="center" prop="personalServiceFee" />
        <el-table-column label="送货上楼(元/人/次)" align="center" prop="upstairsFee" />
        <el-table-column label="贴标(是/否)" align="center" prop="labeling" />
        <el-table-column label="卸货(是/否)" align="center" prop="unloading" />
        <el-table-column label="拆箱/换拖(是/否)" align="center" prop="unpacking" />
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="操作" align="center" fixed="right"  class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['ck:deliveryDemand:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['ck:deliveryDemand:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改货物配送需求对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="deliveryDemandFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="专人服务(元/人/次)" prop="personalServiceFee">
          <el-input v-model="form.personalServiceFee" placeholder="请输入专人服务(元/人/次)" />
        </el-form-item>
        <el-form-item label="送货上楼(元/人/次)" prop="upstairsFee">
          <el-input v-model="form.upstairsFee" placeholder="请输入送货上楼(元/人/次)" />
        </el-form-item>
        <el-form-item label="贴标(是/否)" prop="labeling">
          <el-input v-model="form.labeling" placeholder="请输入贴标(是/否)" />
        </el-form-item>
        <el-form-item label="卸货(是/否)" prop="unloading">
          <el-input v-model="form.unloading" placeholder="请输入卸货(是/否)" />
        </el-form-item>
        <el-form-item label="拆箱/换拖(是/否)" prop="unpacking">
          <el-input v-model="form.unpacking" placeholder="请输入拆箱/换拖(是/否)" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
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

<script setup name="DeliveryDemand" lang="ts">
import { listDeliveryDemand, getDeliveryDemand, delDeliveryDemand, addDeliveryDemand, updateDeliveryDemand } from '@/api/ck/deliveryDemand';
import { DeliveryDemandVO, DeliveryDemandQuery, DeliveryDemandForm } from '@/api/ck/deliveryDemand/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const deliveryDemandList = ref<DeliveryDemandVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const deliveryDemandFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: DeliveryDemandForm = {
  id: undefined,
  personalServiceFee: undefined,
  upstairsFee: undefined,
  labeling: undefined,
  unloading: undefined,
  unpacking: undefined,
  remark: undefined,
}
const data = reactive<PageData<DeliveryDemandForm, DeliveryDemandQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    personalServiceFee: undefined,
    upstairsFee: undefined,
    labeling: undefined,
    unloading: undefined,
    unpacking: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "主键ID不能为空", trigger: "blur" }
    ],
    upstairsFee: [
      { required: true, message: "送货上楼(元/人/次)不能为空", trigger: "blur" }
    ],
    labeling: [
      { required: true, message: "贴标(是/否)不能为空", trigger: "blur" }
    ],
    unloading: [
      { required: true, message: "卸货(是/否)不能为空", trigger: "blur" }
    ],
    unpacking: [
      { required: true, message: "拆箱/换拖(是/否)不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询货物配送需求列表 */
const getList = async () => {
  loading.value = true;
  const res = await listDeliveryDemand(queryParams.value);
  deliveryDemandList.value = res.rows;
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
  deliveryDemandFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: DeliveryDemandVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加货物配送需求";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: DeliveryDemandVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getDeliveryDemand(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改货物配送需求";
}

/** 提交按钮 */
const submitForm = () => {
  deliveryDemandFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateDeliveryDemand(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addDeliveryDemand(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: DeliveryDemandVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除货物配送需求编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delDeliveryDemand(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('ck/deliveryDemand/export', {
    ...queryParams.value
  }, `deliveryDemand_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
