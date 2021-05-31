$(function () {
    var layer = layui.layer;
    var form = layui.form;
    // 定义一个对象用于存放 请求时携带的参数
    var p = {
        pagenum: 1,  // 页码值，默认是第一页
        pagesize: 2,  // 默认每页显示2条数据
        cate_id: '',  // 文章分类的id，默认为空
        state: ''  // 文章的状态（已发布或者草稿），默认为空
    }

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }
    // 初始化文章列表
    initTable();

    // 获取文章的列表数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: p,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                var htmlStr = template("tpl_table", res);
                $("tbody").html(htmlStr);
                // 调用渲染分页的方法
                renderPage(res);
            }
        })
    }

    // 列表数据中的编辑功能
    $("tbody").on("click", ".btn_editor", function () {
        var id = $(this).attr("data-id");
        // 根据 id 获取文章详情
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章详情失败");
                }
                layer.msg("获取文章详情成功");
                var data_edi = res.data;
                console.log(data_edi);
                data_edi = JSON.stringify(data_edi);
                localStorage.setItem('data', data_edi);
                // JSON.parse
                location.href = '/article/article_pub.html';
            }
        })
    })

    // 列表数据中的删除功能
    $("tbody").on("click", ".btn_delect", function () {
        // 删除之前先获取一下屏幕上还有多少删除按钮
        var num = $(".btn_delect").length;
        console.log(num);
        // 获取点击删除按钮时对应数据的id
        var id = $(this).attr("data-id");
        console.log(id);
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg("删除失败");
                    }
                    layer.msg("删除成功");
                    // 当删除数据之后，需要判断当前这一页中是否还有剩余数据，如果没有剩余数据就让页码值减一，如果是第一页不需要减，之后在从新加载文章列表
                    if (num === 1) {
                        p.pagenum = p.pagenum == 1 ? 1 : p.pagenum - 1;
                    }
                    // 初始化文章列表
                    initTable();
                }
            })
            layer.close(index);
        });

    })

    // 筛选区域
    // 获取文章分类列表
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg(res.message);
            var htmlStr = template("sel_table", res);
            $("[name=cate_id]").html(htmlStr);
            form.render();
        }
    })

    // 创建筛选区域表单提交事件，重新获取文章数据列表
    $("#form_search").on("submit", function (e) {
        e.preventDefault();
        // 根据下拉选框内容更新对象p中的数据
        p.cate_id = $("[name=cate_id]").val();
        p.state = $("[name=state]").val();
        // 根据最新的筛选条件重新获取文章列表
        initTable();
    })

    // 分页区域
    // 定义渲染分页的方法
    function renderPage(res) {
        layui.use('laypage', function () {
            var laypage = layui.laypage;

            //执行一个laypage实例
            laypage.render({
                elem: 'pageBox', // 分页容器的 ID，不用加 # 号
                count: res.total,// 数据总数，从服务端得到
                limit: p.pagesize,  // 每页显示几条数据
                limits: [2, 3, 5, 10],
                curr: p.pagenum,  // 默认让那一页的页码被选中
                layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
                // 触发 jump 回调函数的方式有两种：
                // 1、点击页码时会触发jump回调
                // 2、只要调用 laypage.render（）方法就会触发jump回调（此种触发方式可能会发生死循环）
                // 注意：可以通过第二个参数first的值来判断是通过哪种方式调用的jump回调，如果first值为true则是方式2触发的；
                jump: function (obj, first) {
                    //obj包含了当前分页的所有参数，比如：
                    console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                    console.log(obj.limit); //得到每页显示的条数
                    p.pagenum = obj.curr;
                    p.pagesize = obj.limit;

                    //首次不执行
                    if (!first) {
                        //do something
                        // 初始化文章列表
                        initTable();
                    }
                }
            });
        });
    }


})