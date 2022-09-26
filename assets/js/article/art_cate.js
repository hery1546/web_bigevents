$(function () {
    let layer = layui.layer
    let form = layui.form

    initAriCaleList()

    // 获取文章分类的列表
    function initAriCaleList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return '获取文章分类数据失败'
                }
                let htmlstr = template('tpl_table', res)
                $('tbody').html(htmlstr)
            }
        })
    }
    // 为添加类别按钮绑定点击事件
    // 用到弹出层
    let indexAdd = null
    $('#btnAddArtList').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#dialog_add').html()
        })
    })
    // 网页是是没有from_add表单的 只有点击了才有
    // 通过代理的形式,为from_add表单绑定submit事件
    // $('#form_add').on('submit',function(e){})
    $('body').on('submit', '#from_add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章类型失败')
                }
                layer.msg('新增文章类型成功')
                // 成功后 更新一下文章分类
                initAriCaleList()
                // 关闭弹出层
                layer.close(index)
            }
        })
    })

    // 通过代理方式,为btn_edit按钮绑定点击事件
    let indexEdit = null
    $('tbody').on('click', 'btn_edit', function () {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#dialog_edit').html()
        })

        let id = $(this).attr('data-id')
        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('from_edit', res.data)
            }
        })
    })

    // 通过代理的方式, 为修改分类的表单绑定submit事件
    $('body').on('submit', '#from_edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新文章分类失败!')
                }
                layer.msg('更新文章分类成功!')
                // 关闭弹出层
                layer.close(indexEdit)
                // 刷新文章分类数据
                initAriCaleList()
            }
        })
    })

    // 通过代理的形式,为删除按钮绑定点击事件
    $('body').on('click', '.btn-delete', function () {
        let id = $(this).attr('data-id')

        // 提示用户是否要删除
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败!')
                    }
                    layer.msg('删除分类成功!')
                    // 关闭这个层
                    layer.close(index)
                    // 刷新列表数据
                    initAriCaleList()
                }
            })
        })
    })



})