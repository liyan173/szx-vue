export interface CompanyVO {
  /**
   * 主键ID
   */
  id: string | number;

  /**
   * 企业名称
   */
  companyName: string;

  /**
   * 注册地址
   */
  registerAddress: string;

  /**
   * 企业性质
   */
  companyType: string;

  /**
   * 企业规模
   */
  companyScale: string;

  /**
   * 企业简介
   */
  companyIntro: string;

  /**
   * 车辆信息
   */
  vehicleInfo: string;

  /**
   * 统一社会信用代码
   */
  creditCode: string;

  /**
   * 详细地址
   */
  address: string;

  /**
   * 业务类型
   */
  businessType: string;

  /**
   * 主要配送品类
   */
  mainCategory: string;

  /**
   * 主要配送区域
   */
  deliveryArea: string;

  /**
   * 配送中心信息
   */
  deliveryCenterInfo: string;

  /**
   * 认证状态
   */
  authenticationState?: string;

  /**
   * 法定代表人
   */
  juridicalPerson?: string;

  /**
   * 所属园区
   */
  gardenArea?: string;

  /**
   * 业务领域
   */
  linesOfBusiness?: string;

  /**
   * 会员
   */
  member?: string;

  /**
   * 所属区域
   */
  region?: string[] | string;

}

export interface CompanyForm extends BaseEntity {
  /**
   * 主键ID
   */
  id?: string | number;

  /**
   * 企业名称
   */
  companyName?: string;

  /**
   * 注册地址
   */
  registerAddress?: string;

  /**
   * 企业性质
   */
  companyType?: string;

  /**
   * 企业规模
   */
  companyScale?: string;

  /**
   * 企业简介
   */
  companyIntro?: string;

  /**
   * 车辆信息
   */
  vehicleInfo?: string;

  /**
   * 统一社会信用代码
   */
  creditCode?: string;

  /**
   * 详细地址
   */
  address?: string;

  /**
   * 业务类型
   */
  businessType?: string;

  /**
   * 主要配送品类
   */
  mainCategory?: string;

  /**
   * 主要配送区域
   */
  deliveryArea?: string;

  /**
   * 配送中心信息
   */
  deliveryCenterInfo?: string;

  /**
   * 认证状态
   */
  authenticationState?: string;

  /**
   * 法定代表人
   */
  juridicalPerson?: string;

  /**
   * 所属园区
   */
  gardenArea?: string;

  /**
   * 业务领域
   */
  linesOfBusiness?: string;

  /**
   * 会员
   */
  member?: string;

  /**
   * 所属区域
   */
  region?: string[] | string;

}

export interface CompanyQuery extends PageQuery {

  /**
   * 企业名称
   */
  companyName?: string;

  /**
   * 注册地址
   */
  registerAddress?: string;

  /**
   * 企业性质
   */
  companyType?: string;

  /**
   * 企业规模
   */
  companyScale?: string;

  /**
   * 企业简介
   */
  companyIntro?: string;

  /**
   * 车辆信息
   */
  vehicleInfo?: string;

  /**
   * 统一社会信用代码
   */
  creditCode?: string;

  /**
   * 详细地址
   */
  address?: string;

  /**
   * 业务类型
   */
  businessType?: string;

  /**
   * 主要配送品类
   */
  mainCategory?: string;

  /**
   * 主要配送区域
   */
  deliveryArea?: string;

  /**
   * 配送中心信息
   */
  deliveryCenterInfo?: string;

  /**
   * 认证状态
   */
  authenticationState?: string;

  /**
   * 会员
   */
  member?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
