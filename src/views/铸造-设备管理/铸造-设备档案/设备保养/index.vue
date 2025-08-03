<!--设备保养界面-->
<template>
  <div class="container">
    <el-row :gutter="10"    style="  border-radius: 7px;   background-color: #FFFFFF; height: 100%;  flex-direction: column;">

      <!--第一行-->
      <el-col :span="24" style="height: 7%; padding: 15px">
        <el-form :inline="true" :model="filter" class="filter-form">
          <el-form-item label="设备名称">
            <el-input v-model="filter.label" placeholder="请输入设备名称" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="list"><i class="el-icon-search"></i> 查询</el-button>
          </el-form-item>
         </el-form>
        <!--    工具栏-->
      </el-col>
      <!--第二行-->
      <el-col :span="24" style="height: 85%; padding: 10px  ">
        <div style="height: 100%; overflow: auto;">   <!--包裹 防止撑开表格-->
        <el-table :data="paginatedData"       v-loading="loading" border stripe :header-cell-style="tableHeaderStyle">
          <el-table-column prop="id" label="ID"   v-if="false"  />
          <el-table-column prop="label" label="设备名称"    min-width="100"  show-overflow-tooltip/>
          <el-table-column prop="model" label="型号规格"  min-width="100"  show-overflow-tooltip/>
          <el-table-column prop="manufacturer" label="生产厂家"  min-width="100"  show-overflow-tooltip/>
          <el-table-column prop="installDate" label="安装时间"  min-width="100"   :formatter="formatDate" show-overflow-tooltip />
          <el-table-column prop="maintenanceCycle" label="维护周期 (天)"  min-width="100"  show-overflow-tooltip/>
           <!-- 修正 label 并确保 prop 正确 -->
          <el-table-column
            prop="lastMaintenanceTime"
            label="上次保养时间"
            min-width="100"
            :formatter="formatDate"
            show-overflow-tooltip
          />

          <el-table-column prop="maintenanceCountdown" label="维护倒计时"  min-width="100"  show-overflow-tooltip>
            <template slot-scope="scope">
          <span :style="{ color: scope.row.maintenanceCountdown < 7 ? 'red' : (scope.row.maintenanceCountdown < 30 ? 'orange' : '#606266') }">
            剩余 {{ scope.row.maintenanceCountdown }} 天
          </span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="设备状态"  min-width="100"  show-overflow-tooltip/>

          <el-table-column prop="remark" label="保养要求"  min-width="120"  show-overflow-tooltip/>

          <el-table-column prop="warrantyPeriod" label="质保期" min-width="100"  show-overflow-tooltip />
          <el-table-column prop="updateTime" label="更新时间" min-width="100"  show-overflow-tooltip />
          <el-table-column label="操作" min-width="120"  show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="openMaintenanceDrawer(scope.row)">保养管理</el-button>
            </template>
          </el-table-column>
        </el-table> <!--    列表-->
        </div>
      </el-col>
      <!--第三行-->
      <el-col :span="24" style="height: 7%; ">
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="pagelistByMaint" />
      </el-col>
    </el-row>



    <!-- 新增设备弹窗 -->
    <el-dialog title="新增设备" :visible.sync="deviceDialogVisible" width="50%">
      <el-form ref="deviceFormRef" :model="deviceForm" :rules="deviceRules" label-width="120px">
        <el-form-item label="设备名称" prop="label"><el-input v-model="deviceForm.label" /></el-form-item>
        <el-form-item label="设备类型" prop="deviceType">
          <treeselect v-model="deviceForm.deviceType" :options="treeData" :show-count="true" :disable-branch-nodes="true" placeholder="请选择设备" clearable />
        </el-form-item>
        <el-form-item label="型号规格" prop="model"><el-input v-model="deviceForm.model" /></el-form-item>
        <el-form-item label="设备重量"><el-input v-model="deviceForm.weight" type="number"><template #append>KG</template></el-input></el-form-item>
        <el-form-item label="生产厂家"><el-input v-model="deviceForm.manufacturer" /></el-form-item>
        <el-form-item label="安装时间">
          <el-date-picker
            v-model="deviceForm.installDate"
            type="date"
            value-format="yyyy-MM-dd"
          placeholder="选择日期"
          style="width: 100%"
          />

        </el-form-item>
        <el-form-item label="额定电流"><el-input v-model="deviceForm.ratedCurrent" type="number"><template #append>A</template></el-input></el-form-item>
        <el-form-item label="额定电压"><el-input v-model="deviceForm.ratedVoltage" type="number"><template #append>V</template></el-input></el-form-item>
        <el-form-item label="设备状态">
          <el-select v-model="deviceForm.status" placeholder="请选择">
            <el-option label="运行" value="运行" />
            <el-option label="待机" value="待机" />
            <el-option label="故障" value="故障" />
          </el-select>
        </el-form-item>
        <el-form-item label="维护周期"><el-input v-model="deviceForm.maintenanceCycle" type="number"><template #append>天</template></el-input></el-form-item>
        <el-form-item label="质保期">
          <el-date-picker
            v-model="deviceForm.warrantyPeriod"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期" style="width: 100%" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deviceDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveDevice">确定</el-button>
      </span>
    </el-dialog>

    <!-- 保养记录抽屉（外层） -->
    <!-- 保养记录抽屉（外层） -->
    <el-drawer title="保养记录列表" :visible.sync="drawer" size="50%">
      <!-- 保养记录列表展示 -->
      <el-button type="primary" icon="el-icon-plus" @click="openAddMaint" style="margin-bottom: 10px;">新增保养记录</el-button>
      <el-table :data="maintenanceList" border stripe size="small" style="width: 100%;">
        <el-table-column prop="id" label="ID" v-if="false" />
         <el-table-column prop="deviceId" label="deviceId" v-if="false" />
        <el-table-column prop="content" label="保养内容" />
        <el-table-column prop="createTime" label="保养时间" />

        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作" align="center" width="140">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="openEditMaint(scope.row)">编辑</el-button>
            <el-button type="text" size="small" style="color: red" @click="deleteMaint(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 保养记录表单抽屉（内层） -->
      <el-drawer title="新增保养记录" :visible.sync="innerDrawer" :append-to-body="true" :before-close="handleInnerClose" size="30%">
        <div style="padding-bottom: 60px;">
          <el-form :model="maintForm" label-width="100px" label-position="top">
            <el-form-item label="保养内容：">
              <el-input type="textarea" :rows="3" v-model="maintForm.content" placeholder="请输入保养内容" />
            </el-form-item>
            <el-form-item label="保养备注：">
              <el-input type="textarea" :rows="3" v-model="maintForm.remark" placeholder="请输入备注" />
            </el-form-item>
          </el-form>
