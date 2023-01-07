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
import { Md2FormatMessage } from '@/utils/locale'

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
      return message.error(Md2FormatMessage('JPGorPNG'))
    }
    const isLt4M = file.size / 1024 / 1024 < 4
    if (!isLt4M) {
      return message.error(Md2FormatMessage('LessThan4MB'))
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
      message.success(Md2FormatMessage('UploadAvatarSuccess'))
      cb()
    } else {
      message.error(Md2FormatMessage('UploadAvatarFailed'))
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
        {Md2FormatMessage('Upload')}
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
      message.success(Md2FormatMessage('UsernameUpdateSuccess'))
      clearTokens()
      history.push('/login')
    } else {
      message.error(Md2FormatMessage('UsernameUpdateFailed'))
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
      message.success(Md2FormatMessage('EmailUpdateSuccess'))
      cb()
    } else {
      message.error(Md2FormatMessage('EmailUpdateFailed'))
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
      message.success(Md2FormatMessage('PasswordUpdateSuccess'))
      clearTokens()
      history.push('/login')
    } else {
      message.error(Md2FormatMessage('PasswordUpdateFailed'))
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
      message.success(Md2FormatMessage('LocaleUpdateSuccess'))
      cb()
    } else {
      message.error(Md2FormatMessage('LocaleUpdateFailed'))
    }
  }
  return (
    <UserContext.Consumer>
      {([user, getUserInfo]) => (
        <Form form={form} {...formItemLayout} autoComplete="new-password">
          <Form.Item {...titleLayout}>
            <h3 style={{ fontWeight: '600' }}>{Md2FormatMessage('UpdateAvatar')}</h3>
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
              {Md2FormatMessage('ConfirmUpdate')}
            </Button>
          </Form.Item>
          <Divider />
          <Form.Item {...titleLayout}>
            <h3 style={{ fontWeight: '600' }}>{Md2FormatMessage('UpdateUsername')}</h3>
          </Form.Item>
          <Form.Item label={Md2FormatMessage('CurrentUsername')}>
            <Input value={user?.username} disabled />
          </Form.Item>
          <Form.Item
            label={Md2FormatMessage('NewUsername')}
            rules={[
              {
                required: true,
                whitespace: true,
                message: Md2FormatMessage('NewUsernameError'),
              },
            ]}
            name="newUsername"
          >
            <Input placeholder={Md2FormatMessage('NewUsernameInput')} />
          </Form.Item>
          <Form.Item {...buttonLayout}>
            <Button type="primary" onClick={updateUsername}>
              {Md2FormatMessage('ConfirmUpdate')}
            </Button>
          </Form.Item>
          <Divider />
          <Form.Item {...titleLayout}>
            <h3 style={{ fontWeight: '600' }}>{Md2FormatMessage('UpdateEmail')}</h3>
          </Form.Item>
          <Form.Item label={Md2FormatMessage('CurrentEmail')}>
            <Input value={user?.email} disabled />
          </Form.Item>
          <Form.Item
            label={Md2FormatMessage('NewEmail')}
            rules={[
              {
                required: true,
                whitespace: true,
                message: Md2FormatMessage('NewEmailInput'),
              },
              {
                type: 'email',
                message: Md2FormatMessage('NewEmailError'),
              },
            ]}
            name="newEmail"
          >
            <Input placeholder={Md2FormatMessage('NewEmailInput')} />
          </Form.Item>
          <Form.Item {...buttonLayout}>
            <Button type="primary" onClick={() => updateEmail(getUserInfo)}>
              {Md2FormatMessage('ConfirmUpdate')}
            </Button>
          </Form.Item>
          <Divider />
          <Form.Item {...titleLayout}>
            <h3 style={{ fontWeight: '600' }}>{Md2FormatMessage('UpdatePassword')}</h3>
          </Form.Item>
          <Form.Item
            name="oldPassword"
            label={Md2FormatMessage('OldPassword')}
            rules={[
              {
                required: true,
                whitespace: true,
                message: Md2FormatMessage('OldPassword.Error'),
              },
            ]}
          >
            <Input.Password placeholder={Md2FormatMessage('OldPasswordInput')} />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label={Md2FormatMessage('NewPassword')}
            rules={[
              {
                required: true,
                whitespace: true,
                message: Md2FormatMessage('NewPasswordError'),
              },
              {
                min: 6,
                max: 16,
                message: Md2FormatMessage('PasswordLength'),
              },
            ]}
          >
            <Input.Password placeholder={Md2FormatMessage('NewPasswordInput')} />
          </Form.Item>
          <Form.Item
            name="confirm"
            label={Md2FormatMessage('ConfirmPassword')}
            dependencies={['newPassword']}
            hasFeedback
            rules={[
              {
                required: true,
                whitespace: true,
                message: Md2FormatMessage('ConfirmPasswordEmptyError'),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error(Md2FormatMessage('ConfirmPasswordError')))
                },
              }),
            ]}
          >
            <Input.Password placeholder={Md2FormatMessage('ConfirmPasswordInput')} />
          </Form.Item>
          <Form.Item {...buttonLayout}>
            <Button type="primary" onClick={updatePassword}>
              {Md2FormatMessage('ConfirmUpdate')}
            </Button>
          </Form.Item>
          <Divider />
          <Form.Item {...titleLayout}>
            <h3 style={{ fontWeight: '600' }}>{Md2FormatMessage('ChangeLocale')}</h3>
          </Form.Item>
          <Form.Item name="locale" initialValue={user?.locale} wrapperCol={{ span: 4 }}>
            <Radio.Group size="large" style={{ float: 'right' }}>
              <Radio.Button value="CN" onClick={() => updateLocale(user?.locale, 'CN', getUserInfo)}>
                {Md2FormatMessage('Chinese')}
              </Radio.Button>
              <Radio.Button value="EN" onClick={() => updateLocale(user?.locale, 'EN', getUserInfo)}>
                {Md2FormatMessage('English')}
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Form>
      )}
    </UserContext.Consumer>
  )
}
