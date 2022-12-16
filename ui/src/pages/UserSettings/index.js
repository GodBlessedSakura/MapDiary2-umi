import React from 'react'
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons'
import { Avatar, Layout, Menu, theme, Space, Dropdown } from 'antd'
import { Link, Outlet } from 'umi'
const { Header, Content, Footer, Sider } = Layout
import styles from './index.less'

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
    console.log('退出登录')
  }

  return (
    <div className={styles.settings}>
      <Layout>
        <Sider breakpoint="lg" theme="light">
          <div className={styles.logo} />
          <Menu theme="light" mode="inline" defaultSelectedKeys={['1']} items={menuItems} />
        </Sider>
        <Layout>
          <Header
            className={styles.header}
            style={{
              background: colorBgContainer,
            }}
          >
            <div>账号设置</div>
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
                    <Avatar size={46} />
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
  )
}
export default UserSettings
