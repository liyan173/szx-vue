<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="申请时间" style="width: 308px">
              <el-date-picker
                v-model="dateRange"
                value-format="YYYY-MM-DD"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="企业名称" prop="companyName">
              <el-input v-model="queryParams.companyName" placeholder="输入企业名称/社会信用代码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">查询</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="never">
      <!-- 标签页 -->
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="待审批" name="pending"></el-tab-pane>
        <el-tab-pane label="已审批" name="approved"></el-tab-pane>
      </el-tabs>

      <el-table v-loading="loading" border :data="companyList" @selection-change="handleSelectionChange">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="企业名称" align="center" prop="companyName" />
        <el-table-column label="统一社会信用代码" align="center" prop="creditCode" />
        <el-table-column label="法定代表人" align="center" prop="juridicalPerson" />
        <el-table-column label="企业类型" align="center" prop="companyType">
          <template #default="scope">
            <dict-tag :options="enterprise_nature_type" :value="scope.row.companyType"/>
          </template>
        </el-table-column>
        <el-table-column label="业务领域" align="center" prop="linesOfBusiness">
          <template #default="scope">
            <dict-tag :options="lines_of_business_type" :value="scope.row.linesOfBusiness"/>
          </template>
        </el-table-column>
        <el-table-column label="所属园区" align="center" prop="gardenArea">
          <template #default="scope">
            <dict-tag :options="garden_type" :value="scope.row.gardenArea"/>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" align="center" prop="createTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="80">
          <template #default="scope">
            <el-button link type="primary" @click="handleUpdate(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 审核详情对话框 -->
    <el-dialog title="企业认证审核" v-model="dialog.visible" width="800px" append-to-body>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="企业名称">{{ form.companyName }}</el-descriptions-item>
        <el-descriptions-item label="统一社会信用代码">{{ form.creditCode }}</el-descriptions-item>
        <el-descriptions-item label="法定代表人">{{ form.juridicalPerson }}</el-descriptions-item>
        <el-descriptions-item label="企业性质">
          <dict-tag :options="enterprise_nature_type" :value="form.companyType"/>
        </el-descriptions-item>
        <el-descriptions-item label="企业规模">
          <dict-tag :options="company_scale_type" :value="form.companyScale"/>
        </el-descriptions-item>
        <el-descriptions-item label="业务领域">
          <dict-tag :options="lines_of_business_type" :value="form.linesOfBusiness"/>
        </el-descriptions-item>
        <el-descriptions-item label="所属园区">
          <dict-tag :options="garden_type" :value="form.gardenArea"/>
        </el-descriptions-item>
        <el-descriptions-item label="业务类型">
          <dict-tag :options="business_type" :value="form.businessType"/>
        </el-descriptions-item>
        <el-descriptions-item label="所属区域">{{ getAreaName(form.region) }}</el-descriptions-item>
        <el-descriptions-item label="注册地址">{{ form.registerAddress }}</el-descriptions-item>
        <el-descriptions-item label="详细地址" :span="2">{{ form.address }}</el-descriptions-item>
        <el-descriptions-item label="企业简介" :span="2">{{ form.companyIntro }}</el-descriptions-item>
        <el-descriptions-item label="车辆信息" :span="2">{{ form.vehicleInfo }}</el-descriptions-item>
        <el-descriptions-item label="主要配送品类">
          <dict-tag :options="main_category_type" :value="form.mainCategory"/>
        </el-descriptions-item>
        <el-descriptions-item label="主要配送区域">
          <dict-tag :options="delivery_area_type" :value="form.deliveryArea"/>
        </el-descriptions-item>
        <el-descriptions-item label="配送中心信息" :span="2">{{ form.deliveryCenterInfo }}</el-descriptions-item>
        <el-descriptions-item label="当前审核状态" :span="2">
          <dict-tag :options="authentication_state_type" :value="form.authenticationState"/>
        </el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <div class="dialog-footer" style="text-align: center;">
          <el-button :loading="buttonLoading" type="success" @click="handleApprove(1)" size="large">
            <el-icon><Select /></el-icon> 通过
          </el-button>
          <el-button :loading="buttonLoading" type="danger" @click="handleApprove(2)" size="large">
            <el-icon><Close /></el-icon> 不通过
          </el-button>
          <el-button @click="cancel" size="large">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Certificationexamination" lang="ts">
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
const dateRange = ref<[DateModelType, DateModelType]>(['', '']);
const activeTab = ref('pending'); // 当前激活的标签页

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

  // 根据标签页强制设置审核状态
  if (activeTab.value === 'pending') {
    // 待审批：强制查询审批中状态 (字典值 "3")
    queryParams.value.authenticationState = '3';
  } else {
    // 已审批：强制查询通过状态 (字典值 "1")
    queryParams.value.authenticationState = '1';
  }

  const res = await listCompany(proxy?.addDateRange(queryParams.value, dateRange.value));
  companyList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 标签页切换 */
const handleTabClick = () => {
  queryParams.value.pageNum = 1;
  getList();
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
  dateRange.value = ['', ''];
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

/** 修改按钮操作 - 查看详情并审核 */
const handleUpdate = async (row?: CompanyVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getCompany(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "企业认证审核";
}

/** 审批操作 */
const handleApprove = async (status: number) => {
  try {
    await proxy?.$modal.confirm(`确认${status === 1 ? '通过' : '不通过'}该企业的认证审核吗?`);

    buttonLoading.value = true;
    // 提交完整的表单数据,只修改审核状态
    const updateData = {
      ...form.value,
      authenticationState: status.toString()
    };

    await updateCompany(updateData).finally(() => buttonLoading.value = false);
    proxy?.$modal.msgSuccess('审核成功');
    dialog.visible = false;
    await getList();
  } catch (error) {
    // 用户取消操作
  }
}

/** 提交按钮 */
const submitForm = () => {
  // 审核页面不需要此方法，使用 handleApprove 代替
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
  dateRange.value = ['', ''];
  // 初始化时设置为待审批状态
  queryParams.value.authenticationState = '3';
  getList();
});
</script>
