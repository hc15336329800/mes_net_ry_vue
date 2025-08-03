<!-- DevManager.vue -->
<template>
  <el-dialog
    title="设备选择"
    :visible.sync="visibleProxy"
    width="800px"
    custom-class="centered-dialog"
    append-to-body>


      <el-table
        ref="deviceTable"
        row-key="id"
        :data="tableDevDate"
        border
        stripe
        height="400"
        @selection-change="handleSelectionChange"
        @row-dblclick="handleRowDblClick"

      >
<!--        <el-table-column type="selection" width="55" />-->
        <el-table-column prop="id" label="设备ID" />
        <el-table-column prop="label" label="设备名称" />
        <el-table-column prop="model" label="设备型号" />
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="handlePageChange"
      />


    <span slot="footer" class="dialog-footer">
      <el-button @click="closeMainDialog">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { pagelist } from '@/api/zm_device/DeviceManagement'

export default {
  name: 'DevManager',
  model: {
    prop: 'ticketDialogVisible',
    event: 'input'
  },
  props: {
    ticketDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableDevDate: [],        // 设备列表数据
      total: 0,                // 总条数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        label: ''
      },
      selectedDeviceIds: []    // 当前选中设备ID列表
    }
  },
  computed: {
    visibleProxy: {
      get() {
        return this.ticketDialogVisible
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  },
  watch: {
    ticketDialogVisible(newVal) {
      if (newVal) {
        this.fetchDeviceList()
      }
    }
  },
  methods: {

    handleRowDblClick(row) {
      this.$emit('device-selected', row)   // 向父组件发射选中设备数据
      this.closeMainDialog()               // 同时关闭弹窗
    },


    // 分页改变事件
    handlePageChange({ page, limit }) {
      this.queryParams.pageNum = page
      this.queryParams.pageSize = limit
      this.fetchDeviceList()
    },
    // 获取设备分页列表
    async fetchDeviceList() {
      try {
        const res = await pagelist(this.queryParams)
        this.tableDevDate = res.rows
        this.total = res.total
      } catch {
        this.$message.error('获取设备列表失败')
      }
    },
    // 表格选中项变化事件
    handleSelectionChange(selection) {
      this.selectedDeviceIds = selection.map(item => String(item.id))
    },
    // 关闭对话框
    closeMainDialog() {
      this.$emit('input', false)
    }
  }
}
</script>

<style scoped>
/* 可根据实际需求添加样式 */
</style>
