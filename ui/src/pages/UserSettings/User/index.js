import React, { useState } from 'react'
import { history } from 'umi'
import request from '@/utils/request'
import { Button, Divider, Form, Input, Image, Radio, Col, Upload, message } from 'antd'
import { getBase64Url } from '@/utils/functions'
import { clearTokens } from '@/utils/token'
import { PlusOutlined, CloseCircleOutlined } from '@ant-design/icons'
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
  const [avatar, setAvatar] = useState(null)

  /***
    上传验证格式及大小
  */

  const beforeUpload = async (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error(Md2FormatMessage('JPGorPNG'))
      return Upload.LIST_IGNORE
    }
    const isLt4M = file.size / 1024 / 1024 < 4
    if (!isLt4M) {
      message.error(Md2FormatMessage('LessThan4MB'))
      return Upload.LIST_IGNORE
    }
    const newFileBase64Url = await getBase64Url(file)
    setAvatar(newFileBase64Url)
  }

  const updateAvatar = async (cb) => {
    if (!avatar) return

    const response = await request.post('/user/update_info', {
      data: {
        avatar,
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
    <Button style={{ width: 100, height: 100 }}>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        {Md2FormatMessage('Upload')}
      </div>
    </Button>
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
          <div style={{ paddingLeft: '140px' }}>
            {avatar && (
              <div className={styles['image-wrapper']}>
                <Image
                  style={{
                    borderRadius: '50px',
                    objectFit: 'cover',
                  }}
                  width={100}
                  height={100}
                  src={avatar}
                  fallback="data:image/png;base64,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"
                />

                <span className={styles.close}>
                  <CloseCircleOutlined onClick={() => setAvatar(null)} />
                </span>
              </div>
            )}
            <ImgCrop rotate>
              <Upload
                className={styles.upload}
                showUploadList={false}
                customRequest={(options) => {
                  options.onSuccess()
                }}
                beforeUpload={beforeUpload}
              >
                {avatar ? null : getUploadButton()}
              </Upload>
            </ImgCrop>
          </div>
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
