import React from 'react'
import { Avatar, Dropdown, Space } from 'antd'
import { Link, history } from 'umi'
import { clearTokens } from '@/utils/token'
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons'
import styles from './index.less'

const UAvatar = (props) => {
  const { avatar } = props
  const logOut = () => {
    clearTokens()
    history.push('/login')
  }
  const items = [
    {
      key: '1',
      label: (
        <Link to="/settings/user">
          <Space>
            <SettingOutlined />
            账号设置
          </Space>
        </Link>
      ),
    },
    {
      key: '2',
      label: (
        <div onClick={logOut}>
          <Space>
            <LogoutOutlined />
            退出登录
          </Space>
        </div>
      ),
    },
  ]
  return (
    <div className={styles.avatar}>
      <Dropdown
        arrow="true"
        menu={{
          items,
        }}
      >
        <Avatar size={46} icon={avatar ? null : <UserOutlined />} src={avatar} />
      </Dropdown>
    </div>
  )
}

export default React.memo(UAvatar)
