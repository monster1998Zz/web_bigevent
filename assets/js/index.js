$(function () {
  getUserInfo();

  // 先获取layer
  const layer = layui.layer;
  $("#btnOut").click(() => {
    layer.confirm("确认是否退出", { icon: 3, title: "" }, function (index) {
      // 点击退出按钮 清除token
      localStorage.removeItem("token");
      location.href = "/login/html";
    });
  });
});

const layer = layui.layer;
// 获取用户基本信息
function getUserInfo() {
  $.ajax({
    type: "GET",
    url: "/my/userinfo",
    //在请求头里注入token
    // headers: {
    //   Authorization: localStorage.getItem("token"),
    // },
    success: (res) => {
      console.log(res);
      if (res.status !== 0) return layer.msg("数据请求失败！");
      layer.msg("数据请求成功！");
      // 调用 renderAvatar 渲染用户头像
      renderAvatar(res.data);
    },
    // 不论成功还是失败都会调用complete回调函数
    // complete: (res) => {
    //   if (
    //     res.responseJSON.status === 1 &&
    //     res.responseJSON.message === "身份认证失败"
    //   ) {
    //     // 清空token
    //     localStorage.removeItem("token");
    //     location.href = "/login/html";
    //   }
    // },
  });

  // 渲染头像函数
  const renderAvatar = (user) => {
    // 获取用户名字
    let name = user.nickname || user.username;
    // 设置欢迎文本
    $("#welcome").html(`欢迎${name}`);
    // 按需渲染用户头像
    if (user.user_pic !== null) {
      // 渲染图片头像
      $(".layui-nav-img").attr("src", user.user_pic).show();
      $(".text-avatar").hide();
    } else {
      // 渲染文本头像
      $(".layui-nav-img").hide();
      let firstName = name[0].toUpperCase();
      $(".text-avatar").html(firstName).show();
    }
  };
}
