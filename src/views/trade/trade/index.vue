<template>
  <div class="app-container">

    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">


      <el-form-item label="交易状态" prop="tradeStatus">
        <el-select
          v-model="queryParams.tradeStatus"
          placeholder="请选择交易状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in tradeStatusOption"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>


      <el-form-item label="创建时间">
        <el-date-picker
          v-model="queryParams.dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">

<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="danger"-->
<!--          icon="el-icon-delete"-->
<!--          size="mini"-->
<!--          :disabled="multiple"-->
<!--          @click="handleDelete"-->
<!--          v-hasPermi="['advertisement:banner:removeBatch']"-->
<!--        >批量删除</el-button>-->
<!--      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="smsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="交易标识" align="center" prop="trade_id" />

      <el-table-column label="房源编号" align="center" prop="house_id" :show-overflow-tooltip="true" />
      <el-table-column label="房东标识" align="center" prop="landlord_id" :show-overflow-tooltip="true" />
      <el-table-column label="房客标识" align = "center"  prop="tenant_id" :show-overflow-tooltip="true" />
      <el-table-column label="支付金额" align = "center"  prop="free" :show-overflow-tooltip="true" />
      <el-table-column label="房租单价" align = "center"  prop="house_rent_unit_free" :show-overflow-tooltip="true" />
      <el-table-column label="租金单位" align = "center"  prop="rent_unit" :show-overflow-tooltip="true" />
      <el-table-column label="交易状态" align="center" prop="trading_status" :show-overflow-tooltip="true"/>
      <el-table-column label="创建时间" align="center" prop="create_time" width="160"></el-table-column>
      <el-table-column label="备注" align = "center"  prop="remark" />
      <el-table-column
        label="操作"
        align="center"
        width="160"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['advertisement:banner:edit']"
          >修改</el-button>
          <el-button
            v-if="scope.row.userId !== 1"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['advertisement:banner:remove']"
          >删除</el-button>

        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.currentPage"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />




    <div>
      <el-dialog  :visible.sync="drawer" @close="cancel" :title="title" append-to-body>
        <el-row :gutter="15">
          <el-form ref="form" :model="form" :rules="rules" size="medium" label-width="100px">
            <el-col :span="12">
              <el-form-item label="类型" prop="type">
                <el-select v-model="form.type" placeholder="请选择短信模板类型" clearable :style="{width: '100%'}">
                  <el-option v-for="(item, index) in this.sms_type_options" :key="index" :label="item.label"
                             :value="item.value" ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-select v-model="form.status" placeholder="请选择状态" clearable :style="{width: '100%'}">
                  <el-option v-for="(item, index) in this.sms_status_options" :key="index" :label="item.label"
                             :value="item.value" ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="模板内容" prop="template">
                <el-input v-model="form.template" type="textarea" placeholder="请输入模板内容" :maxlength="128"
                          show-word-limit :autosize="{minRows: 4, maxRows: 8}" :style="{width: '100%'}"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" :maxlength="128"
                          show-word-limit :autosize="{minRows: 2, maxRows: 4}" :style="{width: '100%'}"></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div slot="footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </div>
      </el-dialog>
    </div>



  </div>
</template>

<style>

.el-drawer__header span:focus {
  outline: 0;
}

</style>


<script>

import {queryTradeList} from '@/api/trade/trade'

const { listUniversalLabelAndValue } = require('@/api/system/dict/type')


export default {
  name: "trade-list",

  data() {
    return {
      file: undefined,
      // 抽屉是否显示
      drawer: false,
      //表单对齐方式
      labelPosition: 'right',
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 轮播图表格数据
      smsList: [],
      // 弹出层标题
      title: "",

      // 是否显示弹出层
      open: false,

      // 日期范围
      dateRange: [],
      tradeStatusOption: [],
      sms_type_options: [],
      // 表单参数
      form: {

      },
      defaultProps: {
        children: "children",
        label: "label"
      },

      // 查询参数
      queryParams: {
        currentPage: 1,
        size: 10,
        tradingStatus: undefined,
        dataRange: []
      },

    };
  },
  watch: {

  },
  created() {
    this.getList();
    this.getTradeStatusList();

  },
  methods: {

    getTradeStatusList(){
      this.getDicts('trade_status').then(resp=>{
        this.tradeStatusOption = resp.data;
      })
    },

    statusFormat(row, column) {
      return this.selectDictLabel(this.sms_status_options, row.status);
    },

    typesFormat(row, column){
      return this.selectDictLabel(this.sms_type_options, row.type);
    },

    // 查询交易信息
    getList() {
      this.loading = true;
      queryTradeList(this.queryParams).then(response => {

          this.smsList = response.list;
          this.total = response.total;
          this.loading = false;
        }
      );
    },




    // 取消按钮
    cancel() {
      this.drawer = false;
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        type: undefined,
        status: undefined,
        template: undefined,
        remark: undefined
      }

    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.currentPage = 1;
      this.queryParams.size = 10;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();

    },

    /** 提交按钮 */
    submitForm: function() {
      console.log("提交表单")
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id === undefined){
            createSmsTemplate(this.form).then(response => {
              if (response.success){
                this.drawer = false;
                this.msgSuccess("创建短信模板成功")

              }
            })
          }
        }

        this.getList();
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const smsIds = row.id || this.ids;
      this.$confirm('是否确认删除模板编号为"' + smsIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return deleteSmsTemplate(smsIds)
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },

  }
};
</script>
