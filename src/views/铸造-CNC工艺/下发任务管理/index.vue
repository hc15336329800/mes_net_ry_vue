<template>
  <div class="container">
    <!-- 上方工具栏 -->
    <el-form :inline="true" :model="filter" class="filter-form">
      <el-form-item label="选择日期">
        <el-date-picker v-model="selectedDate" type="date" placeholder="请选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" clearable />
      </el-form-item>

      <el-form-item label="工位">
        <el-select v-model="filter.workstation" placeholder="请选择下发工位">
          <el-option label="1#工位" value="CNC-01"></el-option>
          <el-option label="2#工位" value="CNC-02"></el-option>
          <el-option label="3#工位" value="CNC-03"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="searchData">查询</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="openAddDialog">工艺下发</el-button>
      </el-form-item>
    </el-form>

    <!-- 任务列表 -->
    <div class="table-container">
      <el-table :data="paginatedTasks" border stripe style="width: 100%;" :header-cell-style="tableHeaderStyle">
        <el-table-column prop="taskId" label="任务编号" min-width="150" fixed="left" />
        <el-table-column prop="taskName" label="任务名称" min-width="200" fixed="left" />
        <el-table-column prop="workstation" label="目标工位" min-width="150">
          <template slot-scope="{ row }">
            <el-tag v-for="(ws, index) in row.workstation" :key="index">{{ ws }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="任务状态" width="120">
          <template slot-scope="{ row }">
            <el-tag :type="getStatusTag(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="fileName" label="工艺参数文件" width="200">
          <template slot-scope="{ row }">
            <el-link type="primary" @click="downloadFile(row.fileName)">{{ row.fileName }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="dispatchTime" label="下发时间" width="180" />
        <el-table-column prop="remarks" label="备注" min-width="200" :show-overflow-tooltip="true" />

        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="{ row }">
            <el-button type="text" @click="viewTask(row)">查看</el-button>
            <el-button type="text" @click="editTask(row)">编辑</el-button>
            <el-button type="text" @click="deleteTask(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background layout="total, prev, pager, next" :total="tasks.length" :page-size="pageSize" :current-page.sync="currentPage" @current-change="handlePageChange" />
    </div>

    <!-- 新增任务弹窗 -->
    <el-dialog title="新增工艺任务" :visible.sync="addDialogVisible" width="600px"     custom-class="centered-dialog">
      <el-form :model="form" ref="taskForm" label-width="100px">
        <el-form-item label="任务名称" required>
          <el-input v-model="form.taskName" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="目标工位" required>
          <treeselect v-model="form.workstations" :options="workstationOptions" :multiple="true" placeholder="请选择工位" />
        </el-form-item>
        <el-form-item label="工艺参数文件" required>
          <el-upload class="upload-demo" action="#" :before-upload="handleFileUpload" :file-list="form.fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <span slot="tip" class="el-upload__tip">支持 Excel / CSV</span>
          </el-upload>
        </el-form-item>
        <el-form-item label="任务备注">
          <el-input v-model="form.remarks" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitTask">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import taskData from "./tableData.js"; // 任务数据

export default {
  components: {
    Treeselect
  },
  data() {
    return {
      selectedDate: null, // 选择日期
      filter: {
        workstation: "" // 任务筛选
      },
      tasks: taskData, // 任务列表数据
      currentPage: 1,
      pageSize: 10,
      addDialogVisible: false, // 新增任务弹窗
      form: {
        taskName: "",
        workstations: [],
        fileList: [],
        remarks: ""
      },
      workstationOptions: [
        { id: "CNC-01", label: "1#工位" },
        { id: "CNC-02", label: "2#工位" },
        { id: "CNC-03", label: "3#工位" }
      ]
    };
  },
  computed: {
    paginatedTasks() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      return this.tasks.slice(startIndex, startIndex + this.pageSize);
    }
  },
  methods: {
    getStatusTag(status) {
      return status === "已完成" ? "success" : status === "进行中" ? "warning" : "info";
    },
    handlePageChange(page) {
      this.currentPage = page;
    },
    searchData() {
      console.log("查询任务，工位：", this.filter.workstation);
    },
    openAddDialog() {
      this.addDialogVisible = true;
    },
    handleFileUpload(file) {
      this.form.fileList = [file];
      return false; // 阻止默认上传行为
    },
    submitTask() {
      if (!this.form.taskName || this.form.workstations.length === 0 || this.form.fileList.length === 0) {
        this.$message.warning("请填写完整信息");
        return;
      }

      const newTask = {
        taskId: `T${Date.now()}`,
        taskName: this.form.taskName,
        workstation: this.form.workstations,
        status: "未开始",
        fileName: this.form.fileList[0].name,
        dispatchTime: new Date().toLocaleString(),
        remarks: this.form.remarks
      };

      this.tasks.unshift(newTask);
      this.$message.success("任务下发成功！");
      this.addDialogVisible = false;
      this.resetForm();
    },
    resetForm() {
      this.form = {
        taskName: "",
        workstations: [],
        fileList: [],
        remarks: ""
      };
    },
    downloadFile(fileName) {
      this.$message.info(`下载 ${fileName}`);
    },
    viewTask(task) {
      this.$message.info(`查看任务：${task.taskName}`);
    },
    editTask(task) {
      this.$message.info(`编辑任务：${task.taskName}`);
    },
    deleteTask(task) {
      this.tasks = this.tasks.filter(t => t.taskId !== task.taskId);
      this.$message.success("任务已删除！");
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
