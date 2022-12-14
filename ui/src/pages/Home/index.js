import React from 'react'
import withAuth from '@/hocs/withAuth'
import BaiduMap from './BaiduMap'
import styles from './index.less'

const Home = () => {
  return (
    <div className={styles.homepage}>
      <div></div>
      <div className={styles['map-wrapper']}>
        <BaiduMap />
      </div>
    </div>
  )
}
export default withAuth(Home)
