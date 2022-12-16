import { AutoComplete } from 'react-bmapgl'
import { Input } from 'antd'
import React from 'react'

export default function SearchBox(props) {
  const { map } = props

  const setPlace = (res) => {
    var local = new BMapGL.LocalSearch(map, {
      renderOptions: { map: map, autoViewport: true },
      pageCapacity: 3,
    })

    local.search(res)
  }
  const handleConfirm = (e) => {
    const value = e.item.value
    const searchRes = `${value.province}${value.city}${value.district}${value.street}${value.business}`
    setPlace(searchRes)
  }
  return (
    <div>
      <Input id="ac" style={{ position: 'absolute', zIndex: '100', top: '10px', left: '100px', width: '200px' }} placeholder="输入想要搜索的地点" />
      <AutoComplete input="ac" onConfirm={handleConfirm} />
    </div>
  )
}
