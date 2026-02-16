import type { MaybeRef } from 'vue';
import type { TableProps } from 'antdv-next';

export interface TableAction {
  setColumns: (columns: MaybeRef<TableProps['columns']>) => void;
  setDataSource: (dataSource: Array<Record<any, any>>) => void;
  setLoading: (loading: MaybeRef<boolean>) => void;
}
