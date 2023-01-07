import React, { useState } from 'react'
import { Card, List, Button, Typography } from 'antd'
import { Map } from 'react-bmapgl'
import styles from './index.less'
import { Md2FormatMessage } from '@/utils/locale'

export default function DiaryList(props) {
  const { markers, map } = props
  const [animeInstance, setAnimeInstance] = useState(null)
  const [plOverlay, setPlOverlay] = useState(null)
  const renderListItem = (marker) => {
    const { id, title, position: positionStr } = marker
    const [lng, lat] = positionStr.split(',')
    const position = { lng, lat }
    return (
      <List.Item key={id}>
        <Button
          type="dashed"
          onClick={() => {
            map.centerAndZoom(position, 15)
          }}
        >
          <Typography.Text style={{ width: 100 }} ellipsis={true}>
            {title}
          </Typography.Text>
        </Button>
      </List.Item>
    )
  }
  const startDiaryTrip = () => {
    if (markers.length < 2) return
    const calculateLength = (locationA, locationB) => {
      return Math.sqrt(Math.pow(locationA.lng - locationB.lng, 2) + Math.pow(locationA.lat - locationB.lat, 2))
    }
    const locations = []
    const path = markers.map((marker) => {
      const { position: positionStr } = marker
      const [lng, lat] = positionStr.split(',')
      locations.push({ lng, lat })
      return new BMapGL.Point(lng, lat)
    })

    let totalLength = 0
    locations.forEach((item, idx) => {
      if (idx < locations.length - 1) {
        totalLength += calculateLength(locations[idx], locations[idx + 1])
      }
    })

    const polyline = new BMapGL.Polyline(path)
    const trackAni = new BMapGLLib.TrackAnimation(map, polyline, {
      overallView: true, // 动画完成后自动调整视野到总览
      tilt: 30, // 轨迹播放的角度，默认为55
      duration: 20000, // 动画持续时长，默认为10000，单位ms
      delay: 1000, // 动画开始的延迟，默认0，单位ms
    })
    setPlOverlay(polyline)
    setAnimeInstance(trackAni)
    trackAni.start()
  }
  const stopDiaryTrip = () => {
    animeInstance.cancel()
    map.removeOverlay(plOverlay)
    setPlOverlay(null)
    setAnimeInstance(null)
  }
  return (
    <div className={styles['diary-list']}>
      <Card title={<h3 style={{ paddingLeft: '40px' }}>{Md2FormatMessage('MyDiary')}</h3>}>
        <List>{markers.map((marker) => renderListItem(marker))}</List>
        {animeInstance ? (
          <Button style={{ marginLeft: 45, marginTop: 10 }} danger onClick={stopDiaryTrip}>
            {Md2FormatMessage('StopTrack')}
          </Button>
        ) : (
          <Button type="primary" style={{ marginLeft: 45, marginTop: 10 }} onClick={startDiaryTrip}>
            {Md2FormatMessage('DiaryTrack')}
          </Button>
        )}
      </Card>
    </div>
  )
}
