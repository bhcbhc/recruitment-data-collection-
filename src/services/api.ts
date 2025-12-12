/**
 * BOSS直聘 API 服务
 */

import type { CityOption, JobCategory } from '../types'

/**
 * 获取城市列表
 */
export async function fetchCities(): Promise<CityOption[]> {
  try {
    const response = await fetch(
      'https://www.zhipin.com/wapi/zpgeek/common/data/city/site.json',
      {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Referer': 'https://www.zhipin.com/',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include'
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`)
    }

    const data = await response.json()

    if (data.code !== 0 || !data.zpData?.hotCitySites) {
      throw new Error('Invalid city data format')
    }

    return data.zpData.hotCitySites
  } catch (error) {
    console.error('Failed to fetch cities:', error)
    return getDefaultCities()
  }
}

/**
 * 获取职位分类
 */
export async function fetchJobPositions(cityCode: string): Promise<JobCategory[]> {
  try {
    const response = await fetch(
      `https://www.zhipin.com/wapi/zpCommon/data/getCityShowPosition?cityCode=${cityCode}`,
      {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Referer': 'https://www.zhipin.com/',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include'
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`)
    }

    const data = await response.json()

    if (data.code !== 0 || !data.zpData?.position) {
      throw new Error('Invalid position data format')
    }

    return data.zpData.position
  } catch (error) {
    console.error('Failed to fetch job positions:', error)
    return getDefaultJobCategories()
  }
}

/**
 * 默认城市列表
 */
function getDefaultCities(): CityOption[] {
  return [
    { name: '全国', code: 100010000, url: '/?city=100010000' },
    { name: '北京', code: 101010100, url: '/beijing/' },
    { name: '上海', code: 101020100, url: '/shanghai/' },
    { name: '深圳', code: 101210100, url: '/shenzhen/' },
    { name: '杭州', code: 101280100, url: '/hangzhou/' },
    { name: '南京', code: 101190400, url: '/nanjing/' }
  ]
}

/**
 * 默认职位分类
 */
function getDefaultJobCategories(): JobCategory[] {
  return [
    {
      code: 1010000,
      name: '互联网/AI',
      tip: null,
      subLevelModelList: [
        {
          code: 1000020,
          name: '后端开发',
          tip: null,
          subLevelModelList: [
            { code: 100101, name: 'Java', tip: null, subLevelModelList: null },
            { code: 100109, name: 'Python', tip: null, subLevelModelList: null },
            { code: 100116, name: 'Golang', tip: null, subLevelModelList: null }
          ]
        },
        {
          code: 1000030,
          name: '前端/移动开发',
          tip: null,
          subLevelModelList: [
            { code: 100901, name: '前端开发工程师', tip: null, subLevelModelList: null },
            { code: 100202, name: 'Android', tip: null, subLevelModelList: null },
            { code: 100203, name: 'iOS', tip: null, subLevelModelList: null }
          ]
        }
      ]
    }
  ]
}

/**
 * 薪资范围映射
 */
export const SALARY_OPTIONS: Record<string, string> = {
  '402': '3K以下',
  '403': '3-5K',
  '404': '5-10K',
  '405': '10-20K',
  '406': '20-50K',
  '407': '50K以上'
}

/**
 * 学历要求映射
 */
export const DEGREE_OPTIONS: Record<string, string> = {
  '209': '初中及以下',
  '208': '中专/中技',
  '206': '高中',
  '202': '大专',
  '203': '本科',
  '204': '硕士',
  '205': '博士'
}

/**
 * 求职类型映射
 */
export const JOB_REC_TYPE_OPTIONS: Record<string, string> = {
  '0': '不限',
  '1901': '全职',
  '1903': '兼职'
}

/**
 * 工作经验映射
 */
export const EXPERIENCE_OPTIONS: Record<string, string> = {
  '0': '不限',
  '108': '在校生',
  '102': '应届生',
  '101': '经验不限',
  '103': '1年以内',
  '104': '1-3年',
  '105': '3-5年',
  '106': '5-10年',
  '107': '10年以上'
}

