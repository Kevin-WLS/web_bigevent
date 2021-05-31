$(function () {
    var layer = layui.layer;
    var form = layui.form;
    // 初始化文章列表
    initArtCateList();
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                var html_str = template('tpl_table', res);
                $("tbody").html(html_str);
            }
        })
    }

    // 为添加类别按钮添加绑定事件
    var indexAdd = null;
    $("#btnAddCate").on("click", function () {
        // 弹出一个添加类型的层
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            // 将页面元素以字符串的格式获取并填充到内容区
            content: $("#dialog_add").html()
        });
        //拿到的index是一个重要的凭据，它是诸如layer.close(index)等方法的必传参数。       
    })

    // 为弹出层里的form 表单添加submit提交事件
    // 因为表单时未来元素，采用事件代理
    $("body").on("submit", "#form_add", function (e) {
        e.preventDefault();
        console.log('ok');
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // 初始化文章列表（更新）
                initArtCateList();
                // 根据索引关闭对应弹出层
                layer.close(indexAdd);
            }
        })
    })

    // 为表格中的 编辑 按钮添加点击事件
    // 因为是未来元素，所以采用代理的形式
    var indexEdit = null;
    $("tbody").on("click", "#btn_edit", function () {
        console.log('ok');
        // 弹出一个修改文章信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            // 将页面元素以字符串的格式获取并填充到内容区
            content: $("#dialog_edit").html()
        });
        // 先发起请求，把弹出层中的表格填充
        // 根据 Id 获取文章分类数据
        var id = $(this).attr("data-id");
        console.log(id);
        $.ajax({
            method: 'GET',
            // url:'/my/article/cates/:id'   // :id 就是拼接 id 的意思，：不能写，改为 + 
            url: '/my/article/cates/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // layui提供的快速将获取过来的数据填充到表单中
                form.val("form_edit", res.data);
            }
        })
    })

    // 通过代理的形式，为编辑弹出层中的 确认修改 按钮 添加submit提交事件
    $("body").on("submit", "#form_edit", function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // 关闭弹出层
                layer.close(indexEdit);
                // 初始化文章列表（更新）
                initArtCateList();
            }
        })
    })

    // 通过代理的形式为表格中的删除按钮添加点击事件
    $("tbody").on("click", "#btn_delete", function () {
        var id = $(this).attr("data-id");
        console.log(id);
        // 点击删除按钮后弹出询问框
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            console.log('ok');
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg(res.message);
                    // 初始化文章列表（更新）
                    initArtCateList();
                }
            })
            layer.close(index);
        });
    })
})