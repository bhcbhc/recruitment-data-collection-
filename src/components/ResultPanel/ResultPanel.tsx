import React from 'react'
import { Card, Row, Col, Statistic, Empty, Spin, Space } from 'antd'
import type { JobData, CollectionStats } from '../../types'
import './ResultPanel.less'

interface ResultPanelProps {
  stats: CollectionStats
  jobs: JobData[]
  loading?: boolean
}

export const ResultPanel: React.FC<ResultPanelProps> = ({
  stats,
  jobs,
  loading = false
}) => {
  return (
    <div className="result-panel">
      <Spin spinning={loading}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          {/* 统计信息 */}
          <Card className="stats-card">
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="职位数量"
                  value={stats.total}
                  valueStyle={{ color: '#1890ff', fontWeight: 'bold', fontSize: '24px' }}
                />
              </Col>
              <Col span={16}>
                <Statistic
                  title="最后更新"
                  value={stats.lastUpdate || '未更新'}
                  valueStyle={{ fontSize: '12px', color: '#666' }}
                />
              </Col>
            </Row>
          </Card>

          {/* 职位列表 */}
          {jobs.length === 0 ? (
            <Empty
              description="暂无职位数据"
              style={{ marginTop: '40px' }}
            />
          ) : (
            <div className="jobs-list">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </Space>
      </Spin>
    </div>
  )
}

interface JobCardProps {
  job: JobData
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <Card
      className="job-card"
      hoverable
      bodyStyle={{ padding: '12px' }}
    >
      <div className="job-header">
        <h4 className="job-title">{job.name || '职位名称'}</h4>
        <span className="job-match-score">匹配度: {job.matchScore}%</span>
      </div>
      <div className="job-info">
        <div className="info-row">
          {job.company && <span className="info-item company">{job.company}</span>}
          {job.salary && <span className="info-item salary">{job.salary}</span>}
          {job.city && <span className="info-item location">{job.city}</span>}
        </div>
      </div>
      {job.skills && job.skills.length > 0 && (
        <div className="job-skills">
          {job.skills.slice(0, 3).map((skill, idx) => (
            <span key={idx} className="skill-badge">{skill}</span>
          ))}
          {job.skills.length > 3 && (
            <span className="skill-more">+{job.skills.length - 3}</span>
          )}
        </div>
      )}
    </Card>
  )
}



