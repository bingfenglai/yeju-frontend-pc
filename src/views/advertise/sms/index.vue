<template>
  <div class="app-container">
  
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="内容" prop="type">
            <el-input
              v-model="queryParams.template"
              placeholder="请输入短信模板内容"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>

          <el-form-item label="类型" prop="type">
            <el-select
              v-model="queryParams.type"
              placeholder="请选择短信模板类型"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option
                v-for="dict in sms_type_options"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择短信模板状态"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option
                v-for="dict in sms_status_options"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="dateRange"
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
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['advertisement:banner:create']"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['advertisement:banner:removeBatch']"
            >批量删除</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="smsList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="标识" align="center" prop="id" />

          <el-table-column label="类型" align="center" prop="type" :formatter="typesFormat" />
          <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" />
          <el-table-column label="内容" align = "center"  prop="template" :show-overflow-tooltip="true" />
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
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
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


import {query,createSmsTemplate,updateSmsTemplate,deleteSmsTemplateById,deleteSmsTemplateByIdBatch} from '@/api/sms/smsTemplate'

const { listUniversalLabelAndValue } = require('@/api/system/dict/type')
import {getFileMd5,checkMd5,upload} from '@/api/oos'

export default {
  name: "sms-list",

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
      sms_status_options: [],
      sms_type_options: [],
      // 表单参数
      form: {
        type: undefined,
        status: undefined,
        template: undefined,
        remark: undefined
      },
      defaultProps: {
        children: "children",
        label: "label"
      },

      // 查询参数
      queryParams: {
        currentPage: 1,
        size: 10,
        type: undefined,
        status: undefined,
        between: undefined
      },

      rules: {
        type: [{
          required: true,
          message: '请选择短信模板类型',
          trigger: 'blur'
        }],
        status: [{
          required: true,
          message: '请选择状态',
          trigger: 'blur'
        }],
        template: [{
          required: true,
          message: '请输入模板内容',
          trigger: 'blur'
        }],
      },

    };
  },
  watch: {

  },
  created() {
    this.getList();

    this.getSmsStatusList();

    this.getSmsTemplateTypeList();

  },
  methods: {


    statusFormat(row, column) {
      return this.selectDictLabel(this.sms_status_options, row.status);
    },

    typesFormat(row, column){
      return this.selectDictLabel(this.sms_type_options, row.type);
    },

    /** 查询短信模板列表 */
    getList() {
      this.loading = true;
      query(this.queryParams).then(response => {
          console.log("轮播图数据",response.list)
          this.smsList = response.list;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    getSmsStatusList(){
      listUniversalLabelAndValue("status").then(resp => {
          this.sms_status_options = resp.data;
      })
    },

    getSmsTemplateTypeList(){
      listUniversalLabelAndValue("sms_template_type").then(response => {
          this.sms_type_options = response.data;
      })
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
      this.ids = selection.map(item => item.employees_number);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.drawer = true;
      this.title = "添加短信模板";


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
