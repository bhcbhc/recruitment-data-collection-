import { useState, useEffect, useCallback } from 'react'
import { Layout, Tabs, ConfigProvider, theme } from 'antd'
import { Header, FilterPanel, ResultPanel } from './components'
import type { FilterConfig, JobData, CollectionStats } from './types/index'
import { MessageType } from './types/index'
import './popup.less'

const { Content } = Layout

interface ChromeAPI {
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

declare const chrome: ChromeAPI | undefined

// 获取 Chrome API，如果不存在则返回 mock 对象（用于开发环境）
const getChromeAPI = (): ChromeAPI => {
  if (typeof chrome !== 'undefined' && chrome?.storage) {
    return chrome
  }
  // 本地开发时的 mock 实现
  const mockChrome: ChromeAPI = {
    storage: {
      local: {
        get: (keys: string[], callback: (result: Record<string, unknown>) => void) => {
          const result: Record<string, unknown> = {}
          keys.forEach(key => {
            const value = localStorage.getItem(key)
            if (value) {
              try {
                result[key] = JSON.parse(value)
              } catch {
                result[key] = value
              }
            }
          })
          callback(result)
        },
        set: (data: Record<string, unknown>) => {
          Object.entries(data).forEach(([key, value]) => {
            localStorage.setItem(key, JSON.stringify(value))
          })
        }
      }
    },
    runtime: {
      sendMessage: (_msg: unknown, callback: (response: unknown) => void) => {
        console.log('Mock chrome.runtime.sendMessage:', _msg)
        callback({ success: false, error: '本地开发模式下不可用' })
      }
    }
  }
  return mockChrome
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'filter' | 'results'>('filter')
  const [loading, setLoading] = useState(false)
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
    getChromeAPI().storage.local.get(['filterConfig', 'jobsData', 'stats'], (result: Record<string, unknown>) => {
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
    getChromeAPI().storage.local.set({ filterConfig: newConfig })
  }, [])

  const handleConfigChange = (field: keyof FilterConfig, value: string | number | string[]) => {
    const newConfig = { ...config, [field]: value }
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
      getChromeAPI().runtime.sendMessage(
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
            getChromeAPI().storage.local.set({ stats: newStats })

            // 保存数据
            setJobs(fetchResponse.data || [])
            getChromeAPI().storage.local.set({ jobsData: fetchResponse.data || [] })

            // 切换到结果标签
            setActiveTab('results')
          }
        }
      )
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabItems = [
    {
      key: 'filter',
      label: '筛选条件',
      children: (
        <FilterPanel
          config={config}
          loading={loading}
          onConfigChange={handleConfigChange}
          onRefresh={handleRefresh}
        />
      )
    },
    {
      key: 'results',
      label: '职位列表',
      children: (
        <ResultPanel
          stats={stats}
          jobs={jobs}
          loading={loading}
        />
      )
    }
  ]

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2C5AA0',
          borderRadius: 6,
        },
        algorithm: theme.defaultAlgorithm,
      }}
    >
      <Layout className="app-layout" style={{ width: '48rem'}}>
        <Header
          loading={loading}
          onRefresh={handleRefresh}
        />
        <Content>
          <Tabs
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key as 'filter' | 'results')}
            items={tabItems}
            className="app-tabs"
            style={{ padding: '16px 0'}}
          />
        </Content>
      </Layout>
    </ConfigProvider>
  )
}
