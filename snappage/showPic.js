function addEvent(func){
    var oldEvent = window.onload;
    if (typeof window.onload != 'function'){
      window.onload = func;
    }else{
      window.onload=function(){
        oldEvent();
        func();
      };
    }
  }
  
  function insertAfter(newElement, oldElement){
    var parentNode = oldElement.parentNode;
    if (parentNode.lastChild == oldElement){
      parentNode.appendChild(newElement);
    }else{
      parentNode.insertBefore(newElement, oldElement.nextSibling);
    }
  }
  
  function preparePlaceholder(){
    var placeholder = document.createElement('img');
    placeholder.setAttribute("src","./image/originimage.png");
    placeholder.setAttribute("id",'placeholder');
    placeholder.setAttribute("alt",'my Pic gallery');
    var description = document.createElement('p');//描述段落
    description.setAttribute("id","description");
    var text = document.createTextNode('choose an image');//显示文本
    description.appendChild(text);
    var gallery = document.getElementById('pictureGallery');
    insertAfter(placeholder,gallery);
    insertAfter(description,placeholder);//平级关系，不能用APPendchild
  }
  
  function prepareGallery(){
    var gallery = document.getElementById('pictureGallery');
    var links= gallery.getElementsByTagName("a");
    for (var i = 0; i<links.length;i++){
      links[i].onmousemove = function(){
        return showPic(this);
      };
    }
  }
  
  function showPic(thePic){
    var source = thePic.getAttribute("href");//那个PIC的href
    var placeholder = document.getElementById('placeholder');//定位显示区域
    placeholder.setAttribute("src",source);//更改显示图片内容
    if(thePic.getAttribute("title")){
      var text = thePic.getAttribute("title");
    }else{
      var text = " ";
    }
    var description = document.getElementById('description');
    if(description.firstChild.nodeType == 3){
      description.firstChild.nodeValue = text;
    }
    return false;//阻止弹窗
  }
  addEvent(preparePlaceholder);
  addEvent(prepareGallery);
  