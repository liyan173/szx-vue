import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { SiteVO, SiteForm, SiteQuery } from '@/api/ck/site/types';

/**
 * 查询网点信息列表
 * @param query
 * @returns {*}
 */

export const listSite = (query?: SiteQuery): AxiosPromise<SiteVO[]> => {
  return request({
    url: '/ck/site/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询网点信息详细
 * @param id
 */
export const getSite = (id: string | number): AxiosPromise<SiteVO> => {
  return request({
    url: '/ck/site/' + id,
    method: 'get'
  });
};

/**
 * 新增网点信息
 * @param data
 */
export const addSite = (data: SiteForm) => {
  return request({
    url: '/ck/site',
    method: 'post',
    data: data
  });
};

/**
 * 修改网点信息
 * @param data
 */
export const updateSite = (data: SiteForm) => {
  return request({
    url: '/ck/site',
    method: 'put',
    data: data
  });
};

/**
 * 删除网点信息
 * @param id
 */
export const delSite = (id: string | number | Array<string | number>) => {
  return request({
    url: '/ck/site/' + id,
    method: 'delete'
  });
};
