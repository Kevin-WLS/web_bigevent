$(function () {
    // js 实现创建剪裁区
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

    // 文件上传点击事件
    $("#btnChooseimage").on("click", function () {
        $("#file").click();
    })

    var layer = layui.layer;

    // 裁剪区域照片的更换
    // 为文件选择框添加 change 事件,只要选择的文件发生变化就会触发 change 事件
    $("#file").on("change", function (e) {
        console.log(e);
        console.log(e.target.files);  // 通过 e 拿到用户选择的文件
        var filelist = e.target.files;  // 得到的是一个伪数组
        if (filelist.length === 0) {
            return layer.msg('请选择一个图片');
        }
        // 1、拿到用户上传的文件
        var file = e.target.files[0];
        // 2、将文件转化为路径
        var newImgURL = URL.createObjectURL(file);
        // 3、重新初始化裁剪路径
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 将裁剪好的图片上传服务器
    $("#btnUpload").on("click", function () {
        // 拿到用户裁剪好的图片，并将其转换成 base64 格式的
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        // 调用接口将图片上传到服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // 调用父页面中的方法重新渲染里面的头像
                window.parent.gitUserInfo();
            }
        })
    })
})