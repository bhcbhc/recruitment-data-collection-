import React, { useState, useEffect } from 'react'
import { Card, Input, Select, Slider, Tag, Button, Space, message, Spin } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { FilterConfig, CityOption, JobCategory } from '../../types'
import { fetchCities, fetchJobPositions, SALARY_OPTIONS, DEGREE_OPTIONS, JOB_REC_TYPE_OPTIONS, EXPERIENCE_OPTIONS } from '../../services/api'
import './FilterPanel.less'

const WEBSITES = [
  { value: 'boss', label: 'BOSS直聘' },
  { value: 'liepin', label: '猎聘' },
  { value: '51job', label: '51Job' },
  { value: 'zhaopin', label: '智联招聘' },
  { value: 'maimengaoping', label: '脉脉高聘' }
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
  const [cities, setCities] = useState<CityOption[]>([])
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([])
  const [loadingCities, setLoadingCities] = useState(false)
  const [loadingPositions, setLoadingPositions] = useState(false)

  // 获取城市列表
  useEffect(() => {
    if (config.website === 'boss') {
      setLoadingCities(true)
      fetchCities()
        .then(data => {
          setCities(data)
          setLoadingCities(false)
        })
        .catch(() => {
          setLoadingCities(false)
        })
    }
  }, [config.website])

  // 获取职位分类
  useEffect(() => {
    if (config.website === 'boss' && config.city) {
      setLoadingPositions(true)
      fetchJobPositions(config.city.toString())
        .then(data => {
          setJobCategories(data)
          setLoadingPositions(false)
        })
        .catch(() => {
          setLoadingPositions(false)
        })
    }
  }, [config.website, config.city])

  const handleCityChange = (city: string) => {
    onConfigChange('city', city)
    onConfigChange('district', '')
    onConfigChange('jobCategory', '')
    onConfigChange('jobType', '')
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

  const websiteOptions = WEBSITES.map(site => ({
    label: site.label,
    value: site.value
  }))

  // 城市选项 - 仅当选择BOSS直聘时才显示动态城市
  const cityOptions = config.website === 'boss' 
    ? cities.map(city => ({
        label: city.name,
        value: city.code.toString()
      }))
    : [{ label: '北京', value: '101010100' }]

  // 职位分类选项
  const jobCategoryOptions = jobCategories.map(category => ({
    label: category.name,
    value: category.code.toString()
  }))

  // 职位类型选项（二级）
  const currentCategory = jobCategories.find(cat => cat.code.toString() === config.jobCategory)
  const jobTypeOptions = currentCategory?.subLevelModelList?.map(position => ({
    label: position.name,
    value: position.code.toString()
  })) || []

  // 获取选中职位类型的第三级数据（如果存在）
  const currentJobType = currentCategory?.subLevelModelList?.find(pos => pos.code.toString() === config.jobType)
  const jobSubTypeOptions = currentJobType?.subLevelModelList?.map(subType => ({
    label: subType.name,
    value: subType.code.toString()
  })) || []

  // 薪资选项
  const salaryOptions = Object.entries(SALARY_OPTIONS).map(([code, label]) => ({
    label,
    value: code
  }))

  // 学历选项
  const degreeOptions = Object.entries(DEGREE_OPTIONS).map(([code, label]) => ({
    label,
    value: code
  }))

  // 求职类型选项
  const jobRecTypeOptions = Object.entries(JOB_REC_TYPE_OPTIONS)
    .filter(([code]) => code !== '0')
    .map(([code, label]) => ({
      label,
      value: code
    }))

  // 工作经验选项
  const experienceOptions = Object.entries(EXPERIENCE_OPTIONS)
    .filter(([code]) => code !== '0')
    .map(([code, label]) => ({
      label,
      value: code
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

            {/* BOSS直聘特定的筛选选项 */}
            {config.website === 'boss' && (
              <>
                <div className="filter-group">
                  <label className="filter-label">城市</label>
                  <Spin spinning={loadingCities}>
                    <Select
                      value={config.city}
                      onChange={handleCityChange}
                      options={cityOptions}
                      placeholder="选择城市"
                      style={{ width: '100%' }}
                      loading={loadingCities}
                    />
                  </Spin>
                </div>

                <div className="filter-group">
                  <label className="filter-label">职位分类</label>
                  <Spin spinning={loadingPositions}>
                    <Select
                      value={config.jobCategory}
                      onChange={(value) => {
                        onConfigChange('jobCategory', value)
                        onConfigChange('jobType', '')
                      }}
                      options={jobCategoryOptions}
                      placeholder="选择职位分类"
                      style={{ width: '100%' }}
                      loading={loadingPositions}
                      allowClear
                    />
                  </Spin>
                </div>

                <div className="filter-group">
                  <label className="filter-label">职位类型</label>
                  <Select
                    value={config.jobType}
                    onChange={(value) => {
                      onConfigChange('jobType', value)
                      onConfigChange('jobSubType', '')
                    }}
                    options={jobTypeOptions}
                    placeholder="选择职位类型"
                    style={{ width: '100%' }}
                    disabled={!config.jobCategory}
                    allowClear
                  />
                </div>

                {/* 第三级职位子类型（如果存在） */}
                {jobSubTypeOptions.length > 0 && (
                  <div className="filter-group">
                    <label className="filter-label">职位详细类型</label>
                    <Select
                      value={config.jobSubType}
                      onChange={(value) => onConfigChange('jobSubType', value)}
                      options={jobSubTypeOptions}
                      placeholder="选择职位详细类型"
                      style={{ width: '100%' }}
                      disabled={!config.jobType}
                      allowClear
                    />
                  </div>
                )}

                <div className="filter-group">
                  <label className="filter-label">薪资范围</label>
                  <Select
                    mode="multiple"
                    value={config.salary || []}
                    onChange={(value) => onConfigChange('salary', value)}
                    options={salaryOptions}
                    placeholder="选择薪资范围"
                    style={{ width: '100%' }}
                    maxTagCount="responsive"
                  />
                </div>

                <div className="filter-group">
                  <label className="filter-label">学历要求</label>
                  <Select
                    mode="multiple"
                    value={config.degree || []}
                    onChange={(value) => onConfigChange('degree', value)}
                    options={degreeOptions}
                    placeholder="选择学历要求"
                    style={{ width: '100%' }}
                    maxTagCount="responsive"
                  />
                </div>

                <div className="filter-group">
                  <label className="filter-label">求职类型</label>
                  <Select
                    mode="multiple"
                    value={config.jobRecType || []}
                    onChange={(value) => onConfigChange('jobRecType', value)}
                    options={jobRecTypeOptions}
                    placeholder="选择求职类型"
                    style={{ width: '100%' }}
                    maxTagCount="responsive"
                  />
                </div>

                <div className="filter-group">
                  <label className="filter-label">工作经验</label>
                  <Select
                    mode="multiple"
                    value={config.experience || []}
                    onChange={(value) => onConfigChange('experience', value)}
                    options={experienceOptions}
                    placeholder="选择工作经验"
                    style={{ width: '100%' }}
                    maxTagCount="responsive"
                  />
                </div>
              </>
            )}

            {/* 其他网站简化的选项 */}
            {config.website !== 'boss' && (
              <div className="filter-group">
                <label className="filter-label">职位类型</label>
                <Select
                  value={config.jobType}
                  onChange={(value) => onConfigChange('jobType', value)}
                  options={[
                    { value: '1901', label: '全职' },
                    { value: '1902', label: '兼职' },
                    { value: '1903', label: '实习' }
                  ]}
                  placeholder="选择职位类型"
                  style={{ width: '100%' }}
                  allowClear
                />
              </div>
            )}
          </Space>
        </Card>

        {/* 年龄设置 */}
        {config.website !== 'boss' && (
          <Card title="年龄范围" type="inner">
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
            </Space>
          </Card>
        )}

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
