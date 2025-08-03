<!--维修记录页面-->
<template>
  <div class="container">
    <div style="background-color: #FFFFFF; height: 96%; padding: 15px; padding-top: 22px">
      <!-- 过滤条件 -->
      <el-form :inline="true" :model="queryParams" class="filter-form">

        <el-form-item label="摄像头名称">
          <el-input v-model="queryParams.defectName" placeholder="请输入摄像头名称"></el-input>
        </el-form-item>
        <el-form-item label="报警类型">
          <el-select v-model="queryParams.alarmType" placeholder="请选择报警类型" clearable style="width: 200px">
            <el-option label="火灾" value="火灾" />
            <el-option label="安全帽" value="安全帽" />
            <el-option label="抽烟" value="抽烟" />
            <el-option label="离岗" value="离岗" />
          </el-select>
        </el-form-item>


        <el-form-item label="状态">
          <div style="padding-left: 1px ; padding-right: 20px;">
            <el-radio-group v-model="queryParams.defectStatus"  >
              <el-radio label="运行" border  style="  margin-left: 5px;margin-right: 5px">运行</el-radio>

              <el-radio label="停止" border  style="margin-right: 5px">停止</el-radio>
              <el-radio label="故障" border>故障</el-radio>
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

      <!-- 列表 -->
      <el-table :data="tableData" border stripe style="width: 100%  ; height: 94%">


        <!-- 报警类型 -->
        <el-table-column prop="id" label="报警ID" min-width="100" />

        <!-- 报警类型 -->

        <el-table-column prop="alarmType" label="报警类型" min-width="100">
          <template slot-scope="scope">
            <el-tag :type="getTypeTag(scope.row.alarmType)">
              {{ scope.row.alarmType }}
            </el-tag>
          </template>
        </el-table-column>


        <!-- 摄像头名称 -->
        <el-table-column prop="cameraName" label="摄像头名称" min-width="120" />

        <!-- 安装位置 -->
        <el-table-column prop="cameraLocation" label="安装位置" min-width="150" />

        <!-- 安装位置 -->
        <!-- 经纬度展示 -->
        <el-table-column label="经度" min-width="110">
          <template slot-scope="scope">
            {{ scope.row.location ? scope.row.location.lng : '--' }}
          </template>
        </el-table-column>

        <el-table-column label="纬度" min-width="110">
          <template slot-scope="scope">
            {{ scope.row.location ? scope.row.location.lat : '--' }}
          </template>
        </el-table-column>



        <!-- 报警时间 -->
        <el-table-column prop="alarmTime" label="报警时间" min-width="180" />

        <!-- 报警等级 -->
        <el-table-column prop="alarmLevel" label="报警等级" min-width="100" />

        <!-- 报警截图 -->
        <el-table-column label="报警截图" min-width="120">
          <template slot-scope="scope">
            <el-image
              :src="scope.row.image_url"
              :preview-src-list="[scope.row.image_url]"
              style="width: 60px; height: 60px; border-radius: 4px"
              fit="cover"
            />
          </template>
        </el-table-column>

        <!-- 置信度进度条 -->
        <el-table-column label="置信度" min-width="160">
          <template slot-scope="scope">
            <el-progress
              :percentage="scope.row.confidence"
              status="success"
              :text-inside="true"
              stroke-width="18"
            />
          </template>
        </el-table-column>

        <el-table-column prop="deviceStatus" label="运行状态" min-width="100">
          <template slot-scope="scope">
            <el-tag :type="getStatusTag(scope.row.deviceStatus)">
              {{ scope.row.deviceStatus || '未知' }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 备注 -->
        <el-table-column prop="description" label="描述" min-width="150" />
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
        title="维修信息"
        :column="2"
        border
        class="description-section"
      >
        <el-descriptions-item label="维修名称">{{ defectDetail.defectName }}</el-descriptions-item>
        <el-descriptions-item label="任务单号">{{ defectDetail.taskNumber }}</el-descriptions-item>
        <el-descriptions-item label="设备路径">{{ defectDetail.devicePath }}</el-descriptions-item>
        <el-descriptions-item label="设备名称">{{ defectDetail.deviceName }}</el-descriptions-item>
        <el-descriptions-item label="维修描述">{{ defectDetail.defectDesc }}</el-descriptions-item>
        <el-descriptions-item label="维修状态">{{ defectDetail.defectStatus }}</el-descriptions-item>
        <el-descriptions-item label="维修类别">{{ defectDetail.defectCategory }}</el-descriptions-item>
        <el-descriptions-item label="严重等级">{{ defectDetail.severityLevel }}</el-descriptions-item>
        <el-descriptions-item label="消缺期限">{{ defectDetail.fixDeadline }}</el-descriptions-item>

        <el-descriptions-item label="发现时间">{{ defectDetail.discoveryTime }}</el-descriptions-item>
        <el-descriptions-item label="消缺时间">{{ defectDetail.fixTime }}</el-descriptions-item>
        <el-descriptions-item label="消缺人员">{{ defectDetail.fixPerson }}</el-descriptions-item>
        <el-descriptions-item label="处理建议">{{ defectDetail.suggestion }}</el-descriptions-item>

        <!-- 新增维修图片项 -->
        <el-descriptions-item label="维修图片">
          <el-image
            v-if="defectDetail.imageUrl"
            :src="getImageUrl(defectDetail.imageUrl)"
            :preview-src-list="[getImageUrl(defectDetail.imageUrl)]"
            style="width: 120px; height: 120px;"
            fit="cover"
          />
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
import tableData from './data/listAiEventList.js' // 👈 你生成的模拟数据


export default {
  data() {
    return {
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
        pageSize: 8,
        defectName: undefined,  // 名称
        taskId: undefined,  // 单号
        //  defectStatus: '已处理' // 单选默认值
        defectStatus: undefined, // 单选默认值
        defectCategory:'维修' , //固定值
        alarmType: '火灾' //  报警类型
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


    //  ==================列表没化=======================


    getTypeTag(type) {
      switch (type) {
        case '火灾':
          return 'danger';    // 红色
        case '安全帽':
          return 'warning';   // 橙色
        case '抽烟':
          return 'info';      // 蓝色
        case '离岗':
          return 'success';   // 绿色
        default:
          return 'default';   // 灰色（默认）
      }
    },


      getStatusTag(status) {
        switch (status) {
          case '运行':
            return 'success'   // 绿色
          case '故障':
            return 'danger'    // 红色
          case '停止':
            return 'info'      // 灰色
          default:
            return 'default'
        }

    },


    //  ==================查询=======================
    //    查询 列表
    getList() {

      this.tableData = tableData; // ✅ 直接用模拟数据
      this.total = tableData.length; // ✅ 设置总数，分页才会显示

      // this.loading = true;
      // list(this.queryParams).then(res => {
      //   this.tableData = res.rows || [];
      //   this.total = res.total || 0;
      //   this.loading = false;
      // }).catch(() => {
      //   this.tableData = [];
      //   this.total = 0;
      //   this.loading = false;
      // });
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
      // 拼装实际地址：例如：'~@/assets/设备维修图/fengji.jpg'
      return require(`@/assets/设备缺陷图/${fileName}`);
    },



    /***  ----------  **/

    // 【修改点 6】显示维修详情弹窗
    showDefectDetail(row) {
      this.defectDetail = { ...row };
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
