import React, { useEffect, useState, useContext } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Modal, Form, Input, Upload, message } from 'antd'
import { getBase64Url } from '@/utils/functions'
import request from '@/utils/request'
import UserContext from '@/context/user'
import styles from './index.less'

export default function NewDiaryModal(props) {
  const { showCreateModal, onChangeShowModal, position, onChangePosition } = props
  const [form] = Form.useForm()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [fileList, setFileList] = useState([])

  const handleCancel = () => setPreviewOpen(false)
  const handlePreview = async (file) => {
    const fileBase64Url = await getBase64Url(file.originFileObj)
    setPreviewImage(fileBase64Url)
    setPreviewOpen(true)
    setPreviewTitle(file.name)
  }
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList)
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
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('只能上传JPG或PNG文件!')
      return Upload.LIST_IGNORE
    }

    return isJpgOrPng
  }
  const createDiary = async (user, cb) => {
    const images = await Promise.all(fileList.map((file) => getBase64Url(file.originFileObj)))
    const values = await form.validateFields()
    const { title, text } = values
    const { id } = user
    const { lng, lat } = position
    const positionStr = `${lng},${lat}`

    const response = await request.post('/user/add_marker', {
      data: {
        id,
        position: positionStr,
        text,
        title,
        images,
      },
    })
    if (response.id) {
      message.success('日记提交成功')
      setFileList([])
      onChangeShowModal(false)
      onChangePosition(null)
      cb()
    } else {
      message.error('日记提交失败')
    }
  }

  return (
    <UserContext.Consumer>
      {([user, getUserInfo]) => (
        <div>
          <Modal
            destroyOnClose={true}
            bodyStyle={{ overflow: 'auto', height: 600 }}
            width={1000}
            title={<h2>创建新日记</h2>}
            okText="发表"
            onOk={() => createDiary(user, getUserInfo)}
            cancelText="取消"
            centered
            open={showCreateModal}
            onCancel={() => {
              setFileList([]) // 上传的图片列表是受控式表单，手动清除数据
              onChangeShowModal(false)
            }}
          >
            <Form preserve={false} form={form} style={{ marginTop: 20 }}>
              <h3>标题</h3>
              <Form.Item name="title" style={{ width: 300, marginTop: 10 }}>
                <Input
                  placeholder="请输入标题内容"
                  maxLength={30}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: '标题内容不能为空',
                    },
                  ]}
                />
              </Form.Item>
              <h3>照片</h3>

              <div className={styles.upload} style={{ marginTop: 10 }}>
                <Upload action="" beforeUpload={beforeUpload} listType="picture-card" fileList={fileList} onPreview={handlePreview} onChange={handleChange}>
                  {fileList.length >= 9 ? null : getUploadButton()}
                </Upload>
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                  <img
                    alt="example"
                    style={{
                      width: '100%',
                    }}
                    src={previewImage}
                  />
                </Modal>
              </div>
              <h3>这一刻的想法</h3>
              <Form.Item
                name="text"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: '正文内容不能为空',
                  },
                ]}
                style={{ width: 700, marginTop: 10 }}
              >
                <Input.TextArea rows={10} />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      )}
    </UserContext.Consumer>
  )
}
