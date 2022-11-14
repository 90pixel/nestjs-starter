import { OrderBy } from '../helpers/interfaces/paginator';

export function normalizeOrderBy<
  TEntity,
  TColumnNames extends Record<string, string>,
>(
  orderBy: OrderBy<TEntity & TColumnNames> | OrderBy<TEntity & TColumnNames>[],
): [string, boolean][] {
  const orders = [] as [string, boolean][];
  for (const order of Array.isArray(orderBy) ? orderBy : [orderBy]) {
    for (const [key, value] of Object.entries(order)) {
      orders.push([key, value as boolean]);
    }
  }
  return orders;
}
