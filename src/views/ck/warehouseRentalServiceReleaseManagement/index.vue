<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="企业名称" prop="companyName">
              <el-input v-model="queryParams.companyName" placeholder="请输入企业名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="审核状态" prop="authenticationState">
              <el-select v-model="queryParams.authenticationState" placeholder="请选择审核状态" clearable>
                <el-option
                  v-for="dict in authentication_state_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
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
<!--        <el-row :gutter="10" class="mb8">-->
<!--          <el-col :span="1.5">-->
<!--            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['ck:warehouseRentApply:add']">新增</el-button>-->
<!--          </el-col>-->
<!--          <el-col :span="1.5">-->
<!--            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['ck:warehouseRentApply:edit']">修改</el-button>-->
<!--          </el-col>-->
<!--          <el-col :span="1.5">-->
<!--            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['ck:warehouseRentApply:remove']">删除</el-button>-->
<!--          </el-col>-->
<!--          <el-col :span="1.5">-->
<!--            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['ck:warehouseRentApply:export']">导出</el-button>-->
<!--          </el-col>-->
<!--          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>-->
<!--        </el-row>-->
      </template>

      <el-table v-loading="loading" border :data="warehouseRentApplyList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键ID" align="center" prop="id" v-if="true" />
        <el-table-column label="申请标题" align="center" prop="title" />
        <el-table-column label="企业名称" align="center" prop="companyName" />
        <el-table-column label="可租面积(㎡)" align="center" prop="rentableArea" />
        <el-table-column label="起租面积(㎡)" align="center" prop="minRentArea" />
        <el-table-column label="价格(元/㎡·月)" align="center" prop="price" />
        <el-table-column label="物业单价(元/㎡·月)" align="center" prop="propertyPrice" />
        <el-table-column label="自动下架日期" align="center" prop="autoOffDate" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.autoOffDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系人" align="center" prop="contactPerson" />
        <el-table-column label="联系电话" align="center" prop="contactPhone" />
        <el-table-column label="信息描述" align="center" prop="infoDesc" />
        <el-table-column label="审核状态" align="center" prop="authenticationState">
          <template #default="scope">
            <dict-tag :options="authentication_state_type" :value="scope.row.authenticationState"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right"  class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['ck:warehouseRentApply:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['ck:warehouseRentApply:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改仓库出租服务申请对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="warehouseRentApplyFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属企业" prop="companyId">
          <el-select v-model="form.companyId" placeholder="请选择所属企业" filterable>
            <el-option
                v-for="company in companyList"
                :key="company.id"
                :label="company.companyName"
                :value="company.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入申请标题" />
        </el-form-item>
        <el-form-item label="可租面积(㎡)" prop="rentableArea">
          <el-input v-model="form.rentableArea" placeholder="请输入可租面积(㎡)" />
        </el-form-item>
        <el-form-item label="起租面积(㎡)" prop="minRentArea">
          <el-input v-model="form.minRentArea" placeholder="请输入起租面积(㎡)" />
        </el-form-item>
        <el-form-item label="价格(元/㎡·月)" prop="price">
          <el-input v-model="form.price" placeholder="请输入价格(元/㎡·月)" />
        </el-form-item>
        <el-form-item label="物业单价(元/㎡·月)" prop="propertyPrice">
          <el-input v-model="form.propertyPrice" placeholder="请输入物业单价(元/㎡·月)" />
        </el-form-item>
        <el-form-item label="自动下架日期" prop="autoOffDate">
          <el-date-picker clearable
            v-model="form.autoOffDate"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择自动下架日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="联系人" prop="contactPerson">
          <el-input v-model="form.contactPerson" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="contactPhone">
          <el-input v-model="form.contactPhone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="信息描述" prop="infoDesc">
            <el-input v-model="form.infoDesc" type="textarea" placeholder="请输入内容" />
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

