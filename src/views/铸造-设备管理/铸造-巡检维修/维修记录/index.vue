<!--维修记录页面-->
<template>
  <div class="container">
    <div style="background-color: #FFFFFF; height: 100%; padding: 15px; padding-top: 22px">
      <!-- 过滤条件 -->
      <el-form :inline="true" :model="queryParams" class="filter-form">

        <el-form-item label="维修名称">
          <el-input v-model="queryParams.defectName" placeholder="请输入维修名称"></el-input>
        </el-form-item>
        <el-form-item label="任务编号">
          <el-input v-model="queryParams.taskId" placeholder="请输入任务编号"></el-input>
        </el-form-item>

        <!-- 执行结果多选不行） -->
        <!--        <el-form-item label="维修状态">-->
        <!--          <el-checkbox-group v-model="queryParams.defectStatus">-->
        <!--            <el-checkbox label="已处理" border style="margin-right: 3px;"></el-checkbox>-->
        <!--            <el-checkbox label="未处理" border style="margin-right: 3px;"></el-checkbox>-->
        <!--          </el-checkbox-group>-->
        <!--        </el-form-item>-->


        <el-form-item label="状态">
          <div style="padding-left: 1px ; padding-right: 20px;">
            <el-radio-group v-model="queryParams.defectStatus"  >
              <el-radio label="待办" border  style="margin-right: 5px">待办</el-radio>
              <el-radio label="在办" border style="margin-right: 5px">在办</el-radio>
              <el-radio label="办毕" border style="margin-right: 5px">办毕</el-radio>
            </el-radio-group>
          </div>

        </el-form-item>



        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">
            查询
          </el-button>

          <el-button type="primary" icon="el-icon-refresh" @click="resetQuery">
            重置
          </el-button>
        </el-form-item>

      </el-form>

      <el-table
        :data="tableData"
        border
        stripe
        style="width: 100%"
        :header-cell-style="tableHeaderStyle"
      >
        <el-table-column prop="defectName" label="维修名称"  fixed="left" width="150"  show-overflow-tooltip></el-table-column>
        <el-table-column prop="taskId" label="任务单号" fixed="left" width="150"  show-overflow-tooltip></el-table-column>
        <!--        <el-table-column prop="devicePath" label="设备路径" width="150"  show-overflow-tooltip></el-table-column>-->
        <el-table-column prop="deviceName" label="设备名称" width="150"  show-overflow-tooltip></el-table-column>
        <el-table-column prop="defectDesc" label="维修描述"  width="150"  show-overflow-tooltip></el-table-column>
        <el-table-column prop="defectStatus" label="维修状态" width="150"  show-overflow-tooltip>
          <template #default="scope">
              <span :style="{ color: scope.row.defectStatus === '未处理' ? 'red' : 'green' }">
                {{ scope.row.defectStatus }}
              </span>
          </template>
        </el-table-column>
        <el-table-column prop="defectCategory" label="维修类别" width="150"  show-overflow-tooltip  v-if="false"></el-table-column>
        <el-table-column prop="severityLevel" label="严重等级" width="150"  show-overflow-tooltip></el-table-column>
