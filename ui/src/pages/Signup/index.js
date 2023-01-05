import React, { useContext } from 'react'
import { Link, history } from 'umi'
import { Form, Input, Button, message } from 'antd'
import request from '@/utils/request'
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
      message.error(response.error)
    }
  }

  return (
    <div className={styles.background}>
      <div className={styles.main}>
        <div className={styles.logo}></div>
        <div className={styles['form-wrapper']}>
          <h3>Register</h3>
          <Form className={styles.form} form={signupForm} layout="vertical" onFinish={handleSubmitForm}>
            <Form.Item
              name="username"
              label="Username"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: 'Please input the username!',
                },
              ]}
            >
              <Input autoComplete="off" placeholder="Please input your name" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: 'Please input the email!',
                },
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
              ]}
            >
              <Input autoComplete="off" placeholder="Please input your email" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: 'Please input your password!',
                },
              ]}
            >
              <Input.Password autoComplete="off" placeholder="Please input your password" />
            </Form.Item>
            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('The two passwords that you entered do not match!'))
                  },
                }),
              ]}
            >
              <Input.Password autoComplete="off" placeholder="Please re-enter your password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Sign Up
              </Button>
            </Form.Item>
            <p>
              Already have an account?
              <Link to="/login">
                <span className={styles.bald}>&nbsp;&nbsp;&nbsp;Sign in</span>
              </Link>
            </p>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default React.memo(Signup)
