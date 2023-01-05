# MapDiary2-umi

### 功能设计

- 日记功能
  - 当点击地图时添加一个 Marker
  - Hover Marker 时显示一个 InfoWindow 用于添加日记
  - 点击 InfoWindow 时弹出一个窗口用于添加内容
  - 窗口上半部分添加图片，下半部分添加文字（支持富文本编辑）
  - 图片比例问题：使用 Antd 的 Image 组件实现预览，使用 CSS 属性 object-fit:cover,配合固定宽高，实现不同比例图片兼容性显示的问题
- 轨迹动画实现幻灯片功能
- 账号功能
  - 设置用户名，头像
  - 设置自己的 Marker 是否对其它人可见
  - 设置是否展示他人 Marker
  - 修改密码功能
  - 密码找回功能
