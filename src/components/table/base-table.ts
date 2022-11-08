/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable no-return-assign */
// base-table.js
import { ref, isRef, unref, watchEffect, reactive, toRaw, computed, onMounted, onUnmounted } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { isFunction } from 'lodash';
import type { BasicTableProps, Pageable } from './types/table';
import { getList } from '@/api/list';
import { useSettingStore } from '@/store';
import { prefix } from '@/config/global';

const store = useSettingStore();

const searchForm = {
  name: '',
  no: undefined,
  status: undefined,
  type: '',
};

const formData = ref({ ...searchForm });
const rowKey = 'index';
const verticalAlign = 'top';
const hover = true;

// const pagination = ref({
//   // defaultPageSize: 20,
//   total: 100,
//   // defaultCurrent: 1,
//   pageSize: 20,
//   current: 1,
// });
const pagination = ref({
  current: 1,
  pageSize: 20,
  total: 0,
});
const filters = ref(null);

const confirmVisible = ref(false);

const data = ref([]);
const tableRef = ref(null);

const dataLoading = ref(false);

const deleteIdx = ref(-1);
const confirmBody = computed(() => {
  if (deleteIdx.value > -1) {
    const { name } = data.value[deleteIdx.value];
    return `删除后，${name}的所有合同信息将被清空，且无法恢复`;
  }
  return '';
});

const resetIdx = () => {
  deleteIdx.value = -1;
};

const onConfirmDelete = () => {
  // 真实业务请发起请求
  data.value.splice(deleteIdx.value, 1);
  pagination.value.total = data.value.length;
  confirmVisible.value = false;
  MessagePlugin.success('删除成功');
  resetIdx();
};

const onCancel = () => {
  resetIdx();
};

const handleClickDelete = ({ row }) => {
  deleteIdx.value = row.rowIndex;
  confirmVisible.value = true;
};
const onReset = (val) => {
  console.log(val);
};
const onSubmit = (val) => {
  console.log(val);
};

const offsetTop = computed(() => {
  return store.isUseTabsRouter ? 48 : 0;
});

const getContainer = () => {
  return document.querySelector(`.${prefix}-layout`);
};

export function useTable(tableProps?: BasicTableProps, url?: string) {
  // const data = ref(null);
  console.log('tableProps', tableProps);
  const error = ref(null);

  const { beforeFetch, api } = tableProps;
  let params = {};
  const fetchData = async () => {
    if (beforeFetch && isFunction(beforeFetch)) {
      params = (await beforeFetch(params)) || params;
    }
    dataLoading.value = true;
    try {
      const { pageSize, current } = unref(pagination);
      console.log('fetchData filters=', toRaw(filters.value));
      const pageable: Pageable = { page: current, size: pageSize, filters: toRaw(filters.value) };
      const result = await api(pageable);
      console.log(result);
      const { content, size, number, totalElements } = result;
      console.log(content);

      data.value = content;
      pagination.value = {
        pageSize: size,
        current: number + 1,
        total: totalElements,
      };
    } catch (e) {
      console.log(e);
    } finally {
      dataLoading.value = false;
    }
  };
  const onPageChange = (curr, pageInfo) => {
    const { current, pageSize } = curr;
    console.log('onPageChange分页变化', curr, pageInfo);
    pagination.value = {
      ...pagination.value,
      pageSize,
      current,
    };
    fetchData();
  };
  const onChange = (changeParams, triggerAndData) => {
    console.log('onChange统一Change', changeParams, triggerAndData, pagination.value);
    const { trigger } = triggerAndData;
    if (trigger === 'filter') {
      filters.value = changeParams.filter;
      const current = 1;
      pagination.value = {
        ...pagination.value,
        current,
      };
      console.log('filters=', filters.value);

      fetchData();
    }
  };
  const onFilterChange = (changeParams) => {
    // filterValue.value = {
    //   ...filters,
    //   createTime: filters.createTime || [],
    //   lastName: filters.lastName || [],
    // };
    console.log('onFilterChange', changeParams.filter);
    filters.value = changeParams.filter;

    // request(filters);
  };
  onMounted(() => {
    fetchData();
  });
  onUnmounted(() => {
    tableRef.value = null;
  });

  return { data, dataLoading, formData, error, pagination, onPageChange, onChange, onReset, onSubmit, onFilterChange };
}
