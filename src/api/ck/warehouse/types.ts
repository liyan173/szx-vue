export interface WarehouseVO {
  /**
   * 主键ID
   */
  id: string | number;

  /**
   * 仓库名称
   */
  warehouseName: string;

  /**
   * 占地(亩)
   */
  areaMu: number;

  /**
   * 土地属性
   */
  landProperty: string;

  /**
   * 使用年限
   */
  useYears: number;

  /**
   * 楼栋数量
   */
  buildingCount: number;

  /**
   * 容积率
   */
  volumeRatio: number;

  /**
   * 层高
   */
  floorHeight: number;

  /**
   * 仓库总面积（㎡）
   */
  totalArea: number;

  /**
   * 仓库管理方式
   */
  manageType: string;

  /**
   * 所属区域
   */
  region: string;

  /**
   * 详细地址
   */
  address: string;

  /**
   * 主要品类
   */
  mainCategory: string;

  /**
   * 仓库内配套
   */
  innerFacilities: string;

  /**
   * 仓库外配套
   */
  outerFacilities: string;

  /**
   * 园区安保
   */
  securityInfo: string;

  /**
   * 仓库优势
   */
  advantage: string;

  /**
   * 仓库功能
   */
  functionInfo: string;

  /**
   * 仓库实景展示
   */
  gallery: string;

  /**
   * 仓库实景展示Url
   */
  galleryUrl: string;
  /**
   * 消防等级证书
   */
  fireLevel: string;

  /**
   * 消防等级证书Url
   */
  fireLevelUrl: string;
  /**
   * 消防证书有效日期
   */
  fireExpireDate: string;

  /**
   * 各类仓库面积
   */
  warehouseAreaInfo: string;

}

export interface WarehouseForm extends BaseEntity {
  /**
   * 主键ID
   */
  id?: string | number;

  /**
   * 仓库名称
   */
  warehouseName?: string;

  /**
   * 占地(亩)
   */
  areaMu?: number;

  /**
   * 土地属性
   */
  landProperty?: string;

  /**
   * 使用年限
   */
  useYears?: number;

  /**
   * 楼栋数量
   */
  buildingCount?: number;

  /**
   * 容积率
   */
  volumeRatio?: number;

  /**
   * 层高
   */
  floorHeight?: number;

  /**
   * 仓库总面积（㎡）
   */
  totalArea?: number;

  /**
   * 仓库管理方式
   */
  manageType?: string;

  /**
   * 所属区域
   */
  region?: string;

  /**
   * 详细地址
   */
  address?: string;

  /**
   * 主要品类
   */
  mainCategory?: string;

  /**
   * 仓库内配套
   */
  innerFacilities?: string;

  /**
   * 仓库外配套
   */
  outerFacilities?: string;

  /**
   * 园区安保
   */
  securityInfo?: string;

  /**
   * 仓库优势
   */
  advantage?: string;

  /**
   * 仓库功能
   */
  functionInfo?: string;

  /**
   * 仓库实景展示
   */
  gallery?: string;

  /**
   * 消防等级证书
   */
  fireLevel?: string;

  /**
   * 消防证书有效日期
   */
  fireExpireDate?: string;

  /**
   * 各类仓库面积
   */
  warehouseAreaInfo?: string;

}

export interface WarehouseQuery extends PageQuery {

  /**
   * 仓库名称
   */
  warehouseName?: string;

  /**
   * 占地(亩)
   */
  areaMu?: number;

  /**
   * 土地属性
   */
  landProperty?: string;

  /**
   * 使用年限
   */
  useYears?: number;

  /**
   * 楼栋数量
   */
  buildingCount?: number;

  /**
   * 容积率
   */
  volumeRatio?: number;

  /**
   * 层高
   */
  floorHeight?: number;

  /**
   * 仓库总面积（㎡）
   */
  totalArea?: number;

  /**
   * 仓库管理方式
   */
  manageType?: string;

  /**
   * 所属区域
   */
  region?: string;

  /**
   * 详细地址
   */
  address?: string;

  /**
   * 主要品类
   */
  mainCategory?: string;

  /**
   * 仓库内配套
   */
  innerFacilities?: string;

  /**
   * 仓库外配套
   */
  outerFacilities?: string;

  /**
   * 园区安保
   */
  securityInfo?: string;

  /**
   * 仓库优势
   */
  advantage?: string;

  /**
   * 仓库功能
   */
  functionInfo?: string;

  /**
   * 仓库实景展示
   */
  gallery?: string;

  /**
   * 消防等级证书
   */
  fireLevel?: string;

  /**
   * 消防证书有效日期
   */
  fireExpireDate?: string;

  /**
   * 各类仓库面积
   */
  warehouseAreaInfo?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
