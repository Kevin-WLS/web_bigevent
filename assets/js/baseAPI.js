// 注意：每次调用 $.get() / $.post() / $.ajax() 的时候，都会先调用 ajaxPrefilter 这个函数，因此这个js文件必须放在 login.js 之前且在 jquery.js 之后
// 在这个函数中，可以拿到我们给 ajax 提供的配置对象，以参数 options 接收，并且做出适当的修改；
$.ajaxPrefilter(function (options) {
    // 在发起真正的 Ajax 之前，统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;

    // 统一给需要权限的接口，设置 header 请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || '',
        }
    }

    // 统一挂载 complete 这个回调函数，禁止访问有权限的接口
    options.complete = function (res) {
        // console.log(res);
        // console.log(res.responseJSON);
        // 因为未登录，没有 Authorization 的 token 值，因此未登录访问接口时，没有提供 Authorization 值，虽然接口有响应（调用了complete函数），但对于有权限的接口会访问失败
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1、清空本地存储中的 token
            localStorage.removeItem('token');
            // 2、强制返回到登录页面
            location.href = '/login.html';
        }
    }
})