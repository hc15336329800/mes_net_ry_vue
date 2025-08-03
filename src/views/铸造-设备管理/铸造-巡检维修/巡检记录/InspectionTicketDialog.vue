<template>
  <el-dialog
    title="巡检明细"
    :visible.sync="visible"
    custom-class="centered-dialog"
  >
    <div style="height: 100%; overflow-y: auto;">
      <el-table
        :data="internalTableData"
        style="width: 100%;"
        border
        stripe
      >
        <el-table-column prop="taskId" label="任务ID" />
        <el-table-column prop="id" label="设备ID" />
        <el-table-column prop="label" label="设备名称" />
        <el-table-column label="是否完成">
          <template slot-scope="scope">
            <div style="pointer-events: none;">
              <el-checkbox v-model="scope.row.completed" />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getFinishedDeviceIds } from '@/api/zm_device/DeviceManagement'

export default {
  name: "InspectionTicketDialog",
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    recordId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      internalTableData: [],
      finishedDeviceIds: [],
      taskId: null
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.initData();
      }
    }
  },
  methods: {
    async initData() {
      if (!this.recordId) {
        console.warn('未传入 recordId，无法加载巡检明细');
        return;
      }
      try {
        const res = await getFinishedDeviceIds(this.recordId);
        if (res && res.data) {
          const { tataskId, devices, finishedDeviceIds } = res.data;

          this.taskId = tataskId; // 保存下来
          this.finishedDeviceIds = finishedDeviceIds || [];

          this.internalTableData = (devices || []).map(device => ({
            id: String(device.id),
            label: device.label || `设备(${device.id})`,
            taskId: tataskId || null,
            completed: this.finishedDeviceIds.includes(String(device.id))
          }));
        } else {
          this.internalTableData = [];
          this.finishedDeviceIds = [];
          this.taskId = null;
        }
      } catch (error) {
        console.error('获取巡检明细失败', error);
        this.internalTableData = [];
        this.finishedDeviceIds = [];
        this.taskId = null;
      }
    }
  }
}
</script>

<style scoped>
.centered-dialog {
  margin: 0;
  top: 40% !important;
  left: 50% !important;
  transform: translate(-50%, -50%);
  border-radius: 20px;
  padding: 20px;
  width: 50%;
  height: 55%;
}
.centered-dialog .el-dialog__header {
  padding: 5px;
}
>>> .el-dialog__headerbtn {
  display: none !important;
}
</style>
