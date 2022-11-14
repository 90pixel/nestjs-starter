import { OrderBy, PagePagination } from './interfaces/paginator';
import { SelectQueryBuilder } from 'typeorm';
import { normalizeOrderBy } from '../utils/normalize-order';

export interface PagePaginatorPaginateParams<
  TEntity,
  TColumnNames extends Record<string, string>,
> {
  page?: number | null;
  take?: number | null;
  orderBy?: OrderBy<TEntity & TColumnNames> | OrderBy<TEntity & TColumnNames>[];
  where?: string | string[] | { [key: string]: any } | any[];
  relations?: string[];
}

export class PagePaginator<
  TEntity,
  TColumnNames extends Record<string, string>,
> {
  async paginate(
    qb: SelectQueryBuilder<TEntity>,
    params: PagePaginatorPaginateParams<TEntity, TColumnNames> = {},
    isRaw = false,
  ): Promise<PagePagination<TEntity>> {
    const page = params.page ?? 1;
    const take = params.take ?? 10;
    const orderBy = params.orderBy ?? { id: false };

    const qbForCount = qb.clone();

    //where
    if (params.where) {
      qb.where(params.where);
      qbForCount.where(params.where);
    }

    //relations
    if (params.relations) {
      for (const relation of params.relations) {
        qb.leftJoinAndSelect(`${qb.alias}.${relation}`, relation);
        qbForCount.leftJoinAndSelect(`${qb.alias}.${relation}`, relation);
      }
    }

    for (const [key, value] of normalizeOrderBy(orderBy)) {
      qb.addOrderBy(`${qb.alias}.${key}`, value ? 'ASC' : 'DESC');
    }

    let hasNext = false;
    const query = qb
      .clone()
      .offset((page - 1) * take)
      .limit(take + 1);
    const nodes = await (isRaw ? query.getRawMany() : query.getMany()).then(
      (nodes) => {
        if (nodes.length > take) {
          hasNext = true;
        }
        return nodes.slice(0, take);
      },
    );

    return {
      totalCount: await qbForCount.getCount(),
      totalPages: Math.ceil((await qbForCount.getCount()) / take),
      currentPage: page,
      takeSize: take,
      hasNext,
      nodes,
    };
  }
}
