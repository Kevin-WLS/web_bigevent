// 测试函数
function test2() {
    console.log('testttttttttttttt');
}
var form = layui.form;
var layer = layui.layer;


initCate();
// 初始化富文本编辑器
initEditor();
// 定义加载文章分类的方法
function initCate() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function (res) {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg(res.message);
            console.log(123);
            var htmlStr = template("get_cate", res);
            $('[name=cate_id]').html(htmlStr);
            // 一定要调用一下 form.render() 方法，重新渲染一下表单区域
            form.render();
        }
    })
}



// 图片封面裁剪
// 1. 初始化图片裁剪器
var $image = $('#image')

// 2. 裁剪选项
var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
}

// 3. 初始化裁剪区域
$image.cropper(options)

// 为选择封面按钮添加点击事件
$("#btnChooseImage").on("click", function () {
    $("#coverFile").click();
    // 为文件选择框绑定change事件，获取用户选择的文件
    $("#coverFile").on("change", function (e) {
        console.log(e);
        // 更换裁剪的图片
        // 1、拿到用户选择的文件
        var file = e.target.files[0];
        console.log(file);
        // 2、根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file);
        // 3、先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })
})




// 发布新文章
// 分析：由于请求体中的参数是 FormData 格式的，因此需要实例化 FormData 对象
var art_state = '已发布';
// 监听 存为草稿 按钮的点击事件，点击后将 art_state 改为 存为草稿
$("#art_save").on("click", function () {
    art_state = '草稿';
})
$("#form_pub").on("submit", function (e) {
    e.preventDefault();
    // 实例化 FormData 对象
    var fd = new FormData($(this)[0]);
    // fd 对象中增加状态属性
    fd.append('state', art_state);
    // 将裁剪后的图片，输出为文件
    $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            // 将剪裁后的图片以文件的格式追加到 fd 中
            fd.append("cover_img", blob);
            // fd.forEach(function (key, value) {
            //     console.log(key, value);
            // })
            // 发起ajax请求
            publishArticle(fd);
        })
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("发送失败")
                }
                layer.msg("发送成功");
                // gett();
                location.href = '/article/article_list.html';
                // console.log($("[name=content]").val());
            }
        })
    }
})


// 文章列表中的编辑功能,未完成
// var data_edi = '';
// data_edi = localStorage.getItem("data");
// localStorage.removeItem("data");
// console.log(data_edi);
// if (data_edi) {
//     data_edi = JSON.parse(data_edi);
//     form.val("form_pub", data_edi);
//     $("[value=data_edi.id]").attr('selected', 'selected');

//     // $("[name=title]").val(data_edi.title);
//     // $("[name=cate_id]").find("[value=data_edi.id]").attr('selected', 'selected');
//     $("[name=content]").val(data_edi.content);

//     // form.render();
//     data_edi = null;
// }

