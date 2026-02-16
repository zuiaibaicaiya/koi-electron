import { type MaybeRef, nextTick, shallowRef } from 'vue';
import type { TableProps } from 'antdv-next';
import { isFunction } from 'lodash-es';
import type { TableAction } from '@/components/ProTable/src/types/tableAction.ts';
export interface UseTableProps<T> {
  columns: MaybeRef<TableProps['columns']>;
  api?: () => Promise<T>;
}

export type UseTableReturn = [
  ({ tableAction }: { tableAction: TableAction }) => void,
  { reload: () => void },
];
export default function useTable<T>(props: UseTableProps<T>): UseTableReturn {
  const actionRef = shallowRef<TableAction>();
  function fetchData() {
    if (props.api && isFunction(props.api)) {
      props.api().then((res) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        actionRef.value?.setDataSource(res.data.items);
        actionRef.value?.setLoading(false);
      });
    }
  }
  fetchData();
  function reload() {
    actionRef.value?.setLoading(true);
    fetchData();
  }
  function init() {
    actionRef.value?.setColumns(props.columns);
  }
  function register({ tableAction }: { tableAction: TableAction }) {
    actionRef.value = tableAction;
    nextTick(() => {
      init();
    });
  }
  return [register, { reload }];
}
