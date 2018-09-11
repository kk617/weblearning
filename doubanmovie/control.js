var topMovies = {
  init: function(){
    this.$displayarea = $("#topmovies");
    this.isLoading = false;
    this.$content = this.$displayarea.find('.container');
    this.index = 0;
    this.isFinish = false;
    this.bind();
    this.start();
  },
  bind: function(){
    var _this = this;
    this.$displayarea.scroll(function(){
      if(!_this.isFinish && helper.isToEnd(_this.$displayarea,_this.$content)){
        _this.start();
      }
    })
  },
  start: function(){
    var _this = this;
    this.getData(function(data){
     _this.render(data);
    })
    
  },
 getData: function(callback){
    var _this = this;
    if(_this.isLoading) {
      return;
    };
    _this.isLoading = true;
    _this.$displayarea.find('.loading').show();
    $.ajax({
      url: 'https://api.douban.com/v2/movie/top250',
      data: {
      start: _this.index||0
    },
      dataType: 'jsonp'
    }).done(function(ret){
      console.log(ret)
      _this.index += 20;
      if(_this.index >= ret.total){
        _this.isFinish = true;
      }
      callback&&callback(ret);
    }).fail(function(){
      console.log('erro')
      _this.index += 20;
      if(_this.index >= ret.total){
        _this.isFinish = true;
      }
      callback&&callback(ret);
    }).always(function(){
      _this.isLoading = false;
      _this.$displayarea.find('.loading').hide();
    })
  },
  render: function(data){
    var _this = this;
    console.log(data);
    data.subjects.forEach(function(movie){
    _this.$content.append(helper.createNode(movie))
    })
  },
}


var Intheatermovies = {
    init: function(){
    console.log("intheaterok")
    this.isToBottom = false;
    this.$displayarea = $("#intheatermovies")
    this.$content = this.$displayarea.find('.container')
    this.start();
    this.bind();
  },
  start: function(){
    var _this = this;
    _this.getData(function(data){
    _this.render(data);
    })
  },
  bind: function(){
    var _this = this;
    if(!_this.isToBottom&&helper.isToEnd(_this.$displayarea,_this.$content)){
      _this.start();
    }
  },

  getData: function(callback){
    var _this = this;
    if (_this.isToBottom){
      return;
    }
    _this.isToBottom = false;
    this.$displayarea.find(".bottom").hide();
    $.ajax({
      url: 'https://api.douban.com/v2/movie/in_theaters',
      type: 'GET',
      data:{
        city: "上海"
      },
      dataType: "jsonp"
    }).done(function(ret){
      console.log(ret);
      callback&&callback(ret);
    }).fail(function(){
      console.log("intheatererro");
    }).always(function(){
      _this.isToBottom = true;
      _this.$displayarea.find(".bottom").show();
    })
  },
  render: function(data){
    var _this = this;
    data.subjects.forEach(function(movie){
     _this.$content.append(helper.createNode(movie));
    })
  },
}

var searchBox = {
  init: function(){
    console.log('search box good');
    this.$element = $('#searchmovies')
    this.$searchbox = $('#searchmovies>.container .search');
    this.$button = $('#searchmovies .fa-search');
    this.$displayarea = $("#searchmovies")
    this.keyword = '';
    this.start(); 
    this.bind()
  },
  start: function(){
    var _this = this;
    _this.getData(function(data){
      _this.render(data)
    })
  },
  bind: function(){
    var _this = this;
     _this.$element.find('.button').on('click', function(){
      _this.keyword = _this.$element.find('input').val();
      console.log(_this.keyword);
      _this.start();
    })
  },
  
  getData: function(callback){
    var _this = this;
    $.ajax({
      url: "https://api.douban.com/v2/movie/search",
      data: {
      q: _this.keyword
    },
      dataType: "jsonp"
    }).done(function(ret){
       console.log(ret)
       callback&&callback(ret);
    }).fail(function(){
       console.log('searcherro')
    })
    },
  
  render: function(data){
   var _this = this;
  data.subjects.forEach(function(movie){
    _this.$displayarea.find(".container").append(helper.createNode(movie))
      })
    },
  }


var helper = {
  isToBottom: function($content){
    return $content.height();
  },
  isToEnd: function($viewport, $content){
    return $viewport.height()+ $viewport.scrollTop() + 10 > $content.height(); 
  },
  createNode: function(movie){
    var template = `<div class="item">
          <a href="">
            <div class="image">
            <img src="" alt="">
            </div>
            <div class="detail">
              <h2></h2>
              <div class="extra"><span class="score"></span>分</div>
              <div class="extra"><span class= "year"> </span>年</div>
              <div class="extra">导演：<span class= "director"> </span></div>
              <div class="extra">演员：<span class= "actor"> </span></div>
            </div>
          </a>
        </div>`
    var $node = $(template);
    $node.find('a').attr('href', movie.alt)
    $node.find('img').attr('src',movie.images.medium)
    $node.find('.detail h2').text(movie.title);
    $node.find('.extra .score').text(movie.rating.average)
    $node.find('.collect').text(movie.collect_count)
    $node.find('.year').text(movie.year)
    $node.find('.type').text(movie.genres.join(' / '))
    $node.find('.director').text(function(){
      var director = []
      movie.directors.forEach(function(item){
        director.push(item.name);
      })
      return director.join('|')
  })
    $node.find('.actor').text(function(){
      var actor = []
      movie.casts.forEach(function(item){
        actor.push(item.name);
      })
      return actor.join('|')
    })
    return $node;
  },
}









var app = {
  init: function(){
    this.$tabs = $('footer>div');
    this.$pannels = $('section'); 
    this.bind();
    topMovies.init();
    Intheatermovies.init();
    searchBox.init();
  },
  start: function(){
    
  },
  bind: function(){
   var _this = this;
   this.$tabs.on('click',function(){
   console.log("1"); 
   $(this).addClass("active").siblings().removeClass("active");
   _this.$pannels.eq($(this).index()).fadeIn().siblings().hide().siblings('.navbar').show();
   
   })
 },
  getData: function(){
    
  },
  setData: function(){
    
  }
}
app.init();

