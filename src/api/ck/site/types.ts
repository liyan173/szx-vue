export interface SiteVO {
  /**
   * 主键ID
   */
  id: string | number;

  /**
   * 网点类型
   */
  siteType: string;

  /**
   * 用户类型
   */
  userType: string;

  /**
   * 所属区域
   */
  region: string;

  /**
   * 详细地址
   */
  address: string;

  /**
   * 联系人
   */
  contactPerson: string;

  /**
   * 联系电话
   */
  contactPhone: string;
  /**
   * 提交时间
   */
  createTime: string;

}

export interface SiteForm extends BaseEntity {
  /**
   * 主键ID
   */
  id?: string | number;

  /**
   * 网点类型
   */
  siteType?: string;

  /**
   * 用户类型
   */
  userType?: string;

  /**
   * 所属区域
   */
  region?: string;

  /**
   * 详细地址
   */
  address?: string;

  /**
   * 联系人
   */
  contactPerson?: string;

  /**
   * 联系电话
   */
  contactPhone?: string;

  /**
   * 提交时间
   */
  createTime: string;

}

export interface SiteQuery extends PageQuery {

  /**
   * 网点类型
   */
  siteType?: string;

  /**
   * 用户类型
   */
  userType?: string;

  /**
   * 所属区域
   */
  region?: string;

  /**
   * 详细地址
   */
  address?: string;

  /**
   * 联系人
   */
  contactPerson?: string;

  /**
   * 联系电话
   */
  contactPhone?: string;

  /**
   * 日期范围参数
   */
  params?: any;
  /**
   * 提交时间
   */
  createTime: string;
}
