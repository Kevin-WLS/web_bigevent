$(function () {
    // 点击登录和注册相互切换
    $("#link_reg").on("click", function () {
        $(".login_box").hide();
        $(".reg_box").show();
    })
    $("#link_login").on("click", function () {
        $(".reg_box").hide();
        $(".login_box").show();
    })

    // 自定义表单校验规则
    // 从 layui 上获取 form 对象，再调用 form 对象的方法 verify
    // layui 和 jQuery 一样，只要导入相关的 js 文件，就会自动生成 一个 layui 对象 和 jQuery（$） 对象
    var form = layui.form;
    var layer = layui.layer;  // form 和 layer 一样都需要从 layui 上获取后才能使用form和layer身上的方法
    // 通过 form.verify() 函数自定义校验规则
    form.verify({
        // 自定义一个名为 pwd 的校验规则，如果不满足时提示后面的消息（通过 layui 自定义）
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一致的规则
        // value是确认密码框输入的内容，语法格式，参考 layui 理解
        repwd: function (value) {
            // 拿到密码框中的内容
            var pwd = $(".reg_box [name=password]").val();
            if (pwd !== value) {
                return '两次密码不一致';
            }
        }
    })

    // 表单注册
    // 监听注册表单的提交事件
    $("#form_reg").on("submit", function (e) {
        e.preventDefault();
        var username = $("#form_reg [name=username]").val();
        var password = $("#form_reg [name=password]").val();
        // baseAPI.js 文件中有函数已经对 URL 地址做了处理
        $.post('/api/reguser', {
            username: username,
            password: password
        }, function (res) {
            console.log(res);
            if (res.status !== 0) {
                // 采用 弹出层 来提示用户注册成功或者失败的原因和信息
                // return console.log(res.message);
                return layer.msg(res.message);
            }
            // console.log('注册成功，请登录！');
            layer.msg('注册成功，请登录！');
            $("#link_login").click();
        })
    })

    // 表单登录
    $("#form_login").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            // 因为 baseAPI.js 文件中有函数已经对 URL 地址做了处理，因此这里可以这样写
            url: '/api/login',
            // serialize() 函数 快速获取表单中的数据，返回固定格式的字符串
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('登录失败');
                }
                layer.msg(res.massage);
                // 将登录成功得到的token数据存储到本地存储，因为后期有些需要权限的接口都需要这个才能调用成功
                localStorage.setItem('token', res.token);

                // 登录成功后页面跳转到 index.html
                location.href = '/index.html';
            }
        })



    })

})