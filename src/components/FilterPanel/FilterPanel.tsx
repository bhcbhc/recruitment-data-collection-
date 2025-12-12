import React, { useState } from 'react'
import { Card, Input, Select, Slider, Tag, Button, Space, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { FilterConfig } from '../../types'
import './FilterPanel.less'

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

const JOB_TYPES = [
  { value: '1901', label: '全职' },
  { value: '1902', label: '兼职' },
  { value: '1903', label: '实习' }
]

interface FilterPanelProps {
  config: FilterConfig
  loading?: boolean
  onConfigChange: (field: keyof FilterConfig, value: string | number | string[]) => void
  onRefresh?: () => void
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  config,
  loading = false,
  onConfigChange,
  onRefresh
}) => {
  const [skillInput, setSkillInput] = useState('')

  const handleCityChange = (city: string) => {
    onConfigChange('city', city)
    onConfigChange('district', '')
  }

  const addSkill = () => {
    if (skillInput.trim() && !config.skills.includes(skillInput.trim())) {
      const newSkills = [...config.skills, skillInput.trim()]
      onConfigChange('skills', newSkills)
      setSkillInput('')
      setTimeout(() => {
        message.success('技能已添加')
      }, 100)
    }
  }

  const removeSkill = (skill: string) => {
    const newSkills = config.skills.filter(s => s !== skill)
    onConfigChange('skills', newSkills)
  }

  const cityOptions = CITIES.map(city => ({
    label: city.label,
    value: city.value
  }))

  const districtOptions = (CITY_DISTRICTS[config.city] || []).map(district => ({
    label: district.label,
    value: district.value
  }))

  const jobTypeOptions = JOB_TYPES.map(type => ({
    label: type.label,
    value: type.value
  }))

  const websiteOptions = WEBSITES.map(site => ({
    label: site.label,
    value: site.value
  }))

  return (
    <div className="filter-panel">
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* 基础筛选 */}
        <Card title="基础筛选" type="inner">
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <div className="filter-group">
              <label className="filter-label">职位名称</label>
              <Input
                placeholder="搜索岗位名称..."
                value={config.jobTitle}
                onChange={(e) => onConfigChange('jobTitle', e.target.value)}
                allowClear
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">招聘网站</label>
              <Select
                value={config.website}
                onChange={(value) => onConfigChange('website', value)}
                options={websiteOptions}
                style={{ width: '100%' }}
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">城市与地区</label>
              <Space
                style={{
                  width: '100%',
                  display: 'flex',
                  gap: '8px'
                }}
                size={0}
              >
                <Select
                  value={config.city}
                  onChange={handleCityChange}
                  options={cityOptions}
                  style={{ flex: 1, minWidth: 0 }}
                />
                <Select
                  value={config.district}
                  onChange={(value) => onConfigChange('district', value)}
                  options={districtOptions}
                  placeholder="选择区域"
                  style={{ flex: 1, minWidth: 0 }}
                  allowClear
                />
              </Space>
            </div>

            <div className="filter-group">
              <label className="filter-label">职位类型</label>
              <Select
                value={config.jobType}
                onChange={(value) => onConfigChange('jobType', value)}
                options={jobTypeOptions}
                placeholder="选择职位类型"
                style={{ width: '100%' }}
                allowClear
              />
            </div>
          </Space>
        </Card>

        {/* 薪资与年龄 */}
        <Card title="薪资与年龄" type="inner">
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <div className="filter-group">
              <label className="filter-label">
                年龄范围: {config.minAge}-{config.maxAge}岁
              </label>
              <Slider
                range
                min={18}
                max={65}
                value={[config.minAge, config.maxAge]}
                onChange={(values) => {
                  onConfigChange('minAge', values[0])
                  onConfigChange('maxAge', values[1])
                }}
                marks={{
                  18: '18',
                  65: '65'
                }}
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">
                薪资范围: {config.minSalary}K-{config.maxSalary}K/月
              </label>
              <Slider
                range
                min={10}
                max={100}
                step={5}
                value={[config.minSalary, config.maxSalary]}
                onChange={(values) => {
                  onConfigChange('minSalary', values[0])
                  onConfigChange('maxSalary', values[1])
                }}
                marks={{
                  10: '10K',
                  100: '100K'
                }}
              />
            </div>
          </Space>
        </Card>

        {/* 技能标签 */}
        <Card title="技能标签" type="inner">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div className="skills-container">
              {config.skills.map((skill) => (
                <Tag
                  key={skill}
                  closable
                  onClose={() => removeSkill(skill)}
                  color="blue"
                  className="skill-tag"
                >
                  {skill}
                </Tag>
              ))}
            </div>
            <Space
              style={{
                width: '100%',
                display: 'flex',
                gap: '8px'
              }}
              size={0}
            >
              <Input
                placeholder="添加技能 (如: React, Python)"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onPressEnter={addSkill}
                style={{ flex: 1, minWidth: 0 }}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={addSkill}
              >
                添加
              </Button>
            </Space>
          </Space>
        </Card>

        {/* 操作按钮 */}
        <Button
          type="primary"
          size="large"
          loading={loading}
          onClick={onRefresh}
          block
          className="search-button"
        >
          {loading ? '采集中...' : '开始采集'}
        </Button>
      </Space>
    </div>
  )
}

