<template>
  <div class="list-common-table">
    <t-form
      ref="searchFormRef"
      :data="searchFormData"
      :label-width="80"
      colon
      :style="{ marginBottom: '8px' }"
      @reset="onReset"
      @submit="onSubmit"
    >
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[16, 24]">
            <t-col v-for="(item, index) in searchForm" :key="index" :span="4">
              <t-form-item :label="item.title" :name="item.colKey">
                <t-input
                  v-model="searchFormData[item.colKey]"
                  class="form-item-content"
                  type="search"
                  :placeholder="`请输入${item.title}`"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
          </t-row>
        </t-col>

        <t-col :span="2" class="operation-container">
          <t-button theme="primary" type="submit" :style="{ marginLeft: '8px' }"> 查询 </t-button>
          <t-button type="reset" variant="base" theme="default"> 重置 </t-button>
        </t-col>
      </t-row>
    </t-form>

    <div class="table-container">
      <t-table
        :data="data"
        :columns="columns"
        :row-key="rowKey"
        :vertical-align="verticalAlign"
        :hover="true"
        :pagination="pagination"
        :loading="dataLoading"
        :bordered="true"
        :header-affixed-top="{ offsetTop, container: getContainer }"
        @filter-change="onFilterChange"
        @page-change="onPageChange"
        @change="onChange"
      >
        <template v-for="item in Object.keys($slots)" #[item]="{ row }" :key="item">
          <slot :name="item" v-bind="row || {}"></slot>
        </template>

        <template #op="{ row }">
          <slot name="op" v-bind="row">
            <a class="t-button-link" @click="onEdit(row)">编辑</a>
            <a class="t-button-link" @click="onDelete(row)">删除</a>
          </slot>
        </template>
      </t-table>
      <t-dialog
        v-model:visible="confirmVisible"
        header="确认删除当前所选合同？"
        :body="confirmBody"
        :on-cancel="onCancel"
        @confirm="onConfirmDelete"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { useSettingStore } from '@/store';
import { prefix } from '@/config/global';

import { useTable } from './base-table';

const props = defineProps({
  columns: Array,
  api: Object,
});
const store = useSettingStore();

// const basicTableProps = { api: props.api, columns: props.columns };
const {
  data,
  dataLoading,
  searchForm,
  searchFormData,
  pagination,
  onPageChange,
  onChange,
  onFilterChange,
  onReset,
  onSubmit,
} = useTable(props);
const rowKey = 'index';
const verticalAlign = 'top';

const confirmVisible = ref(false);

const deleteIdx = ref(-1);
const confirmBody = computed(() => {
  if (deleteIdx.value > -1) {
    const { name } = data.value[deleteIdx.value];
    return `删除后，${name}的所有合同信息将被清空，且无法恢复`;
  }
  return '';
});

const onConfirmDelete = () => {
  // 真实业务请发起请求
  confirmVisible.value = false;
  MessagePlugin.success('删除成功');
};

const onCancel = () => {
  confirmVisible.value = false;
};

const onDelete = (row: any) => {
  deleteIdx.value = row.rowIndex;
  confirmVisible.value = true;
};

const onEdit = (row: any) => {
  console.log(row);
};

const offsetTop = computed(() => {
  return store.isUseTabsRouter ? 48 : 0;
});

const getContainer = () => {
  return document.querySelector(`.${prefix}-layout`);
};
</script>

<style lang="less" scoped>
.list-common-table {
  background-color: var(--td-bg-color-container);
  padding: 30px 32px;
  border-radius: @border-radius;

  .table-container {
    margin-top: 30px;
  }
}

.form-item-content {
  width: 100%;
}

.operation-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .expand {
    .t-button__text {
      display: flex;
      align-items: center;
    }
    .t-icon {
      margin-left: 4px;
      transition: transform 0.3s ease;
    }
  }
}

.payment-col {
  display: flex;

  .trend-container {
    display: flex;
    align-items: center;
    margin-left: 8px;
  }
}
</style>
