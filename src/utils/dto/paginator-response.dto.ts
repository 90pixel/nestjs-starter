export class PaginatorResponse {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  nodes: [] | any;
}
