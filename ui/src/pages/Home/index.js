import React, { useContext } from 'react'
import UAvatar from './UAvatar'
import withAuth from '@/hocs/withAuth'
import UserContext from '@/context/user'
import BaiduMap from './BaiduMap'
import styles from './index.less'

const Home = () => {
  return (
    <UserContext.Consumer>
      {([user]) => (
        <div className={styles.homepage}>
          <UAvatar avatar={user?.avatar} />
          <div className={styles['map-wrapper']}>
            <BaiduMap />
          </div>
        </div>
      )}
    </UserContext.Consumer>
  )
}
export default withAuth(Home)
