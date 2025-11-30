<template>
  <div class="p-2">
    <el-card shadow="never">
      <template #header>
        <div class="page-header">
          <div class="header-title">
            <span class="title-bar"></span>
            <span class="title-text">货物配送需求</span>
            <span class="title-time">(最近更新时间: {{ formData.updateTime || '2024-03-14 20:13:14' }})</span>
          </div>
          <el-button link type="primary" @click="handleEdit" v-hasPermi="['ck:deliveryDemand:edit']">
            <el-icon><Edit /></el-icon>
            编辑
          </el-button>
        </div>
      </template>

      <el-form ref="deliveryDemandFormRef" :model="formData" :rules="rules" label-width="180px" class="delivery-form">
        <el-form-item prop="personalServiceFee">
          <template #label>
            <span class="required-label">专人服务（元/人/次）</span>
          </template>
          <div class="form-item-row">
            <el-input v-model="formData.personalServiceFee" placeholder="300" class="fee-input" :disabled="!isEditing" />
            <span class="unit-text">元/人/次</span>
            <el-radio-group v-model="formData.personalServiceStatus" class="status-radio" :disabled="!isEditing">
              <el-radio :value="1">启用</el-radio>
              <el-radio :value="0">禁用</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>

        <el-form-item prop="upstairsFee">
          <template #label>
            <span class="required-label">送货上楼（元/人/次）</span>
          </template>
          <div class="form-item-row">
            <el-input v-model="formData.upstairsFee" placeholder="300" class="fee-input" :disabled="!isEditing" />
            <span class="unit-text">元/人/次</span>
            <el-radio-group v-model="formData.upstairsStatus" class="status-radio" :disabled="!isEditing">
              <el-radio :value="1">启用</el-radio>
              <el-radio :value="0">禁用</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>

        <el-form-item prop="labeling">
          <template #label>
            <span class="required-label">贴标</span>
          </template>
          <div class="form-item-row">
            <el-input v-model="formData.labelingFeePerPiece" placeholder="25" class="fee-input-small" :disabled="!isEditing" />
            <span class="unit-text">元/件</span>
            <el-input v-model="formData.labelingFeePerPerson" placeholder="300" class="fee-input-small" :disabled="!isEditing" />
            <span class="unit-text">元/人/次</span>
            <el-radio-group v-model="formData.labelingStatus" class="status-radio" :disabled="!isEditing">
              <el-radio :value="1">启用</el-radio>
              <el-radio :value="0">禁用</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>

        <el-form-item prop="unloading">
          <template #label>
            <span class="required-label">卸货</span>
          </template>
          <div class="form-item-row">
            <el-input v-model="formData.unloadingFeePerPiece" placeholder="25" class="fee-input-small" :disabled="!isEditing" />
            <span class="unit-text">元/件</span>
            <el-input v-model="formData.unloadingFeePerPerson" placeholder="300" class="fee-input-small" :disabled="!isEditing" />
            <span class="unit-text">元/人/次</span>
            <el-radio-group v-model="formData.unloadingStatus" class="status-radio" :disabled="!isEditing">
              <el-radio :value="1">启用</el-radio>
              <el-radio :value="0">禁用</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>

        <el-form-item prop="unpacking">
          <template #label>
            <span class="required-label">拆箱/拆拖/换拖</span>
          </template>
          <div class="form-item-row">
            <el-input v-model="formData.unpackingFeePerPiece" placeholder="25" class="fee-input-small" :disabled="!isEditing" />
            <span class="unit-text">元/件</span>
            <el-input v-model="formData.unpackingFeePerPerson" placeholder="300" class="fee-input-small" :disabled="!isEditing" />
            <span class="unit-text">元/人/次</span>
            <el-radio-group v-model="formData.unpackingStatus" class="status-radio" :disabled="!isEditing">
              <el-radio :value="1">启用</el-radio>
              <el-radio :value="0">禁用</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" type="textarea" placeholder="以上价格均为含税价格" :rows="3" :disabled="!isEditing" />
        </el-form-item>

        <el-form-item v-if="isEditing" class="form-actions">
          <el-button type="primary" :loading="buttonLoading" @click="submitForm">保存</el-button>
          <el-button @click="cancelEdit">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup name="DeliveryDemand" lang="ts">
