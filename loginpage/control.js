function $(selector){
    return document.querySelector(selector);
}
function $$(selector){
    return document.querySelectorAll(selector);
}
$('header .login').addEventListener('click',function(e){
    e.stopPropagation();
    $('.flip-pannel').style.display = 'block';
})
$('.flip-pannel').addEventListener('click',function(e){
    e.stopPropagation();
    if(e.target.classList.contains('login')){
        $('.flip-pannel').classList.remove('register');
        $('.flip-pannel').classList.add('login');
        $('.flip-pannel .erromsg').innerText = "";
    }if(e.target.classList.contains('register')){
        $('.flip-pannel').classList.add('register');
        $('.flip-pannel').classList.remove('login');
        $('.flip-pannel .erromsg').innerText = "";
    }
    console.log(e.target);
    console.log(this);
    window.target = e.target;
    if(e.target.classList.contains('close')){
        $('.flip-pannel').style.display = 'none';
    }
    if(e.target.classList.contains('showpasswordicon')){
        var showpassword = $$('.flip-pannel input[name=password]');
        for (var i = 0; i<showpassword.length;i++){
            if(showpassword[i].type === 'password'){
                showpassword[i].type = 'text';
        }else{
            showpassword[i].type = 'password';
        }
        }
    }
    if(e.target.classList.contains('showpasswordiconagn')){
        var showpassword = $('.flip-pannel input[name=password2]');
        if(showpassword.type === 'password'){
                showpassword.type = 'text';
        }else{
            showpassword.type = 'password';
        }
    }
})
document.addEventListener('click',function(){
    $('.flip-pannel').style.display = 'none';
})
$(".pannel-login form").addEventListener('submit',function(e){
    e.preventDefault();
    if(!/^\w{3,8}$/.test($('.pannel-login input[name=username]').value)){
        $('.pannel-login .erromsg').innerText = '用户名需输入3-8个字符，包括字母数字下划线'
        return false
      }
    if(!/^\w{6,10}$/.test($('.pannel-login input[name=password]').value)){
        $('.pannel-login .erromsg').innerText = '密码需输入6-10个字符，包括字母数字下划线'
        return false
      }
      this.submit(); 
})
$(".pannel-register form").addEventListener('submit',function(e){
    e.preventDefault();
    if(!/^\w{3,8}$/.test($('.pannel-register input[name=username]').value)){
        $('.pannel-register .erromsg').innerText = '用户名需输入3-8个字符，包括字母数字下划线'
        return false
      }
    if(/^hunger$|^ruoyu$|^wjxalexander$/.test($('.pannel-register input[name=username]').value)){
        $('.pannel-register .erromsg').innerText = '用户名已存在'
        return false
      }
    if(!/^\w{6,10}$/.test($('.pannel-register input[name=password]').value)){
        $('.pannel-register .erromsg').innerText = '密码需输入6-10个字符，包括字母数字下划线'
        return false
      }
    if($(".pannel-register input[name=password].value")!==$(".pannel-register input[name=password2].value")){
        $('.pannel-register .erromsg').innerText = '两次输入的密码不一致';
        return false;
    }
      this.submit(); 
})
