export interface DeliveryDemandVO {
  /**
   * 主键ID
   */
  id: string | number;

  /**
   * 专人服务(元/人/次)
   */
  personalServiceFee: number;

  /**
   * 送货上楼(元/人/次)
   */
  upstairsFee: number;

  /**
   * 贴标(是/否)
   */
  labeling: string;

  /**
   * 卸货(是/否)
   */
  unloading: string;

  /**
   * 拆箱/换拖(是/否)
   */
  unpacking: string;

  /**
   * 备注
   */
  remark: string;

}

export interface DeliveryDemandForm extends BaseEntity {
  /**
   * 主键ID
   */
  id?: string | number;

  /**
   * 专人服务(元/人/次)
   */
  personalServiceFee?: number;

  /**
   * 送货上楼(元/人/次)
   */
  upstairsFee?: number;

  /**
   * 贴标(是/否)
   */
  labeling?: string;

  /**
   * 卸货(是/否)
   */
  unloading?: string;

  /**
   * 拆箱/换拖(是/否)
   */
  unpacking?: string;

  /**
   * 备注
   */
  remark?: string;

}

export interface DeliveryDemandQuery extends PageQuery {

  /**
   * 专人服务(元/人/次)
   */
  personalServiceFee?: number;

  /**
   * 送货上楼(元/人/次)
   */
  upstairsFee?: number;

  /**
   * 贴标(是/否)
   */
  labeling?: string;

  /**
   * 卸货(是/否)
   */
  unloading?: string;

  /**
   * 拆箱/换拖(是/否)
   */
  unpacking?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
