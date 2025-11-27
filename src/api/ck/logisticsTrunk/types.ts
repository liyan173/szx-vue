export interface LogisticsTrunkVO {
  /**
   * 主键ID
   */
  id: string | number;

  /**
   * 始发地
   */
  origin: string;

  /**
   * 目的地
   */
  destination: string;

  /**
   * 最低收费(元)
   */
  minFee: number;

  /**
   * 单价(元/KG)
   */
  pricePerKg: number;

  /**
   * 备注信息
   */
  remark: string;
  /**
   * 企业id
   */
  companyId: string;

}

export interface LogisticsTrunkForm extends BaseEntity {
  /**
   * 主键ID
   */
  id?: string | number;

  /**
   * 始发地
   */
  origin?: string;

  /**
   * 目的地
   */
  destination?: string;

  /**
   * 最低收费(元)
   */
  minFee?: number;

  /**
   * 单价(元/KG)
   */
  pricePerKg?: number;

  /**
   * 备注信息
   */
  remark?: string;
  /**
   * 企业id
   */
  companyId: string;
}

export interface LogisticsTrunkQuery extends PageQuery {

  /**
   * 始发地
   */
  origin?: string;

  /**
   * 目的地
   */
  destination?: string;

  /**
   * 最低收费(元)
   */
  minFee?: number;

  /**
   * 单价(元/KG)
   */
  pricePerKg?: number;

  /**
   * 日期范围参数
   */
  params?: any;
  
  /**
   * 企业id
   */
  companyId?: string;
}
