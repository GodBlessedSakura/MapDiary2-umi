import React, { useContext } from 'react'
import { Input, Form, Button, Switch } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Link, history, setLocale } from 'umi'
import { localeMapForUmi } from '@/locales/map'
import UserContext from '@/context/user'
import request from '@/utils/request'
import styles from './index.less'
import imgUrl from '@/assets/LoginLogo.JPG'
import { Md2FormatMessage } from '@/utils/locale'

export default function Login() {
  const [loginForm] = Form.useForm()
  const context = useContext(UserContext)
  const handleLogIn = () => {
    loginForm.validateFields().then((values) => {
      const { username, password } = values
      request
        .post('/login', {
          data: {
            username,
            password,
          },
        })
        .then((response) => {
          if (response.id) {
            const [user, getUserInfo] = context
            getUserInfo()
            history.push('/')
          }
        })
    })
  }
  return (
    <div className={styles.background}>
      <div className={styles.login}>
        <img src={imgUrl} />
        <Form className={styles.form} form={loginForm} layout="vertical" onFinish={() => handleLogIn()}>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                whitespace: true,
                message: Md2FormatMessage('UsernameInput'),
              },
            ]}
          >
            <Input prefix={<UserOutlined />} autoComplete="off" placeholder={Md2FormatMessage('Username')} />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                whitespace: true,
                message: Md2FormatMessage('PasswordInput'),
              },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} autoComplete="off" placeholder={Md2FormatMessage('Password')} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" style={{ width: '100%' }} htmlType="submit">
              {Md2FormatMessage('Login')}
            </Button>
          </Form.Item>
          <div className={styles.bottom}>
            <Form.Item>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div>
                  {Md2FormatMessage('NoAccount')}&nbsp;
                  <Link to="/signup">{Md2FormatMessage('SignUp')}</Link>
                </div>
                <div className={styles.locale}>
                  <Button size="small" type="link" onClick={() => setLocale(localeMapForUmi['EN'])}>
                    Eng
                  </Button>
                  |
                  <Button size="small" type="link" onClick={() => setLocale(localeMapForUmi['CN'])}>
                    中文
                  </Button>
                </div>
              </div>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  )
}
