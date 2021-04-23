<template>
  <div class="app-container">



        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">

          <el-form-item label="账户" prop="account">
            <el-input
              v-model="queryParams.account"
              placeholder="请输入账号"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="积分类型" prop="status">
            <el-select
              v-model="queryParams.integrationType"
              placeholder="积分类型"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option
                v-for="dict in integrationTypeOptions"
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





          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
          <el-table-column type="selection"  align="center" />
          <el-table-column label="积分标识" align="center" prop="id" />
          <el-table-column label="账户标识" align="center" prop="account_id" :show-overflow-tooltip="true" />
          <el-table-column label="积分" align="center" prop="integration" :show-overflow-tooltip="true" />
          <el-table-column label="积分类型" align="center" prop="integration_type" :formatter="integrationTypeFormatter"/>

          <el-table-column label="创建时间" align="center" prop="create_time" ></el-table-column>
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
                icon="el-icon-key"
                @click="handleResetPwd(scope.row)"
                v-hasPermi="['integration:reset']"
              >重置</el-button>
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



    <!--    添加或修改抽屉-->
    <el-drawer
      :title="title"
      :visible.sync="drawer"
      :before-close="handleClose"

      >
      <div class="demo-drawer__content" >

        <el-form ref="form" :label-position="labelPosition" :model="form" :rules="rules" label-width="80px">
          <el-row >
            <el-col :span="18" :offset="2">
              <el-form-item v-if="form.employees_number === undefined" label="姓名" prop="username">
                <el-input v-model="form.username" placeholder="请输入用户姓名" />
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="18" :offset="2">
              <el-form-item label="归属部门" prop="deptId">
                <treeselect v-model="form.deptId" :options="deptOptions" :show-count="true" placeholder="请选择归属部门" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18" :offset="2">
              <el-form-item label="手机号码" prop="phone_number">
                <el-input v-model="form.phone_number" placeholder="请输入手机号码" maxlength="11" />
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="18" :offset="2">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="18" :offset="2">
              <el-form-item v-if="form.employees_number=== undefined" label="用户密码" prop="password">
                <el-input v-model="form.password" placeholder="请输入用户密码" type="password" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18" :offset="2">
              <el-form-item label="用户性别">
                <el-select v-model="form.gender" placeholder="请选择">
                  <el-option
                    v-for="dict in genderOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="18" :offset="2">
              <el-form-item label="状态">
                <el-radio-group v-model="form.status">
                  <el-radio
                    v-for="dict in statusOptions"
                    :key="dict.value"
                    :label="dict.value"
                  >{{dict.label}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18" :offset="2">
              <el-form-item label="角色">
                <el-select v-model="form.roleIds" multiple placeholder="请选择">
                  <el-option
                    v-for="item in roleOptions"
                    :key="item.roleId"
                    :label="item.roleName"
                    :value="item.roleId"
                    :disabled="item.status === 1"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18" :offset="2">
              <el-form-item label="备注">
                <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class=" drawer__footer" style="margin-left: 50%">

              <el-button @click="cancel" class="f_btn f_btn_c">取 消</el-button>


              <el-button type="primary" @click="submitForm" class="f_btn">确 定</el-button>

        </div>

      </div>



    </el-drawer>
  </div>
</template>

<style>

.el-drawer__header span:focus {
  outline: 0;
}

</style>


<script>

import {getCustomerList} from "@/api/customer/customer"



const { listUniversalLabelAndValue } = require('@/api/system/dict/type')
import {getIntegrationList} from '@/api/integration/integration'

export default {
  name: "integration",

  data() {
    return {
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
      // 积分类型
      integrationTypeOptions:[],
      // 积分信息列表
     list: null,
      // 弹出层标题
      title: "",

      // 是否显示弹出层
      open: false,


      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],

      // 岗位选项

      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },

      // 查询参数
      queryParams: {
        currentPage: 1,
        size: 10,

      },

    };
  },
  watch: {

  },
  created() {
    this.getList();
    this.getDicts('integration_type').then(resp=>{
      this.integrationTypeOptions = resp.data;
    })
  },
  methods: {


    integrationTypeFormatter(row){
      return this.selectDictLabel(this.integrationTypeOptions,row.integration_type);
    },

    /** 查询积分信息 */
    getList() {
      this.loading = true;
      getIntegrationList(this.queryParams).then(response => {

          this.list = response.list;
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
        userId: undefined,
        deptId: undefined,
        username: undefined,
        password: undefined,
        phone_number: undefined,
        email: undefined,
        gender: undefined,
        employees_status: "1",
        remark: undefined,
        postIds: [],
        roleIds: []
      };
      this.resetForm("form");
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
      this.title = "添加用户";

    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();

      this.drawer = true;



    },

    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.userId !== undefined) {
            updateUser(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addUser(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.userId || this.ids;
      this.$confirm('是否确认删除用户编号为"' + userIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delUser(userIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },

    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },

    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
          this.drawer = false;
          this.reset();
        })
        .catch(_ => {});


    }
  }
};
</script>