<!--        <el-table-column prop="suggestion" label="处理建议" width="150"  show-overflow-tooltip></el-table-column>-->
        <!--        <el-table-column prop="discoveryTime" label="发现时间" width="150"  show-overflow-tooltip></el-table-column>-->
        <el-table-column prop="fixTime" label="消缺时间"  show-overflow-tooltip></el-table-column>
        <el-table-column prop="fixPerson" label="消缺人员" width="150"  show-overflow-tooltip></el-table-column>
        <!--        <el-table-column prop="fixDeadline" label="消缺期限" width="150"  show-overflow-tooltip></el-table-column>-->
        <el-table-column prop="discoveryTime" label="发现时间"   show-overflow-tooltip></el-table-column>


        <!-- 【修改点 2】新增操作列：包含“详情”和“处理”按钮 -->
        <el-table-column label="操作" align="center" width="180">


          <template #default="scope">
            <el-button-group>

              <el-button  type="primary"   size="small"    @click="showDefectDetail(scope.row)"   >
                维修详情
              </el-button>

              <el-button type="danger" size="small" @click="handleDelete(scope.row)">
                删除
              </el-button>

            </el-button-group>



          </template>
        </el-table-column>
      </el-table>

    </div>

    <!-- 分页组件 -->
    <div style="padding: 0px 15px 5px 0px;; display: flex; flex-direction: row; justify-content: flex-end;     background-color: white;">


      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="handlePageChange"
      />


    </div>

    <!-- 【弹窗】 维修详情 -->
    <el-dialog
      title="维修详情"
      :visible.sync="dialogVisible"
      width="50%"
      custom-class="centered-dialog"
    >
      <!-- 这里可以展示维修的详细信息。示例仅保留部分字段 -->
      <el-descriptions
        title=""
        :column="2"
        border
        class="description-section"
      >
        <el-descriptions-item label="维修名称">{{ defectDetail.defectName }}</el-descriptions-item>
        <el-descriptions-item label="任务单号">{{ defectDetail.taskId }}</el-descriptions-item>
<!--        <el-descriptions-item label="设备路径">{{ defectDetail.devicePath }}</el-descriptions-item>-->
        <el-descriptions-item label="设备名称">{{ defectDetail.deviceName }}</el-descriptions-item>
<!--        <el-descriptions-item label="维修状态">{{ defectDetail.defectStatus }}</el-descriptions-item>-->
<!--        <el-descriptions-item label="维修类别">{{ defectDetail.defectCategory }}</el-descriptions-item>-->
<!--        <el-descriptions-item label="严重等级">{{ defectDetail.severityLevel }}</el-descriptions-item>-->
<!--        <el-descriptions-item label="消缺期限">{{ defectDetail.fixDeadline }}</el-descriptions-item>-->
        <el-descriptions-item label="消缺人员">{{ defectDetail.fixPerson }}</el-descriptions-item>

        <el-descriptions-item label="发现时间">{{ defectDetail.discoveryTime }}</el-descriptions-item>
        <el-descriptions-item label="消缺时间">{{ defectDetail.fixTime }}</el-descriptions-item>
        <el-descriptions-item label="维修描述">{{ defectDetail.defectDesc }}</el-descriptions-item>
        <el-descriptions-item label="维修内容">{{ defectDetail.remark }}</el-descriptions-item>

        <!--        <el-descriptions-item label="处理建议">{{ defectDetail.suggestion }}</el-descriptions-item>-->

        <!-- ✅ 多图渲染 -->
        <el-descriptions-item label="维修图片">
          <template v-if="defectDetail.imageUrl">
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <el-image
                v-for="(url, index) in defectImageList"
                :key="index"
                :src="url"
                :preview-src-list="defectImageList"
                :initial-index="index"
                style="width: 120px; height: 120px;"
                fit="cover"
              />
            </div>
          </template>
          <span v-else>无图片</span>
        </el-descriptions-item>


      </el-descriptions>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
import { mapState } from 'vuex'

import { list, info, del, add, update } from "@/api/zm_device/defectRecord";  //记录接口


