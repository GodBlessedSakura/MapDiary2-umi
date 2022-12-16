import React, { useState } from 'react'
import { Avatar, Dropdown, Space } from 'antd'
import { Link } from 'umi'
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons'
import styles from './index.less'

const UAvatar = () => {
  const [userAvatar, setUserAvatar] = useState(null)
  const logOut = () => {
    console.log('退出登录')
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
        <Avatar size={46} icon={userAvatar || <UserOutlined />} />
      </Dropdown>
    </div>
  )
}

export default React.memo(UAvatar)
