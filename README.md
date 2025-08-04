# mes_net_ry_vue


重点：页面跳转写法  ，需要拼接菜单表单的path（父路由+子路由）
- this.$router.push('/proManage/proInfo'); // 跳转到你定义的新页面
-  this.$router.push('/proManage/proInfo/' + row.id)  // 错误

   this.$router.push({
   path: '/proManage/proInfo',
   query: { productId: row.id }   
   })

而在项目中并没有定义形如 /proManage/proInfo/:id 的路由，只存在 /proManage/proInfo。文档也提醒路由跳转应“拼接菜单表的父路由+子路由”即可。因此当在路径中直接追加 ID 时，匹配不到相应路由便产生 404。解决方法之一是仍然跳转到 /proManage/proInfo，再通过查询参数携带产品 ID：