import React from 'react'
import { Marker } from 'react-bmapgl'

export default function UMarker(props) {
  const { position } = props
  const handleClickMarker = (e) => {
    e.domEvent.stopPropagation()
    console.log('e', e)
  }
  return <Marker zIndex={99} position={position} onClick={handleClickMarker} />
}
