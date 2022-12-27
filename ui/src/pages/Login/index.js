import React from 'react'
import { Input, Form, Button, Switch } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Link } from 'umi'
import styles from './index.less'
import imgUrl from '@/assets/LoginLogo.JPG'

export default function Login() {
  const [loginForm] = Form.useForm()
  const handleLogIn = () => {
    loginForm.validateFields().then(() => {})
  }
  return (
    <div className={styles.background}>
      <div className={styles.login}>
        <img src={imgUrl} />
        <Form className={styles.form} form={loginForm} layout="vertical" onFinish={handleLogIn}>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                whitespace: true,
                message: 'Please input the username!',
              },
            ]}
          >
            <Input prefix={<UserOutlined />} autoComplete="off" placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                whitespace: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} autoComplete="off" placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" style={{ width: '100%' }} htmlType="submit">
              Login
            </Button>
          </Form.Item>
          <div className={styles.bottom}>
            <Form.Item>
              <div>
                <Form.Item name="keepLoggedIn" noStyle>
                  <Switch defaultChecked={false} />
                </Form.Item>
                <span style={{ color: '#1677ff' }}>&nbsp;&nbsp;Keep logged in</span>
              </div>
              <div>
                <Link to="/signup">Forget password?</Link>
              </div>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  )
}
