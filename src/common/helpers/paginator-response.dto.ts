export class PaginatorResponse {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  takeSize: number;
  hasNext: boolean;
  nodes: [] | any;
}
