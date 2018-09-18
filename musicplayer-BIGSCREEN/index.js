var EventCenter = {
    on: function(type, handler){
      $(document).on(type, handler)
    },
    fire: function(type, data){
      $(document).trigger(type, data)
    }
  }

var footer = {
    init: function(){
        this.$footer = $('footer')
        this.$footerul = this.$footer.find('ul')
        this.$box = this.$footer.find('.box')
        this.$footRightBtn = this.$footer.find('.fa-chevron-right');
        this.$fooLefttBtn = this.$footer.find('.fa-chevron-left');
        this.isToEnd = false;
        this.isToStart = true;
        this.isAnimate = false;
        this.footstart();
        this.bind()
    },

    getData: function(callback){
        $.ajax({
            url: "http://api.jirengu.com/fm/getChannels.php",
            type: "GET",
            dataType: "jsonp",
        }).done(function(ret){
            callback(ret.channels);
        }
        )
    },

    footstart: function(){
        var _this = this;
        _this.getData(function(channels){
            _this.footrender(channels);
        })
    },

    bind: function(){
        var _this = this;
        $(window).resize(function(){
            _this.footSetStyle();
        })
        _this.$footRightBtn.on('click',function(){
            if(_this.isAnimate) return;
            var unitWidth = _this.$box.find('li').outerWidth(true);
            var rowcnt = Math.floor(_this.$box.width() / unitWidth);
            if(!_this.isToEnd){
                _this.isAnimate = true;
                _this.$footerul.animate({
                    left: '-='+ rowcnt * _this.$box.find('li').outerWidth(true),
                },400,function(){
                    _this.isAnimate = false;
                    _this.isToStart = false;
                    if(parseFloat(_this.$box.width()) - parseFloat(_this.$footerul.css('left')) >= parseFloat(_this.$footerul.css('width'))){
                        //console.log('over')
                        _this.isToEnd = true;
                    }
                })
            }; 
        });
        _this.$fooLefttBtn.on('click',function(){
            //console.log('leftbtn')
            if(_this.isAnimate) return;
            var rowcnt = Math.floor(_this.$box.width()/_this.$box.find('li').outerWidth(true));
            if(!_this.isToStart){
                _this.isAnimate = true;
                _this.$footerul.animate({
                    left: '+=' +  rowcnt * _this.$box.find('li').outerWidth(true),
                },400,function(){
                    // 回调函数，complete状态
                    _this.isAnimate = false;
                    _this.isToStart = false;
                    if(parseFloat( _this.$footerul.css('left')) >= 0){
                        _this.isToStart = true;
                        //console.log('leftend')
                    }
                })
            }
        })
        _this.$footer.on('click','li',function(){
            $(this).addClass('active').siblings().removeClass('active')
            EventCenter.fire('select-albumn',{
                channelId: $(this).attr('data-channel-id'),
                channelName: $(this).attr('data-channel-name'),
            })
        })
    
    },

    footrender: function(channels){
        var _this = this;
        console.log('infootrender',channels);
        $.each(channels,function(index,channel){
            var $channel = _this.footgetNode(channel)
            _this.$footerul.append($channel)
            console.log($channel)
        })
        _this.footSetStyle();
    },

    footgetNode: function(node){
        var tpl = '';
            tpl +=  '<li data-channel-id='+ node.channel_id + ' data-channel-name='+node.name+'>';
            tpl += '<div class ="cover" style = "background-image:url('+node.cover_small+')"></div>';
            tpl +='<h3>'+node.name+'</h3>';
            tpl += '</li>'
        return $(tpl)   
    },

    footSetStyle: function(){
        var footerCnt = this.$footer.find('li').length;
        var liWidth = this.$footer.find('li').outerWidth(true);
        console.log(footerCnt,liWidth)
        this.$footerul.css({
            width: footerCnt * liWidth + 'px'
        })
    }
}


