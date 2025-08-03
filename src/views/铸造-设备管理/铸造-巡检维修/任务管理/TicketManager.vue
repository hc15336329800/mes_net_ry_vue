<!--TicketManager.vue-->
<template>
  <!-- 主对话框：操作票管理 -->
  <el-dialog
    title="操作票管理"
    :visible.sync="visibleProxy"
    width="800px"
    custom-class="centered-dialog"
    append-to-body>

    <!-- 工具栏：新增操作票按钮 -->
    <div style="margin-bottom: 15px; text-align: right;">
      <el-button type="primary" @click="openTicketForm('add')">新增操作票</el-button>
    </div>

    <!-- 操作票列表 -->
    <el-table :data="tickets" style="width: 100%;" border stripe>
      <el-table-column prop="id" label="序号"  ></el-table-column>
      <el-table-column prop="name" label="操作票名称"    ></el-table-column>

      <el-table-column label="设备数量"  >
        <template slot-scope="scope">
          {{ getDeviceCount(scope.row) }}
        </template>
      </el-table-column>



      <el-table-column label="操作"  align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="openTicketForm('edit', scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="deleteTicket(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <span slot="footer" class="dialog-footer">
      <el-button @click="closeMainDialog">关闭</el-button>
    </span>

    <!-- 子对话框：新增/编辑操作票 -->
    <!-- 子对话框：新增/编辑操作票 -->
    <el-dialog
      :title="ticketFormTitle"
      :visible.sync="ticketFormDialogVisible"
      width="950px"
      custom-class="centered-dialog"
      append-to-body>
      <el-form :model="ticketForm" label-width="120px">

        <el-form-item label="操作票名称">
          <el-input v-model="ticketForm.name" placeholder="请输入操作票名称"></el-input>
        </el-form-item>

        <el-row :gutter="20">
          <!-- 左侧树结构 -->
          <!-- 修改后的左侧树结构 -->
          <el-col :span="6">
            <el-card shadow="hover">
              <el-tree
                ref="deviceTree"
                :data="processedTreeData"
                node-key="id"
                :props="treeProps"
                default-expand-all
                @node-click="handleNodeClick"
              :highlight-current="true"
              ></el-tree>
            </el-card>
          </el-col>

          <!-- 右侧表格 -->
          <!-- 修改后的右侧表格 -->
          <el-col :span="18">
            <el-card shadow="hover">
              <el-table
                ref="deviceTable"
              row-key="id"
                :data="tableDevDate"
              border
              stripe
              height="400"
              @selection-change="handleSelectionChange"
              >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="id" label="设备ID"  ></el-table-column>
              <el-table-column prop="label" label="设备名称"  ></el-table-column>
              <el-table-column prop="model" label="设备型号" ></el-table-column>
              <!-- 其他列... -->
              </el-table>
              <!--    分页组件-->
              <pagination
                v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="handlePageChange"
              />


            </el-card>
          </el-col>

        </el-row>

      </el-form>

      <span slot="footer" class="dialog-footer">
    <el-button @click="ticketFormDialogVisible = false">取消</el-button>
    <el-button type="primary" @click="submitTicketForm">确定</el-button>
  </span>
    </el-dialog>


  </el-dialog>
</template>

<script>
import { listTicket, addTicket, updateTicket, delTicket } from '@/api/zm_device/ticket'
import { getTreeNode } from "@/api/zm_device/DeviceType"
import { pagelist } from '@/api/zm_device/DeviceManagement'


export default {
  name: 'TicketManager',
  model: {
    prop: 'ticketDialogVisible',
    event: 'input'
  },
  props: {
    // 父组件通过 v-model 传入
    ticketDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

      // 分页&加载状态，用来给 list() 调用
      tableDevDate: [],    // 设备列表数据
      loading: false,      // 表格 loading
      total: 0,            // 总条数
      queryParams: { pageNum: 1, pageSize: 5, label: '' },

      // 新增数据项
      filteredDevices: [], // 筛选后的设备列表
      selectedDevices: [], // 表格中选中的设备
      selectedDeviceIds: [] ,// 存储表格选中的ID集合

      currentCategory: null, // 当前选中的分类

      // 主页面操作票列表数据
      tickets: [],
      // 控制新增/编辑子对话框显示
      ticketFormDialogVisible: false,
      // 新增/编辑表单数据对象
      ticketForm: {
        ticketName: '',
        devices: []
      },
      // 子对话框标题
      ticketFormTitle: '',
      // 树形组件数据及配置
      processedTreeData: [],
      treeProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {
    // 计算属性代理 ticketDialogVisible，避免直接修改 prop
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
    // 当主对话框打开时加载列表数据
    ticketDialogVisible(newVal) {
      if (newVal) {
        this.fetchTickets()
      }
    }
  },
  created() {
    // 加载树数据
    this.fetchTreeData()
  },
  methods: {

    // 1）分页控件触发时只管更新页码
    handlePageChange(pagination) {
      this.queryParams.pageNum = pagination.page
      this.queryParams.pageSize =  pagination.limit
      this.list()
    },

    // 处理树节点点击事件
    async handleNodeClick(nodeData) {
      this.currentCategory = nodeData.id;
      try {
        // 调用新接口获取该分类下的设备
        const response = await getDevicesByCategory(nodeData.id);
        this.filteredDevices = response.data || [];
      } catch (error) {
        this.$message.error('获取设备列表失败');
        this.filteredDevices = [];
      }
    },
    // 处理表格多选变化
    handleSelectionChange(selection) {
       this.selectedDeviceIds = selection.map(item => String(item.id)); // 确保id是字符串类型

    },
    // 计算设备数量
    getDeviceCount(row) {
      if (row.deviceIds && typeof row.deviceIds === 'string') {
        try {
          return JSON.parse(row.deviceIds).length;
        } catch (e) {
          return 0;
        }
      } else if (Array.isArray(row.deviceIds)) {
        return row.deviceIds.length;
      }
      return 0;
    },

    // 获取操作票列表
    async fetchTickets() {
      try {
        const response = await listTicket({})
        this.tickets = response.rows || []
      } catch (error) {
        this.$message.error('获取操作票列表失败')
      }
    },

    // 加载树数据时，对返回的节点进行递归处理，将非末端节点设置为 disabled
    async fetchTreeData() {
      try {
        const response = await getTreeNode();
        const data = response.data || [];
        // 递归处理节点：如果存在子节点，则禁用当前节点的复选框
        const processNodes = (nodes) => {
          return nodes.map(node => {
            if (node.children && node.children.length) {
              node.disabled = true;
              node.children = processNodes(node.children);
            } else {
              node.disabled = false;
            }
            return node;
          });
        };
        this.processedTreeData = processNodes(data);
      } catch (error) {
        this.$message.error('获取树数据失败');
      }
    },


    // 打开新增或编辑对话框 ！！！！！
    async   openTicketForm(mode, row) {

      // 先拉设备列表
      this.queryParams.pageNum = 1    // 重置到第一页
      this.queryParams.pageSize = 10.   // 或者一个更大的数，看你场景
      await this.list()

      if (mode === 'add') {
        this.ticketFormTitle = '新增操作票'
        this.ticketForm = { name: '', deviceIds: '[]' }
        this.selectedDeviceIds = []
        this.$nextTick(() => {
          this.$refs.deviceTable.clearSelection()
        })

      } else if (mode === 'edit') { // 编辑按钮
        this.ticketFormTitle = '编辑操作票'
        this.ticketForm = { ...row }
        // 解析旧选中 ID
        try {
          this.selectedDeviceIds = JSON.parse(row.deviceIds).map(String)
        } catch {
          this.selectedDeviceIds = []
        }

        // DOM 更新后，清空 + 重新勾选
        this.$nextTick(() => {
          const table = this.$refs.deviceTable
          table.clearSelection()
          // 找到对应行并选中
          this.selectedDeviceIds.forEach(id => {
            const dev = this.tableDevDate.find(d => String(d.id) === id)  // 注意这里从 tableDevDate 里找行
            if (dev) {
              table.toggleRowSelection(dev, true)
            }
          })
        })


      }
      this.ticketFormDialogVisible = true
    },



    // 删除操作票
    async deleteTicket(row) {
      try {
        await delTicket(row.id)
        this.$message.success('删除成功')
        this.fetchTickets()
      } catch (error) {
        this.$message.error('删除失败')
      }
    },
    // 提交新增或编辑操作票表单
     async submitTicketForm() {

       // 组装设备ID数组为JSON字符串
       this.ticketForm.deviceIds = JSON.stringify(this.selectedDeviceIds);

       try {
         const response = await addTicket(this.ticketForm);
         this.$message.success('新增成功');
         this.ticketFormDialogVisible = false;
         this.fetchTickets();
       } catch (error) {
         this.$message.error('提交失败');
       }
    },

    // 关闭主对话框时通知父组件更新绑定值
    closeMainDialog() {
      this.$emit('input', false)
    },



    // 设备分页&拉数据
    async list() {
      this.loading = true
      try {
        const res = await pagelist(this.queryParams)
        this.tableDevDate = res.rows //列表数据赋值
        this.total = res.total
        this.loading = false
      } catch {
        this.$message.error('获取设备列表失败')
        this.loading = false
      } finally {
        this.loading = false
      }
    },

  }
}
</script>

<style scoped>
/* 根据需要自定义样式 */
</style>
