# 一个响应式全屏播放器
技术栈关键字：jQuery、CSS3、响应式
## 功能介绍&实现方法：
1. 响应式布局： 利用vh及Media Query（媒介查询）达到响应式布局和自适应
2. 音乐播放功能： 通过对象Audio的实例化
3. 绑定暂停，播放按钮：事件监听
4. 播放/暂停按钮的切换：if条件语句判断添加和删除class(也可以使用toggle方法)
5. 字体图标iconfont
6. 调节音量
7. 点击进度条，音乐就会快进至对应的时间播放
### css部分
1. CSS中通过transition来控制图标选中和不选中的渐变动画样式
2. 通过css中@keyframes使得图片转动，达到类似胶片播放的形式，有如下几个改进
   + 当音乐处于播放状态时CSS动画旋转，当音乐处于暂停状态时动画暂停: 通过jQuery修改animation-play-state running/pause 实现
   + 当切换音乐的时候CSS的动画从头开始进行：写两个名字不同但是方法相同的动画，在切换音乐时将图片的CSS在两个不同动画间来回切换（toggleClass）,将两个动画分别放进两个不同class中
   + 通过浮动来放置图片位置
   + main需要浮动
3. 通过transition: width .8s;使得进度条在增长的过程中匀速前进。
4. 修改input type=range的样式 使得音乐调节bar 更加美观
### jQuery部分
#### 将整个APP分成三个部分: 
   + 事件中心：用于交互footer和player的信息，使得两者不直接对话。
   + 底部的音乐合集footer,用于展现不同的channel。
   + 音乐播放器功能player
#### footer
1. 通过jQuery Ajax获取数据
2. 将获取到的数据拼接成一个DOM对象并且将他放入footer的ul中
3. 通过jQuery 修改CSS属性
4. 实现轮播： `left: '-='+ rowcnt * _this.$box.find('li').outerWidth(true)`,
5. 轮播改进； 获取每排能展示li的个数，保证每次轮播展示的都是完整的li对象
6. 通过向事件中心向player发送数据
#### player
1. 将从事件中心发来的数据绑定到自己声明的参数上；
2. 通过Ajax获得对应歌曲的各种数据，
3. 将获得来的数据setSong（）来修改对应节点的数据同时利用Ajax获得歌词,在获得歌词的过程中遇到一个问题：如果在jQuery 的AJAX中设置了`dataType:"JSONP"`那么获取数据会失败，删除以后就好了，原因： 
```
因为这个接口默认支持cors 跨域，所以 直接发请求就行了
虽然支持 jsonp，但传递的 jsonp 的参数是 callback，而是用 jquery的 ajax 里的 jsonp 参数不是 callback
```
4. 通过监控play 来更新各项数据如进度条，时间等，一个小问题：找了半天jQuery没有onplay，不知道对不对，一个小改进：利用setInterval 匀速输出时间 监听play
5. 监听进度条拖拽+函数节流达到指定时间点播放的功能
6. 控制音量：利用toggleClass 实现音量调节bar的显示与不显示，通过
```
_this.$container.find('.vol .volumebar').on('change',function(){
           var vol = (this.value)
            _this.audio.volume = vol;
       })
```
实现播放器的音量调节

