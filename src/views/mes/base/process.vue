<template>
  <div class="container">

    <!--    工具栏-->
    <div>
      <el-form
        ref="queryRef"
        :model="queryParams"
        class="query-form commen-search"
        :inline="true"
      >
        <el-form-item label="BOM号" class="condition">
          <el-input
            v-model="queryParams.params.bomNo"
            placeholder="请输入BOM号"
            clearable
          />
        </el-form-item>
        <el-form-item label="物料号" class="condition">
          <el-input
            v-model="queryParams.params.itemNo"
            placeholder="请输入物料号"
            clearable
          />
        </el-form-item>
        <el-form-item class="commen-button">
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="handleQuery"
          >搜索
          </el-button>
        </el-form-item>
        <el-form-item class="commen-button reset">
          <el-button
            icon="el-icon-refresh"
            @click="handleReset"
          >重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

<!--左右两列-->
    <el-row :gutter="20"  style="height: 90%">
      <el-col :span="7"     style="    height: 100%;  margin-left: 20px">

        <el-table
          :data="pageList"
          class="commen-table mt_20"
          @row-click="handleBomRowClick"
          style="    height: 95%;"
        >
<!--          <el-table-column type="index" width="55" label="序号"/>-->
          <el-table-column label="名称" align="center" prop="itemName"/>

          <el-table-column label="Bom号" align="center" prop="bomNo"/>
          <el-table-column label="物料号" align="center" prop="itemNo"/>
        </el-table>
        <pagination
          v-show="pageTotal>0"
          style="text-align: right"
          :total="pageTotal"
          :page.sync="queryParams.page.page_num"
          :limit.sync="queryParams.page.page_size"
          @pagination="getBomData"
        />
      </el-col>

      <el-col :span="16">
        <div class="commen-title" v-if="currentBom">{{ currentBom.itemName }} 工序列表</div>
        <el-table :data="procedureList" class="commen-table mt_20">
          <el-table-column type="index" width="55" label="序号"/>
          <el-table-column label="工序编码" prop="procedureCode" align="center"/>
          <el-table-column label="工序名称" prop="procedureName" align="center"/>
          <el-table-column label="加工工时" prop="hoursWork" align="center"/>
          <el-table-column label="额定工时" prop="hoursFixed" align="center"/>
          <el-table-column label="准备工时" prop="hoursPrepare" align="center"/>
        </el-table>
        <div v-if="!procedureList.length" class="placeholder">
          请选择左侧BOM查看工序
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { pagelist as itemStockPagelist } from '@/api/mes/base/itemStock'

export default {
  data() {
    return {
      queryParams: {
        params: {
          bomNo: '',
          itemNo: '',
          itemName: ''
        },
        page: {
          page_num: 1,
          page_size: 15
        }
      },
      pageList: [],
      pageTotal: 0,
      currentBom: null,
      procedureList: []
    }
  },
  created() {
    this.getBomData()
  },
  methods: {
    getBomData() {
      const query = {
        pageIndex: this.queryParams.page.page_num,
        pageSize: this.queryParams.page.page_size,
        ...this.queryParams.params
      }
      itemStockPagelist(query).then(res => {
        this.pageList = res.rows || []
        this.pageTotal = res.total || 0
      })
    },
    handleQuery() {
      this.queryParams.page.page_num = 1
      this.getBomData()
    },
    handleReset() {
      this.queryParams = {
        params: {
          bomNo: '',
          itemNo: '',
          itemName: ''
        },
        page: {
          page_num: 1,
          page_size: 15
        }
      }
      this.getBomData()
    },
    handleBomRowClick(row) {
      this.currentBom = row
      // TODO: 替换为真实工序查询接口
      this.procedureList = [
        {
          seqNo: 1,
          procedureCode: 'PROC-001',
          procedureName: '工序示例',
          hoursWork: 0.000,
          hoursFixed: 0.000,
          hoursPrepare: 0.000,
          bomNo: row.bomNo
        }
      ]
    }
  }
}
</script>

<style scoped>

.container {

  margin: 10px;
  height: calc(100vh - 110px);
  background-color: #FFFFFF;
  padding: 20px;
}


.placeholder {
  text-align: center;
  padding: 20px;
  color: #909399;
}


</style>