import { listDeliveryDemand, getDeliveryDemand, updateDeliveryDemand } from '@/api/ck/deliveryDemand';
import { DeliveryDemandVO, DeliveryDemandForm } from '@/api/ck/deliveryDemand/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const buttonLoading = ref(false);
const isEditing = ref(false);
const deliveryDemandFormRef = ref<ElFormInstance>();

const initFormData: DeliveryDemandForm = {
  id: undefined,
  personalServiceFee: undefined,
  personalServiceStatus: 1,
  upstairsFee: undefined,
  upstairsStatus: 1,
  labeling: undefined,
  labelingFeePerPiece: undefined,
  labelingFeePerPerson: undefined,
  labelingStatus: 1,
  unloading: undefined,
  unloadingFeePerPiece: undefined,
  unloadingFeePerPerson: undefined,
  unloadingStatus: 1,
  unpacking: undefined,
  unpackingFeePerPiece: undefined,
  unpackingFeePerPerson: undefined,
  unpackingStatus: 1,
  remark: undefined,
  updateTime: undefined,
}

const formData = ref<DeliveryDemandForm>({ ...initFormData });
const originalFormData = ref<DeliveryDemandForm>({ ...initFormData });

const rules = ref({
  personalServiceFee: [
    { required: true, message: "专人服务费用不能为空", trigger: "blur" }
  ],
  upstairsFee: [
    { required: true, message: "送货上楼费用不能为空", trigger: "blur" }
  ],
  labeling: [
    { required: true, message: "贴标费用不能为空", trigger: "blur" }
  ],
  unloading: [
    { required: true, message: "卸货费用不能为空", trigger: "blur" }
  ],
  unpacking: [
    { required: true, message: "拆箱/拆拖/换拖费用不能为空", trigger: "blur" }
  ],
});

/** 查询货物配送需求数据 */
const getData = async () => {
  try {
    const res = await listDeliveryDemand({ pageNum: 1, pageSize: 1 });
    if (res.rows && res.rows.length > 0) {
      formData.value = { ...res.rows[0] };
      originalFormData.value = { ...res.rows[0] };
    }
  } catch (error) {
    console.error('获取数据失败:', error);
  }
}

/** 编辑按钮操作 */
const handleEdit = () => {
  isEditing.value = true;
}

/** 取消编辑 */
const cancelEdit = () => {
  formData.value = { ...originalFormData.value };
  isEditing.value = false;
  deliveryDemandFormRef.value?.clearValidate();
}

/** 提交按钮 */
const submitForm = () => {
  deliveryDemandFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      try {
        await updateDeliveryDemand(formData.value);
        proxy?.$modal.msgSuccess("保存成功");
        isEditing.value = false;
        await getData();
      } catch (error) {
        console.error('保存失败:', error);
      } finally {
        buttonLoading.value = false;
      }
    }
  });
}

onMounted(() => {
  getData();
});
</script>

<style lang="scss" scoped>
.page-header {
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
}

.delivery-form {
  max-width: 1200px;
  padding: 20px 0;
}

.form-item-row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;

  .fee-input {
    width: 200px;
  }

  .fee-input-small {
    width: 140px;
  }

  .unit-text {
    color: #606266;
    font-size: 14px;
    white-space: nowrap;
  }

  .status-radio {
    margin-left: auto;
  }
}

.form-actions {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

:deep(.el-form-item__label) {
  font-weight: 500;
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

:deep(.el-radio.is-disabled) {
  cursor: not-allowed;

  .el-radio__label {
    color: #a8abb2;
  }
}
</style>
