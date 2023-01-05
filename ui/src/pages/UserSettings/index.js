import React from 'react'
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons'
import { Avatar, Layout, Menu, theme, Space, Dropdown, Button, Spin } from 'antd'
import withAuth from '@/hocs/withAuth'
import { Link, Outlet, history } from 'umi'
import { clearTokens } from '@/utils/token'
import UserContext from '@/context/user'
import styles from './index.less'

const { Header, Content, Footer, Sider } = Layout

const UserSettings = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken()
  const menuItems = [
    {
      key: '1',
      icon: <UserOutlined />,
      label: <Link to="/settings/user">用户设置</Link>,
    },
    {
      key: '2',
      icon: <SettingOutlined />,
      label: <Link to="/settings/privacy">隐私设置</Link>,
    },
  ]
  const logOut = () => {
    clearTokens()
    history.push('/login')
  }

  const getDefaultSelect = () => {
    const url = location.pathname
    if (url.includes('settings/user')) return '1'
    if (url.includes('settings/privacy')) return '2'
  }

  return (
    <UserContext.Consumer>
      {([user]) =>
        user ? (
          <div className={styles.settings}>
            <Layout>
              <Sider breakpoint="lg" theme="light">
                <Button
                  type="link"
                  onClick={() => {
                    history.push('/')
                  }}
                >
                  <div className={styles.logo} />
                </Button>
                <Menu theme="light" mode="inline" defaultSelectedKeys={getDefaultSelect()} items={menuItems} />
              </Sider>
              <Layout>
                <Header
                  className={styles.header}
                  style={{
                    background: colorBgContainer,
                  }}
                >
                  <h2>账号设置</h2>
                  <div className={styles['header-right']}>
                    <Space size={30}>
                      <div>
                        <Link to="/">回到主页</Link>
                      </div>
                      <div>
                        <Dropdown
                          menu={{
                            items: [
                              {
                                key: '1',
                                label: (
                                  <div onClick={logOut}>
                                    <Space>
                                      <LogoutOutlined />
                                      退出登录
                                    </Space>
                                  </div>
                                ),
                              },
                            ],
                          }}
                        >
                          <Avatar src={user?.avatar} icon={<UserOutlined />} size={46} />
                        </Dropdown>
                      </div>
                    </Space>
                  </div>
                </Header>
                <Content
                  style={{
                    margin: '24px 16px 0',
                  }}
                >
                  <div
                    style={{
                      padding: 24,
                      height: '100%',
                      overflow: 'auto',
                      background: colorBgContainer,
                    }}
                  >
                    <Outlet />
                  </div>
                </Content>
                <Footer
                  style={{
                    textAlign: 'center',
                  }}
                >
                  Copyright©SakuraFantasy 2022, All Rights Reserved
                </Footer>
              </Layout>
            </Layout>
          </div>
        ) : (
          <Spin size="large" />
        )
      }
    </UserContext.Consumer>
  )
}
export default withAuth(UserSettings)
