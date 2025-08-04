<!--bom列表-->
<template>
  <div class="container">

    <!--    搜索框-->
    <el-form ref="queryRef" :model="queryParams" class="query-form commen-search" :inline="true">
      <el-form-item label="BOM号" class="condition">
        <el-input v-model="queryParams.params.bomNo" placeholder="请输入BOM号" clearable />
      </el-form-item>

      <el-form-item label="物料号" class="condition">
        <el-input v-model="queryParams.params.itemNo" placeholder="请输入物料号" clearable />
      </el-form-item>

      <el-form-item label="产品名称" class="condition">
        <el-input v-model="queryParams.params.itemName" placeholder="请输入名称" clearable />
      </el-form-item>
      <el-form-item label="库位" class="condition">
        <el-select v-model="queryParams.location" placeholder="请选择产品库位" clearable>
          <el-option
            v-for="dict in locationList"
            :key="dict.code"
            :label="dict.name"
            :value="dict.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="commen-button">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
      </el-form-item>
      <el-form-item class="commen-button reset">
        <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </el-form-item>
      <el-form-item />
    </el-form>

    <!--    工具栏-->
    <el-row class="flex_row pb_10 c_b fw_bold fs_24">
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="handleAdd()"
      >新增
      </el-button>

    </el-row>

    <!--    列表-->
    <el-table :data="pageList" class="commen-table mt_20">
      <el-table-column type="index" width="55" label="序号"></el-table-column>
      <el-table-column label="Bom号" align="center" prop="bomNo" />
      <el-table-column label="物料号" align="center" prop="itemNo" />
      <el-table-column label="产品名称" align="center" prop="itemName" />
      <el-table-column label="型号" align="center" prop="itemModel" />
      <el-table-column label="来源" align="center" prop="itemOrigin" />
      <el-table-column label="库存量" align="center" prop="itemCount" />
      <el-table-column label="净重" align="center" prop="netWeight" />
      <el-table-column label="单位" align="center" prop="itemMeasure" />
      <el-table-column label="库位" align="center" prop="locationDesc" />
      <el-table-column label="创建时间" align="center" prop="createdTime" />
      <el-table-column label="操作" align="center" min-width="250"   class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button link type="primary" icon="Edit" @click="handleDetail(scope.row)">工序详情</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUsedDetail(scope.row)">用料详情</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      style="text-align: right"
      v-show="pageTotal>0"
      :total="pageTotal"
      :page.sync="queryParams.page.page_num"
      :limit.sync="queryParams.page.page_size"
      @pagination="getData"
    />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="dialogShow" width="960px" @close="beforeClose">
      <el-form ref="form" :model="form" class="commen-form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item prop="bomNo" label="图纸号">
              <el-input v-model="form.bomNo" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="itemNo" label="产品编码">
              <el-input v-model="form.itemNo" :disabled="form.id" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="itemName" label="产品名称">
              <el-input v-model="form.itemName" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item prop="itemModel" label="规格型号">
              <el-input v-model="form.itemModel" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="itemOrigin" label="产品来源">
              <el-select v-model="form.itemOrigin" placeholder="请选择产品来源" clearable>
                <el-option
                  v-for="dict in itemOriginList"
                  :key="dict.code"
                  :label="dict.name"
                  :value="dict.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="location" label="库位">
              <el-select v-model="form.location" placeholder="请选择产品库位" clearable>
                <el-option
                  v-for="dict in locationList"
                  :key="dict.code"
                  :label="dict.name"
                  :value="dict.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="itemCount" label="库存量">
              <el-input-number v-model="form.itemCount" :precision="3" :controls="false" :min="0"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="netWeight" label="净重">
              <el-input-number v-model="form.netWeight" :precision="3" :controls="false" :min="0"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="itemMeasure" label="单位">
              <el-input v-model="form.itemMeasure" />
            </el-form-item>
          </el-col>
        </el-row>

        <div class="dialog-footer" style="text-align: center;width:100%;">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>


<script>

import { pagelist as itemStockPagelist } from '@/api/mes/base/itemStock'

