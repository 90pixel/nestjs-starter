import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { DataSource } from 'typeorm';
import { PaginatorResponse } from './dto/paginator-response.dto';

interface PageOptions {
  page: number;
  limit: number;
}

interface ListOptions {
  order?: { [key: string]: 'ASC' | 'DESC' };
  where?: Record<string, unknown>;
  relations?: string[];
}

@Injectable()
export class UtilsService {
  constructor(@InjectDataSource() readonly dataSource: DataSource) {}

  private async getPaginatedData<T>(
    entity: new () => T,
    pageOptions: PageOptions,
    listOptions: ListOptions,
  ): Promise<{ data: T[]; total: number }> {
    const { page, limit } = pageOptions;
    const { order, where, relations } = listOptions;

    let queryBuilder = this.dataSource
      .getRepository(entity)
      .createQueryBuilder();

    if (order) {
      queryBuilder = queryBuilder.orderBy(order);
    }

    if (where) {
      queryBuilder = queryBuilder.where(where);
    }

    if (relations) {
      relations.forEach((relation) => {
        queryBuilder = queryBuilder.leftJoinAndSelect(
          `${entity.name}.${relation}`,
          relation,
        );
      });
    }

    const skip = (page - 1) * limit;

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async adminPagination<T, U>(
    entity: new () => U,
    pageOptions: PageOptions,
    listOptions: ListOptions,
    toMapObject: new () => T | undefined = undefined,
  ): Promise<PaginatorResponse> {
    const { page, limit } = pageOptions;
    //const { order, where, relations } = listOptions;

    // eslint-disable-next-line prefer-const
    let { data, total } = await this.getPaginatedData<U>(
      entity,
      pageOptions,
      listOptions,
    );

    const response = new PaginatorResponse();
    response.nodes =
      toMapObject === undefined
        ? data
        : await this.autoMapper<T>(data, toMapObject);
    response.currentPage = page;
    response.pageSize = limit > total ? total : limit;
    response.hasNext = total > page * pageOptions.page;
    response.totalPages = Math.ceil(total / limit);
    response.totalCount = total;

    return response;
  }

  //automapper array
  async autoMapper<T>(source: any[] | any, Dto: new () => T): Promise<T[] | T> {
    if (!Array.isArray(source)) {
      return await this.autoMapperInternal(source, Dto);
    }

    const results: T[] = [];

    for (const item of source) {
      results.push(await this.autoMapperInternal(item, Dto));
    }

    return results;
  }

  private async autoMapperInternal<T>(
    source: any | any[],
    Dto: new () => T,
  ): Promise<T> {
    const plain = instanceToPlain(source);

    const errors = await validate(source);

    if (errors.length > 0) {
      throw new Error(
        `Auto mapper validation failed: ${JSON.stringify(errors)}`,
      );
    }

    return plainToInstance(Dto, plain, {
      excludeExtraneousValues: true,
    });
  }
}
