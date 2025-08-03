<!-- 任务管理页面模板 -->
<template>
  <div class="container">
    <!-- 顶部筛选表单 -->
    <el-form :inline="true" :model="filter" class="filter-form" style="white-space: nowrap;">
      <el-form-item label="任务类型">
        <el-select v-model="filter.taskType" placeholder="请选择任务类型">
          <el-option label="巡检" value="巡检"  style="    margin-right: -0px;" />
          <el-option label="维修" value="维修" style="    margin-right: -0px;" />
          <el-option label="抢修" value="抢修" />
        </el-select>
      </el-form-item>

      <el-form-item label="任务状态">
        <el-checkbox-group v-model="filter.results" @change="handleSingleCheck">
          <el-checkbox label="待办" border />
          <el-checkbox label="在办" border />
          <el-checkbox label="办毕" border />
        </el-checkbox-group>
      </el-form-item>

      <el-form-item><el-button type="primary" @click="searchData">查询任务</el-button></el-form-item>
      <el-form-item><el-button type="primary" @click="openAddDialog">新增任务</el-button></el-form-item>
      <el-form-item><el-button type="primary" @click="ticketDialogVisible = true">新增操作票</el-button></el-form-item>
    </el-form>

    <!-- 中部任务表格 -->
    <div style="overflow: auto; max-height: 700px;">
      <el-table :data="paginatedTasks" border stripe style="width: 100%;" :header-cell-style="tableHeaderStyle"  v-loading="loading" >
        <el-table-column prop="taskName" label="任务名称" min-width="120" fixed="left"  show-overflow-tooltip/>
        <el-table-column prop="id" label="任务编号" min-width="120" fixed="left" show-overflow-tooltip />
        <el-table-column prop="leader" label="负责人" min-width="90"  show-overflow-tooltip/>
        <el-table-column prop="executor" label="执行人" min-width="90" show-overflow-tooltip />
        <el-table-column prop="taskType" label="任务类型" min-width="80" show-overflow-tooltip/>
        <el-table-column prop="taskStatus" label="任务状态" min-width="80" show-overflow-tooltip/>
<!--        <el-table-column prop="checkInDeviation" label="签到偏差距离(m)" min-width="150"show-overflow-tooltip />-->
        <el-table-column prop="planStartTime" label="计划开始时间" min-width="160" show-overflow-tooltip/>
        <el-table-column prop="planEndTime" label="计划完成时间" min-width="160"show-overflow-tooltip />
        <el-table-column prop="actualEndTime" label="实际完成时间" min-width="160"show-overflow-tooltip />
<!--        <el-table-column prop="createBy" label="创建人" min-width="90" show-overflow-tooltip/>-->
        <el-table-column prop="createTime" label="创建时间" min-width="160" show-overflow-tooltip/>
        <el-table-column prop="remark" label="备注" min-width="160"show-overflow-tooltip />

        <!-- 操作列 -->
        <el-table-column label="操作" align="center" width="120">
          <template #default="scope">
