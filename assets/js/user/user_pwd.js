$(function () {
    // 自定义表单验证规则
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 新旧密码不能一样
        samePwd: function (value) {
            if (value === $("[name=oldPwd]").val()) {
                return '新旧密码不能一致！';
            }
        },
        // 两次新密码必须一致
        rePwd: function (value) {
            if (value !== $("[name=newPwd]").val()) {
                return '两次密码输入不一致';
            }
        }
    })

    // 给表单添加提交事件
    $(".layui-form").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // 密码修改完成后，重置表单,注意，reset是原生js方法
                $(".layui-form")[0].reset();
            }
        })
    })
})