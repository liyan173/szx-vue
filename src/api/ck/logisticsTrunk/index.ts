import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { LogisticsTrunkVO, LogisticsTrunkForm, LogisticsTrunkQuery } from '@/api/ck/logisticsTrunk/types';

/**
 * 查询物流干线配送服务列表
 * @param query
 * @returns {*}
 */

export const listLogisticsTrunk = (query?: LogisticsTrunkQuery): AxiosPromise<LogisticsTrunkVO[]> => {
  return request({
    url: '/ck/logisticsTrunk/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询物流干线配送服务详细
 * @param id
 */
export const getLogisticsTrunk = (id: string | number): AxiosPromise<LogisticsTrunkVO> => {
  return request({
    url: '/ck/logisticsTrunk/' + id,
    method: 'get'
  });
};

/**
 * 新增物流干线配送服务
 * @param data
 */
export const addLogisticsTrunk = (data: LogisticsTrunkForm) => {
  return request({
    url: '/ck/logisticsTrunk',
    method: 'post',
    data: data
  });
};

/**
 * 修改物流干线配送服务
 * @param data
 */
export const updateLogisticsTrunk = (data: LogisticsTrunkForm) => {
  return request({
    url: '/ck/logisticsTrunk',
    method: 'put',
    data: data
  });
};

/**
 * 删除物流干线配送服务
 * @param id
 */
export const delLogisticsTrunk = (id: string | number | Array<string | number>) => {
  return request({
    url: '/ck/logisticsTrunk/' + id,
    method: 'delete'
  });
};