export default {
  data() {
    return {

      defectImageList: [], //多图

      //  ==================消缺弹窗相关=======================

      fixTaskDialogVisible: false, // 控制“发布消缺任务”弹窗显示/隐藏
      fixTaskForm: {
        id: undefined,
        taskType: '维修', // 固定为巡检
        relatedTaskId: '', // 新增：关联的任务ID（从当前行获取）
        taskName: '消缺任务-' + new Date().toLocaleDateString(), // 自动生成任务名称
        leader: '',
        executor: '',
        planStartTime: '',
        planEndTime: '',
        remark: ''
      },
      userOptions: [], // 用户选项列表（与任务管理页面一致）

      // 如果需要从维修记录中获取一些信息，也可以保存在这里
      currentDefect: {},

      //  ==================表格=======================

      userList: [],
      tableData: [],
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 11,
        defectName: undefined,  // 名称
        taskId: undefined,  // 单号
        //  defectStatus: '已处理' // 单选默认值
        defectStatus: undefined, // 单选默认值
        defectCategory:'维修'  //固定值
      },

      //  ==================弹窗=======================


      // 弹窗和维修详情数据
      dialogVisible: false,
      defectDetail: {} // 【修改点 4】改为 defectDetail 以存储维修数据
    };
  },
  computed: {
    ...mapState({
      theme: (state) => state.settings.theme // 从 Vuex 获取主题
    }),
    tableHeaderStyle() {
      return {
        backgroundColor: this.theme || '#fa0623',
        color: this.theme.cardHeaderText || '#ffffff',
        fontWeight: 'bold'
      }
    },

  },
  created() {
    this.getList();
  },
  methods: {

//删除
    handleDelete(row) {
      this.$confirm(`确认删除维修记录 “${row.defectName}”？`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await del(row.id);
          if (res.code === 200) {
            this.$message.success('删除成功');
            this.getList(); // 刷新列表
          } else {
            this.$message.error(res.msg || '删除失败');
          }
        } catch (error) {
          this.$message.error('删除接口异常');
          console.error('删除失败:', error);
        }
      }).catch(() => {
        // 用户点击“取消”无需处理
      });
    },


    //  ==================查询=======================
    //    查询 列表
    getList() {
      this.loading = true;
      list(this.queryParams).then(res => {
        this.tableData = res.rows || [];
        this.total = res.total || 0;
        this.loading = false;
      }).catch(() => {
        this.tableData = [];
        this.total = 0;
        this.loading = false;
      });
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1; // 重置为第一页
      this.getList();
    },

    /** f分页事件 */
    handlePageChange(page) {
      this.queryParams.pageNum = page;
      this.getList();
    },

    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.pageNum=1;
      this.queryParams.pageSize=11;

      this.queryParams.defectName=undefined;
      this.queryParams.taskId=undefined;
      this.queryParams.defectStatus=undefined;

      this.getList();
    },

    //  ==================消缺弹窗处理=======================


    //  =========================================

    // 拼接获取图片地址
    getImageUrl(fileName) {

      // 如果是完整 URL，直接返回
      if (fileName.startsWith('http')) {
        return fileName;
      }
      // 拼装实际地址：例如：'~@/assets/设备维修图/fengji.jpg'
      return require(`@/assets/设备缺陷图/${fileName}`);
    },



    /***  ----------  **/

    // 【修改点 6】显示维修详情弹窗
    showDefectDetail(row) {
      this.defectDetail = { ...row };
      this.defectImageList = (row.imageUrl || '')
        .split(',')
        .filter(Boolean) // 过滤空字符串
      this.dialogVisible = true;
    },

    exportData() {
      this.$message.info("导出功能开发中...");
    }


  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  margin: 10px;
  height: calc(100vh - 130px);
}

/* 弹窗样式：上下左右居中 */
>>> .centered-dialog {
  margin: 0;

  top: 40% !important;
  left: 50% !important;
  transform: translate(-50%, -50%);
  border-radius: 20px;
  padding: 20px;
  padding-top: 10px;
}

>>> .description-section .el-descriptions__title {
  color: #01ada8;
  font-size: 15px;
}


/* ======================表格============================ */

/* 局部样式，让所有表头和单元格文字居中 */
>>>.el-table th,
>>>.el-table td {
  text-align: center;
  white-space: nowrap;         /* 禁止换行 */
  overflow: hidden;            /* 超出部分隐藏 */
  text-overflow: ellipsis;     /* 显示省略号 */
}
</style>
