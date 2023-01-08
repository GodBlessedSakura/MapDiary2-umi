import { Outlet, setLocale } from 'umi'
import { useState, useEffect } from 'react'
import { message } from 'antd'
import request from '@/utils/request'
import UserContext from '@/context/user'
import { localeMapForEditor, localeMapForUmi } from '@/locales/map'
import { i18nChangeLanguage } from '@wangeditor/editor'
import { Md2FormatMessage } from '@/utils/locale'
import styles from './index.less'

export default function Layout() {
  const [user, setUser] = useState(null)
  const getUserInfo = async () => {
    const response = await request.post('/user/get_info', {
      data: {},
    })
    if (response) {
      setUser(response)
      setLocale(localeMapForUmi[response.locale], true)
      i18nChangeLanguage(localeMapForEditor[response.locale])
    } else {
      message.error(Md2FormatMessage('GetInfoError'))
    }
  }
  useEffect(() => {
    if (location.pathname.includes('login') || location.pathname.includes('signup')) return
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