<!--          <el-form :model="maintForm" label-width="100px">-->
<!--&lt;!&ndash;            <el-form-item label="deviceId"  v-if="false"><el-input v-model="maintForm.deviceId" placeholder="请输入保养内容" /></el-form-item>&ndash;&gt;-->
<!--&lt;!&ndash;            <el-table-column prop="createTime" label="保养时间" />&ndash;&gt;-->
<!--            <el-form-item label="保养内容："><el-input v-model="maintForm.content" placeholder="请输入保养内容" /></el-form-item>-->
<!--            <el-form-item label="保养备注："><el-input v-model="maintForm.remark" placeholder="请输入备注" /></el-form-item>-->
<!--          </el-form>-->
        </div>
        <div class="inner-drawer-footer">
          <el-button @click="innerDrawer = false">取消</el-button>
          <el-button type="primary" @click="submitMaintForm">保存</el-button>
        </div>
      </el-drawer>
    </el-drawer>

  </div>
</template>



<script>
 import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getTreeNode } from '@/api/zm_device/DeviceType'
import { add, pagelistByMaint } from '@/api/zm_device/DeviceManagement'
import {  listMaint,  addMaint,editMaint,deleteMain } from '@/api/zm_device/DeviceMaint'
import { mapState } from 'vuex'
 import dayjs from 'dayjs';


 export default {
  components: {  },
  data() {
    return {
      // 遮罩层
      loading: true,
      ////////////////////// 查询与分页相关 //////////////////////
      queryParams: { pageNum: 1, pageSize: 13, label: undefined, deviceTypeId: 0 },
      total: 0,
      filter: { label: '' },

      ////////////////////// 设备数据 //////////////////////
      treeData: [],
      paginatedData: [],
      deviceDialogVisible: false,
      deviceForm: {
        id: 0, label: '', deviceType: '', model: '', capacity: null,
        quantity: 0, weight: null, manufacturer: '', installDate: null,
        ratedCurrent: null, ratedVoltage: null, status: '', tempControl: null,
        maintenanceCycle: null, warrantyPeriod: null, processId: 0,lastMaintenanceTime:null
      },
      deviceRules: {
        label: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
        quantity: [{ required: true, message: '请输入设备数量', trigger: 'blur' }],
        model: [{ required: true, message: '请输入型号规格', trigger: 'blur' }]
      },

      ////////////////////// 保养记录抽屉 //////////////////////
      drawer: false,
      innerDrawer: false,
      currentDeviceId: null,
      maintenanceList: [],
      maintForm: { id: '', deviceId: '', content: '', remark: '',createTime:'' }
    }
  },
  computed: {
    ...mapState({ theme: state => state.settings.theme }),
    tableHeaderStyle() {
      return {
        backgroundColor: this.theme || '#fa0623',
        color: this.theme.cardHeaderText || '#ffffff',
        fontWeight: 'bold',
        height: '40px',     // 表头高度
      }
    }
  },
  created() {

    this.list()
    this.getTree()
  },
  methods: {
    ////////////////////// 日期格式化工具 //////////////////////

    formatDate(row, column, cellValue) {
      return cellValue ? dayjs(cellValue).format('YYYY-MM-DD') : '';
    },

    ////////////////////// 查询与分页方法 //////////////////////
    getTree() {
      // 遮罩层
      loading: true,
      getTreeNode().then(res => {
        this.treeData = res.data
        // 遮罩层
        loading: true
      })
    },
    list() {
      this.loading = true;
      this.queryParams.label = this.filter.label //搜索参数
      pagelistByMaint(this.queryParams).then(res => {
        this.paginatedData = res.rows
        this.total = res.total
        this.loading = false;
      })
    },
    pagelistByMaint(pageParams) {
      this.queryParams.pageNum = pageParams.page
      this.queryParams.pageSize = pageParams.limit
      this.list()
    },

    ////////////////////// 设备新增方法 //////////////////////
    addDevice() {
      this.deviceForm = {
        id: 0, deviceId: 0, label: '', deviceType: 103,
        model: '', capacity: null, quantity: 0, weight: null,
        manufacturer: '', installDate: null, ratedCurrent: null,
        ratedVoltage: null, status: '', tempControl: null,
        maintenanceCycle: null, warrantyPeriod: null, processId: 0
      }
      this.deviceDialogVisible = true
    },
    saveDevice() {
      this.$refs.deviceFormRef.validate(valid => {
        if (!valid) return

        // 🛠️ 强制格式化 installDate 和 warrantyPeriod
        // const payload = {
        //   ...this.deviceForm,
        //   installDate: this.deviceForm.installDate ? dayjs(this.deviceForm.installDate).format('YYYY-MM-DD') : null,
        //   warrantyPeriod: this.deviceForm.warrantyPeriod ? dayjs(this.deviceForm.warrantyPeriod).format('YYYY-MM-DD') : null
        // };


        //  时间组件中已经格式化
        const payload = {
          ...this.deviceForm,
          installDate: this.deviceForm.installDate,
          warrantyPeriod: this.deviceForm.warrantyPeriod
        };
        add(payload ).then(() => {
          this.deviceDialogVisible = false
          this.list()
        })
      })
    },

    ////////////////////// 保养记录相关方法 //////////////////////
    // 点击“详情”按钮，打开第一层 Drawer 显示保养记录表格
    openMaintenanceDrawer(row) {
      this.currentDeviceId = row.deviceId || row.id // 兼容两种情况
      this.drawer = true
      this.loadMaintList()
    },

    //  刷新
    loadMaintList() {
      if (!this.currentDeviceId) return
      listMaint(this.currentDeviceId).then(res => {
        this.maintenanceList = res.rows || []
      })
    },


    // 新增时打开
    openAddMaint() {
      if (!this.currentDeviceId) {
        this.$message.error('设备ID缺失，无法新增保养记录')
        return
      }
      this.maintForm = {
        // id: null,
        deviceId: this.currentDeviceId, //中间表使用
        content: '',
        remark: ''
      }
      this.innerDrawer = true
    },

    // 编辑时打开
    openEditMaint(row) {
      this.maintForm = {
        id: row.id,
        deviceId: this.currentDeviceId, // 强制设置 deviceId 确保不为 0
        content: row.content,
        remark: row.remark,
      }
      this.innerDrawer = true
    },

    // 提交保养记录：根据 id 判断是新增还是编辑
    submitMaintForm() {
      const isEdit = !!this.maintForm.id
      const payload = {
        id: this.maintForm.id,
        deviceId: this.currentDeviceId, // 强制覆盖，确保不为空
        content: this.maintForm.content,
        remark: this.maintForm.remark
      }

      if (isEdit) {
        // 获取当前记录对应的 createTime
        const matched = this.maintenanceList.find(item => item.id === this.maintForm.id) //自动从 maintenanceList 中找到当前 ID 对应的项，并提取其 createTime；
        if (matched) payload.createTime = matched.createTime

       // this.$modal.msg("默认反馈 " + payload.createTime)

        // 编辑逻辑
        editMaint(payload).then(res => {
          if (res.code === 200) {
            this.$message.success('修改成功')
            this.innerDrawer = false
            this.openMaintenanceDrawer({ deviceId: this.currentDeviceId })
          } else {
            this.$message.error(res.msg || '修改失败')
          }
        })
      } else {
        // 新增逻辑
        addMaint(payload).then(res => {
          if (res.code === 200) {
            this.$message.success('新增成功')
            this.innerDrawer = false
            this.openMaintenanceDrawer({ deviceId: this.currentDeviceId })
          } else {
            this.$message.error(res.msg || '新增失败')
          }
        })
      }
    },


    // 退出页面的关闭提醒
    handleInnerClose(done) {
      //this.$confirm('确认关闭？').then(() => done()).catch(() => {})
    },

    // 删除
    deleteMaint(row) {
      this.$confirm('确认删除这条保养记录吗？', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        deleteMain(row.id).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.openMaintenanceDrawer({ deviceId: this.currentDeviceId })
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        })
      })
    }
  }
}
</script>

<style scoped>


.filter-form {
  margin-bottom: 20px;
}

.dialog-footer {
  text-align: right;
  padding: 10px 0;
}

.el-table th {
  background-color: #f5f7fa;
  color: #333;
  font-weight: bold;
}

.el-drawer .el-table {
  margin-bottom: 20px;
}

.el-drawer .el-button {
  margin-bottom: 10px;
}

/* 一层 Drawer 的 body 增加内边距 */
>>>.el-drawer__body {
  padding: 20px;
}

/* 二层 Drawer 的 footer 按钮居中显示 */
>>>.inner-drawer-footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 10px 20px;
  background-color: #fff;
  text-align: center;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.1);
}
</style>
