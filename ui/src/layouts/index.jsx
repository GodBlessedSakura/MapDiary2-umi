import { Outlet } from 'umi'
import { useState, useEffect } from 'react'
import request from '@/utils/request'
import UserContext from '@/context/user'
import styles from './index.less'
import { message } from 'antd'

export default function Layout() {
  const [user, setUser] = useState(null)
  const getUserInfo = async () => {
    const response = await request.post('/user/get_info', {
      data: {},
    })
    console.log('response', response)
    if (response) {
      setUser(response)
    } else {
      message.error('获取用户信息失败')
    }
  }
  useEffect(() => {
    getUserInfo()
  }, [])

  return (
    <UserContext.Provider value={[user, getUserInfo]}>
      <div className={styles.layout}>
        <Outlet />
      </div>
    </UserContext.Provider>
  )
}
