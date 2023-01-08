import React, { useEffect, useState, useContext } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Modal, Form, Input, Upload, message } from 'antd'
import { getBase64Url } from '@/utils/functions'
import request from '@/utils/request'
import UserContext from '@/context/user'
import { Md2FormatMessage } from '@/utils/locale'
import MyEditor from '../MyEditor'
import styles from './index.less'

export default function NewDiaryModal(props) {
  const { showCreateModal, onChangeShowModal, position, onChangePosition } = props
  const [form] = Form.useForm()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [contents, setContents] = useState('')
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
        {Md2FormatMessage('Upload')}
      </div>
    </div>
  )
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error(Md2FormatMessage('JPGorPNG'))
      return Upload.LIST_IGNORE
    }

    return isJpgOrPng
  }
  const createDiary = async (user, cb) => {
    const images = await Promise.all(fileList.map((file) => getBase64Url(file.originFileObj)))
    const values = await form.validateFields()
    const { title } = values
    const { id } = user
    const { lng, lat } = position
    const positionStr = `${lng},${lat}`

    const response = await request.post('/user/add_marker', {
      data: {
        id,
        position: positionStr,
        text: contents,
        title,
        images,
      },
    })
    if (response.id) {
      message.success(Md2FormatMessage('AddDiarySuccess'))
      setFileList([])
      setContents('')
      onChangeShowModal(false)
      onChangePosition(null)
      cb()
    } else {
      message.error(Md2FormatMessage('AddDiaryFail'))
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
            title={<h2>{Md2FormatMessage('AddDiaryTitle')}</h2>}
            okText={Md2FormatMessage('Publish')}
            onOk={() => createDiary(user, getUserInfo)}
            cancelText={Md2FormatMessage('Cancel')}
            centered
            closable={false}
            open={showCreateModal}
            onCancel={() => {
              setFileList([]) // 上传的图片列表是受控式表单，手动清除数据
              setContents('')
              onChangeShowModal(false)
            }}
          >
            <Form preserve={false} form={form} style={{ marginTop: 20 }}>
              <h3>{Md2FormatMessage('Title')}</h3>
              <Form.Item
                name="title"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: Md2FormatMessage('TitleInputError'),
                  },
                ]}
                style={{ width: 300, marginTop: 10 }}
              >
                <Input placeholder={Md2FormatMessage('TitleInput')} maxLength={30} />
              </Form.Item>
              <h3>{Md2FormatMessage('Photos')}</h3>

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
              <h3>{Md2FormatMessage('Thoughts')}</h3>
              <MyEditor contents={contents} onContentsChange={setContents} />
            </Form>
          </Modal>
        </div>
      )}
    </UserContext.Consumer>
  )
}
