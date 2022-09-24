$(function () {
    let layer = layui.layer
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 为上传按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#file').click()
    })

    // 为文件选择框绑定change事件
    $('#file').on('change', function (e) {
        // 获取用户选择的文件
        // 是一个伪数组
        let filelist = e.target.files
        if (filelist.length === 0) {
            return layer.msg('请选择照片!')
        }
        //1  拿到用户选择的文件
        let file = filelist[0]
        // 2 给文件创建一个路径
        let newImgURL = URL.createObjectURL(file)

        console.log(filelist);
    })
})