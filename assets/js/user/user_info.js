$(function(){
    let form = layui.form
    let layer = layui.layer
    form.verify({
        nickname:function(value){
            if(value.length>6){
                return '昵称长度在1-6个字符之间'
            }
        }
    })
    initUserInfo()

    // 初始化用户的基本信息
    function initUserInfo(){
        $.ajax({
            method:'get',
            url:'/my/userinfo',
            success:function(res){
                console.log(res)
                if(res.status!==0){
                    return layer.msg(res.message)
                }
                // form.val() 快速为表单赋值
                form.val('fromUserInfo', res.data)
            }
        })
    }
   
    // 重置表单的数据
    $('#btnReset').on('click', function(e){
        // 阻止表单的默认重置行为
        e.preventDefault()
        initUserInfo()
    })
    // 表单数据的提交
    // 监听表单的提交事件
    $('.layui-form').on('submit', function(e){
        // 阻止表单的默认提交行为
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success:function(res){
                if(res.status !==0){
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                // 调用父页面中的方法,重新渲染用户的头像和用户的信息
                window.parent.getUserInfo()
            }
        })
    })
})