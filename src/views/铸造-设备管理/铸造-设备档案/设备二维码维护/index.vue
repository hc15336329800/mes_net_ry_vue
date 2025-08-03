<template>
  <div class="container">
    <div style="background-color: #FFFFFF; height: 100%; padding: 15px; padding-top: 22px;">
      <!-- 查询条件 -->
      <el-form :inline="true" :model="filter" class="filter-form">
        <el-form-item label="设备名称">
          <el-select v-model="filter.factory" placeholder="请选择厂房">
            <el-option
              v-for="factory in factoryList"
              :key="factory"
              :label="factory"
              :value="factory"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="filter.deviceName"
            placeholder="请输入设备名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchData">查询</el-button>
          <el-button type="primary" @click="openGenerateDialog">生成二维码</el-button>

        </el-form-item>
      </el-form>


      <!-- 设备二维码维护列表 -->
      <el-table
        :data="paginatedData"
        border
        stripe
        style="width: 100%"
        :header-cell-style="tableHeaderStyle"
      >
        <!-- 二维码编号 -->
        <el-table-column prop="qrcodeId" label="二维码编号" min-width="150" />

        <!-- 站点名称 -->
        <el-table-column
          prop="factoryName"
          label="站点名称"
          min-width="140"
        />

        <!-- 设备名称 -->
        <el-table-column
          prop="deviceName"
          label="设备名称"
          min-width="140"
        />

        <!-- 设备分类路径 -->
        <el-table-column
          prop="devicePath"
          label="设备分类路径"
          min-width="180"
        />

        <!-- 备注 -->
        <el-table-column prop="remark" label="备注" min-width="160" />

        <!-- 绑定状态 -->
        <el-table-column
          prop="bindStatus"
          label="绑定状态"
          align="center"
          min-width="100"
        />

        <!-- 创建时间 -->
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
          min-width="160"
        />

        <!-- 操作列（查看、编辑、删除）暂不绑定事件 -->
        <el-table-column label="操作" align="center" width="160">
          <template #default="scope">
            <el-button type="text">查看</el-button>
            <el-button type="text">编辑</el-button>
            <el-button type="text">删除</el-button>
          </template>
        </el-table-column>

        <!-- 生成二维码按钮 -->
        <el-table-column label="二维码" align="center" width="130">
          <template #default="scope">
            <el-button type="primary" size="small" @click="viewQRCode(scope.row)">
              查看二维码
            </el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>

    <!-- 分页 -->
    <div
      style="
        padding: 15px;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
      "
    >
      <el-pagination
        background
        layout="total, prev, pager, next"
        :total="tableData.length"
        :page-size="pageSize"
        :current-page.sync="currentPage"
        @current-change="handlePageChange"
      ></el-pagination>
    </div>

    <!-- 二维码生成与绑定对话框 -->
    <!-- 生成二维码对话框 -->
    <el-dialog
      title="生成二维码"
      :visible.sync="generateDialogVisible"
      width="40%"
      custom-class="centered-dialog"
      append-to-body
    >
      <el-row>
        <!-- 左侧：二维码生成区域 -->
        <el-col :span="10" style="text-align: center;">
          <div ref="qrcodeContainer" style="width:200px; height:200px; margin:0 auto;"></div>
        </el-col>
        <!-- 右侧：树结构选择 -->
        <el-col :span="14">
          <el-tree
            :data="treeData"
            :props="defaultTreeProps"
            @node-click="handleNodeClick"
          />
          <div style="margin-top: 10px; text-align: right;">
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="bindDevice">绑定</el-button>

        <el-button @click="generateDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <!-- 查看二维码对话框 -->
    <el-dialog
      title="查看二维码"
      :visible.sync="viewDialogVisible"
      width="40%"
      custom-class="centered-dialog"
      append-to-body
    >
      <div style="text-align: center;">
        <img
          :src="currentQRCodeRecord ? ('https://via.placeholder.com/200x200.png?text=' + currentQRCodeRecord.qrcodeId) : ''"
          alt="二维码"
          style="width:200px; height:200px; border:1px solid #ccc;"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="viewDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

  </div>


</template>

<script>
// 请确保已安装 qrcodejs2: npm install qrcodejs2
import QRCode from "qrcodejs2";
import { mapState } from "vuex";

const mockTableData = [
  {
    qrcodeId: "QR_20230306001",
    factoryName: "新式环境实验房",
    deviceName: "光分板",
    devicePath: "新式环境实验房/一号车间",
    remark: "测试二维码",
    bindStatus: "未绑定",
    createTime: "2025-03-06 17:25:07"
  },
  {
    qrcodeId: "QR_20230306002",
    factoryName: "厂房A",
    deviceName: "自动包装机",
    devicePath: "厂房A/包装车间",
    remark: "已绑定测试",
    bindStatus: "已绑定",
    createTime: "2025-03-06 15:10:22"
  },
  {
    qrcodeId: "QR_20230306003",
    factoryName: "厂房B",
    deviceName: "消毒柜",
    devicePath: "厂房B/消毒区",
    remark: "待确认",
    bindStatus: "未绑定",
    createTime: "2025-03-07 09:00:00"
  }
];

