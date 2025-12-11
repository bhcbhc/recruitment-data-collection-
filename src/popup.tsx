import { useState, useEffect, useCallback } from 'react'
import './popup.css'
import type { FilterConfig, JobData, CollectionStats } from './types/index'
import { MessageType } from './types/index'

declare const chrome: {
  storage: {
    local: {
      get: (keys: string[], callback: (result: Record<string, unknown>) => void) => void
      set: (data: Record<string, unknown>) => void
    }
  }
  runtime: {
    sendMessage: (message: unknown, callback: (response: unknown) => void) => void
  }
}

const WEBSITES = [
  { value: 'boss', label: 'BOSS直聘' },
  { value: 'liepin', label: '猎聘' },
  { value: '51job', label: '51Job' },
  { value: 'zhaopin', label: '智联招聘' },
  { value: 'maimengaoping', label: '脉脉高聘' }
]

const CITIES = [
  { value: '101010100', label: '北京' },
  { value: '101020100', label: '上海' },
  { value: '101210100', label: '深圳' },
  { value: '101280100', label: '杭州' },
  { value: '101190400', label: '南京' }
]

const CITY_DISTRICTS: Record<string, Array<{ value: string; label: string }>> = {
  '101010100': [
    { value: '1', label: '朝阳区' },
    { value: '2', label: '海淀区' },
    { value: '3', label: '东城区' },
    { value: '4', label: '西城区' },
    { value: '5', label: '丰台区' }
  ],
  '101020100': [
    { value: '1', label: '浦东新区' },
    { value: '2', label: '静安区' },
    { value: '3', label: '黄浦区' },
    { value: '4', label: '长宁区' }
  ],
  '101210100': [
    { value: '1', label: '南山区' },
    { value: '2', label: '福田区' },
    { value: '3', label: '罗湖区' },
    { value: '4', label: '龙华区' }
  ]
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'filter' | 'results'>('filter')
  const [loading, setLoading] = useState(false)
  const [skillInput, setSkillInput] = useState('')
  const [stats, setStats] = useState<CollectionStats>({
    total: 0,
    lastUpdate: '',
    source: 'BOSS直聘'
  })
  const [jobs, setJobs] = useState<JobData[]>([])

  const [config, setConfig] = useState<FilterConfig>({
    website: 'boss',
    city: '101010100',
    district: '',
    jobTitle: '',
    jobType: '',
    minAge: 25,
    maxAge: 35,
    minSalary: 15,
    maxSalary: 25,
    skills: ['React', 'Vue', 'Node.js']
  })

  // 加载配置
  useEffect(() => {
    chrome.storage.local.get(['filterConfig', 'jobsData', 'stats'], (result: Record<string, unknown>) => {
      if (result.filterConfig as FilterConfig) {
        setConfig(result.filterConfig as FilterConfig)
      }
      if (result.jobsData as JobData[]) {
        setJobs(result.jobsData as JobData[])
      }
      if (result.stats as CollectionStats) {
        setStats(result.stats as CollectionStats)
      }
    })
  }, [])

  // 保存配置
  const saveConfig = useCallback((newConfig: FilterConfig) => {
    chrome.storage.local.set({ filterConfig: newConfig })
  }, [])

  const handleConfigChange = (field: keyof FilterConfig, value: string | number | string[]) => {
    const newConfig = { ...config, [field]: value }
    setConfig(newConfig)
    saveConfig(newConfig)
  }

  const handleCityChange = (city: string) => {
    handleConfigChange('city', city)
    handleConfigChange('district', '')
  }

  const addSkill = () => {
    if (skillInput.trim() && !config.skills.includes(skillInput.trim())) {
      const newConfig = {
        ...config,
        skills: [...config.skills, skillInput.trim()]
      }
      setConfig(newConfig)
      saveConfig(newConfig)
      setSkillInput('')
    }
  }

  const removeSkill = (skill: string) => {
    const newConfig = {
      ...config,
      skills: config.skills.filter(s => s !== skill)
    }
    setConfig(newConfig)
    saveConfig(newConfig)
  }

  const handleRefresh = async () => {
    setLoading(true)
    try {
      // 构建请求参数
      const params = new URLSearchParams({
        page: '1',
        pageSize: '15',
        city: config.city,
        encryptExpectId: '',
        mixExpectType: '',
        expectInfo: '',
        jobType: config.jobType || '1901',
        salary: '',
        experience: '',
        degree: '',
        industry: '',
        scale: '',
        _: Date.now().toString()
      })

      // 发送消息给service worker
      chrome.runtime.sendMessage(
        {
          type: MessageType.FETCH_JOBS,
          config: config,
          params: params.toString()
        },
        (response: unknown) => {
          const fetchResponse = response as { success: boolean; data?: JobData[] }
          if (fetchResponse && fetchResponse.success) {
            // 更新统计信息
            const newStats: CollectionStats = {
              total: fetchResponse.data?.length || 0,
              lastUpdate: new Date().toLocaleString('zh-CN'),
              source: 'BOSS直聘'
            }
            setStats(newStats)
            chrome.storage.local.set({ stats: newStats })

            // 保存数据
            setJobs(fetchResponse.data || [])
            chrome.storage.local.set({ jobsData: fetchResponse.data || [] })

            // 切换到结果标签
            setActiveTab('results')
          } else {
            alert('数据采集失败，请检查网络或配置')
          }
        }
      )
    } catch (error) {
      console.error('Error:', error)
      alert('采集失败: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full h-full bg-gray-50 flex flex-col">
      {/* 顶部功能栏 */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-sm">
            招
          </div>
          <h1 className="text-base font-bold text-gray-900">招聘数据采集器</h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleRefresh}
            disabled={loading}
            className="icon-btn"
            title="刷新数据"
          >
            {loading ? <span className="loading-spinner"></span> : <i className="fas fa-sync-alt text-sm"></i>}
          </button>
          <button className="icon-btn" title="设置">
            <i className="fas fa-cog text-sm"></i>
          </button>
        </div>
      </div>

      {/* 标签切换 */}
      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'filter' ? 'active' : ''}`}
          onClick={() => setActiveTab('filter')}
        >
          <i className="fas fa-sliders-h mr-1"></i> 筛选条件
        </button>
        <button 
          className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
        >
          <i className="fas fa-list mr-1"></i> 职位列表
        </button>
      </div>

      {/* 筛选区域 */}
      {activeTab === 'filter' && (
        <div className="flex-1 overflow-y-auto hide-scrollbar px-4 py-3 space-y-4">
          {/* 基础筛选 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <i className="fas fa-filter text-blue-600"></i> 基础筛选
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="搜索岗位名称..."
                value={config.jobTitle}
                onChange={(e) => handleConfigChange('jobTitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 transition-smooth"
              />

              <select
                value={config.website}
                onChange={(e) => handleConfigChange('website', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 transition-smooth"
              >
                {WEBSITES.map(w => (
                  <option key={w.value} value={w.value}>{w.label}</option>
                ))}
              </select>

              <div className="flex gap-2">
                <select
                  value={config.city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 transition-smooth"
                >
                  {CITIES.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>

                <select
                  value={config.district}
                  onChange={(e) => handleConfigChange('district', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 transition-smooth"
                >
                  <option value="">选择区域</option>
                  {(CITY_DISTRICTS[config.city] || []).map(d => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>

              <select
                value={config.jobType}
                onChange={(e) => handleConfigChange('jobType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 transition-smooth"
              >
                <option value="">全部岗位类型</option>
                <option value="1901">全职</option>
                <option value="1902">兼职</option>
                <option value="1903">实习</option>
              </select>
            </div>
          </div>

          {/* 薪资与年龄 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <i className="fas fa-chart-pie text-green-600"></i> 薪资与年龄
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-medium text-gray-700">年龄范围</label>
                  <span className="text-xs font-semibold text-blue-600">{config.minAge}-{config.maxAge}岁</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="range"
                    min="18"
                    max="65"
                    value={config.minAge}
                    onChange={(e) => handleConfigChange('minAge', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <input
                    type="range"
                    min="18"
                    max="65"
                    value={config.maxAge}
                    onChange={(e) => handleConfigChange('maxAge', parseInt(e.target.value))}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-medium text-gray-700">薪资范围</label>
                  <span className="text-xs font-semibold text-green-600">{config.minSalary}K-{config.maxSalary}K/月</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={config.minSalary}
                    onChange={(e) => handleConfigChange('minSalary', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={config.maxSalary}
                    onChange={(e) => handleConfigChange('maxSalary', parseInt(e.target.value))}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 技能标签 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <i className="fas fa-tags text-purple-600"></i> 技能标签
            </h3>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {config.skills.map((skill) => (
                  <span key={skill} className="badge badge-blue flex items-center gap-2">
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="font-bold hover:opacity-70"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="添加技能 (如: React, Python)"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addSkill()
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 transition-smooth"
                />
                <button
                  onClick={addSkill}
                  className="button-primary px-3"
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            </div>
          </div>

          {/* 采集按钮 */}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="w-full button-primary flex items-center justify-center gap-2 py-3 mt-4"
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                采集中...
              </>
            ) : (
              <>
                <i className="fas fa-download"></i>
                点击刷新采集数据
              </>
            )}
          </button>
        </div>
      )}

      {/* 结果区域 */}
      {activeTab === 'results' && (
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          {/* 统计信息 */}
          {stats.total > 0 && (
            <div className="bg-white border-b border-gray-100 px-4 py-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="stat-card">
                  <div className="stat-number">{stats.total}</div>
                  <div className="stat-label">职位总数</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number" style={{ color: '#16a34a' }}>86%</div>
                  <div className="stat-label">匹配度</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number" style={{ color: '#0284c7' }}>
                    {new Date().toLocaleTimeString('zh-CN')}
                  </div>
                  <div className="stat-label">更新时间</div>
                </div>
              </div>
            </div>
          )}

          {/* 职位列表 */}
          <div className="px-4 py-4">
            {jobs.length > 0 ? (
              <div className="space-y-3">
                {jobs.map((job, index) => (
                  <div key={job.id || index} className="job-card">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="job-title">{job.name}</h4>
                        <p className="job-info">{job.company} · {job.city}</p>
                      </div>
                      <span className={`badge badge-green text-xs`}>
                        {job.matchScore || 85}% 匹配
                      </span>
                    </div>
                    <p className="job-info mb-3">{job.salary}</p>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="badge badge-blue">
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 3 && (
                        <span className="badge badge-blue">
                          +{job.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <i className="fas fa-inbox"></i>
                </div>
                <p className="text-sm font-medium">还没有采集数据</p>
                <p className="text-xs mt-2">点击顶部刷新按钮采集职位信息</p>
              </div>
            )}
          </div>

          {/* 底部信息 */}
          {stats.total > 0 && (
            <div className="bg-gray-50 border-t border-gray-100 px-4 py-3 text-center">
              <p className="text-xs text-gray-600">
                数据更新: {stats.lastUpdate} · 来源: {stats.source}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

