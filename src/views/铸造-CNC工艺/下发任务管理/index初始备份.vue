<template>
  <div class="container">


    <!-- 上方工具栏：  全部在一行 -->
    <el-form :inline="true" :model="filter" class="filter-form" style="white-space: nowrap;">
      <!-- 选择日期  -->
      <el-form-item label="选择日期">
        <el-date-picker
          v-model="selectedDate"
          type="date"
          placeholder="请选择日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :clearable="true"
          style="width: 100%;"
        />
      </el-form-item>



      <!--    -->
      <el-form-item label="工位">
        <el-select v-model="filter.taskStatus" placeholder="请选择下发工位">
          <el-option label="1#工位" value="pending"></el-option>
          <el-option label="2#工位" value="in_progress"></el-option>
          <el-option label="3#工位" value="completed"></el-option>
        </el-select>
      </el-form-item>


      <!-- 查询按钮 -->
      <el-form-item>
        <el-button type="primary" @click="searchData">查询</el-button>
      </el-form-item>

      <!-- 新增任务按钮 -->
      <el-form-item>
        <el-button type="primary" @click="openAddDialog">新增任务</el-button>
      </el-form-item>


    </el-form>


    <!-- 中间表格：新增/调整列，参考你提供的截图 -->
    <div style="overflow: auto; max-height: 700px; height: 100%;"   >

      <el-table :data="paginatedTasks" border stripe style="width: 100%"    :header-cell-style="tableHeaderStyle">
        <!-- 表头列按照要求更新 -->
        <el-table-column prop="factoryName" label="厂房名称" min-width="120"  fixed="left" />
        <el-table-column prop="taskNo" label="任务单号" min-width="120"  fixed="left" />
        <el-table-column prop="leader" label="负责人" min-width="100" />
        <el-table-column prop="executor" label="执行人" min-width="100" />
        <el-table-column prop="taskType" label="任务类型" min-width="100" />
        <el-table-column prop="taskStatus" label="任务状态" min-width="100" />
        <el-table-column prop="deviation" label="签到偏差距离(m)" min-width="150" />
        <el-table-column prop="planStart" label="计划开始时间" min-width="160" />
        <el-table-column prop="planComplete" label="计划完成时间" min-width="160" />
        <el-table-column prop="actualComplete" label="实际完成时间" min-width="160" />
        <el-table-column prop="creator" label="创建人" min-width="100" />
        <el-table-column prop="createTime" label="创建时间" min-width="160" />
        <el-table-column prop="remark" label="备注" min-width="160" />

        <!-- 操作列（查看、编辑、删除）示例 -->
        <el-table-column label="操作" align="center" width="180">
          <template #default="scope">
            <el-button type="text" size="small" @click="viewTaskDetail(scope.row)">查看</el-button>
            <el-button type="text" size="small" @click="editTask(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="deleteTask(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>

    <!-- 下方分页 -->
    <div style="padding:15px; display:flex; justify-content:flex-end;">
      <el-pagination
        background
        layout="total, prev, pager, next"
        :total="tasks.length"
        :page-size="pageSize"
        :current-page.sync="currentPage"
        @current-change="handlePageChange">
      </el-pagination>
    </div>

    <!-- 查看任务详情对话框（只读） -->
    <el-dialog title="任务详情" :visible.sync="detailDialogVisible" width="600px">
      <el-form :model="currentTask" label-width="120px">
        <el-form-item label="任务编号">
          <el-input v-model="currentTask.taskId" disabled></el-input>
        </el-form-item>
        <el-form-item label="任务名称">
          <el-input v-model="currentTask.taskName" disabled></el-input>
        </el-form-item>
        <el-form-item label="任务类型">
          <el-input v-model="currentTask.taskType" disabled></el-input>
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input v-model="currentTask.deviceName" disabled></el-input>
        </el-form-item>
        <el-form-item label="巡检人">
          <el-input v-model="currentTask.inspector" disabled></el-input>
        </el-form-item>
        <el-form-item label="任务状态">
          <el-select v-model="currentTask.status" disabled>
            <el-option label="待处理" value="pending"></el-option>
            <el-option label="处理中" value="in_progress"></el-option>
            <el-option label="已完成" value="completed"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计划开始时间">
          <el-input v-model="currentTask.planStart" disabled></el-input>
        </el-form-item>
        <el-form-item label="计划结束时间">
          <el-input v-model="currentTask.planEnd" disabled></el-input>
        </el-form-item>
        <el-form-item label="实际开始时间">
          <el-input v-model="currentTask.actualStart" disabled></el-input>
        </el-form-item>
        <el-form-item label="实际结束时间">
          <el-input v-model="currentTask.actualEnd" disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>


     <!-- 新增任务对话框：任务发布 -->
    <el-dialog  class="dialogadd" title="任务发布" :visible.sync="addDialogVisible"     custom-class="centered-dialog">

      <el-form :model="addTaskForm" ref="addTaskForm"   :inline="true"   style="  padding: 20px 80px   0px   80px;">

        666

      </el-form>

      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer" style="display: flex; justify-content: flex-end; gap: 10px;">
    <el-button @click="addDialogVisible = false">取消</el-button>
    <el-button type="primary" @click="submitTask">确定</el-button>
  </span>
    </el-dialog>



  </div>
</template>

<script>

import tasks  from './tableData.js';
 import { mapState } from 'vuex'

export default {
  components: {
   },
  data() {
    return {

      ////////////////////////////////时间选择///////////////////////////////////////
      selectedDate: null, // 时间范围

      ////////////////////////////////工具栏///////////////////////////////////////

      filter: {
        taskId: "",
        taskName: "",
        taskStatus: "",
      },
      factoryList: ['厂房A', '厂房B', '厂房C'],

      //////////////////////////////// 表格相关///////////////////////////////////////


      tasks: tasks,
      currentPage: 1,
      pageSize: 11,

      detailDialogVisible: false, //任务详情对话框
      currentTask: {},
       editTask: {},
      editDialogMode: "add" ,// "add" 或 "edit"

      //////////////////////////////// 新增/编辑任务对话框相关///////////////////////////////////////

      addDialogVisible: false, // 控制对话框显示/隐藏
      addTaskForm: {
        station: "",
        taskType: "",
        startTime: "",
        endTime: "",
        leader: "",
        executor: "",
        ticket: "",
        content: ""
      },


    };
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
    // 分页数据
    paginatedTasks() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      return this.tasks.slice(startIndex, startIndex + this.pageSize);
    },

  },
  methods: {

    // 打开对话框
    openAddDialog() {
      this.addDialogVisible = true;
      // 如果需要初始化表单数据，可在此处执行
      // Object.assign(this.addTaskForm, { station: "", ... });
    },
    // 打开对话框,提交任务
    submitTask() {
      // 此处可对 addTaskForm 数据进行校验或发起后端请求
      console.log("提交的表单数据：", this.addTaskForm);
      this.$message.success("提交成功！");
      this.addDialogVisible = false;
    },

    searchData() {
      console.log("查询条件：", this.filter);
      // TODO: 根据 filter 发起请求或过滤 tasks 数据
    },
    handlePageChange(page) {
      this.currentPage = page;
    },

    viewTaskDetail(task) {
      this.currentTask = { ...task };
      this.detailDialogVisible = true;
    },


    deleteTask(task) {
      const index = this.tasks.findIndex(t => t.taskId === task.taskId);
      if (index !== -1) {
        this.tasks.splice(index, 1);
        this.$message.success("任务删除成功！");
      }
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

  background-color: #FFFFFF;
  padding: 20px  ;
}
.filter-form {
  margin-bottom: 15px;
}

/* 、、、、、、、、、、、、、、、、、、弹窗样式&&&表单样式 、、、、、、、、、、、、、、、、、、 */


/* 弹窗居中 & 圆角    */
>>>.centered-dialog {
  margin: 0;
  top: 40% !important;
  left: 50% !important;
  transform: translate(-50%, -50%);
  border-radius: 20px;
  padding: 20px;
 width: 50%;
}

/* 、、、、、、、、、、、、、、、、、、弹窗样式&&&表单样式 、、、、、、、、、、、、、、、、、、 */



</style>
