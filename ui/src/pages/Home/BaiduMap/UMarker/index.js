import React from 'react'
import { Marker } from 'react-bmapgl'

export default function UMarker(props) {
  const { position } = props
  const handleClickMarker = (e) => {
    console.log('e', e)
  }
  return <Marker position={position} onClick={handleClickMarker} />
}
