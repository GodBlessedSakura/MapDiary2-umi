import React, { useState, useEffect } from 'react'
import request from '@/utils/request'
import { PlusOutlined } from '@ant-design/icons'
import { Map, NavigationControl, CityListControl, MapTypeControl, InfoWindow, Label, CustomOverlay } from 'react-bmapgl'
import UserContext from '@/context/user'
import SearchBox from './SearchBox'
import UMarker from './UMarker'
import { Button } from 'antd'
import NewDiaryModal from './NewDiaryModal'
import DiaryModal from './DiaryModal'

const BaiduMap = () => {
  const [curPosition, setCurPosition] = useState(null) // 点击地图的位置
  const [diary, setDiary] = useState(null) // 需要展示的日记信息
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDiaryModal, setShowDiaryModal] = useState(false)
  const getCenter = (markers) => {
    if (markers?.length > 0) {
      const [lng, lat] = markers[0].position.split(',')
      return { lng, lat }
    }
    return { lng: 116.402544, lat: 39.928216 }
  }

  const handleClickMap = (e) => {
    const position = e.latlng
    setCurPosition(position)
  }
  const showDiary = (e, diary) => {
    e.stopPropagation()
    setDiary(diary)
    setShowDiaryModal(true)
  }
  return (
    <UserContext.Consumer>
      {([user, getUserInfo]) => (
        <Map style={{ height: '100%', width: '100%' }} center={getCenter(user?.markers)} zoom="11" enableDoubleClickZoom enableScrollWheelZoom enableRotate onClick={handleClickMap}>
          <NavigationControl anchor={BMAP_ANCHOR_BOTTOM_RIGHT} offset={new BMapGL.Size(50, 50)} />
          <SearchBox />
          <CityListControl />
          {curPosition && <UMarker position={curPosition} />}
          {curPosition && (
            <CustomOverlay position={curPosition} offset={new BMapGL.Size(0, -20)}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{ width: 120, height: 40, borderRadius: '20px', opacity: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation()
                  setShowCreateModal(true)
                }}
              >
                添加日记
              </Button>
            </CustomOverlay>
          )}
          {user?.markers.map((marker) => {
            const { id, position: positionStr, images, text, title } = marker
            const [lng, lat] = positionStr.split(',')
            const position = { lng, lat }
            return (
              <div key={id}>
                <UMarker position={position} />
                <CustomOverlay position={position} offset={new BMapGL.Size(0, -20)}>
                  <Button type="primary" style={{ borderRadius: '10px', opacity: 0.7 }} onClick={(e) => showDiary(e, marker)}>
                    {title}
                  </Button>
                </CustomOverlay>
              </div>
            )
          })}
          {<NewDiaryModal showCreateModal={showCreateModal} onChangeShowModal={setShowCreateModal} position={curPosition} onChangePosition={setCurPosition} />}
          {<DiaryModal diary={diary} showDiaryModal={showDiaryModal} onChangeShowModal={setShowDiaryModal} />}
        </Map>
      )}
    </UserContext.Consumer>
  )
}

export default React.memo(BaiduMap)
