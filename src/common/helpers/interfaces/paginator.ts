export type OrderBy<TEntity> = {
  [TKey in keyof TEntity]?: boolean;
};

export interface PagePagination<TEntity> {
  readonly totalCount: number;
  readonly totalPages: number;
  readonly currentPage: number;
  readonly takeSize: number;
  readonly hasNext: boolean;
  readonly nodes: TEntity[];
}
