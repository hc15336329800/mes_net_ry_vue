<template>
  <div class="container">
    <el-form :inline="true" :model="queryParams" style="white-space: nowrap;">
      <el-form-item>
        <el-input v-model="queryParams.taskId" placeholder="请输入任务ID" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchData">查询</el-button>
      </el-form-item>
    </el-form>

    <div style="overflow: auto; max-height: 700px; height: 100%;">
      <el-table
        v-loading="loading"
        :data="recordList"
        border
        stripe
        style="width: 100%"
        :header-cell-style="tableHeaderStyle"
      >
        <el-table-column label="主键" align="center" prop="id" v-if="false"/>
        <el-table-column label="任务ID" align="center" prop="taskId" fixed="left" show-overflow-tooltip min-width="120"/>
        <el-table-column label="任务名称" align="center" prop="taskName" show-overflow-tooltip min-width="200"/>
        <el-table-column label="负责人" align="center" prop="leader" show-overflow-tooltip min-width="120"/>
        <el-table-column label="执行人" align="center" prop="executor" show-overflow-tooltip min-width="120"/>
        <el-table-column label="任务状态" align="center" prop="taskStatus" show-overflow-tooltip min-width="120"/>
        <el-table-column label="任务开始时间" align="center" prop="taskStartTime" show-overflow-tooltip min-width="120">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.taskStartTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="任务结束时间" align="center" prop="taskEndTime" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.taskEndTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="巡检设备数量" align="center" prop="deviceCount" min-width="120" show-overflow-tooltip />
        <el-table-column label="缺陷总个数" align="center" prop="defectTotal" min-width="120" show-overflow-tooltip />
        <el-table-column label="备注" align="center" prop="remark" min-width="150" show-overflow-tooltip />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="190" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="primary" size="small" @click="openTicketDialog(scope.row)">巡检明细</el-button>
              <el-button type="primary" size="small" @click="handleDelete(scope.row)">删除记录</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div style="padding:15px; display:flex; justify-content:flex-end;">
      <el-pagination
        background
        layout="total, prev, pager, next"
        :total="total"
        :page-size="queryParams.pageSize"
        :current-page.sync="queryParams.pageNum"
        @current-change="handlePageChange">
      </el-pagination>
    </div>

    <InspectionTicketDialog
      :visible.sync="ticketDialogVisible"
      :recordId="currentRecordId"
    />
  </div>
</template>

<script>
import { list, del } from "@/api/zm_device/record";
import { mapState } from 'vuex';
import InspectionTicketDialog from '@/views/铸造-设备管理/铸造-巡检维修/巡检记录/InspectionTicketDialog.vue';

export default {
  components: {
    InspectionTicketDialog
  },
  data() {
    return {
      loading: false,
      recordList: [],
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 11,
        taskId: undefined,
        taskName: undefined
      },
      ticketDialogVisible: false,
      currentRecordId: null,
      multipleSelection: []
    }
  },
  computed: {
    ...mapState({ theme: (state) => state.settings.theme }),
    tableHeaderStyle() {
      return {
        backgroundColor: this.theme || '#fa0623',
        color: this.theme.cardHeaderText || '#ffffff',
        fontWeight: 'bold'
      }
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      list(this.queryParams).then(response => {
        this.recordList = response.rows || [];
        this.total = response.total || 0;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    handlePageChange(page) {
      this.queryParams.pageNum = page;
      this.getList();
    },
    searchData() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleDelete(row) {
      this.$confirm('确认删除该记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del(row.id).then(() => {
          this.$message.success('删除成功');
          this.getList();
        }).catch(() => {
          this.$message.error('删除失败');
        });
      }).catch(() => {});
    },
    /** 打开巡检明细弹窗 */
    openTicketDialog(row) {
      if (!row || !row.id) {
        this.$message.warning('无效的巡检记录');
        return;
      }
      this.currentRecordId = row.id; // ✅ 只传 recordId
      this.ticketDialogVisible = true;
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

>>> .centered-dialog {
  margin: 0;
  top: 40% !important;
  left: 50% !important;
  transform: translate(-50%, -50%);
  border-radius: 20px;
  padding: 20px;
  width: 50%;
}

>>> .centered-dialog .el-dialog__header {
  padding: 5px;
}
</style>
