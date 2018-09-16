function Tab (node){
    //补全
  this.pannel = node;
  this.init();
  }
  
  Tab.prototype = {
      constructor: Tab,
      init: function(){
        this.pannel
        console.log(this.pannel)
        this.displayarea =  document.getElementsByClassName("displayarea")[0];
        this.index;
        this.bind();
      },
      bind: function(){
       var _this = this;
    _this.pannel.addEventListener("click",function(e){
        console.log(e.target);
       for(var i =0; i <_this.pannel.children.length; i++ ){
         console.log('in for loop')
         console.log(_this.pannel.children.length)
         console.log(i)
         _this.pannel.children[i].classList.remove("active");//先去除所有的activ
         _this.displayarea.children[i].classList.remove("active");
         //两者length一致，所以都在这里remove active了
         if(e.target == _this.pannel.children[i]){
           _this.index = i
           console.log(_this.index);
         }
       }
           e.target.classList.add("active");//事件绑定
           console.log(_this.index);
           _this.displayarea.children[_this.index].classList.add("active");
     })
    }
  }             
var tab1 = new Tab(document.querySelectorAll('.pannels')[0]);
