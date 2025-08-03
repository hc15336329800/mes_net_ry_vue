<!--设备档案管理页面-->
<template>
  <div class="container">
    <el-row :gutter="10" style="height: 100%; ">
      <!-- 左侧：树结构 -->
      <el-col :span="4" style="height: 100%;">

        <div style=" border-radius: 7px;   background-color: #FFFFFF;  height: 100%; ">
          <!-- 操作按钮  备用-->
          <div class="tree-actions1">          </div>
          <!-- 设备树结构 -->
          <div style="    padding: 20px;">
            <el-tree
              ref="tree"
              :data="treeData"
              :props="defaultProps"
              node-key="id"
              default-expand-all
              @node-click="handleNodeClick"
            ></el-tree>
          </div>

        </div>

      </el-col>

      <!-- 右侧：设备详情 -->
      <el-col :span="20" style=" border-radius: 7px;   background-color: #FFFFFF; height: 100%; padding: 10px;">
        <div style="background-color: #FFFFFF; height: 100%; padding: 15px; padding-top: 22px">
          <!-- 过滤条件 -->
          <el-form :inline="true" :model="filter" class="filter-form">
            <el-form-item label="设备名称">
              <el-input v-model="filter.label" placeholder="请输入设备名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="list">
                <i class="el-icon-search"></i> 查询
              </el-button>
            </el-form-item>
            <el-button type="primary"   class="custom-btn" @click="addDevice">
              <i class="el-icon-plus"></i> 新增
            </el-button>

          </el-form>

          <!-- 展示所有设备管理实体字段的列表 -->
          <div style="overflow: auto; height: 86%;"   >        <!-- 外层容器设置了水平滚动 -->
          <el-table
            v-loading="loading"
            :data="paginatedData"
            border
            stripe
            :cell-style="{ height: '57px' }"
            :header-cell-style="tableHeaderStyle"
          >
            <el-table-column prop="id" label="主键ID " min-width="120"  show-overflow-tooltip    v-if="false"            ></el-table-column>
            <el-table-column prop="deviceId" label="设备ID" min-width="120"show-overflow-tooltip   v-if="false"       ></el-table-column>
            <el-table-column prop="label" label="设备名称" min-width="120"show-overflow-tooltip fixed="left"            ></el-table-column>
            <el-table-column prop="model" label="型号规格"min-width="120"show-overflow-tooltip  fixed="left"   ></el-table-column>

<!--            <el-table-column prop="deviceType" label="设备类型"min-width="120"show-overflow-tooltip></el-table-column>-->
            <el-table-column
              prop="deviceType"
              label="设备类型"
              min-width="120"
              show-overflow-tooltip
              :formatter="formatDeviceType"
            />


            <el-table-column prop="capacity" label="额定容量 (L)"min-width="120"show-overflow-tooltip    v-if="false"     ></el-table-column>
            <el-table-column prop="quantity" label="数量"min-width="120"show-overflow-tooltip   v-if="false"     ></el-table-column>
            <el-table-column prop="weight" label="设备重量 (KG)"min-width="120"show-overflow-tooltip></el-table-column>
            <el-table-column prop="manufacturer" label="生产厂家"min-width="120"show-overflow-tooltip></el-table-column>
            <el-table-column prop="installDate" label="安装时间"min-width="120"show-overflow-tooltip></el-table-column>
            <el-table-column prop="ratedCurrent" label="额定电流 (A)"min-width="120"show-overflow-tooltip></el-table-column>
            <el-table-column prop="ratedVoltage" label="额定电压 (V)"min-width="120"show-overflow-tooltip></el-table-column>
            <el-table-column prop="status" label="设备状态"min-width="120"show-overflow-tooltip></el-table-column>
            <el-table-column prop="tempControl" label="温控要求 (℃)"min-width="120"show-overflow-tooltip  v-if="false"></el-table-column>
            <el-table-column prop="maintenanceCycle" label="维护周期 (天)"min-width="120"show-overflow-tooltip></el-table-column>
            <el-table-column prop="warrantyPeriod" label="质保期"min-width="120"show-overflow-tooltip></el-table-column>
            <el-table-column prop="processId" label="设备所属工序ID"min-width="120"show-overflow-tooltip   v-if="false"     ></el-table-column>
            <el-table-column prop="createTime" label="创建时间"min-width="120"show-overflow-tooltip></el-table-column>
            <el-table-column prop="updateTime" label="更新时间"min-width="120"show-overflow-tooltip></el-table-column>

            <!-- 操作列：设备详情 -->
            <el-table-column label="设备详情" align="center" min-width="230" show-overflow-tooltip>
              <template #default="scope">
                <el-button type="success" size="small" @click="showQrCode(scope.row)">
                  二维码
                </el-button>
                <el-button type="primary" size="small" @click="editDevice(scope.row)">
                  修改
                </el-button>
                <el-button type="primary" size="small" @click="deleteDevice(scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          </div>
          <!--    分页组件-->
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="pagelist"
          />

        </div>
      </el-col>
    </el-row>

    <!-- 【改动3】新增/修改设备弹窗 -->
    <el-dialog
      :title="deviceForm.id ? '修改设备' : '新增设备'"
      :visible.sync="deviceDialogVisible"

      width="40%"
      custom-class="centered-dialog"
    >
      <!-- 【改动4】增加表单校验，绑定 rules 和 ref -->
      <el-form ref="deviceFormRef" :model="deviceForm" :rules="deviceRules" label-width="120px">
        <el-form-item label="设备名称" prop="label">
          <el-input v-model="deviceForm.label"></el-input>
        </el-form-item>
