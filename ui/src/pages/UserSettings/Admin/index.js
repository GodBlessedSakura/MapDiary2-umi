import { Card, List, message, Avatar, Popover, Button } from 'antd'
import React, { useEffect, useState } from 'react'
import request from '@/utils/request'
import { RedoOutlined, SnippetsOutlined, StopOutlined, UserOutlined } from '@ant-design/icons'
import DiaryModal from '@/pages/Home/BaiduMap/DiaryModal'
import { Md2FormatMessage } from '@/utils/locale'

export default function Admin() {
  const [users, setUsers] = useState([])
  const [diary, setDiary] = useState(null)
  const [showDiaryModal, setShowDiaryModal] = useState(false)

  const getUserList = async () => {
    const response = await request.post('/user/get_all_users', {
      data: {},
    })
    if (response.users) {
      setUsers(response.users)
    } else {
      message.error(Md2FormatMessage('GetUserListError'))
    }
  }

  const getTitle = (username, email, isAdmin) => {
    let res = `${username} (${email})`
    if (isAdmin) res += '(Admin)'
    return res
  }

  const handleBanOrEnable = async (id, action) => {
    const response = await request.post('/user/ban_or_enable', {
      data: {
        id,
        action,
      },
    })
    if (response.id) {
      message.success(action === 'ban' ? Md2FormatMessage('BanAccountSuccess') : Md2FormatMessage('EnableAccountSuccess'))
    } else {
      message.error(action === 'ban' ? Md2FormatMessage('BanAccountFailed') : Md2FormatMessage('EnableAccountFailed'))
    }
    getUserList()
  }
  const renderListItem = (user) => {
    const { id, username, avatar, email, enable, markers, isAdmin } = user
    const showDiary = (diary) => {
      setDiary(diary)
      setShowDiaryModal(true)
    }
    const getDiaryList = (markers) => {
      return (
        <List>
          {markers.map((marker) => (
            <List.Item>
              <Button onClick={() => showDiary(marker)}>{marker.title}</Button>
            </List.Item>
          ))}
        </List>
      )
    }
    const getBanOrEnableActions = () => {
      if (isAdmin) return
      return enable ? (
        <StopOutlined style={{ color: 'red' }} onClick={() => handleBanOrEnable(id, 'ban')} />
      ) : (
        <RedoOutlined
          style={{ color: 'green' }}
          onClick={() => {
            handleBanOrEnable(id, 'enable')
          }}
        />
      )
    }
    const renderActions = () => [
      <Popover title={Md2FormatMessage('DiaryList')} content={getDiaryList(markers)}>
        <SnippetsOutlined style={{ color: 'blue' }} />
      </Popover>,
      getBanOrEnableActions(),
    ]
    return (
      <List.Item actions={renderActions()}>
        <List.Item.Meta avatar={<Avatar src={avatar} icon={<UserOutlined />} />} title={getTitle(username,email,isAdmin)} description={`${markers.length}${Md2FormatMessage('XDiary')}`} />
      </List.Item>
    )
  }
  useEffect(() => {
    getUserList()
  }, [])
  return (
    <>
      <Card title={Md2FormatMessage('UserList')} bordered={false}>
        <List>{users.map((user) => renderListItem(user))}</List>
      </Card>
      <DiaryModal diary={diary} showDiaryModal={showDiaryModal} onChangeShowModal={setShowDiaryModal} onAdminEdit={getUserList} />
    </>
  )
}
