/**
 * Created by Administrator on 2017/4/1.
 */
window.onload=function(){
    var otxt=document.getElementById("txt");
    var obtn1=document.getElementById("btn1");
    var otio=document.getElementById("tio");
    var obt=document.getElementById("bt");

    obtn1.onclick=function(){  //点击的时候从新渲染数据显示第一页，的第一条数据。
        enterclick();
    }

    document.onkeydown=function(e){
        var e=e || window.event;
        if(e.keyCode==13){
            enterclick();
            e.preventDefault();
        }
    }

    function enterclick(){   //事件发生的时候出现的情况
        var val=testStr(otxt.value);
        otxt.value=null;
        if(val){
            ajax({
                url:"weibo.php?act=add&content=",
                type:"json",
                name:val,
                success:function(data){
                    ajax({
                        url:"weibo.php?act=get&page=1",
                        type:"json",
                        success:function(data){
                            jsonHtml(data,1);
                            pageAcreat();
                        }
                    })
                }
            })
        }else{
            alert("内容不能为空")
        }
    }

    ajax({//刷新的时候数据会到第一页
        url:"weibo.php?act=get&page=1",
        type:"json",
        success:function(data){
            jsonHtml(data);
            pageAcreat();
        }
    })

    function jsonHtml(data,a){ //这是数据主要渲染的函数
        tio.innerHTML="";
        for(var i=0;i<data.length;i++){
            tio.innerHTML+='<div class="tiao" id="'+data[i].id+'"><p>'+data[i].content.substring(1)+'</p>'+'<div class="xia">'+'<span>'+getTime(data[i].time)+'</span>'+
                '<p class="xlar">'+'<a href="javascript:;">'+data[i].acc+'</a><a href="javascript:;">'+data[i].ref+'</a><a href="javascript:;">'+"删除"+'</a></p></div></div>'
        }
        touch(a); //是产生顶还有点击事件的函数。
    }

    function touch(x){  //点击事件的函数。
        var oTclass=otio.getElementsByClassName("tiao");
        for(var i=0;i<oTclass.length;i++){
            var oA=oTclass[i].getElementsByTagName("a");
            oA[0].onclick=function(){
                var ding=this.parentNode.parentNode.parentNode.getAttribute("id");
                var d=ding+"0";
                if(!getCookie(d)){   //设置一天只能点击一次通过cookie值来的。
                    var s=this.innerHTML;
                    setCookie(d,s,0.66);
                    this.innerHTML=parseInt(getCookie(d))+1;
                    ajax({
                        url:"weibo.php?act=acc&id="+ding
                    })
                }else{
                    alert("你今天点赞过了");
                }
            };
            oA[1].onclick=function(){
                var ding=this.parentNode.parentNode.parentNode.getAttribute("id");
                var c=ding+"1";
                if(!getCookie(c)){
                    var s=this.innerHTML;
                    setCookie(c,s,0.66);
                    this.innerHTML=parseInt(getCookie(c))+1;
                    ajax({
                        url:"weibo.php?act=ref&id="+ding
                    })
                }else{
                    alert("你今天点赞过了");
                }

            };
            oA[2].onclick=function(){
                var ding=this.parentNode.parentNode.parentNode.getAttribute("id");
                this.parentNode.parentNode.parentNode.remove();
                removeCookie(ding+"0",-1);
                removeCookie(ding+"1",-1);
                ajax({
                    url:"weibo.php?act=del&id="+ding,
                    success:function(data){
                        var as=obt.getElementsByTagName("a");
                        var long=as.length;
                        ajax({
                            url:"weibo.php?act=get_page_count",
                            type:"json",
                            success:function(data) {
                                if (long != data.count) {
                                    obt.removeChild(as[long-1]);
                                }
                                    ajax({
                                        url:"weibo.php?act=get&page="+x,
                                        type:"json",
                                        success:function(data){
                                            jsonHtml(data,x);
                                        }
                                    })

                            }
                        })

                    }
                })
            };
        }
    }

    function getPage(){   //获得页数的函数
        ajax({
            url:"weibo.php?act=get_page_count",
            type:"json",
            success:function(data){
                return data.count;
            }
        })
    }

    function pageAcreat(){   //产生下面按钮的函数。
        obt.innerHTML=null;
        ajax({
            url:"weibo.php?act=get_page_count",
            type:"json",
            success:function(data){
                for(var i=0;i<data.count-1;i++){
                    if(i==0){
                        obt.innerHTML+='<a class="active" href="javascript:;">'+(i+1)+'</a>';
                    }else{
                        obt.innerHTML+='<a href="javascript:;">'+(i+1)+'</a>';
                    }
                }
                clickPage();
            }
        })
    }

    function clickPage(){
        var as=obt.getElementsByTagName("a");
        for(var i=0;i<as.length;i++){
            as[i].onclick=function(){
                var s=this.innerHTML;
                for(var j=0;j<as.length;j++){
                    as[j].className="";
                }
                this.className="active";
                ajax({
                    url:"weibo.php?act=get&page="+s,
                    type:"json",
                    success:function(data){
                        jsonHtml(data,s);
                    }
                })
            }
        }
    }

    function testStr(str) {   //检查全是空字符串的方法
        var s = str.trim();
        if(s.length!=0){
            return s;
        }else{
            return false;
        }
    }

    function getTime(num){   //这是时间显示的主要函数。
        var oday=new Date(num*1000);
        var year=oday.getFullYear();
        var mom=oday.getMonth()+1;
        var day=oday.getDate();
        var hour=oday.getHours();
        var min=oday.getMinutes();
        var sec=oday.getSeconds();
        function fn(n){
            n=n+"";
            if(n.length==1){
                n="0"+n;
            }
            return n;
        }
        return year+"-"+fn(mom)+"-"+fn(day)+" "+fn(hour)+"-"+fn(min)+"-"+fn(sec);
    }

    function setCookie(name, value, iDay){
        if(iDay!==false)
        {
            var oDate=new Date();
            oDate.setDate(oDate.getDate()+iDay);
            document.cookie=name+'='+value+';expires='+oDate+';path=/';
        }
        else
        {
            document.cookie=name+'='+value;
        }
    }
    function getCookie(name){
        var arr=document.cookie.split('; ');
        var i=0;
        for(i=0;i<arr.length;i++)
        {
            var arr2=arr[i].split('=');
            if(arr2[0]==name)
            {
                return arr2[1];
            }
        }
        return '';
    }
    function removeCookie(name){
        setCookie(name, 'a', -1);
    }







}