<!--            <el-button type="text" size="small" @click="viewTaskDetail(scope.row)">查看</el-button>-->
            <el-button type="text" size="small" @click="editTask(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="deleteTask(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页组件 -->
    <div style="padding:0px; display:flex; justify-content:flex-end;">
      <el-pagination
        background layout="total, prev, pager, next"
        :total="totalCount"
        :page-size="pageSize"
        :current-page.sync="currentPage"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 查看任务详情 -->
    <el-dialog title="任务详情" :visible.sync="detailDialogVisible" width="600px">
      <el-form :model="currentTask" label-width="120px">
        <el-form-item label="任务编号"><el-input v-model="currentTask.id" disabled /></el-form-item>
        <el-form-item label="任务名称"><el-input v-model="currentTask.taskName" disabled /></el-form-item>
        <el-form-item label="任务类型"><el-input v-model="currentTask.taskType" disabled /></el-form-item>
        <el-form-item label="任务状态"><el-input v-model="currentTask.taskStatus" disabled /></el-form-item>
        <el-form-item label="负责人"><el-input v-model="currentTask.leader" disabled /></el-form-item>
        <el-form-item label="执行人"><el-input v-model="currentTask.executor" disabled /></el-form-item>
        <el-form-item label="计划开始时间"><el-input v-model="currentTask.planStartTime" disabled /></el-form-item>
        <el-form-item label="计划完成时间"><el-input v-model="currentTask.planEndTime" disabled /></el-form-item>
        <el-form-item label="实际完成时间"><el-input v-model="currentTask.actualEndTime" disabled /></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

<!--    新增/编辑对话框-->
    <el-dialog
      :title="editMode === 'add' ? '新增任务' : '编辑任务'"
      :visible.sync="editDialogVisible"
      width="800px"
      custom-class="centered-dialog"
    >
      <el-form ref="form"   :rules="rules"  :model="editTaskForm" label-width="100px" style="padding: 20px;">
        <el-form-item label="ID" v-if="false"><el-input v-model="editTaskForm.id" /></el-form-item>
        <el-form-item label="任务名称"  prop="taskName">
          <el-input v-model="editTaskForm.taskName"  placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="任务类型" prop="taskType">
          <el-select v-model="editTaskForm.taskType" placeholder="请选择"   style=" width: 100%">
            <el-option v-for="type in taskTypeList" :key="type" :label="type" :value="type" />
          </el-select>
        </el-form-item>

         <el-form-item
          label="选择设备"
          prop="deviceId"
          v-if="editTaskForm.taskType === '维修' || editTaskForm.taskType === '抢修'"
        >
          <el-input
            v-model="editTaskForm.deviceName"
            placeholder="请选择设备"
            readonly
            @focus="deviceDialogVisible = true"
          >
            <template slot="append">
              <el-button icon="el-icon-search" @click="deviceDialogVisible = true"></el-button>
            </template>
          </el-input>
        </el-form-item>



        <!--添加操作票下拉框 -->
        <el-form-item
          label="操作票"
          prop="ticketId"
          v-if="editTaskForm.taskType === '巡检'"
        >
          <el-select v-model="editTaskForm.ticketId" placeholder="请选择操作票" style=" width: 100%">
            <el-option
              v-for="item in ticketOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>


        <el-row>
          <el-col :span="12">
            <el-form-item label="负责人" prop="leader">
              <el-select v-model="editTaskForm.leader" placeholder="请选择负责人" style=" width: 100%">
                <el-option v-for="user in userOptions" :key="user.userId" :label="user.userName" :value="user.userName" />
              </el-select>

            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="执行人" prop="executor">

              <el-select v-model="editTaskForm.executor" placeholder="请选择执行人"  style=" width: 100%">
                <el-option v-for="user in userOptions" :key="user.userId" :label="user.userName" :value="user.userName" />
              </el-select>

            </el-form-item>
          </el-col>
        </el-row>

        <!-- 时间 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="editTaskForm.planStartTime"
                type="datetime"
                placeholder="请选择开始时间"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="完成时间">
              <el-date-picker
                v-model="editTaskForm.planEndTime"
                type="datetime"
                placeholder="请选择完成时间"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="备注"   prop="remark"><el-input type="textarea" v-model="editTaskForm.remark" /></el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取消</el-button>
    <el-button type="primary" @click="submitTask">确定</el-button>
  </span>
    </el-dialog>


    <!-- 操作票组件 -->
    <ticket-manager v-model="ticketDialogVisible" />
<!--    DevManager 弹窗-->
    <dev-manager
      v-model="deviceDialogVisible"
      @device-selected="handleDeviceSelected"
    />

  </div>
</template>


<script>
//////////////////// 数据引入 ////////////////////
import { getTaskPageList,addTask, updateTask,deleteTask} from '@/api/zm_device/deviceInspectionTask'
import TicketManager from './TicketManager.vue'
import { mapState } from 'vuex'
import { listTicket } from '@/api/zm_device/ticket'
import { listUser } from "@/api/system/user";

import DevManager from './DevManager.vue' //设备选择框


//////////////////// 组件定义 ////////////////////
export default {
  components: { TicketManager ,DevManager},
  data() {
    return {

      deviceDialogVisible: false, // ✅ 控制设备弹窗显隐


      //////////////////// 表单校验 ////////////////////

      rules: {
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' },
          { max: 20, message: '任务名称不能超过20个字符', trigger: 'blur' }
        ],
        taskType: [
          { required: true, message: '请选择任务类型', trigger: 'change' }
        ],
        ticketId: [
          { required: true, message: '请选择操作票', trigger: 'change' }
        ],
        leader: [
          { required: true, message: '请选择负责人', trigger: 'change' }
        ],
        executor: [
          { required: true, message: '请选择执行人', trigger: 'change' }
        ],
        planStartTime: [
          { required: true, message: '请选择计划开始时间', trigger: 'change' }
        ],
        planEndTime: [
          { required: true, message: '请选择计划完成时间', trigger: 'change' }
        ],
        remark: [
          { max: 500, message: '备注不能超过500个字符', trigger: 'blur' }
        ]
      },

      // 遮罩层
      loading: true,
      //////////////////// 查询与分页 ////////////////////
      filter: {
        taskType: '',
        taskName: '',
        results: []
      },
      tasks: [],
      totalCount: 0,
      currentPage: 1,
      pageSize: 12,

      //////////////////// 弹窗控制 ////////////////////
      detailDialogVisible: false,
      ticketDialogVisible: false,
      editDialogVisible: false,
      editMode: 'add',

      //////////////////// 当前任务数据 ////////////////////
      currentTask: {},
      editTaskForm: {
        id: '0',
        taskName: null,
        taskType: null,
        leader: null,
        executor: null,
        planStartTime: null,
        planEndTime: null,
        actualEndTime: null,
        remark: null,
        ticketId: null , // ✅ 显式写入初始值

        deviceId: null,     // ✅ 保存设备ID用于提交接口
        deviceName: null    // ✅ 显示设备名称用于表单展示

      },

      //////////////////// 下拉选项（预设） ////////////////////
      taskTypeList: ['巡检', '维修', '抢修'],
      // 【新增】 用于操作票下拉框选项数据
      ticketOptions: [],

      userOptions: []  //用户列表
    }
  },

  //////////////////// 样式计算属性 ////////////////////
  computed: {
    ...mapState({ theme: state => state.settings.theme }),
    tableHeaderStyle() {
      return {
        backgroundColor: this.theme || '#fa0623',
        color: this.theme.cardHeaderText || '#ffffff',
        fontWeight: 'bold'
      }
    },
    paginatedTasks() {
      return this.tasks
    }
  },

  //////////////////// 初始化 ////////////////////
  mounted() {
    this.fetchTasks()
  },
  created() {
    this.loadUserOptions();
  },

  //////////////////// 逻辑方法 ////////////////////
  methods: {

 //时间更合适
    formatDateTime(date) {
      const yyyy = date.getFullYear();
      const mm = ('0' + (date.getMonth() + 1)).slice(-2);
      const dd = ('0' + date.getDate()).slice(-2);
      const hh = ('0' + date.getHours()).slice(-2);
      const mi = ('0' + date.getMinutes()).slice(-2);
      const ss = ('0' + date.getSeconds()).slice(-2);
      return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
    },


    // DevManager 弹窗，事件处理方法
    handleDeviceSelected(device) {
      this.editTaskForm.deviceId = device.id
      this.editTaskForm.deviceName = device.label
    },

    // 手动限制只能选一个
    handleSingleCheck(val) {
      if (val.length > 1) {
        this.filter.results = [val[val.length - 1]]; // 只保留最后选中的一个
      }
    },

    //**************加载用户相关**************///

    async loadUserOptions() {
      try {
        const res = await listUser({ pageNum: 1, pageSize: 100 });
        if (res.code === 200 && res.rows) {
          this.userOptions = res.rows
            .filter(user => user.userId !== 1) // 过滤超级管理员（假设 ID 1 为超级管理员）
            .map(user => ({
              ...user,
              userId: String(user.userId) // 确保 userId 为字符串
            }));

          // 设置默认值（转换为字符串）
          if (this.userOptions.length > 0) {
            this.editTaskForm.leader = String(this.userOptions[0].userId);
            this.editTaskForm.executor = String(this.userOptions[0].userId);
          }
        }
      } catch (error) {
        this.$message.error("加载用户失败");
      }
    },


    //**************操作票相关**************///

    // 【新增】 获取操作票选项数据（调用操作票 list 接口）
    async fetchTicketOptions() {
      try {
        const res = await listTicket({ pageNum: 1, pageSize: 100 });
        if (res && res.rows) {
          this.ticketOptions = res.rows || [];
        }
      } catch (error) {
        this.$message.error('获取操作票选项失败');
      }
    },


    //**************查询数据**************///

    // 查询数据（分页 + 筛选）
    async fetchTasks() {
      this.loading = true;
      const queryParams = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        taskName: this.filter.taskName || '',
        taskType: this.filter.taskType || '',
        taskStatus: this.filter.results.length === 1 ? this.filter.results[0] : ''
      }

      try {
        // 1. 获取任务列表
        const res = await getTaskPageList(queryParams);

        // 2. 获取用户列表（复用任务管理页面的API）
        const userRes = await listUser({ pageNum: 1, pageSize: 100 });
        const userMap = new Map();
        if (userRes.code === 200) {
          userRes.rows.forEach(user => {
            userMap.set(String(user.userId), user.userName);
          });
        }

        // 3. 处理任务数据
        if (res && res.total !== undefined) {
          this.tasks = res.rows.map(task => ({
            ...task,
            // 保留原始ID
            leaderId: task.leader,
            executorId: task.executor,
            // 显示用户名
            leader: userMap.get(task.leader) || task.leader,
            executor: userMap.get(task.executor) || task.executor
          }));

          this.totalCount = res.total;
        }
      } catch (error) {
        console.error('获取任务列表失败:', error);
        this.$message.error('获取数据失败');
      } finally {
        this.loading = false;
      }
    },

    // 切换分页
    handlePageChange(page) {
      this.currentPage = page
      this.fetchTasks()
    },

    // 点击查询按钮
    searchData() {
      this.currentPage = 1
      this.fetchTasks()
    },


    // 表单重置
    reset() {
      this.editTaskForm = {
        id: undefined,                // 主键 ID，新增时候设置undefined表示不传递
        taskName: null,            // 任务名称，字符串
        taskType: null,            // 任务类型，字符串（巡检/维修/抢修）
        leader: null,              // 负责人，字符串
        executor: null,            // 执行人，字符串
        planStartTime: null,     // 计划开始时间，DateTime? → null
        planEndTime: null,       // 计划完成时间，DateTime? → null
        actualEndTime: null,     // 实际完成时间，DateTime? → null
        remark: null  ,             // 备注，字符串
        ticketId: null       // 添加 ticketId 属性
      }
      },

    // 打开新增任务对话框
    openAddDialog() {
      this.editMode = 'add';
      this.editDialogVisible = true; // 先打开弹窗（重要）

      this.$nextTick(() => {
        // 先清空表单内容（重置模型）
        this.reset();

        // ✅ 默认开始/结束时间设置
        const now = new Date();
        const end = new Date();
        end.setHours(23, 59, 0, 0); // ✅ 设置为晚上 23:59

        this.editTaskForm.planStartTime = this.formatDateTime(now);
        this.editTaskForm.planEndTime = this.formatDateTime(end);

        // 再清除表单校验状态
        if (this.$refs.form) {
          this.$refs.form.resetFields();
        }
      });

      this.fetchTicketOptions(); // 加载操作票弹窗

    },

    // 打开编辑任务对话框
    editTask(row) {
      this.editMode = 'edit';
      // 【修改点】显式初始化 ticketId 字段，防止未定义导致下拉框不绑定
      this.editTaskForm = {
        ...row
      };
      this.fetchTicketOptions(); // ✅ 加载下拉框数据
      this.editDialogVisible = true;
    },


    // 提交新增/编辑
    async submitTask() {
      try {
        // 1. 表单校验
        const valid = await this.$refs.form.validate();
        if (!valid) return;

        // 2. 准备提交数据（使用原始ID）
        const submitData = {
          ...this.editTaskForm,
          // leader: this.editTaskForm.leaderId || this.editTaskForm.leader,
          // executor: this.editTaskForm.executorId || this.editTaskForm.executor
          leader: this.editTaskForm.leader,
          executor: this.editTaskForm.executor
        };

        // 3. 设置加载状态
        this.loading = true;

        // 4. 判断操作类型   修改或者新增
        const isEdit = submitData.id != null;
        const apiFunc = isEdit ? updateTask : addTask;

        // 5. 执行API请求
        const res = await apiFunc(submitData);

        // 6. 处理响应
        if (res.code === 200) {
          this.$message.success({
            message: isEdit ? '修改成功' : '新增成功',
            duration: 2000,
            showClose: true
          });

          // 7. 关闭弹窗并刷新表格
          this.editDialogVisible = false;
          await this.fetchTasks();

          // 8. 重置表单
          this.$nextTick(() => {
            this.$refs.form.resetFields();
          });
        } else {
          this.$message.error(res.msg || '操作失败');
        }
      } catch (error) {
        console.error('任务提交错误:', error);
        this.$message.error('请求异常，请稍后重试');
      } finally {
        this.loading = false;
      }
    },
    // 查看详情
    viewTaskDetail(task) {
      this.currentTask = { ...task }
      this.detailDialogVisible = true
    },

// 删除任务
    deleteTask(row) {
      this.$confirm('确认删除该任务吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await deleteTask([row.id]);
        if (res.code === 200) {
          this.$message.success('删除成功');
          this.fetchTasks();
        } else {
          this.$message.error(res.msg || '删除失败');
        }
      }).catch(() => {});
    }

  }
}
</script>



<style scoped>
.container {
  display: flex;
  flex-direction: column;
  margin: 10px;
  height: calc(100vh - 130px);
  background-color: #FFFFFF;
  padding: 20px;
}

.filter-form {
  margin-bottom: 0px;
}

/* ================== 弹窗样式 ================== */
>>>.centered-dialog {
  //margin: 0;
  //top: 50% !important;  /* 弹窗顶部从页面顶端开始，50% 位置（居中关键） */
  //left: 50% !important;
  //transform: translate(-50%, -60%); /*   将弹窗自身往左移一半宽度、往上移一半高度，真正做到水平+垂直居中 */
  border-radius: 20px;
}
/* ================== 表单行排版 ================== */

>>>.el-select el-select--default {
  width: 100%;
}


>>>.el-checkbox.is-bordered.el-checkbox--medium {
  margin-right: 0px;
}

</style>