<!--        <el-form-item label="设备类型" prop="deviceType">-->
<!--          <el-input v-model="deviceForm.deviceType"></el-input>-->
<!--        </el-form-item>-->
        <!-- 新增：设备类型下拉选择框 -->
        <el-form-item label="设备类型" prop="deviceType">
          <treeselect
            v-model="deviceForm.deviceType"
            :options="treeData"
          :show-count="true"
          :disable-branch-nodes="true"
          placeholder="请选择设备"
          clearable
           />
        </el-form-item>
        <el-form-item label="型号规格" prop="model">
          <el-input v-model="deviceForm.model"></el-input>
        </el-form-item>
<!--        <el-form-item label="额定容量">-->
<!--          <el-input v-model="deviceForm.capacity" type="number">-->
<!--            <template #append>L</template>-->
<!--          </el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="数量" prop="quantity">-->
<!--          <el-input v-model="deviceForm.quantity" type="number"></el-input>-->
<!--        </el-form-item>-->
        <el-form-item label="设备重量">
          <el-input v-model="deviceForm.weight" type="number">
            <template #append>KG</template>
          </el-input>
        </el-form-item>
        <el-form-item label="生产厂家">
          <el-input v-model="deviceForm.manufacturer"></el-input>
        </el-form-item>
        <el-form-item label="安装时间">
          <el-date-picker   value-format="yyyy-MM-dd" v-model="deviceForm.installDate" type="date" style="width: 100%"></el-date-picker>
        </el-form-item>
        <el-form-item label="额定电流">
          <el-input v-model="deviceForm.ratedCurrent" type="number">
            <template #append>A</template>
          </el-input>
        </el-form-item>
        <el-form-item label="额定电压">
          <el-input v-model="deviceForm.ratedVoltage" type="number">
            <template #append>V</template>
          </el-input>
        </el-form-item>
        <el-form-item label="设备状态">
          <el-select v-model="deviceForm.status" placeholder="请选择">
            <el-option label="运行" value="运行"></el-option>
            <el-option label="待机" value="待机"></el-option>
            <el-option label="故障" value="故障"></el-option>
          </el-select>
        </el-form-item>
<!--        <el-form-item label="温控要求">-->
<!--          <el-input v-model="deviceForm.tempControl" type="number">-->
<!--            <template #append>℃</template>-->
<!--          </el-input>-->
<!--        </el-form-item>-->
        <el-form-item label="维护周期">
          <el-input v-model="deviceForm.maintenanceCycle" type="number">
            <template #append>天</template>
          </el-input>
        </el-form-item>
        <el-form-item label="质保期">
          <el-date-picker   value-format="yyyy-MM-dd"  v-model="deviceForm.warrantyPeriod" type="date" style="width: 100%"></el-date-picker>
        </el-form-item>
        <!-- 其它字段可按需添加 -->

        <el-form-item label="保养内容" prop="remark">
          <el-input v-model="deviceForm.remark"></el-input>
        </el-form-item>


      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deviceDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveDevice">确 定</el-button>

      </span>
    </el-dialog>


    <!-- 二维码弹窗 -->
    <el-dialog
      title="设备二维码"
      :visible.sync="qrCodeDialogVisible"
      width="25%"
      custom-class="centered-dialog"
      @close="handleQrClose">

      <div style="text-align: center;">
        <div id="qrcode"   style="display: inline-block;"></div> <!-- 二维码容器 -->
        <p style="margin-top: 10px;">设备ID：{{ currentId }}</p>
        <el-button type="primary" @click="printQrCode">打印二维码</el-button>
      </div>
    </el-dialog>



  </div>
