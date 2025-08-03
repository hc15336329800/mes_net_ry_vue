<!--左侧设备分类，右侧列表 ，备用-->
<template>
  <el-dialog
    title="巡检设备明细"
    :visible.sync="visible"
    custom-class="centered-dialog"
  >
    <el-row :gutter="30">
      <!-- 左侧：树形选择 -->
      <el-col :span="8">
        <div style="max-height: 350px; overflow-y: auto;">
          <el-tree
            ref="ticketTree"
            :data="treeData"
            node-key="id"
            show-checkbox
            default-expand-all
            :props="treeProps"
            :check-strictly="true"
            :default-checked-keys="finishedDeviceIds"
          />
        </div>
      </el-col>

      <!-- 右侧：展示设备列表 -->
      <el-col :span="16">
        <div style="height: 100%; overflow-y: auto;">
          <el-table
            :data="tableData"
            style="width: 100%;"
            border
            stripe
          >
            <el-table-column prop="deviceId" label="设备ID" />
            <el-table-column prop="deviceName" label="设备名称" />
            <el-table-column label="是否完成">
              <template slot-scope="scope">
                <div style="pointer-events: none;">
                  <el-checkbox v-model="scope.row.completed" />
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>

    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "InspectionTicketDialog",
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    treeData: {
      type: Array,
      required: true
    },
    inspectedDeviceIds: {
      type: Array,
      required: true
    },
    finishedDeviceIds: {
      type: Array,
      required: true
    },
    treeProps: {
      type: Object,
      default: () => ({
        children: "children",
        label: "label",
        disabled: "disabled"
      })
    }
  },
  computed: {
    /** 自动生成表格数据（从树形数据中匹配设备ID名称） */
    tableData() {
      const flatMap = {};
      const flattenTree = (nodes = []) => {
        nodes.forEach(node => {
          if (!node.children || node.children.length === 0) {
            flatMap[node.id] = node.label;
          } else {
            flattenTree(node.children);
          }
        });
      };
      flattenTree(this.treeData);

      return this.inspectedDeviceIds.map(id => {
        return {
          deviceId: id,
          deviceName: flatMap[id] || '未知设备',
          completed: this.finishedDeviceIds.includes(id)
        };
      });
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
</style>
