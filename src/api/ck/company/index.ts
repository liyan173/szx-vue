import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CompanyVO, CompanyForm, CompanyQuery } from '@/api/ck/company/types';

/**
 * 查询企业信息列表
 * @param query
 * @returns {*}
 */

export const listCompany = (query?: CompanyQuery): AxiosPromise<CompanyVO[]> => {
  return request({
    url: '/ck/company/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询企业信息详细
 * @param id
 */
export const getCompany = (id: string | number): AxiosPromise<CompanyVO> => {
  return request({
    url: '/ck/company/' + id,
    method: 'get'
  });
};

/**
 * 新增企业信息
 * @param data
 */
export const addCompany = (data: CompanyForm) => {
  return request({
    url: '/ck/company',
    method: 'post',
    data: data
  });
};

/**
 * 修改企业信息
 * @param data
 */
export const updateCompany = (data: CompanyForm) => {
  return request({
    url: '/ck/company',
    method: 'put',
    data: data
  });
};

/**
 * 删除企业信息
 * @param id
 */
export const delCompany = (id: string | number | Array<string | number>) => {
  return request({
    url: '/ck/company/' + id,
    method: 'delete'
  });
};