<script setup name="WarehouseRentApply" lang="ts">
import { listCompany } from '@/api/ck/company';
import { CompanyVO, CompanyQuery, CompanyForm } from '@/api/ck/company/types';
import { listWarehouseRentApply, getWarehouseRentApply, delWarehouseRentApply, addWarehouseRentApply, updateWarehouseRentApply } from '@/api/ck/warehouseRentApply';
import { WarehouseRentApplyVO, WarehouseRentApplyQuery, WarehouseRentApplyForm } from '@/api/ck/warehouseRentApply/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { authentication_state_type} = toRefs<any>(proxy?.useDict('authentication_state_type'));

const warehouseRentApplyList = ref<WarehouseRentApplyVO[]>([]);
const companyList = ref<CompanyVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const warehouseRentApplyFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});


const initFormData: WarehouseRentApplyForm = {
  id: undefined,
  companyId: undefined,
  title: undefined,
  companyName: undefined,
  rentableArea: undefined,
  minRentArea: undefined,
  price: undefined,
  propertyPrice: undefined,
  autoOffDate: undefined,
  contactPerson: undefined,
  contactPhone: undefined,
  infoDesc: undefined,
}
const data = reactive<PageData<WarehouseRentApplyForm, WarehouseRentApplyQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    title: undefined,
    companyName: undefined,
    rentableArea: undefined,
    minRentArea: undefined,
    price: undefined,
    propertyPrice: undefined,
    autoOffDate: undefined,
    contactPerson: undefined,
    contactPhone: undefined,
    infoDesc: undefined,
    companyId: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "主键ID不能为空", trigger: "blur" }
    ],
    companyId: [
      { required: true, message: "请选择所属企业", trigger: "change" }
    ],
    title: [
      { required: true, message: "申请标题不能为空", trigger: "blur" }
    ],
    companyName: [
      { required: true, message: "企业名称不能为空", trigger: "blur" }
    ],
    rentableArea: [
      { required: true, message: "可租面积(㎡)不能为空", trigger: "blur" }
    ],
    minRentArea: [
      { required: true, message: "起租面积(㎡)不能为空", trigger: "blur" }
    ],
    price: [
      { required: true, message: "价格(元/㎡·月)不能为空", trigger: "blur" }
    ],
    propertyPrice: [
      { required: true, message: "物业单价(元/㎡·月)不能为空", trigger: "blur" }
    ],
    autoOffDate: [
      { required: true, message: "自动下架日期不能为空", trigger: "blur" }
    ],
    contactPerson: [
      { required: true, message: "联系人不能为空", trigger: "blur" }
    ],
    contactPhone: [
      { required: true, message: "联系电话不能为空", trigger: "blur" }
    ],
    infoDesc: [
      { required: true, message: "信息描述不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询企业信息列表 */
const getCompanyList = async () => {
  const res = await listCompany({ pageNum: 1, pageSize: 9999 });
  companyList.value = res.rows;
}

/** 查询仓库出租服务申请列表 */
const getList = async () => {
  loading.value = true;
  const res = await listWarehouseRentApply(queryParams.value);
  warehouseRentApplyList.value = res.rows;
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
  warehouseRentApplyFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: WarehouseRentApplyVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = async () => {
  reset();
  await getCompanyList();
  dialog.visible = true;
  dialog.title = "添加仓库出租服务申请";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: WarehouseRentApplyVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getWarehouseRentApply(_id);
  Object.assign(form.value, res.data);
  await getCompanyList();
  dialog.visible = true;
  dialog.title = "修改仓库出租服务申请";
}

/** 提交按钮 */
const submitForm = () => {
  warehouseRentApplyFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateWarehouseRentApply(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addWarehouseRentApply(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: WarehouseRentApplyVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除仓库出租服务申请编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delWarehouseRentApply(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('ck/warehouseRentApply/export', {
    ...queryParams.value
  }, `warehouseRentApply_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
