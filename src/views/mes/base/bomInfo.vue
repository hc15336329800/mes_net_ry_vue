<template>
  <div class="container">
    <el-form ref="queryRef" :model="queryParams" class="query-form commen-search" :inline="true">
      <el-form-item label="BOM号" class="condition">
        <el-input v-model="queryParams.bomNo" placeholder="请输入BOM号" clearable/>
      </el-form-item>

      <el-form-item label="物料号" class="condition">
        <el-input v-model="queryParams.itemNo" placeholder="请输入物料号" clearable/>
      </el-form-item>

      <el-form-item class="commen-button">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
      </el-form-item>
      <el-form-item class="commen-button reset">
        <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="pageList"
      row-key="usedId"
      :tree-props="{ children: 'children' }"
      default-expand-all
      border
      style="width: 100%;"
    >
      <el-table-column label="部件名称" prop="itemName"/>
      <el-table-column label="物料号" prop="itemNo"/>
      <el-table-column label="BOM号" prop="bomNo"/>
      <el-table-column label="用量" prop="fixedUsed"/>
      <el-table-column label="父级编码" prop="parentCode"/>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            v-if="showAddButton(scope.row)"
            type="text"
            size="mini"
            @click="handleAdd(scope.row)"
          >新增
          </el-button>
          <el-button
            v-if="showDeleteButton(scope.row)"
            type="text"
            size="mini"
            style="color: #f56c6c"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="pageTotal>0"
      style="text-align: right"
      :total="pageTotal"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getData"
    />

    <el-dialog title="选择BOM" :visible.sync="bomDialogVisible" width="600px">
      <el-table
        :data="bomOptions"
        highlight-current-row
        style="width: 100%"
        @row-click="handleBomRowClick"

      >
        <el-table-column label="名称" prop="itemName"/>
        <el-table-column label="物料号" prop="itemNo"/>
        <el-table-column label="类型" prop="itemType">
          <template slot-scope="scope">
            <span>{{ formatItemType(scope.row.itemType) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bomDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAdd">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import { addBomChild, bomInfo, deleteBomChild } from '@/api/mes/base/bom.js'
import { pagelist as itemStockPagelist } from '@/api/mes/base/itemStock.js'

export default {
  data() {
    return {
      queryParams: {
        bomNo: '', // 查询用BOM编号
        itemNo: '', // 物料号
        pageNum: 1,
        pageSize: 10
      },
      pageTotal: 0,
      pageList: [], // 表格数据
      bomDialogVisible: false,
      bomOptions: [],
      selectedBom: null,
      currentNode: null,
      rootItemNo: ''
    }
  },
  created() {
    const { bomNo, itemNo } = this.$route.query
    this.queryParams.bomNo = bomNo || ''
    this.queryParams.itemNo = itemNo || ''
    if (this.queryParams.bomNo) {
      this.getData()
    }
  },
  methods: {
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getData()
    },
    /** 重置操作表单 */
    handleReset() {
      this.queryParams = {
        bomNo: '',
        itemNo: '',

        pageNum: 1,
        pageSize: 10
      }
      this.getData()
    },
    /** 获取表格数据 */
    getData() {
      if (!this.queryParams.bomNo) {
        this.$message.warning('请输入BOM号')
        return
      }

      // 调用接口获取BOM树数据
      bomInfo(this.queryParams.bomNo, this.queryParams.itemNo).then(res => {
        this.pageList = res.data || []
        this.pageTotal = this.pageList.length
        this.rootItemNo = this.pageList.length ? this.pageList[0].itemNo : ''

        if (this.pageList.length === 0) {
          this.$message.warning('暂无数据，请检查BOM号是否正确')
        }
      }).catch(err => {
        console.error('获取BOM信息失败:', err)
        this.$message.error('获取BOM信息失败')
      })
    },

    handleAdd(row) {
      this.currentNode = row
      this.selectedBom = null
      this.bomDialogVisible = true
      const query = { pageIndex: 1, pageSize: 10 }
      itemStockPagelist(query).then(res => {
        this.bomOptions = res.rows || []
      })
    },
    handleDelete(row) {
      this.$confirm('确认删除该节点及其所有子节点吗？', '提示').then(() => {
        deleteBomChild(row.usedId).then(res => {
          this.$message.success(res.msg || '删除成功')
          this.getData()
        }).catch(() => {
          this.$message.error('删除失败')
        })
      }).catch(() => {
      })
    },
    handleBomRowClick(row) {
      this.selectedBom = row
    },
    confirmAdd() {
      if (!this.selectedBom) {
        this.$message.warning('请选择BOM')
        return
      }
      const payload = [{
        itemNo: this.currentNode.itemNo,
        useItemNo: this.selectedBom.itemNo,
        useItemCount: this.selectedBom.fixedUsed || 1,
        useItemType: '01'
      }]
      addBomChild(payload).then(res => {
        this.$message.success(res.msg || '新增成功')
        this.bomDialogVisible = false
        this.getData()
      }).catch(() => {
        this.$message.error('新增失败')
      })
    },
    formatItemType(type) {
      return type === '01' ? 'BOM' : '物料'
    },
    showAddButton(row) {
      return row.itemType === '01'
    },
    showDeleteButton(row) {
      if (row.itemNo === this.rootItemNo && row.parentCode === row.itemNo) {
        return false
      }
      if (row.itemType === '00') {
        return row.parentCode === this.rootItemNo
      }
      return true

    }
  }
}
</script>

<style lang="scss" scoped>

.container {

  margin: 10px;
  height: calc(100vh - 130px);
  background-color: #FFFFFF;
  padding: 20px;
}


.query-form {
  margin-bottom: 20px;
}

::v-deep .el-form--inline .el-form-item {
  margin-right: 20px;
}
</style>
