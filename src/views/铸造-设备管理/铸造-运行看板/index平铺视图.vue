<!--index666.vue-->
<template>
  <div class="container">
    <el-row :gutter="20" style="height: 100%;">

      <!-- 左侧 -->

      <!-- 右侧 -->
      <el-col :span="24" style="background-color: #FFFFFF; height: 100%;   padding:10px;">

        <!--工具栏-->
        <div class="flexHorizontal"   style="padding: 5px ; border-bottom: 1px solid #DCDFE6;">



          <!-- 操作按钮 -->
          <div class="flexHorizontal"  style="padding: 15px ; ">

            <span>选择厂区</span>
            <el-select v-model="rname" placeholder="请选择活动区域">
              <el-option label="厂区一" value="shanghai"></el-option>
              <el-option label="厂区二" value="beijing"></el-option>
            </el-select>

            <el-button type="primary" @click="">
              <i class="el-icon-search  el-icon--left"></i> 平铺
            </el-button>

            <el-button type="primary" @click="">
              <i class="el-icon-download  el-icon--left"></i> 列表
            </el-button>
          </div>


        </div>
        <!--内容-->
        <div style="height: 100%; width: 100%" class="flexHorizontalSco">
          <!-- 动态遍历逆变器数据 -->
          <div v-for="(item, index) in inverterData" :key="index" class="flexVertical  "
               style="width: 31%; height: 300px"
          >
            <!-- 一行：站点名称 + 状态 -->
            <div class="flexHorizontal"
                 style="background-color: #e5f6f4; justify-content: space-between; height: 36px; padding: 3px 10px; width: 100%;"
            >
              <span>{{ item.location }}</span>
              <span :style="{ color: item.status === '在线' ? 'green' : 'red' }">{{ item.status }}</span>
            </div>

            <!-- 两行结构 -->
            <div class="flexHorizontal" style="height: 80% ;width: 100%;">
              <!-- 内一列：图片 -->
              <div style="flex: 3; height: 100%">
                <div class="flexVertical" style="height: 100%">
                  <div style="text-align: center; width: 100px; height: 100%">
                    <el-image style="width: 100px; height: 100%" class="image-icon"
                              :src="require('@/assets/images/逆变器.png')" fit="contain"
                    />
                  </div>
                  <span style="text-align: center; width: 100px;">逆变器</span>
                </div>
              </div>

              <!-- 内二列：数据信息 -->
              <div style="flex: 4; height: 100%">
                <div class="flexVertical_betweenn" style="height: 100% ;padding: 15px;">
                  <p v-for="(dataItem, key) in item.data" :key="key" style="padding: 0; margin: 0;">
                    <span>{{ key }} <span>{{ dataItem.value }}</span> {{ dataItem.unit }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>



      </el-col>

    </el-row>
  </div>
</template>


<script>

 import { mapState } from 'vuex'

// 引入生成的数据模块

export default {
  name: 'ElectricData',
  components: {
   },

  data() {
    return {
/////////////////////////////////工具栏//////////////////////////////////////
      rname:"",

      /////////////////////////////////逆变器//////////////////////////////////////

      inverterData: [
        {
          location: 'A楼5F',
          status: '离线',
          data: {
            '当前水压': { value: 0.67, unit: 'MPa' },
            '当前水流速': { value: 121, unit: 'm/s' },
            '当前水流量 ': { value: 4, unit: 'm³/h' },
            '总用水电量': { value: 328803.67, unit: 'm³/h' }
          }
        },
        {
          location: 'B楼3F',
          status: '在线',
          data: {
            '当前水压': { value: 0.67, unit: 'MPa' },
            '当前水流速': { value: 121, unit: 'm/s' },
            '当前水流量 ': { value: 4, unit: 'm³/h' },
            '总用水电量': { value: 328803.67, unit: 'm³/h' }
          }
        },
        {
          location: 'C楼2F',
          status: '在线',
          data: {
            '当前水压': { value: 0.67, unit: 'MPa' },
            '当前水流速': { value: 121, unit: 'm/s' },
            '当前水流量 ': { value: 4, unit: 'm³/h' },
            '总用水电量': { value: 328803.67, unit: 'm³/h' }
          }
        },
        {
          location: 'D楼1F',
          status: '离线',
          data: {
            '当前水压': { value: 0.67, unit: 'MPa' },
            '当前水流速': { value: 121, unit: 'm/s' },
            '当前水流量 ': { value: 4, unit: 'm³/h' },
            '总用水电量': { value: 328803.67, unit: 'm³/h' }
          }
        },
        {
          location: 'E楼6F',
          status: '在线',
          data: {
            '当前水压': { value: 0.67, unit: 'MPa' },
            '当前水流速': { value: 121, unit: 'm/s' },
            '当前水流量 ': { value: 4, unit: 'm³/h' },
            '总用水电量': { value: 328803.67, unit: 'm³/h' }
          }
        }
      ],

      ////////////////////////////////表格数据///////////////////////////////////////


      ////////////////////////////////时间选择///////////////////////////////////////



      ////////////////////////////////tab标签///////////////////////////////////////


      ////////////////////////////////树形菜单///////////////////////////////////////

      // 绑定的下拉框值
      selectedValue: '66',


      // 树形数据
      treeData: [
        {
          id: 1,
          label: '园区东光伏电站',
        },
        {
          id: 6,
          label: '园区西光伏电站',
        },
        {
          id: 10,
          label: '园区南光伏电站',
        }

      ],

      // 属性配置，自定义指定树形结构的数据字段
      defaultProps: {
        children: 'children', // 子节点字段
        label: 'label' // 显示的文本字段
      },



    }
  },

  computed: {
    ...mapState({
      theme: (state) => state.settings.theme // // 从 Vuex 获取主题
    }),
    tableHeaderStyle() {
      return {
        backgroundColor: this.theme || '#fa0623', // 表头背景颜色
        color: this.theme.cardHeaderText || '#ffffff', // 表头文字颜色
        fontWeight: 'bold' ,// 加粗文字
        // textAlign: "center", // 表头水平居中
        // verticalAlign: "middle", // 表头垂直居中
      }
    },


  },


  methods: {


    // 日期格式化方法
    formatMonth(row, column, cellValue) {
      if (!cellValue) return ''
      const date = new Date(cellValue)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0') // 月份补零
      return `${year}年${month}月`
    },

  },

  created() {

  },

  mounted() {
    // console.log('组件已挂载');

  }

}
</script>

<style scoped>

/* ##################################  通用布局  ##################################*/

/* 主容器*/
.container {
  display: flex;
  flex-direction: column;
  margin: 10px;
  height: calc(100vh - 130px);
  gap: 5px;
}

/* 水平盒子容器*/
.flexVertical {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 20px;
  gap: 10px;
  font-size: 15px;
}

/* 垂直盒子容器*/
.flexHorizontal {
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
}


/* 垂直*/
.flexBox {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

/* 文字不换行*/
.spanInline {
  display: inline-block;
  white-space: nowrap;
}

/* ##################################  卡片  ##################################*/


/* 使用 CSS 变量动态设置背景颜色 */
>>> .el-card {
  height: 100%; /* 自适应 */
  width: 100%;
  //overflow: hidden;
  border: 0px solid #e6ebf5;
  border-radius: 0px; /* 圆角 */
}

>>> .el-card__header {
  background-color: var(--card-header-bg, theme); /* 默认颜色为淡蓝色 */
  color: #ffffff; /* 白色字体 */
  padding: 7px; /* 内边距 */
  //border-radius: 4px 4px 0 0;
  padding-left: 20px;
  font-size: 16px;
  line-height: 32px;

  font-weight: 600;
  letter-spacing: 2px;
  min-height: 35px;
}

.aa >>> .el-card__body {
  padding: 0px ;
  //padding: 5px 0px 0px 15px;
  /* height: 55%; */
  /* height: 100%;  这个必须减去头才是正确的高度 */
  height: calc(100% - 40px);

  display: flex;
  flex-direction: column;
  justify-content: space-around;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1px;
}






/*  ================右侧====================== */

/* 滚动盒子,容器*/
.flexHorizontalSco {

  justify-content: flex-start;

  overflow-y: auto;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  -ms-flex-line-pack: center;
  align-content: flex-start;
  -webkit-box-pack: start;
  -ms-flex-pack: start;

  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  flex-wrap: wrap;
}

</style>
