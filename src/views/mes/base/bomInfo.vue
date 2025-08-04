<template>
  <div class="container">
    <el-form :model="queryParams" ref="queryRef" class="query-form commen-search" :inline="true">
      <el-form-item label="BOM号" class="condition">
        <el-input v-model="queryParams.bomNo" placeholder="请输入BOM号" clearable />
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
      row-key="id"
      :tree-props="{ children: 'children' }"
      default-expand-all
      border
      style="width: 100%;"
    >
      <el-table-column label="部件名称" prop="itemName" />
      <el-table-column label="物料号" prop="itemNo" />
      <el-table-column label="BOM号" prop="bomNo" />
      <el-table-column label="子件号" prop="useItemNo" />
      <el-table-column label="用量" prop="useItemCount" />
      <el-table-column label="父级编码" prop="parentCode" />
    </el-table>

    <pagination
      style="text-align: right"
      v-show="pageTotal>0"
      :total="pageTotal"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getData"
    />
  </div>
</template>

<script>
import { bomInfo, getBomTreePage } from '@/api/mes/base/bom.js'

export default {
  data() {
    return {
      queryParams: {
        bomNo: '', // 查询用BOM编号
        pageNum: 1,
        pageSize: 10
      },
      pageTotal: 0,
      pageList: [] // 表格数据
    }
  },
  created() {
    // 默认加载指定bomNo的数据
    this.queryParams.bomNo = '2516001917-1'
    this.getData()
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
      bomInfo(this.queryParams.bomNo).then(res => {
        // 这里根据实际接口返回数据结构调整
        this.pageList = res.data || []
        this.pageTotal = this.pageList.length

        if (this.pageList.length === 0) {
          this.$message.warning('暂无数据，请检查BOM号是否正确')
        }
      }).catch(err => {
        console.error('获取BOM信息失败:', err)
        this.$message.error('获取BOM信息失败')
      })
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
