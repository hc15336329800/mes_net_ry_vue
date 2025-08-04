<!--bom列表-->
<template>
  <div class="app-container">

    <!--    搜索框-->
    <el-form :model="queryParams" ref="queryRef" class="query-form commen-search" :inline="true">
      <el-form-item label="BOM号" class="condition">
        <BomNoSelect :item-no.sync="queryParams.params.bomNo" />
      </el-form-item>

      <el-form-item label="物料号" class="condition">
        <ItemNoSelect :item-no.sync="queryParams.params.itemNo" />
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
      <el-form-item></el-form-item>
    </el-form>

    <!--    工具栏-->
    <el-row class="flex_row pb_10 c_b fw_bold fs_24">
      <el-button
        type="primary"
        icon="el-icon-plus"
        v-if="hasPerm('B002004000001')"
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
      <el-table-column label="操作" align="center" width="320" class-name="small-padding fixed-width">
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
      <el-form :model="form" class="commen-form" :rules="rules" ref="form" label-width="100px">
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
