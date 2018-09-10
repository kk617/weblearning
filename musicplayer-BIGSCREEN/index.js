var player = {
    init: function(){
        this.$footer = $('footer')
        this.$footerul = this.$footer.find('ul')
        this.$box = this.$footer.find('.box')
        this.$footRightBtn = this.$footer.find('.fa-chevron-right');
        this.$fooLefttBtn = this.$footer.find('.fa-chevron-left');
        this.isToEnd = false;
        this.isToStart = true;
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
            var rowcnt = Math.floor(_this.$box.width()/_this.$box.find('li').outerWidth(true));
            if(!_this.isToEnd){
                _this.$footerul.animate({
                    left: '-='+ rowcnt * _this.$box.find('li').outerWidth(true),
                },400,function(){
                    _this.isToStart=false;
                    if(parseFloat(_this.$box.width()) - parseFloat(_this.$footerul.css('left')) >= parseFloat(_this.$footerul.css('width'))){
                        console.log('over')
                        _this.isToEnd = true;
                    }
                })
            }; 
        });
        _this.$fooLefttBtn.on('click',function(){
            console.log('leftbtn')
            var rowcnt = Math.floor(_this.$box.width()/_this.$box.find('li').outerWidth(true));
            if(!_this.isToStart){
                _this.$footerul.animate({
                    left: '+=' +  rowcnt * _this.$box.find('li').outerWidth(true),
                },400,function(){
                    // 回调函数，complete状态
                    _this.isToEnd = false;
                    if(parseFloat( _this.$footerul.css('left')) >= 0){
                        _this.isToStart = true;
                        console.log('leftend')
                    }
                })
            }
        })
    },

    footrender: function(channels){
        var _this = this;
        console.log('infootrender',channels);
        $.each(channels,function(index,channel){
            console.log(channel)
            var $channel = _this.footgetNode(channel)
            _this.$footerul.append($channel)
        })
        _this.footSetStyle();
    },

    footgetNode: function(node){
        var tpl = '';
            tpl +=  '<li data-channel-id='+ node.channel_id+'data-channel-name='+node.name+'>';
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
player.init();