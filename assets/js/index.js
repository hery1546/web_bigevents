$(function () {
    // 调用getUserInfo() 获取用户信息
    getUserInfo()

    let layer = layui.layer

    $('#btnlogout').on('click', function () {
        // 提示用户是否确认退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            // 清空本地存储数据
            localStorage.removeItem('token')
            // 跳转到登录界面
            location.href = '/login.html'

            // 关闭confirm提示框
            layer.close(index)
        })
    })
})

// 获取用户的基本信息
function getUserInfo() {
    // let token = localStorage.getItem('token')
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        // // headers 就是请求头配置对象
        // headers: {
        //     Authorization: token || '',
        // },
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            renderAvatar(res.data)
        },

        // 控制用户没有登录就可以进后台主页面
        // 不论成功或失败,最终都会调用complete回调函数
        // complete: function (res) {
        //     // console.log('执行了complete回调')
        //     // console.log(res)
        //     // 在complete回调函数中,可以使用res.responseJSON 拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 1 清空本机存储数据token
        //         localStorage.removeItem('token')
        //         // 2 强制跳转到登录界面
        //         location.href = 'login.html'
        //     }

        // }
    })
}
// 渲染用户的头像
function renderAvatar(user) {
    //1  获取用户的名称
    let name = user.nickname || user.username
    // 2 设置欢迎的文本
    $('#welcome').html('欢迎:&nbsp;' + name)
    // 3 渲染图片头像
    if (user.user_pic !== null) {
        // 3.1
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        let first = name[0].toUpperCase()
        $('.text-avatar').html(first).show
    }
}