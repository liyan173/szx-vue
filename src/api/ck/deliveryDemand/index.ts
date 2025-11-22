import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { DeliveryDemandVO, DeliveryDemandForm, DeliveryDemandQuery } from '@/api/ck/deliveryDemand/types';

/**
 * 查询货物配送需求列表
 * @param query
 * @returns {*}
 */

export const listDeliveryDemand = (query?: DeliveryDemandQuery): AxiosPromise<DeliveryDemandVO[]> => {
  return request({
    url: '/ck/deliveryDemand/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询货物配送需求详细
 * @param id
 */
export const getDeliveryDemand = (id: string | number): AxiosPromise<DeliveryDemandVO> => {
  return request({
    url: '/ck/deliveryDemand/' + id,
    method: 'get'
  });
};

/**
 * 新增货物配送需求
 * @param data
 */
export const addDeliveryDemand = (data: DeliveryDemandForm) => {
  return request({
    url: '/ck/deliveryDemand',
    method: 'post',
    data: data
  });
};

/**
 * 修改货物配送需求
 * @param data
 */
export const updateDeliveryDemand = (data: DeliveryDemandForm) => {
  return request({
    url: '/ck/deliveryDemand',
    method: 'put',
    data: data
  });
};

/**
 * 删除货物配送需求
 * @param id
 */
export const delDeliveryDemand = (id: string | number | Array<string | number>) => {
  return request({
    url: '/ck/deliveryDemand/' + id,
    method: 'delete'
  });
};
