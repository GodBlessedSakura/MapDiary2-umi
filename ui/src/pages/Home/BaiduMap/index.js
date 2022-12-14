import React, { useState, useEffect } from 'react'

import { Map, NavigationControl, CityListControl, MapTypeControl, InfoWindow } from 'react-bmapgl'
import UMarker from './UMarker'

export default function BaiduMap() {
  const [curMarker, setCurMarker] = useState(null)

  const handleClickMap = (e) => {
    const position = e.latlng
    setCurMarker(position)
  }
  return (
    <Map style={{ height: '100%', width: '100%' }} center={{ lng: 116.402544, lat: 39.928216 }} zoom="11" enableDoubleClickZoom enableScrollWheelZoom enableRotate onClick={handleClickMap}>
      <NavigationControl />
      <CityListControl />
      {curMarker && <UMarker position={curMarker} />}
    </Map>
  )
}