var player = {
    init: function(){
        this.$container = $("#page-music")
        this.channelId;
        this.audio = new Audio();
        this.audio.autoplay = true;
        this.bind();//bind 不能放在audio的前面，否则会在bind中获取不到这个audio

    },
    bind: function(){
        var _this = this;
        EventCenter.on('select-albumn',function(e,channelId){
            _this.channelId = channelId;
            _this.loadSong(function(){
                _this.setSong()
            });
        });
        //play&&pause
        _this.$container.find('.play-btn').on('click',function(){
            if(_this.audio.paused){
                _this.audio.play();
                _this.$container.find('.play-btn').removeClass("fa-play").addClass("fa-pause");
                _this.$container.find('.aside figure').css('animation-play-state', 'running')
            }else{
                _this.audio.pause();
                _this.$container.find('.play-btn').removeClass("fa-pause").addClass("fa-play");
                _this.$container.find('.aside figure').css('animation-play-state', 'paused')

            }
        });
        //下一首;
        _this.$container.find('.fa-step-forward').on('click',function(){
            _this.loadSong();
            //_this.$container.find('.aside figure').removeClass('restart');
        });
        //利用setInterval 匀速输出时间 监听play
          _this.audio.addEventListener('play',function(){//找了半天jQuery没有onplay
            //console.log('inplay',_this.audio)
            clearInterval(_this.clock)
            _this.clock = setInterval(function(){
                _this.updateStatus();//更新时间，进度条,等等
            },1000)
          })
          _this.audio.addEventListener('pause',function(){
            clearInterval(_this.clock);
            //console.log('inpause')
       });
       // 监听进度条拖拽+函数节流
       _this.$container.find('.bar').on('click',function(e){
           console.log(_this.$container.find('.bar').width());
           console.log(e.offsetX)
           var timer;
           var dragpercentage = e.offsetX / _this.$container.find('.bar').width();
            return (function(){
                console.log('insettimeout')
                if(timer){
                    //console.log(timer)
                    clearTimeout(timer);
                }
                timer = setTimeout(function(){
                    _this.audio.currentTime =Math.floor(dragpercentage * _this.audio.duration);//需要Math.floor 否则会报错 
                },300)
            })()
       });
       // 控制音量
       // 利用toggleClass 实现音量调节bar的显示与不显示
       _this.$container.find('.vol .fa-volume-up').on('click',function(){
            _this.$container.find('.vol .volumebar').toggleClass('volDisplay');
       });
       _this.$container.find('.vol .volumebar').on('change',function(){
           var vol = (this.value)
        //    console.log('invol',vol);
            _this.audio.volume = vol;
       })

    },
    loadSong(){
        var _this = this;
        console.log('inloadsong')
        $.ajax({
            url: "https://jirenguapi.applinzi.com/fm/getSong.php",
            type: "GET",
            data: {
              channel: this.channelId,
            },
            dataType: "jsonp",
        }).done(function(ret){
            _this.song = ret["song"][0];
            console.log('inloadsong',_this.song)
            _this.setSong();
            _this.loadLyric();

        })
    },
    loadLyric(){
        var _this = this;
        console.log('inloadlyric', _this.song.sid)
        $.ajax({
            url: "https://jirenguapi.applinzi.com/fm/getLyric.php",
            type: "GET",
            data:{
              sid: _this.song.sid
            },
        }).done(function(ret){
           var lyric = JSON.parse(ret).lyric
           var lyricObj = {}
           lyric.split('\n').forEach(function(line){
                var times = line.match(/\d{2}:\d{2}/g)
                var str = line.replace(/\[.+?\]/g, '')
                if(Array.isArray(times)){
                    times.forEach(function(time){
                        lyricObj[time] = str
                    })
                }             
           })
           _this.lyricObj = lyricObj
           window.lyric = lyric
        }).fail(function(error){
          console.log('error:',error)
        })
    },
    setSong(){
        var _this = this;
        console.log('insetmusic', this.song)
        console.log('insetmusic', this.channelId)
        _this.audio.src = _this.song.url;//设置音乐的链接
        _this.$container.find('.aside figure').css('background-image', 'url('+ _this.song.picture + ')')
        _this.$container.find('.detail h1').text(_this.song.title)
        _this.$container.find('.detail .author').text(_this.song.artist)
        _this.$container.find('.detail .tag').text(_this.channelId.channelName)
        _this.$container.find('.play-btn').removeClass("fa-play").addClass("fa-pause");
        _this.$container.find('.aside figure').css('animation-play-state', 'running')
        _this.$container.find('.aside figure').toggleClass('restart');
    },
    updateStatus(){
        var _this = this;
        console.log("inupdate")
        var currentTime = _this.audio.currentTime;
        var totalTime = _this.audio.duration;
        var currentMinute = Math.floor(currentTime / 60);
        var currentSecs = Math.floor(currentTime % 60);
        var totalSecs = Math.floor(totalTime % 60);
        var totalMinute = Math.floor(totalTime / 60);
        var percentage = (currentTime / totalTime)*100;
        _this.$container.find('.area-bar .current-time').text(_this.getTimeFormat(currentSecs,currentMinute));//显示当前时间
        _this.$container.find('.area-bar .total-time').text(_this.getTimeFormat(totalSecs,totalMinute));//显示总时间
        _this.$container.find('.area-bar .bar-progress').css('width', percentage+'%')
        var currentLyric = _this.lyricObj['0'+currentMinute+':'+currentSecs]
        if(currentLyric){
            _this.$container.find('.lyric p').text(currentLyric).boomText();
        }
        if(totalTime - currentTime < 1){
            _this.loadSong();//监听播放时间与总时间的关系，自动播放下一曲
        }
       // console.log(_this.lyricObj['0'+currentMinute+':'+currentSecs])
    },
    getTimeFormat(seconds,minutes){
        var tpl;
        if(seconds<10){
            tpl = minutes + ':0'+ seconds
        }else{
            tpl = minutes + ':'+ seconds;
        }
        return tpl;
    },
}

$.fn.boomText = function(type){
    type = type || 'rollIn'
    console.log(type)
    this.html(function(){
      var arr = $(this).text()
      .split('').map(function(word){
          return '<span class="boomText">'+ word + '</span>'
      })
      return arr.join('')
    })
    
    var index = 0
    var $boomTexts = $(this).find('span')
    var clock = setInterval(function(){
      $boomTexts.eq(index).addClass('animated ' + type)
      index++
      if(index >= $boomTexts.length){
        clearInterval(clock)
      }
    }, 300)
  }

footer.init();
player.init();