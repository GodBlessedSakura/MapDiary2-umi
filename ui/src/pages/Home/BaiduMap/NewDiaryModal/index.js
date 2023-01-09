import React, { useEffect, useState, useContext } from 'react'
import { PlusOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { Modal, Form, Input, Upload, message, Button, Image } from 'antd'
import { getBase64Url } from '@/utils/functions'
import request from '@/utils/request'
import UserContext from '@/context/user'
import { Md2FormatMessage } from '@/utils/locale'
import MyEditor from '../MyEditor'
import styles from './index.less'

export default function NewDiaryModal(props) {
  const { showCreateModal, onChangeShowModal, position, onChangePosition } = props
  const [form] = Form.useForm()
  const [contents, setContents] = useState('')
  const [fileList, setFileList] = useState([])
  const removeUploadImg = (idx) => {
    setFileList(fileList.filter((file, fileIdx) => fileIdx !== idx))
  }
  const getUploadButton = () => (
    <Button style={{ width: 200, height: 200 }}>
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
  const beforeUpload = async (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error(Md2FormatMessage('JPGorPNG'))
      return Upload.LIST_IGNORE
    }
    const newFileBase64Url = await getBase64Url(file)
    setFileList([...fileList, newFileBase64Url])
  }
  const calculateHeightWithUploader = (fileList, maxNum) => {
    return fileList.length === maxNum ? Math.ceil(fileList.length / 3) * 200 + 40 : Math.ceil((fileList.length + 1) / 3) * 200 + 40
  }
  const createDiary = async (user, cb) => {
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
        images: fileList,
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

              <div
                style={{
                  display: 'grid',
                  rowGap: 10,
                  columnGap: 10,
                  gridTemplateColumns: '200px 200px 200px',
                  gridTemplateRows: '200px 200px 200px',
                  marginTop: 10,
                  width: 640,
                  height: calculateHeightWithUploader(fileList, 9),
                }}
              >
                {fileList.map((imageUrl, idx) => (
                  <div className={styles['image-wrapper']}>
                    <Image
                      style={{
                        objectFit: 'cover',
                      }}
                      width={200}
                      height={200}
                      src={imageUrl}
                      fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                    />

                    <span className={styles.close}>
                      <CloseCircleOutlined onClick={() => removeUploadImg(idx)} />
                    </span>
                  </div>
                ))}
                <Upload
                  showUploadList={false}
                  customRequest={(options) => {
                    options.onSuccess()
                  }}
                  beforeUpload={beforeUpload}
                >
                  {fileList.length >= 9 ? null : getUploadButton()}
                </Upload>
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
