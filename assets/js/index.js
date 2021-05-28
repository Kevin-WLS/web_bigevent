$(function () {
    gitUserInfo();
    // 获取用户的基本信息
    function gitUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            // headers 就是请求头配置对象，有些有权限的需要携带请求头才能访问成功,在baseAPI中统一设置
            // headers: {
            //     Authorization: localStorage.getItem('token') || '',
            // },
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('获取用户信息失败');
                }
                layui.layer.msg('获取用户信息成功！');
                // 渲染用户的基本信息
                randerAvatar(res.data);
            },

            // 用户未登录，禁止访问主页 功能
            // 每次访问有权限的接口时都需要这个功能，因此，把它放到baseAPI中统一设置
            // 只要是采用ajax发起请求，不管请求是否成功，都会调用 complete 这个回调函数
            // complete: function (res) {
            //     console.log(res);
            //     console.log(res.responseJSON);
            //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //         // 1、清空本地存储中的 token
            //         localStorage.removeItem('token');
            //         // 2、强制返回到登录页面
            //         location.href = '/login.html';
            //     }
            // }
        })
    }
    // 渲染用户的基本信息
    function randerAvatar(user) {
        // 1、渲染用户名称
        var name = user.nickname || user.username;
        var firstNameString = name.charAt(0).toUpperCase();
        $("#welcome").html('欢迎&nbsp;&nbsp;' + name);
        // 2、渲染用户头像
        if (user.user_pic !== null) {
            // 渲染图片头像
            $(".layui-nav-img").show().attr('src', user.user_pic);
            $(".text-avatar").hide();
        } else {
            // 渲染文本头像
            $(".layui-nav-img").hide().attr('src', user.user_pic);
            $(".text-avatar").show().html(firstNameString);
        }
    }

    // 实现退出功能
    $("#logout").on("click", function () {
        // 提示用户是否确认退出登录
        layui.layer.confirm('是否退出登录?', { icon: 3, title: '提示' }, function (index) {
            console.log('ok');
            // 点击确认后跳转到 login 页面
            location.href = '/login.html';
            // 清空本地存储的 token 
            localStorage.removeItem('token');
            // 关闭对应的弹出层，是layui官方提供的
            layer.close(index);
        });
    })
})