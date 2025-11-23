<template>
  <div class="p-2">
<!--    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">-->
<!--      <div v-show="showSearch" class="mb-[10px]">-->
<!--        <el-card shadow="hover">-->
<!--          <el-form ref="queryFormRef" :model="queryParams" :inline="true">-->
<!--            <el-form-item label="网点类型" prop="siteType">-->
<!--              <el-input v-model="queryParams.siteType" placeholder="请输入网点类型" clearable @keyup.enter="handleQuery" />-->
<!--            </el-form-item>-->
<!--            <el-form-item label="用户类型" prop="userType">-->
<!--              <el-select v-model="queryParams.userType" placeholder="请选择用户类型" clearable >-->
<!--                <el-option v-for="dict in user_type" :key="dict.value" :label="dict.label" :value="dict.value"/>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="所属区域" prop="region">-->
<!--              <el-select v-model="queryParams.region" placeholder="请选择所属区域" clearable >-->
<!--                <el-option v-for="dict in area_type" :key="dict.value" :label="dict.label" :value="dict.value"/>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="详细地址" prop="address">-->
<!--              <el-input v-model="queryParams.address" placeholder="请输入详细地址" clearable @keyup.enter="handleQuery" />-->
<!--            </el-form-item>-->
<!--            <el-form-item label="联系人" prop="contactPerson">-->
<!--              <el-select v-model="queryParams.contactPerson" placeholder="请选择联系人" clearable >-->
<!--                <el-option v-for="dict in linkman_type" :key="dict.value" :label="dict.label" :value="dict.value"/>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="联系电话" prop="contactPhone">-->
<!--              <el-input v-model="queryParams.contactPhone" placeholder="请输入联系电话" clearable @keyup.enter="handleQuery" />-->
<!--            </el-form-item>-->
<!--            <el-form-item>-->
<!--              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>-->
<!--              <el-button icon="Refresh" @click="resetQuery">重置</el-button>-->
<!--            </el-form-item>-->
<!--          </el-form>-->
<!--        </el-card>-->
<!--      </div>-->
<!--    </transition>-->

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['ck:site:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['ck:site:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['ck:site:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['ck:site:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="siteList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键ID" align="center" prop="id" v-if="true" />
        <el-table-column label="网点类型" align="center" prop="siteType" />
        <el-table-column label="用户类型" align="center" prop="userType">
          <template #default="scope">
            <dict-tag :options="user_type" :value="scope.row.userType"/>
          </template>
        </el-table-column>
        <el-table-column label="所属区域" align="center" prop="region">
          <template #default="scope">
            <dict-tag :options="area_type" :value="scope.row.region"/>
          </template>
        </el-table-column>
        <el-table-column label="详细地址" align="center" prop="address" />
        <el-table-column label="联系人" align="center" prop="contactPerson">
          <template #default="scope">
            <dict-tag :options="linkman_type" :value="scope.row.contactPerson"/>
          </template>
        </el-table-column>
        <el-table-column label="联系电话" align="center" prop="contactPhone" />
        <el-table-column label="操作" align="center" fixed="right"  class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['ck:site:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['ck:site:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改网点信息对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="siteFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="网点类型" prop="siteType">
          <el-input v-model="form.siteType" placeholder="请输入网点类型" />
        </el-form-item>
        <el-form-item label="用户类型" prop="userType">
          <el-select v-model="form.userType" placeholder="请选择用户类型">
            <el-option
                v-for="dict in user_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
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



        <el-form-item label="详细地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item label="联系人" prop="contactPerson">
          <el-select v-model="form.contactPerson" placeholder="请选择联系人">
            <el-option
                v-for="dict in linkman_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" prop="contactPhone">
          <el-input v-model="form.contactPhone" placeholder="请输入联系电话" />
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

<script setup name="Site" lang="ts">
import { listSite, getSite, delSite, addSite, updateSite } from '@/api/ck/site';
import { SiteVO, SiteQuery, SiteForm } from '@/api/ck/site/types';
import areaData from '@/utils/cnarea_2023.json';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { linkman_type, user_type, area_type } = toRefs<any>(proxy?.useDict('linkman_type', 'user_type', 'area_type'));

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

const siteList = ref<SiteVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const siteFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: SiteForm = {
  id: undefined,
  siteType: undefined,
  userType: undefined,
  region: undefined,
  address: undefined,
  contactPerson: undefined,
  contactPhone: undefined,
}
const data = reactive<PageData<SiteForm, SiteQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    siteType: undefined,
    userType: undefined,
    region: undefined,
    address: undefined,
    contactPerson: undefined,
    contactPhone: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "主键ID不能为空", trigger: "blur" }
    ],
    siteType: [
      { required: true, message: "网点类型不能为空", trigger: "blur" }
    ],
    userType: [
      { required: true, message: "用户类型不能为空", trigger: "change" }
    ],
    address: [
      { required: true, message: "详细地址不能为空", trigger: "blur" }
    ],
    contactPerson: [
      { required: true, message: "联系人不能为空", trigger: "change" }
    ],
    contactPhone: [
      { required: true, message: "联系电话不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询网点信息列表 */
const getList = async () => {
  loading.value = true;
  const res = await listSite(queryParams.value);
  siteList.value = res.rows;
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
  siteFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: SiteVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加网点信息";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: SiteVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getSite(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改网点信息";
}

/** 提交按钮 */
const submitForm = () => {
  siteFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateSite(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addSite(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: SiteVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除网点信息编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delSite(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('ck/site/export', {
    ...queryParams.value
  }, `site_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
