import React from 'react'
import { Button, Spin } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import './Header.less'

interface HeaderProps {
  loading?: boolean
  onRefresh?: () => void
}

export const Header: React.FC<HeaderProps> = ({ loading = false, onRefresh }) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="header-logo">招</div>
        <h1 className="header-title">招聘数据采集器</h1>
      </div>
      <div className="header-right">
        <Button
          type="primary"
          icon={loading ? <Spin size="small" /> : <ReloadOutlined />}
          onClick={onRefresh}
          loading={loading}
          className="header-refresh-btn"
        >
          {loading ? '采集中...' : '采集'}
        </Button>
      </div>
    </header>
  )
}

