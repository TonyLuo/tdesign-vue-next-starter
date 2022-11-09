<template>
  <base-table :columns="COLUMNS" :api="userApi">
    <template #contractType="row"> 审核失败 {{ row.id }} </template>
    <!-- <template #name="row"> 审核失败 {{ row.id }} </template> -->

    <template #op="slotProps">
      <a class="t-button-link" @click="rehandleClickOp(slotProps)">管理</a>
      <a class="t-button-link" @click="handleClickDelete(slotProps)">删除</a>
    </template>
  </base-table>
</template>
<script lang="ts">
export default {
  name: 'UserView',
};
</script>
<script setup lang="ts">
import BaseTable from '@/components/table/BaseTable.vue';
import userApi from '@/api/user/user.api';

const COLUMNS = [
  {
    title: '名称1',
    fixed: 'left',
    width: 200,
    ellipsis: true,
    align: 'left',
    colKey: 'name',
    // 输入框过滤配置
    filter: {
      type: 'input',
      operator: 'like',

      // 文本域搜索
      // component: Textarea,

      resetValue: '',
      // 按下 Enter 键时也触发确认搜索
      confirmEvents: ['onEnter'],
      props: { placeholder: '输入关键词过滤' },
      // 是否显示重置取消按钮，一般情况不需要显示
      showConfirmAndReset: true,
    },
    search: true,
  },
  { title: '合同状态', colKey: 'status', width: 200, cell: { col: 'status' }, search: true },
  {
    title: '合同编号',
    width: 200,
    ellipsis: true,
    colKey: 'no',
  },
  {
    title: '合同类型',
    width: 200,
    ellipsis: true,
    colKey: 'contractType',
  },
  {
    title: '合同收付类型',
    width: 200,
    ellipsis: true,
    colKey: 'paymentType',
  },
  {
    title: '合同金额 (元)',
    width: 200,
    ellipsis: true,
    colKey: 'amount',
  },
  {
    align: 'left',
    fixed: 'right',
    width: 200,
    colKey: 'op',
    title: '操作',
  },
];
const handleClickDelete = ({ row }) => {
  // deleteIdx.value = row.rowIndex;
  // confirmVisible.value = true;
};

const rehandleClickOp = ({ text, row }) => {
  console.log(text, row);
};
</script>
