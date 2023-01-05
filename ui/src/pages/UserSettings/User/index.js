import React, { useState } from 'react'
import { history } from 'umi'
import request from '@/utils/request'
import { Button, Divider, Form, Input, Row, Switch, Radio, Col, Upload, message } from 'antd'
import { getBase64Url } from '@/utils/functions'
import { clearTokens } from '@/utils/token'
import { PlusOutlined } from '@ant-design/icons'
import ImgCrop from 'antd-img-crop'
import UserContext from '@/context/user'
import styles from './index.less'

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
  const [fileList, setFileList] = useState([])

  /***
    上传验证格式及大小
  */

  const handleChangeAvatarUpload = ({ file, fileList: newFileList }) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      return message.error('只能上传JPG或PNG文件!')
    }
    const isLt4M = file.size / 1024 / 1024 < 4
    if (!isLt4M) {
      return message.error('图片大小需小于4MB!')
    }

    setFileList(newFileList)
  }

  const updateAvatar = async (cb) => {
    if (fileList.length === 0) return
    const avatarBase64 = await getBase64Url(fileList[0].originFileObj)
    const response = await request.post('/user/update_info', {
      data: {
        avatar: avatarBase64,
      },
    })
    if (response.id) {
      message.success('头像上传成功')
      cb()
    } else {
      message.error('头像上传失败')
    }
  }
  const getUploadButton = () => (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        上传
      </div>
    </div>
  )
  const updateUsername = async () => {
    const values = await form.validateFields(['newUsername'])
    const response = await request.post('/user/update_info', {
      data: {
        username: values.newUsername,
      },
    })
    if (response.id) {
      message.success('用户名更改成功,请重新登录！')
      clearTokens()
      history.push('/login')
    } else {
      message.error(response.error)
    }
  }

  const updateEmail = async (cb) => {
    const values = await form.validateFields(['newEmail'])
    const response = await request.post('/user/update_info', {
      data: {
        email: values.newEmail,
      },
    })
    if (response.id) {
      message.success('邮箱更改成功')
      cb()
    } else {
      message.error('邮箱更改失败')
    }
  }

  const updatePassword = async () => {
    const values = await form.validateFields(['newPassword', 'oldPassword', 'confirm'])
    const response = await request.post('/user/update_info', {
      data: {
        new_password: values.newPassword,
        old_password: values.oldPassword,
      },
    })
    if (response.id) {
      message.success('密码更改成功，请重新登录')
      clearTokens()
      history.push('/login')
    } else {
      message.error('密码更改失败')
    }
  }

  const updateLocale = async (oldLocale, newLocale, cb) => {
    if (oldLocale === newLocale) return
    const response = await request.post('/user/update_info', {
      data: {
        locale: newLocale,
      },
    })
    if (response.id) {
      message.success('语言更改成功！')
      cb()
    } else {
      message.error('语言更改失败')
    }
  }
  return (
    <UserContext.Consumer>
      {([user, getUserInfo]) => (
        <Form form={form} {...formItemLayout} autoComplete="new-password">
          <Form.Item {...titleLayout}>
            <h3 style={{ fontWeight: '600' }}>修改头像</h3>
          </Form.Item>
          <Form.Item name="avatar" style={{ paddingLeft: '195px' }}>
            <ImgCrop rotate>
              <Upload className={styles.upload} showUploadList={{ showPreviewIcon: false }} action="" fileList={fileList} listType="picture-card" onChange={handleChangeAvatarUpload}>
                {fileList.length >= 1 ? null : getUploadButton()}
              </Upload>
            </ImgCrop>
          </Form.Item>
          <Form.Item {...buttonLayout}>
            <Button type="primary" onClick={() => updateAvatar(getUserInfo)}>
              确认修改
            </Button>
          </Form.Item>
          <Divider />
          <Form.Item {...titleLayout}>
            <h3 style={{ fontWeight: '600' }}>修改用户名</h3>
          </Form.Item>
          <Form.Item label="当前用户名">
            <Input value={user?.username} disabled />
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
            name="newUsername"
          >
            <Input placeholder="请输入新的用户名" />
          </Form.Item>
          <Form.Item {...buttonLayout}>
            <Button type="primary" onClick={updateUsername}>
              确认修改
            </Button>
          </Form.Item>
          <Divider />
          <Form.Item {...titleLayout}>
            <h3 style={{ fontWeight: '600' }}>修改邮箱</h3>
          </Form.Item>
          <Form.Item label="当前邮箱">
            <Input value={user?.email} disabled />
          </Form.Item>
          <Form.Item
            label="新的邮箱"
            rules={[
              {
                required: true,
                whitespace: true,
                message: '请输入新邮箱',
              },
              {
                type: 'email',
                message: '输入的不是有效邮箱格式',
              },
            ]}
            name="newEmail"
          >
            <Input type="" placeholder="请输入新的邮箱" />
          </Form.Item>
          <Form.Item {...buttonLayout}>
            <Button type="primary" onClick={() => updateEmail(getUserInfo)}>
              确认修改
            </Button>
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
            name="newPassword"
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
            dependencies={['newPassword']}
            hasFeedback
            rules={[
              {
                required: true,
                message: '新密码不能为空',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
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
            <Button type="primary" onClick={updatePassword}>
              确认修改
            </Button>
          </Form.Item>
          <Divider />
          <Form.Item {...titleLayout}>
            <h3 style={{ fontWeight: '600' }}>修改语言设置</h3>
          </Form.Item>
          <Form.Item name="locale" initialValue={user?.locale} wrapperCol={{ span: 4 }}>
            <Radio.Group size="large" style={{ float: 'right' }}>
              <Radio.Button value="CN" onClick={() => updateLocale(user?.locale, 'CN', getUserInfo)}>
                中文
              </Radio.Button>
              <Radio.Button value="EN" onClick={() => updateLocale(user?.locale, 'EN', getUserInfo)}>
                英文
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Form>
      )}
    </UserContext.Consumer>
  )
}