export default {
  data() {

    return {
      // 查询参数
      queryParams: {
        params: {
          bomNo: '',
          itemNo: '',
          itemName: ''
        },
        location: '',
        page: {
          page_num: 1,
          page_size: 10
        }
      },
      // 字典数据
      locationList: [
        { code: 'A1', name: '仓库A1' },
        { code: 'B2', name: '仓库B2' }
      ],
      itemOriginList: [
        { code: 'self', name: '自制' },
        { code: 'purchase', name: '采购' }
      ],
      // 列表数据
      allData: [],
      pageList: [],
      pageTotal: 0,
      // 弹窗
      dialogShow: false,
      title: '',
      form: {
        id: null,
        bomNo: '',
        itemNo: '',
        itemName: '',
        itemModel: '',
        itemOrigin: '',
        itemCount: 0,
        netWeight: 0,
        itemMeasure: '',
        location: '',
        locationDesc: ''
      },
      rules: {
        bomNo: [{ required: true, message: '图纸号不能为空', trigger: 'blur' }],
        itemNo: [{ required: true, message: '产品编码不能为空', trigger: 'blur' }],
        itemName: [{ required: true, message: '产品名称不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    /** 获取列表数据 */
    getData() {
      const query = {
        pageIndex: this.queryParams.page.page_num,
        pageSize: this.queryParams.page.page_size,
        ...this.queryParams.params,
        location: this.queryParams.location
      }
      itemStockPagelist(query).then(res => {
        this.pageList = res.rows || []
        this.pageTotal = res.total || 0
      })
    },
    /** 搜索按钮 */
    handleQuery() {
      this.queryParams.page.page_num = 1
      this.getData()
    },
    /** 重置按钮 */
    handleReset() {
      this.queryParams = {
        params: {
          bomNo: '',
          itemNo: '',
          itemName: ''
        },
        location: '',
        page: {
          page_num: 1,
          page_size: 10
        }
      }
      this.getData()
    },
    /** 新增 */
    handleAdd() {
      this.title = '新增BOM'
      this.form = {
        id: null,
        bomNo: '',
        itemNo: '',
        itemName: '',
        itemModel: '',
        itemOrigin: '',
        itemCount: 0,
        netWeight: 0,
        itemMeasure: '',
        location: '',
        locationDesc: ''
      }
      this.dialogShow = true
    },
    /** 编辑 */
    handleUpdate(row) {
      this.title = '编辑BOM'
      this.form = { ...row }
      this.dialogShow = true
    },
    /** 删除 */
    handleDelete(row) {
      this.$confirm('是否确认删除该数据？', '提示', { type: 'warning' })
        .then(() => {
          return new Promise(resolve => {
            setTimeout(() => {
              this.allData = this.allData.filter(item => item.id !== row.id)
              resolve()
            }, 300)
          })
        })
        .then(() => {
          this.$message.success('删除成功')
          this.getData()
        })
        .catch(() => {})
    },
    /** 提交表单 */
    submitForm() {
      this.$refs.form.validate(valid => {
        if (!valid) return
        new Promise(resolve => {
          setTimeout(() => {
            if (this.form.id) {
              const index = this.allData.findIndex(item => item.id === this.form.id)
              if (index !== -1) {
                this.form.locationDesc = this.getLocationDesc(this.form.location)
                this.allData.splice(index, 1, { ...this.form })
              }
            } else {
              const newId = this.allData.length
                ? Math.max(...this.allData.map(item => item.id)) + 1
                : 1
              this.form.id = newId
              this.form.locationDesc = this.getLocationDesc(this.form.location)
              this.form.createdTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
              this.allData.push({ ...this.form })
            }
            resolve()
          }, 300)
        }).then(() => {
          this.dialogShow = false
          this.$message.success('保存成功')
          this.getData()
        })
      })
    },
    /** 取消 */
    cancel() {
      this.dialogShow = false
      this.beforeClose()
    },
    /** 弹窗关闭前重置 */
    beforeClose() {
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.resetFields()
      })
    },
    /** 获取库位描述 */
    getLocationDesc(code) {
      const item = this.locationList.find(v => v.code === code)
      return item ? item.name : ''
    },
    /** 查看工序详情 */
    handleDetail(row) {
      this.$message.info(`查看工序详情：${row.bomNo}`)
    },
    /** 查看用料详情 */
    handleUsedDetail(row) {
      this.$message.info(`查看用料详情：${row.bomNo}`)
    }
  }
}
</script>

<style scoped>

.container {

  margin: 10px;
  height: calc(100vh - 130px);
  background-color: #FFFFFF;
  padding: 20px;
}



</style>
