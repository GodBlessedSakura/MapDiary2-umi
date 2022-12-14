import React from 'react'
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { Layout, Menu, theme } from 'antd'
const { Header, Content, Footer, Sider } = Layout
import styles from './index.less'

const UserSettings = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken()
  return (
    <div className={styles.settings}>
      <Layout>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken)
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type)
          }}
        >
          <div className="logo" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['4']}
            items={[UserOutlined, VideoCameraOutlined, UploadOutlined, UserOutlined].map((icon, index) => ({
              key: String(index + 1),
              icon: React.createElement(icon),
              label: `nav ${index + 1}`,
            }))}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
          />
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
              content
            </div>
          </Content>
          <Footer
            style={{
              textAlign: 'center',
            }}
          >
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    </div>
  )
}
export default UserSettings
