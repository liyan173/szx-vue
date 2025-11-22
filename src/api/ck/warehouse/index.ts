import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { WarehouseVO, WarehouseForm, WarehouseQuery } from '@/api/ck/warehouse/types';

/**
 * 查询仓库基础数据录入列表
 * @param query
 * @returns {*}
 */

export const listWarehouse = (query?: WarehouseQuery): AxiosPromise<WarehouseVO[]> => {
  return request({
    url: '/ck/warehouse/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询仓库基础数据录入详细
 * @param id
 */
export const getWarehouse = (id: string | number): AxiosPromise<WarehouseVO> => {
  return request({
    url: '/ck/warehouse/' + id,
    method: 'get'
  });
};

/**
 * 新增仓库基础数据录入
 * @param data
 */
export const addWarehouse = (data: WarehouseForm) => {
  return request({
    url: '/ck/warehouse',
    method: 'post',
    data: data
  });
};

/**
 * 修改仓库基础数据录入
 * @param data
 */
export const updateWarehouse = (data: WarehouseForm) => {
  return request({
    url: '/ck/warehouse',
    method: 'put',
    data: data
  });
};

/**
 * 删除仓库基础数据录入
 * @param id
 */
export const delWarehouse = (id: string | number | Array<string | number>) => {
  return request({
    url: '/ck/warehouse/' + id,
    method: 'delete'
  });
};
