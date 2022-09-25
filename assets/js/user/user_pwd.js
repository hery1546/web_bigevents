$(function(){
    let form = layui.form
    let layer = layui.layer
    form.verify({
        pass: [/^[\S]{6,12}$/,
        '密码必须6到12位,且不能出现空格'],
        somePwd: function(value){
            if(value === $('[name=oldPwd]').val()){
                return '新旧密码不能相同'
            }
        } ,
        repwd: function(value){
            if(value !== $('[name=newPwd]').val()){
                return '两次密码要一样'
            }
        }
    })
    $('.layui-form').on('submit', function(e){
        e.preventDefault()
        $.ajax({
            method:'post',
            url:'/my/updatepwd',
            data: $(this).serialize(),
            success: function(res){
                if(res.status !==0){
                    return layer.msg('更新密码失败')
                }
                layer.msg('更新密码成功')
                // 重置表单 通过[0]转原生dom对象
                $('.layui-form')[0].reset()
            }
        })
    })

})