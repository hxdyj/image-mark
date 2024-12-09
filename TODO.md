- [x] Plugin System
- [x] Rect Or Other Mode use plugin system implement
- [x] limit move not out of container
- [x] dropable
- [x] commonly action class
- [x] resize deal: resize event maybe can't listen container size change , use MutationObserver instead
- [x] caculate next step chunk
- [x] company map demo finished
- [x] use react write demo
- [x] multiple instance demo
- [x] shape rect、circle support
- [x] shape line、polygon、polyline、pathline support
- [ ] resize action
- [ ] single/multiple select
- [ ] zIndex support
- [ ] rect select
- [ ] operate history and undo redo
- [ ] mini map
- [ ] rotate action
- [ ] move action add mode to holder and custom holder ui
- [ ] shape options
- [ ] shortcut system
- [ ] mask base image support
- [ ] mobile support
- [ ] docs

## resize or scale

其实缩放对于不同的图形操作不一样

对于 rect 四条边和顶点就是改变宽高
对于 line 来说，其实应该展示两个点在两侧，然后重新定位点的位置就好
对于 cirle 来说，应该在弧上边等分 4 个点，然后缩小 r 就行
对于 image,pathline 来说，应该以中心点为中心，然后以中心点为中心进行等比缩放
对于 polygon、polyline、 来说,应该描绘出每个点，然后拖拽点来进行改变位置

但是要注意旋转完的 shape，进行缩放的时候，要注意将对应点旋转，以 rect 为例

rect 旋转 45 度以后，右侧的边是倾斜的，然后鼠标在右侧边进行 resize 的时候，鼠标挪动的距离应该是斜边的距离，而不是直边的距离

对于 circle 来说，等分的四个点应该也要进行旋转，以保持在未旋转的之前圆上的位置

## rotate

都以 shape 中心旋转
