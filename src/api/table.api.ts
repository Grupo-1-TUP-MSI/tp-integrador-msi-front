export interface Pagination {
  current?: number;
  pageSize?: number;
  total?: number;
}
export interface BasicTableData {
  data: any[];
  pagination: Pagination;
}

export const getTableData = (pagination: Pagination) => {
  const data = {
    data: [],
    pagination: {},
  };
  data.pagination = { ...pagination, total: data.data.length };
  return data;
};
