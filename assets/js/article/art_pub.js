$(function () {
  const form = layui.form;
  const layer = layui.layer;

  // 获取文章分类
  const initCate = () => {
    $.ajax({
      type: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("初始化文章分类失败！");
        }
        // 调用模板引擎，渲染分类的下拉菜单
        var htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        // 一定要记得调用 form.render() 方法 否则看不到页面的变化
        form.render();
      },
    });
  };

  initCate();

  // 初始化富文本编辑器
  initEditor();

  // 1. 初始化图片裁剪器
  var $image = $("#image");

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  };

  // 3. 初始化裁剪区域
  $image.cropper(options);

  // 4.点击上传图片
  $("#btnChooseImage").on("click", function () {
    $("#coverFile").click();
  });

  $("#coverFile").change((e) => {
    const files = e.target.files;
    if (files.length === 0) return;
    const newImgUrl = URL.createObjectURL(files[0]);
    $image.cropper("destroy").attr("src", newImgUrl).cropper(options);
  });

  //定义文章发布状态
  let art_state = "已发布";
  // 点击存为草稿，状态改变为草稿
  $("#btnSave2").click(() => {
    art_state = "草稿";
  });

  // 监听form的提交
  $("#form_pub").on("submit",function (e) {
    e.preventDefault();
    const fd = new FormData($(this)[0]);
    fd.append("state", art_state);
    // 4. 将封面裁剪过后的图片，输出为一个文件对象
    $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 5. 将文件对象，存储到 fd 中
        fd.append("cover_img", blob);
        // 6. 发起 ajax 数据请求
        publishArticle(fd)
      });
  });

  //发送新增文章请求
  function publishArticle(fd) {
    $.ajax({
      method: "POST",
      url: "/my/article/add",
      data: fd,
      // 注意：如果向服务器提交的是 FormData 格式的数据，
      // 必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("发布文章失败！");
        }
        layer.msg("发布文章成功！");
        // 发布文章成功后，跳转到文章列表页面
        location.href = "/article/art_list.html";
        window.parent.change()
      },
    });
  }
});