</template>

<script>

import Treeselect from '@riophae/vue-treeselect' // ✅ 引入 vue-treeselect 树组件
import '@riophae/vue-treeselect/dist/vue-treeselect.css'// ✅ 引入 vue-treeselect 树样式
import QRCode from 'qrcodejs2' // 纯js二维码库 ,无需注册组件

import { getTreeNode } from "@/api/zm_device/DeviceType"; //  树

import { pagelist,pagelistbytype ,add, update,del} from "@/api/zm_device/DeviceManagement";
import { mapState } from 'vuex' //  设备管理
export default {
  components: {
    Treeselect,
   },
  data() {
    return {
      // 遮罩层
      loading: true,
      ////////////////////////////////////////// 二维码////////////////////////////////////////////////

      qrCodeDialogVisible: false,
      currentId: null,
      qrCodeUrl: '',
      ////////////////////////////////////////// 查询参数////////////////////////////////////////////////
      queryParams: {
        pageNum: 1,
        pageSize: 11,
        label: undefined, //设备名称
        deviceTypeId:0    //设备分类
      },
      total: 0,// 总条数
      //////////////////////////////////////////////////////////////////////////////////////////////////////


      treeData: [], // 设备树数据
      defaultProps: {
        children: "children",
        label: "label"
      },
      selectedNode: null,
      filter: {
        label: ""
      },
      paginatedData: [], // 后台返回的设备管理数据列表

      //////////////////////////////////////新增/修改设备弹窗相关数据////////////////////////////////////////////////////////////////

      deviceDialogVisible: false,
      deviceForm: {

        id: 0,
        deviceId: 0,
        label: "",
        deviceType: "", // 设置下拉框默认值为 103
        model: "",
        capacity: null,
        quantity: 0,
        weight: null,
        manufacturer: "",
        installDate: null,
        ratedCurrent: null,
        ratedVoltage: null,
        status: "",
        tempControl: null,
        maintenanceCycle: null,
        warrantyPeriod: null,
        processId: 0
      },
      //  校验规则：必填项为 label、quantity、model
      deviceRules: {
        label: [{ required: true, message: "请输入设备名称", trigger: "blur" }],
        quantity: [{ required: true, message: "请输入设备数量", trigger: "blur" }],
        model: [{ required: true, message: "请输入型号规格", trigger: "blur" }]
      }


      //////////////////////////////////////////////////////////////////////////////////////////////////////

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
        height: '40px',     // 表头高度
        // lineHeight: '50px'  // 表头文字居中

        // textAlign: "center", // 表头水平居中
        // verticalAlign: "middle", // 表头垂直居中
      }
    }
  },
  created() {
    // 初始化加载树数据和设备管理数据
    this.list();
    this.getTree();
  },
  methods: {

    ////////////////////////////////////////// 设备类型////////////////////////////////////////////////

    formatDeviceType(row) {
      const typeId = row.deviceType;
      const match = this.findTreeLabelById(this.treeData, typeId);
      return match || typeId; // 如果找不到，保留原值
    },

    findTreeLabelById(tree, id) {
      for (let node of tree) {
        if (String(node.id) === String(id)) {
          return node.label;
        }
        if (node.children && node.children.length) {
          const childResult = this.findTreeLabelById(node.children, id);
          if (childResult) return childResult;
        }
      }
      return null;
    },


    ////////////////////////////////////////// 二维码////////////////////////////////////////////////

    //展示二维码
    showQrCode(row) {
      this.currentId = row.id
      this.qrCodeDialogVisible = true

      // 延迟一会儿，等 DOM 渲染完成
      this.$nextTick(() => {
        document.getElementById('qrcode').innerHTML = '' // 清空旧的
        new QRCode(document.getElementById('qrcode'), {
          text: `http://192.168.2.198:8080/KRTSB/KRTDA/DevInfoApp?deviceId=${row.id}`,
          // text: row.id.toString(),  // 旧的只显示id
          width: 200,
          height: 200,
        })
      })
    },

    //打印二维码
    printQrCode() {
      const qrDiv = document.getElementById('qrcode')
      const img = qrDiv.querySelector('img')
      const win = window.open('', '_blank')
      win.document.write(`
        <html>
          <head><title>打印二维码</title></head>
          <body style="text-align:center">
            <h3>设备ID：${this.currentId}</h3>
            <img src="${img.src}" style="width:200px;height:200px;" />
            <script>window.onload = function() { window.print(); }<\/script>
          </body>
        </html>
      `)
      win.document.close()
    },
    //关闭二维码
    handleQrClose() {
      this.currentId = ''
      document.getElementById('qrcode').innerHTML = ''
    },

    ////////////////////////////////////////// 树结构////////////////////////////////////////////////

    // 获取树结构数据
    getTree() {
      // 遮罩层
      loading: true,
      getTreeNode().then(response => {
        this.treeData = response.data;
        // 遮罩层
        loading: false
      });
    },

    // 节点点击事件
    handleNodeClick(node) {
      if (this.isLeaf(node)) {
        this.selectedNode = node;
        //  将当前节点id赋给 queryParams.deviceTypeId
        this.queryParams.deviceTypeId = node.id;
        // 调用查询接口，刷新数据
        this.searchNodeData();
      } else {
        this.selectedNode = null;
      }
    },

    // 判断节点是否为叶子节点
    isLeaf(node) {
      return !node.children || node.children.length === 0;
    },
    // 查询设备管理数据
    list() {
      this.loading = true;
      this.queryParams.label = this.filter.label //搜索参数
      pagelist(this.queryParams).then(response => {
        this.paginatedData = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    // 查询设备分类下的所有设备 （自定义SQL-涉及中间表）
    searchNodeData() {
      pagelistbytype(this.queryParams).then(response => {
        this.paginatedData = response.rows;
        this.total = response.total;

        this.loading = false;
      });
    },

    // 分页回调
    pagelist(pageParams) {
      // 【改动3】：更新分页信息，然后重新查询数据
      this.queryParams.pageNum = pageParams.page;
      this.queryParams.pageSize = pageParams.limit;
      this.list();
    },
    // 显示设备详情
    showDeviceDetail(row) {
      // 设备详情展示逻辑
      console.log("显示设备详情：", row);
    },


    /////////////////////////////////////////////////////////////////////新增/修改/保存设备////////////////////////////////////////////////////////////////////

    // 新增设备：清空表单，显示弹窗
    addDevice() {
      this.deviceForm = {
        id: 0,
        deviceId: 0,
        label: "",
        deviceType: 103,  // 注意：设定默认值为 103
        model: "",
        capacity: null,
        quantity: 0,
        weight: null,
        manufacturer: "",
        installDate: null,
        ratedCurrent: null,
        ratedVoltage: null,
        status: "",
        tempControl: null,
        maintenanceCycle: null,
        warrantyPeriod: null,
        processId: 0
      };
      this.deviceDialogVisible = true;
    },
    // 【改动2】修改设备：接收传入的行数据加载到表单中，显示弹窗
    editDevice(row) {
      if (!row) return;
      this.deviceForm = Object.assign({}, row);
      this.deviceDialogVisible = true;
    },
    // 【改动2】【改动4】保存设备：判断是新增还是修改后调用相应接口，并进行表单校验
    saveDevice() {
      this.$refs.deviceFormRef.validate((valid) => {
        if (valid) {
          if (this.deviceForm.id === 0) {
            // 新增
            add(this.deviceForm).then((response) => {
              this.deviceDialogVisible = false;
              this.list();
            });
          } else {
            // 修改
            update(this.deviceForm).then((response) => {
              this.deviceDialogVisible = false;
              this.list();
            });
          }
        } else {
          console.log("校验失败");
          return false;
        }
      });
    },
    // 删除设备（示例实现）
    // 删除设备：确认后调用删除接口（同时删除中间表记录）
    deleteDevice(row) {
      if (!row) return;
      this.$confirm("确认删除该设备吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        // 调用删除接口，传递设备ID
        del(row.id).then(response => {
          this.$message.success("删除成功");
          this.list();
        }).catch(err => {
          this.$message.error("删除失败");
        });
      }).catch(() => {
        // 取消删除
      });
    },

  }
};
</script>

<style scoped>


.tree-actions {
  padding: 20px 10px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}


/* 弹窗居中 & 圆角 */
>>>.centered-dialog {
  margin: 0;
  top: 50% !important;  /* 弹窗顶部从页面顶端开始，50% 位置（居中关键） */
  left: 50% !important;
  transform: translate(-50%, -60%); /*   将弹窗自身往左移一半宽度、往上移一半高度，真正做到水平+垂直居中 */
  border-radius: 20px;
}


.tree-container {
  height: 100%;
  background-color: #ffffff;
  border-radius: 10px; /* ✅ 圆角 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* ✅ 阴影 */
  padding: 10px; /* 内边距让内容更美观 */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 防止内容超出边角 */
}


</style>
