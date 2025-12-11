/**
 * 招聘数据采集器 - 类型定义
 */

/**
 * 筛选配置
 */
export interface FilterConfig {
  /** 招聘网站 */
  website: 'boss' | 'liepin' | '51job' | 'zhaopin' | 'maimengaoping'
  /** 城市代码 */
  city: string
  /** 区域代码 */
  district: string
  /** 职位名称 */
  jobTitle: string
  /** 职位类型 */
  jobType: string
  /** 最小年龄 */
  minAge: number
  /** 最大年龄 */
  maxAge: number
  /** 最小薪资 (K) */
  minSalary: number
  /** 最大薪资 (K) */
  maxSalary: number
  /** 技能标签 */
  skills: string[]
}

/**
 * 职位数据
 */
export interface JobData {
  /** 职位ID */
  id: string
  /** 职位名称 */
  name: string
  /** 公司名称 */
  company: string
  /** 工作城市 */
  city: string
  /** 薪资范围 */
  salary: string
  /** 所需技能 */
  skills: string[]
  /** 匹配度评分 (0-100) */
  matchScore: number
}

/**
 * 采集统计信息
 */
export interface CollectionStats {
  /** 职位总数 */
  total: number
  /** 最后更新时间 */
  lastUpdate: string
  /** 数据来源 */
  source: string
}

/**
 * 消息类型
 */
export const MessageType = {
  FETCH_JOBS: 'FETCH_JOBS',
  GET_PAGE_DATA: 'GET_PAGE_DATA',
  UPDATE_CONFIG: 'UPDATE_CONFIG'
} as const

/**
 * 采集请求消息
 */
export interface FetchJobsMessage {
  type: typeof MessageType.FETCH_JOBS
  config: FilterConfig
  params: string
}

/**
 * 采集响应消息
 */
export interface FetchJobsResponse {
  success: boolean
  data?: JobData[]
  error?: string
}

/**
 * BOSS直聘 API 响应
 */
export interface ZhipinApiResponse {
  code: number
  message: string
  data?: ZhipinJob[]
  zpData?: {
    pageSize: number
    pageNo: number
    hasMore: boolean
    totalCount: number
  }
}

/**
 * BOSS直聘 职位项
 */
export interface ZhipinJob {
  encryptId: string
  positionId: number
  positionName: string
  companyFullName: string
  companyId: number
  companyLogoUrl: string
  cityName: string
  cityId: number | string
  salary: string
  workYear: string
  education: string
  financeStage: string
  companySize: string
  positionLables: string[]
  formatCreateTime: string
}

/**
 * 网站配置
 */
export interface WebsiteConfig {
  value: string
  label: string
}

/**
 * 城市配置
 */
export interface CityConfig {
  value: string
  label: string
}

/**
 * 区域配置
 */
export interface DistrictConfig {
  value: string
  label: string
}

/**
 * 存储数据结构
 */
export interface StorageData {
  filterConfig?: FilterConfig
  jobsData?: JobData[]
  stats?: CollectionStats
}

/**
 * 页面数据
 */
export interface PageData {
  title: string
  company: string
  salary: string
  location: string
}

