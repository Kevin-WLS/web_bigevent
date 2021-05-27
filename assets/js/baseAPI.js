// 注意：每次调用 $.get() / $.post() / $.ajax() 的时候，都会先调用 ajaxPrefilter 这个函数，因此这个js文件必须放在 login.js 之前且在 jquery.js 之后
// 在这个函数中，可以拿到我们给 ajax 提供的配置对象，以参数 options 接收，并且做出适当的修改；
$.ajaxPrefilter(function (options) {
    // 在发起真正的 Ajax 之前，统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
})