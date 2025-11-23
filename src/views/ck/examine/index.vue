<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="提交日期" style="width: 308px">
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
              <el-input v-model="queryParams.companyName" placeholder="请输入企业名称" clearable @keyup.enter="handleQuery" />
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
      <el-table v-loading="loading" border :data="warehouseList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
<!--        <el-table-column label="主键ID" align="center" prop="id" v-if="true" />-->
        <el-table-column label="仓库名称" align="center" prop="warehouseName" />
<!--        <el-table-column label="占地(亩)" align="center" prop="areaMu" />-->
        <el-table-column label="土地属性" align="center" prop="landProperty">
          <template #default="scope">
            <dict-tag :options="landt_ypes" :value="scope.row.landProperty"/>
          </template>
        </el-table-column>
        <el-table-column label="使用年限" align="center" prop="useYears">
          <template #default="scope">
            <dict-tag :options="age_limit_type" :value="scope.row.useYears"/>
          </template>
        </el-table-column>
<!--        <el-table-column label="楼栋数量" align="center" prop="buildingCount" />-->
<!--        <el-table-column label="容积率" align="center" prop="volumeRatio" />-->
<!--        <el-table-column label="层高" align="center" prop="floorHeight" />-->
        <el-table-column label="仓库总面积" align="center" prop="totalArea" />
        <el-table-column label="仓库管理方式" align="center" prop="manageType">
          <template #default="scope">
            <dict-tag :options="warehouse_method_type" :value="scope.row.manageType"/>
          </template>
        </el-table-column>
<!--        <el-table-column label="所属区域" align="center" prop="region">-->
<!--          <template #default="scope">-->
<!--            <dict-tag :options="area_type" :value="scope.row.region"/>-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column label="所属区域" align="center" prop="region">
          <template #default="scope">
            {{ getAreaName(scope.row.region) }}
          </template>
        </el-table-column>
        <el-table-column label="详细地址" align="center" prop="address" />
        <el-table-column label="提交时间" align="center" prop="createTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" align="center" prop="authenticationState">
          <template #default="scope">
            <dict-tag :options="authentication_state_type" :value="scope.row.authenticationState"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="审批" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['ck:warehouse:edit']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
  </div>
</template>

<script setup name="Warehouse" lang="ts">
import { listWarehouse, getWarehouse, delWarehouse, addWarehouse, updateWarehouse } from '@/api/ck/warehouse';
import { WarehouseVO, WarehouseQuery, WarehouseForm } from '@/api/ck/warehouse/types';
import areaData from '@/utils/cnarea_2023.json';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { advantage_type, security_info_type, function_info_type, age_limit_type, warehouse_method_type, category_type, landt_ypes, area_type, outer_facilities_type, integrated_facilities_type, authentication_state_type} = toRefs<any>(proxy?.useDict('advantage_type', 'security_info_type', 'function_info_type', 'age_limit_type', 'warehouse_method_type', 'category_type', 'landt_ypes', 'area_type', 'outer_facilities_type', 'integrated_facilities_type','authentication_state_type'));

const warehouseList = ref<WarehouseVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const dateRange = ref<[DateModelType, DateModelType]>(['', '']);

const queryFormRef = ref<ElFormInstance>();
const warehouseFormRef = ref<ElFormInstance>();

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


const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: WarehouseForm = {
  id: undefined,
  warehouseName: undefined,
  areaMu: undefined,
  landProperty: undefined,
  useYears: undefined,
  buildingCount: undefined,
  volumeRatio: undefined,
  floorHeight: undefined,
  totalArea: undefined,
  manageType: undefined,
  region: undefined,
  address: undefined,
  mainCategory: undefined,
  innerFacilities: undefined,
  outerFacilities: undefined,
  securityInfo: undefined,
  advantage: undefined,
  functionInfo: undefined,
  gallery: undefined,
  fireLevel: undefined,
  fireExpireDate: undefined,
  warehouseAreaInfo: undefined,
  authenticationState: undefined,
  createTime: undefined,
}
const data = reactive<PageData<WarehouseForm, WarehouseQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    warehouseName: undefined,
    areaMu: undefined,
    landProperty: undefined,
    useYears: undefined,
    buildingCount: undefined,
    volumeRatio: undefined,
    floorHeight: undefined,
    totalArea: undefined,
    manageType: undefined,
    region: undefined,
    address: undefined,
    mainCategory: undefined,
    innerFacilities: undefined,
    outerFacilities: undefined,
    securityInfo: undefined,
    advantage: undefined,
    functionInfo: undefined,
    gallery: undefined,
    fireLevel: undefined,
    fireExpireDate: undefined,
    warehouseAreaInfo: undefined,
    authenticationState: undefined,
    createTime: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "主键ID不能为空", trigger: "blur" }
    ],
    warehouseName: [
      { required: true, message: "仓库名称不能为空", trigger: "blur" }
    ],
    areaMu: [
      { required: true, message: "占地(亩)不能为空", trigger: "blur" }
    ],
    landProperty: [
      { required: true, message: "土地属性不能为空", trigger: "change" }
    ],
    useYears: [
      { required: true, message: "使用年限不能为空", trigger: "change" }
    ],
    buildingCount: [
      { required: true, message: "楼栋数量不能为空", trigger: "blur" }
    ],
    volumeRatio: [
      { required: true, message: "容积率不能为空", trigger: "blur" }
    ],
    floorHeight: [
      { required: true, message: "层高不能为空", trigger: "blur" }
    ],
    region: [
      { required: true, message: "所属区域不能为空", trigger: "change" }
    ],
    address: [
      { required: true, message: "详细地址不能为空", trigger: "blur" }
    ],
    mainCategory: [
      { required: true, message: "主要品类不能为空", trigger: "change" }
    ],
    fireLevel: [
      { required: true, message: "消防等级证书不能为空", trigger: "blur" }
    ],
    fireExpireDate: [
      { required: true, message: "消防证书有效日期不能为空", trigger: "blur" }
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


/** 查询仓库基础数据录入列表 */
const getList = async () => {
  loading.value = true;
  const res = await listWarehouse(proxy?.addDateRange(queryParams.value, dateRange.value));
  warehouseList.value = res.rows;
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
  warehouseFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: WarehouseVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加仓库基础数据录入";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: WarehouseVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getWarehouse(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改仓库基础数据录入";
}

/** 提交按钮 */
const submitForm = () => {
  warehouseFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateWarehouse(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addWarehouse(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: WarehouseVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除仓库基础数据录入编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delWarehouse(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('ck/warehouse/export', {
    ...queryParams.value
  }, `warehouse_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  dateRange.value = ['', ''];
  getList();
});
</script>
