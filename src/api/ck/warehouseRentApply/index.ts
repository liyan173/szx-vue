import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { WarehouseRentApplyVO, WarehouseRentApplyForm, WarehouseRentApplyQuery } from '@/api/ck/warehouseRentApply/types';

/**
 * 查询仓库出租服务申请列表
 * @param query
 * @returns {*}
 */

export const listWarehouseRentApply = (query?: WarehouseRentApplyQuery): AxiosPromise<WarehouseRentApplyVO[]> => {
  return request({
    url: '/ck/warehouseRentApply/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询仓库出租服务申请详细
 * @param id
 */
export const getWarehouseRentApply = (id: string | number): AxiosPromise<WarehouseRentApplyVO> => {
  return request({
    url: '/ck/warehouseRentApply/' + id,
    method: 'get'
  });
};

/**
 * 新增仓库出租服务申请
 * @param data
 */
export const addWarehouseRentApply = (data: WarehouseRentApplyForm) => {
  return request({
    url: '/ck/warehouseRentApply',
    method: 'post',
    data: data
  });
};

/**
 * 修改仓库出租服务申请
 * @param data
 */
export const updateWarehouseRentApply = (data: WarehouseRentApplyForm) => {
  return request({
    url: '/ck/warehouseRentApply',
    method: 'put',
    data: data
  });
};

/**
 * 删除仓库出租服务申请
 * @param id
 */
export const delWarehouseRentApply = (id: string | number | Array<string | number>) => {
  return request({
    url: '/ck/warehouseRentApply/' + id,
    method: 'delete'
  });
};
