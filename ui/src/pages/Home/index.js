import React from 'react'
import UAvatar from './UAvatar'
import withAuth from '@/hocs/withAuth'
import BaiduMap from './BaiduMap'
import styles from './index.less'

const Home = () => {
  return (
    <div className={styles.homepage}>
      <UAvatar />
      <div className={styles['map-wrapper']}>
        <BaiduMap />
      </div>
    </div>
  )
}
export default withAuth(Home)
