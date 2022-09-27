$(function () {
    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (data) {
        let dt = new Date(data)
        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())

        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询的参数对象,将来请求数据的
    // 需要将请求参数对象提交到服务器
    let q = {
        pagenum: 1,  // 页码值
        pagesize: 2,  // 每页显示多少条数据
        cate_id: '',   // 文章分类的 Id
        state: ''      // 文章的发布状态，可选值有：已发布、草稿
    }
    initTable()
    initCate()

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败!')
                }
                layer.msg('获取文章列表成功!')
                //  使用模板引擎渲染页面的数据
                let htmlstr = template('tpl_table', res)
                $('tbody').html(htmlstr)
                // 渲染完数据后 调用分开方法
                renderPage(res.total)
            }
        })
    }

    // 获取文章分类的列表
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败')
                }
                layer.msg('获取文章分类成功')

                // 调用模板引擎渲染分类的可选项
                let htmlstr = template('tpl_cate', res)
                // console.log($('[name=cate_id]'))
                $('[name=cate_id]').html(htmlstr)
                // 通过layui 重新渲染表单区域的ui结构
                form.render()
            }
        })
    }

    // 为筛选表单绑定submit事件
    $('#form_search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单中选中项的值
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        // 为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件, 重新渲染表格的数据
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用 laypage.render()方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox',  //分页容器的Id
            count: total,   // 总数据条数
            limit: q.pagesize,  //每页显示几条数据
            curr: q.pagenum,    // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候,触发jump回调

            jump: function (obj, first) {

                // //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数

                // 把最新的页码值, 赋值到q这个查询参数对象中
                q.pagenum = obj.curr
                // 把最新的条数, 赋值到q这个查询参数对象中
                q.pagesize = obj.limit

                // 根据最新的q 获取对应的数据列表 并渲染表格
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 通过代理的形式,为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function (e) {
        // 获取删除按钮的个数
        let len = $('.btn-delete').length
        e.preventDefault()
        // 获取文章的ID
        let id = $(this).attr('data-id')
        layer.confirm('确定要删除吗?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    // 当数据删除完成后,需要判断当前这一页中,是否还有剩余的数据
                    // 如果没有剩余的数据了,则让页码值-1 之后, 再重新调用initTable()方法
                    // 根据当前页面删除按钮个数判断当前页面是否还有数据
                    if (len === 1) {
                        // 如果len的值等于1,证明删除完毕之后,页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index)
        })
    })
})