$(function () {
    const form = layui.form;
    // 自定义昵称校验规则
    form.verify({
      nickname: (val) => {
        if (val.length > 6) return "昵称长度必须在 1 ~ 6 个字符之间！";
      },
    });
    const layer = layui.layer;
  // 初始化用户信息
  const initUserInfo = () => {
    $.ajax({
      type: "GET",
      url: "/my/userinfo",
      success: (res) => {
        if (res.status !== 0) return layer.msg("获取用户信息失败！");
        layer.msg("获取用户信息成功！")
        form.val("formUserInfo", res.data)
      },
    });
  };
  
  initUserInfo();

  // 重置功能
  $('#btnReset').click((e)=>{
    e.preventDefault();
    initUserInfo()
  })

  // 更新用户信息
  $('.layui-form').on('submit',function(e){
      e.preventDefault()
      $.ajax({
          type:'POST',
          url:"/my/userinfo",
          data:$(this).serialize(),
          success:(res)=>{
              if(res.status !==0) return layer.msg("更改用户信息失败！")
              layer.msg("更改用户信息成功")
              window.parent.getUserInfo()
          }
      })
  })
  });