export default {
  data() {
    return {
      filter: {
        factory: "",     // 站点名称查询
        deviceName: ""   // 设备名称查询
      },
      factoryList: ["厂房A", "厂房B", "厂房C", "新式环境实验房"],
      tableData: [],       // 存储表格数据
      currentPage: 1,
      pageSize: 12,

      // 二维码对话框
      qrcodeDialogVisible: false,
      qrcodeText: "",       // 用于生成二维码的文本
      treeData: [],        // 树结构数据
      selectedNode: null,   // 当前选中的末端节点

      generateDialogVisible: false,
      viewDialogVisible: false,
      currentQRCodeRecord: null, // 用于查看二维码时存放当前记录
    };
  },
  computed: {
    // 从 Vuex 获取主题（RuoYi-Vue 风格）
    ...mapState({
      theme: (state) => state.settings.theme
    }),

    // 表头样式
    tableHeaderStyle() {
      return {
        backgroundColor: this.theme || "#fa0623",
        color: this.theme.cardHeaderText || "#ffffff",
        fontWeight: "bold"
      };
    },

    // 分页数据
    paginatedData() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      return this.tableData.slice(startIndex, startIndex + this.pageSize);
    },

    // el-tree 默认配置
    defaultTreeProps() {
      return {
        children: "children",
        label: "label"
      };
    }
  },
  created() {
    // 初始化表格数据（后续可改为接口调用）
    this.getData();
  },
  watch: {
    generateDialogVisible(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.generateQRCode();
          }, 100);
        });
      }
    }
  },
  methods: {
    getData() {
      this.tableData = mockTableData;
    },
    searchData() {
      console.log("执行查询：", this.filter);
      // TODO: 根据查询条件请求接口或过滤数据
    },
    handlePageChange(page) {
      this.currentPage = page;
    },
    // 打开生成二维码对话框（上方工具栏触发）
    openGenerateDialog() {
      // 设置二维码内容（此处示例用当前时间生成二维码编号）
      this.qrcodeText = "QR " + Date.now();
      // 初始化树结构示例数据
      this.treeData = [
        {
          label: "厂房A",
          children: [
            { label: "车间A1", children: [{ label: "设备A1-01" }, { label: "设备A1-02" }] },
            { label: "车间A2", children: [{ label: "设备A2-01" }, { label: "设备A2-02" }] }
          ]
        },
        {
          label: "厂房B",
          children: [
            { label: "车间B1", children: [{ label: "设备B1-01" }, { label: "设备B1-02" }] }
          ]
        }
      ];
      this.selectedNode = null;
      this.generateDialogVisible = true;
    },
    // 生成二维码（使用 ref 获取二维码容器）
    generateQRCode() {
      const container = this.$refs.qrcodeContainer;
      if (!container) {
        console.error("qrcodeContainer 未找到");
        return;
      }
      container.innerHTML = "";
      new QRCode(container, {
        text: this.qrcodeText,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    },
    handleNodeClick(node) {
      this.selectedNode = node;
      console.log("已选中节点：", node);
    },
    // 绑定二维码（仅允许末端节点绑定）
    bindDevice() {
      if (!this.selectedNode) {
        this.$message.warning("请先选择一个末端节点设备！");
        return;
      }
      if (this.selectedNode.children && this.selectedNode.children.length > 0) {
        this.$message.warning("请选择末端节点设备！");
        return;
      }
      const newRecord = {
        qrcodeId: this.qrcodeText,
        factoryName: this.filter.factory || "默认站点",
        deviceName: this.filter.deviceName || "未知设备",
        devicePath: "示例路径",
        remark: "",
        bindStatus: "已绑定",
        createTime: new Date().toLocaleString()
      };
      this.tableData.push(newRecord);
      this.$message.success("二维码绑定成功！");
      this.generateDialogVisible = false;
    },
    // 查看二维码对话框（表格按钮触发）
    viewQRCode(row) {
      // 假设设备记录中有 deviceId 字段
      // 调用后端接口查询当前设备绑定的二维码图片 URL
      // 这里用 setTimeout 模拟异步请求
      setTimeout(() => {
        // 模拟接口返回结果，假设返回数据格式为 { qrcodeImageUrl: "http://xxx/xxx.png" }
        // 例如，如果设备绑定状态为 "已绑定"，则返回一个二维码图片 URL，否则返回 null
        let simulatedResponse = row.bindStatus === "已绑定"
          ? { qrcodeImageUrl: "https://via.placeholder.com/200x200.png?text=" + row.qrcodeId }
          : null;

        if (simulatedResponse && simulatedResponse.qrcodeImageUrl) {
          // 将返回的二维码图片 URL 赋值到当前记录中
          this.currentQRCodeRecord = Object.assign({}, row, simulatedResponse);
          this.viewDialogVisible = true;
        } else {
          this.$message.warning("该设备未绑定二维码！");
        }
      }, 300);
    }}

};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  margin: 10px;
  height: calc(100vh - 130px);
}

/* 弹窗居中 & 圆角 */
>>>.centered-dialog {
  margin: 0;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%);
  border-radius: 20px;
}
</style>
