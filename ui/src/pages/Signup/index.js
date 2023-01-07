import React, { useContext } from 'react'
import { Link, history } from 'umi'
import { Form, Input, Button, message } from 'antd'
import request from '@/utils/request'
import { Md2FormatMessage } from '@/utils/locale'
import UserContext from '@/context/user'
import styles from './index.less'

const Signup = () => {
  const [signupForm] = Form.useForm()
  const context = useContext(UserContext)
  const handleSubmitForm = async () => {
    const values = await signupForm.validateFields()
    const { username, email, password } = values
    const response = await request.post('/registration', {
      data: {
        username,
        email,
        password,
      },
    })

    if (response.id) {
      const [user, getUserInfo] = context
      getUserInfo()
      history.push('/')
    } else {
      if (response['username_error']) {
        message.error(Md2FormatMessage('UsernameError'))
      } else if (response['email_error']) {
        message.error(Md2FormatMessage('EmailError'))
      } else if (response['password_error']) {
        message.error(Md2FormatMessage('PasswordError'))
      } else {
        message.error(Md2FormatMessage('RegisterError'))
      }
    }
  }

  return (
    <div className={styles.background}>
      <div className={styles.main}>
        <div className={styles.logo}></div>
        <div className={styles['form-wrapper']}>
          <h3>{Md2FormatMessage('Register')}</h3>
          <Form className={styles.form} form={signupForm} layout="vertical" onFinish={handleSubmitForm}>
            <Form.Item
              name="username"
              label={Md2FormatMessage('Username')}
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: Md2FormatMessage('UsernameInput'),
                },
              ]}
            >
              <Input autoComplete="off" placeholder={Md2FormatMessage('UsernameInput')} />
            </Form.Item>
            <Form.Item
              name="email"
              label={Md2FormatMessage('Email')}
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: Md2FormatMessage('EmailInput'),
                },
                {
                  type: 'email',
                  message: Md2FormatMessage('EmailInvalid'),
                },
              ]}
            >
              <Input autoComplete="off" placeholder={Md2FormatMessage('EmailInput')} />
            </Form.Item>
            <Form.Item
              name="password"
              label={Md2FormatMessage('Password')}
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: Md2FormatMessage('PasswordInput'),
                },
                {
                  min: 6,
                  max: 16,
                  message: Md2FormatMessage('PasswordLength'),
                },
              ]}
            >
              <Input.Password autoComplete="off" placeholder={Md2FormatMessage('PasswordInput')} />
            </Form.Item>
            <Form.Item
              name="confirm"
              label={Md2FormatMessage('ConfirmPassword')}
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: Md2FormatMessage('ConfirmPasswordInput'),
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error(Md2FormatMessage('ConfirmPasswordError')))
                  },
                }),
              ]}
            >
              <Input.Password autoComplete="off" placeholder={Md2FormatMessage('ConfirmPasswordInput')} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {Md2FormatMessage('SignUp')}
              </Button>
            </Form.Item>
            <p>
              {Md2FormatMessage('HaveAccount')}
              <Link to="/login">
                <span className={styles.bald}>&nbsp;&nbsp;&nbsp;{Md2FormatMessage('SignIn')}</span>
              </Link>
            </p>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default React.memo(Signup)
