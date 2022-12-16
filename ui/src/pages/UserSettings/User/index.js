import React, { useState } from 'react'
import { Button, Divider, Form, Input, Row } from 'antd'

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 },
}

const titleLayout = {
  wrapperCol: { offset: 2 },
}
const buttonLayout = {
  wrapperCol: { span: 12, offset: 4 },
}

export default function User() {
  const [form] = Form.useForm()
  const [curUsername, setCurUserName] = useState(null)

  return (
    <Form form={form} {...formItemLayout} autoComplete="new-password">
      <Form.Item {...titleLayout}>
        <h3 style={{ fontWeight: '600' }}>修改用户名</h3>
      </Form.Item>
      <Form.Item label="当前用户名">
        <Input value={curUsername} disabled />
      </Form.Item>
      <Form.Item
        label="新的用户名"
        rules={[
          {
            required: true,
            whitespace: true,
            message: '新用户名不能为空！',
          },
        ]}
        name="newUserName"
      >
        <Input placeholder="请输入新的用户名" />
      </Form.Item>
      <Form.Item {...buttonLayout}>
        <Button type="primary">确认修改</Button>
      </Form.Item>
      <Divider />
      <Form.Item {...titleLayout}>
        <h3 style={{ fontWeight: '600' }}>修改密码</h3>
      </Form.Item>
      <Form.Item
        name="oldPassword"
        label="旧密码"
        rules={[
          {
            required: true,
            whitespace: true,
            message: '旧密码不能为空',
          },
        ]}
      >
        <Input.Password placeholder="请输入旧密码" />
      </Form.Item>
      <Form.Item
        name="password"
        label="新密码"
        rules={[
          {
            required: true,
            whitespace: true,
            message: '新密码不能为空',
          },
        ]}
      >
        <Input.Password placeholder="请输入新密码" />
      </Form.Item>
      <Form.Item
        name="confirm"
        label="确认新密码"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: '新密码不能为空',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve()
              }
              return Promise.reject(new Error('两次输入的密码不匹配'))
            },
          }),
        ]}
      >
        <Input.Password placeholder="请再次输入新密码" />
      </Form.Item>
      <Form.Item {...buttonLayout}>
        <Button type="primary">确认修改</Button>
      </Form.Item>
    </Form>
  )
}
