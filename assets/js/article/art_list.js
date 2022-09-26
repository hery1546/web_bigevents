$(function(){
    // 定义一个查询的参数对象,将来请求数据的shih
    // 需要将请求参数对象提交到服务器
    let q ={
        pagenum: 1,  // 页码值
        pagesize: 2,  // 每页显示多少条数据
        cate_id: '',   // 文章分类的 Id
        state: ''      // 文章的发布状态，可选值有：已发布、草稿
    }
    initTable()

    let layer = layui.layer

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method:'get',
            url:'/my/article/list',
            data: q,
            success: function(res){
                if(res.status !==0 ){
                    return layer.msg('获取文章列表失败!')
                }
                layer.msg('获取文章列表成功!')
                //  使用模板引擎渲染页面的数据
               let htmlstr = template('tpl_table', res.data) 
               $('tbody').html(htmlstr)          
            }
        })
    }

})