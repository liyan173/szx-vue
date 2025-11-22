export interface WarehouseRentApplyVO {
  /**
   * 主键ID
   */
  id: string | number;

  /**
   * 申请标题
   */
  title: string;

  /**
   * 企业名称
   */
  companyName: string;

  /**
   * 可租面积(㎡)
   */
  rentableArea: number;

  /**
   * 起租面积(㎡)
   */
  minRentArea: number;

  /**
   * 价格(元/㎡·月)
   */
  price: number;

  /**
   * 物业单价(元/㎡·月)
   */
  propertyPrice: number;

  /**
   * 自动下架日期
   */
  autoOffDate: string;

  /**
   * 联系人
   */
  contactPerson: string;

  /**
   * 联系电话
   */
  contactPhone: string;

  /**
   * 信息描述
   */
  infoDesc: string;

}

export interface WarehouseRentApplyForm extends BaseEntity {
  /**
   * 主键ID
   */
  id?: string | number;

  /**
   * 申请标题
   */
  title?: string;

  /**
   * 企业名称
   */
  companyName?: string;

  /**
   * 可租面积(㎡)
   */
  rentableArea?: number;

  /**
   * 起租面积(㎡)
   */
  minRentArea?: number;

  /**
   * 价格(元/㎡·月)
   */
  price?: number;

  /**
   * 物业单价(元/㎡·月)
   */
  propertyPrice?: number;

  /**
   * 自动下架日期
   */
  autoOffDate?: string;

  /**
   * 联系人
   */
  contactPerson?: string;

  /**
   * 联系电话
   */
  contactPhone?: string;

  /**
   * 信息描述
   */
  infoDesc?: string;

}

export interface WarehouseRentApplyQuery extends PageQuery {

  /**
   * 申请标题
   */
  title?: string;

  /**
   * 企业名称
   */
  companyName?: string;

  /**
   * 可租面积(㎡)
   */
  rentableArea?: number;

  /**
   * 起租面积(㎡)
   */
  minRentArea?: number;

  /**
   * 价格(元/㎡·月)
   */
  price?: number;

  /**
   * 物业单价(元/㎡·月)
   */
  propertyPrice?: number;

  /**
   * 自动下架日期
   */
  autoOffDate?: string;

  /**
   * 联系人
   */
  contactPerson?: string;

  /**
   * 联系电话
   */
  contactPhone?: string;

  /**
   * 信息描述
   */
  infoDesc?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
