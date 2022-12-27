import React, { useState } from 'react'
import { Button, Divider, Form, Input, Row, Switch } from 'antd'

export default function Privacy() {
  const [form] = Form.useForm()
  const [curUsername, setCurUserName] = useState(null)
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
  }

  const titleLayout = {
    wrapperCol: { offset: 2 },
  }
  const buttonLayout = {
    wrapperCol: { span: 10, offset: 4 },
  }

  return (
    <Form form={form} {...formItemLayout} autoComplete="new-password">
      <Form.Item>
        <h3 style={{ fontWeight: '600', paddingLeft: '150px' }}>个性化设置</h3>
      </Form.Item>
      <Divider />
      <Form.Item label="公开自己的标记">
        <Switch defaultChecked={true} />
      </Form.Item>
      <Form.Item label="查看他人的标记">
        <Switch defaultChecked={true} />
      </Form.Item>
      <Form.Item {...buttonLayout}>
        <Button type="primary" style={{ marginLeft: '-128px' }}>
          确认修改
        </Button>
      </Form.Item>
    </Form>
  )
}
