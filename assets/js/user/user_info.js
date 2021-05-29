$(function () {
    var form = layui.form;
    var layer = layui.layer;
    // 自定义表单验证规则
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '请输入 1 - 6 个字符！';
            }
        }
    })
    initUserInfo();
    // 初始化用户基本信息
    function initUserInfo() {
        // 获取用户的基本信息
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败');
                }
                layer.msg('获取用户信息成功！');
                console.log(res);
                // form.val() layui官方提供的快速给表单赋值和快速获取表单内容的方法
                console.log(form.val('formUserInfo'));  // 获取表单内容（与本案例无关）
                form.val('formUserInfo', res.data);  // 给表单赋值
                console.log(form.val('formUserInfo'));  // 获取表单内容，同时也可以得到隐藏域中的内容（与本案例无关）
            }
        })
    }

    // 重置按钮的点击事件
    $("#btnReset").on("click", function (e) {
        // 阻止重置按钮的默认清空行为
        e.preventDefault();
        // 重新给表单赋值,再次调用函数初始化用户信息
        initUserInfo();
    })

    // 监听表单的提交事件
    $(".layui-form").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            // data: form.val('formUserInfo'),
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改用户信息失败')
                }
                layer.msg('修改用户信息成功！');
                console.log('修改用户信息成功！');
                // 再次调用函数初始化用户信息
                // initUserInfo();
                // 调用父页面中的方法 gitUserInfo ，重新渲染用户的头像和用户的信息（当前页面是在 iframe 页面中）
                console.log($(".layui-form").parent);
                window.parent.test();
                // 注意：如果有$入口函数，以下的方法可能调用不成功
                window.parent.gitUserInfo();  // window 代表 iframe 这个窗口

            }
        })
    })

})