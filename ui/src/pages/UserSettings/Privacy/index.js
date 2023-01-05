import React, { useEffect, useState } from 'react'
import { Button, Divider, Form, message, Switch, Spin } from 'antd'
import UserContext from '@/context/user'
import request from '@/utils/request'

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 },
}

const buttonLayout = {
  wrapperCol: { span: 10, offset: 4 },
}
export default function Privacy() {
  const [form] = Form.useForm()

  const updatePrivacySettings = async (cb) => {
    const newDisplayUser = form.getFieldValue('displayUser')
    const newDisplayOtherUsers = form.getFieldValue('displayOtherUsers')
    const response = await request.post('/user/update_info', {
      data: {
        display_user: newDisplayUser,
        display_other_users: newDisplayOtherUsers,
      },
    })
    if (response.id) {
      message.success('设置更新成功')
      cb()
    } else {
      message.error('设置更新失败')
    }
  }

  return (
    <UserContext.Consumer>
      {([user, getUserInfo]) =>
        user ? (
          <Form form={form} {...formItemLayout} autoComplete="new-password">
            <Form.Item>
              <h3 style={{ fontWeight: '600', paddingLeft: '150px' }}>个性化设置</h3>
            </Form.Item>
            <Divider />
            <Form.Item label="公开自己的标记" name="displayUser">
              <Switch defaultChecked={user.displayUser} />
            </Form.Item>
            <Form.Item label="查看他人的标记" name="displayOtherUsers">
              <Switch defaultChecked={user.displayOtherUsers} />
            </Form.Item>
            <Form.Item {...buttonLayout}>
              <Button type="primary" style={{ marginLeft: '-128px' }} onClick={() => updatePrivacySettings(getUserInfo)}>
                确认修改
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <Spin size="large" />
        )
      }
    </UserContext.Consumer>
  )
}
