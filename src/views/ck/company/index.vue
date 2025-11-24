<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="企业名称" prop="companyName">
              <el-input v-model="queryParams.companyName" placeholder="请输入企业名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="统一社会信用代码" prop="creditCode">
              <el-input v-model="queryParams.creditCode" placeholder="请输入统一社会信用代码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="会员级别" prop="member">
              <el-select v-model="queryParams.member" placeholder="请选择会员级别" clearable >
                <el-option v-for="dict in member_type" :key="dict.value" :label="dict.label" :value="dict.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="认证状态" prop="authenticationState">
              <el-select v-model="queryParams.authenticationState" placeholder="请选择认证状态" clearable >
                <el-option v-for="dict in authentication_state_type" :key="dict.value" :label="dict.label" :value="dict.value"/>
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
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['ck:company:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['ck:company:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['ck:company:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['ck:company:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="companyList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="企业名称" align="center" prop="companyName" />
        <el-table-column label="统一社会信用代码" align="center" prop="creditCode" />
        <el-table-column label="会员级别" align="center" prop="member">
          <template #default="scope">
            <dict-tag :options="member_type" :value="scope.row.member"/>
          </template>
        </el-table-column>
        <el-table-column label="法定代表人" align="center" prop="juridicalPerson" />
        <el-table-column label="所属园区" align="center" prop="gardenArea">
          <template #default="scope">
            <dict-tag :options="garden_type" :value="scope.row.gardenArea"/>
          </template>
        </el-table-column>
        <el-table-column label="业务领域" align="center" prop="linesOfBusiness">
          <template #default="scope">
            <dict-tag :options="lines_of_business_type" :value="scope.row.linesOfBusiness"/>
          </template>
        </el-table-column>
        <el-table-column label="认证状态" align="center" prop="authenticationState">
          <template #default="scope">
            <dict-tag :options="authentication_state_type" :value="scope.row.authenticationState"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right"  class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['ck:company:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['ck:company:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改企业信息对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="companyFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="企业名称" prop="companyName">
          <el-input v-model="form.companyName" placeholder="请输入企业名称" />
        </el-form-item>
        <el-form-item label="所属区域" prop="region">
          <el-cascader
            v-model="form.region"
            :options="areaOptions"
            :props="cascaderProps"
            placeholder="请选择省/市/区"
            clearable
            filterable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="注册地址" prop="registerAddress">
          <el-input v-model="form.registerAddress" placeholder="请输入注册地址" />
        </el-form-item>
        <el-form-item label="企业性质" prop="companyType">
          <el-select v-model="form.companyType" placeholder="请选择企业性质">
            <el-option
              v-for="dict in enterprise_nature_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业规模" prop="companyScale">
          <el-select v-model="form.companyScale" placeholder="请选择企业规模">
            <el-option
              v-for="dict in company_scale_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业简介" prop="companyIntro">
          <el-input v-model="form.companyIntro" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="车辆信息" prop="vehicleInfo">
          <el-input v-model="form.vehicleInfo" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="统一社会信用代码" prop="creditCode">
          <el-input v-model="form.creditCode" placeholder="请输入统一社会信用代码" />
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item label="业务类型" prop="businessType">
          <el-select v-model="form.businessType" placeholder="请选择业务类型">
            <el-option
              v-for="dict in business_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主要配送品类" prop="mainCategory">
          <el-select v-model="form.mainCategory" placeholder="请选择主要配送品类">
            <el-option
              v-for="dict in main_category_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主要配送区域" prop="deliveryArea">
          <el-select v-model="form.deliveryArea" placeholder="请选择主要配送区域">
            <el-option
              v-for="dict in delivery_area_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="配送中心信息" prop="deliveryCenterInfo">
          <el-input v-model="form.deliveryCenterInfo" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="会员级别" prop="member">
          <el-select v-model="form.member" placeholder="请选择会员级别">
            <el-option
              v-for="dict in member_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="法定代表人" prop="juridicalPerson">
          <el-input v-model="form.juridicalPerson" placeholder="请输入法定代表人" />
        </el-form-item>
        <el-form-item label="所属园区" prop="gardenArea">
          <el-select v-model="form.gardenArea" placeholder="请选择所属园区">
            <el-option
              v-for="dict in garden_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务领域" prop="linesOfBusiness">
          <el-select v-model="form.linesOfBusiness" placeholder="请选择业务领域">
            <el-option
              v-for="dict in lines_of_business_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="认证状态" prop="authenticationState">
          <el-select v-model="form.authenticationState" placeholder="请选择认证状态">
            <el-option
              v-for="dict in authentication_state_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
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

<script setup name="Company" lang="ts">
import { listCompany, getCompany, delCompany, addCompany, updateCompany } from '@/api/ck/company';
import { CompanyVO, CompanyQuery, CompanyForm } from '@/api/ck/company/types';
import areaData from '@/utils/cnarea_2023.json';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { authentication_state_type, delivery_area_type, company_scale_type, main_category_type, garden_type, enterprise_nature_type, lines_of_business_type, business_type, member_type } = toRefs<any>(proxy?.useDict('authentication_state_type', 'delivery_area_type', 'company_scale_type', 'main_category_type', 'garden_type', 'enterprise_nature_type', 'lines_of_business_type', 'business_type', 'member_type'));

// Cascader 配置
const cascaderProps = {
  value: 'area_code',
  label: 'name',
  children: 'children'
};

// 构建三级联动数据结构
const areaOptions = computed(() => {
  // 获取所有省级数据（level === '1'）
  const provinces = areaData.filter(item => item.level === '1');

  return provinces.map(province => {
    // 获取该省下的所有市级数据（level === '2'）
    const cities = areaData.filter(item =>
      item.level === '2' && item.parent_code === province.area_code
    );

    return {
      area_code: province.area_code,
      name: province.name,
      children: cities.map(city => {
        // 获取该市下的所有区县数据（level === '3'）
        const districts = areaData.filter(item =>
          item.level === '3' && item.parent_code === city.area_code
        );

        return {
          area_code: city.area_code,
          name: city.name,
          children: districts.map(district => ({
            area_code: district.area_code,
            name: district.name
          }))
        };
      })
    };
  });
});

const companyList = ref<CompanyVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const companyFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: CompanyForm = {
  id: undefined,
  companyName: undefined,
  registerAddress: undefined,
  companyType: undefined,
  companyScale: undefined,
  companyIntro: undefined,
  vehicleInfo: undefined,
  creditCode: undefined,
  address: undefined,
  businessType: undefined,
  mainCategory: undefined,
  deliveryArea: undefined,
  deliveryCenterInfo: undefined,
  remark: undefined,
  member: undefined,
  juridicalPerson: undefined,
  gardenArea: undefined,
  linesOfBusiness: undefined,
  authenticationState: undefined
}
const data = reactive<PageData<CompanyForm, CompanyQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    companyName: undefined,
    creditCode: undefined,
    member: undefined,
    authenticationState: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "主键ID不能为空", trigger: "blur" }
    ],
    companyName: [
      { required: true, message: "企业名称不能为空", trigger: "blur" }
    ],
    registerAddress: [
      { required: true, message: "注册地址不能为空", trigger: "blur" }
    ],
    companyType: [
      { required: true, message: "企业性质不能为空", trigger: "change" }
    ],
    companyScale: [
      { required: true, message: "企业规模不能为空", trigger: "change" }
    ],
    companyIntro: [
      { required: true, message: "企业简介不能为空", trigger: "blur" }
    ],
    vehicleInfo: [
      { required: true, message: "车辆信息不能为空", trigger: "blur" }
    ],
    address: [
      { required: true, message: "详细地址不能为空", trigger: "blur" }
    ],
    businessType: [
      { required: true, message: "业务类型不能为空", trigger: "change" }
    ],
    mainCategory: [
      { required: true, message: "主要配送品类不能为空", trigger: "change" }
    ],
    deliveryCenterInfo: [
      { required: true, message: "配送中心信息不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 根据区域代码数组获取区域名称 */
const getAreaName = (regionCodes: string[] | string) => {
  if (!regionCodes || (Array.isArray(regionCodes) && regionCodes.length === 0)) {
    return '-';
  }

  // 如果是数组，转换为区域名称路径
  if (Array.isArray(regionCodes)) {
    const names: string[] = [];

    regionCodes.forEach(code => {
      const area = areaData.find(item => item.area_code === code);
      if (area) {
        names.push(area.name);
      }
    });

    return names.join(' / ');
  }

  // 如果是单个字符串代码
  const area = areaData.find(item => item.area_code === regionCodes);
  return area ? area.name : regionCodes;
};

/** 查询企业信息列表 */
const getList = async () => {
  loading.value = true;
  const res = await listCompany(queryParams.value);
  companyList.value = res.rows;
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
  companyFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: CompanyVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加企业信息";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: CompanyVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getCompany(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改企业信息";
}

/** 提交按钮 */
const submitForm = () => {
  companyFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateCompany(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addCompany(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: CompanyVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除企业信息编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delCompany(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('ck/company/export', {
    ...queryParams.value
  }, `company_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
