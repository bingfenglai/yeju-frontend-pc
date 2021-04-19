<template>
  <div class="app-container">


      <!--用户数据-->

        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="标题" prop="userName">
            <el-input
              v-model="queryParams.title"
              placeholder="请输入轮播图标题"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.banner_status"
              placeholder="轮播图状态"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option
                v-for="dict in banner_status_options"
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




        <el-table v-loading="loading" :data="bannerList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" align="center" />
          <el-table-column label="标识" align="center" prop="id" />
          <el-table-column label="图片" align="center">
            <template slot-scope="scope">
              <el-image :src="scope.row.image_url"></el-image>
            </template>
          </el-table-column>
          <el-table-column label="标题" align="center" prop="title" :show-overflow-tooltip="true" />
          <el-table-column label="状态" align="center" prop="banner_status" :formatter="statusFormat" />
          <el-table-column label="优先级" align="center" prop="sort"/>
          <el-table-column label="活动地址" align="center" >

              <template slot-scope="scope">
                <el-button icon="el-icon-share" type="text" @click="clickTarget(scope.row.target_url)">
                  点击前往
                </el-button>
              </template>

          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="create_time" ></el-table-column>
          <el-table-column
            label="操作"
            align="center"

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




      <el-drawer
        :title="title"
        :visible.sync="drawer"
        :before-close="cancel"

      >
        <div class="demo-drawer__content" >
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item label="活动地址" prop="target_url">
              <el-input v-model="form.target_url" placeholder="活动地址" />
            </el-form-item>
            <el-form-item label="优先级" prop="sort">
              <el-input-number v-model="form.sort" controls-position="right" :min="0" />
            </el-form-item>
            <el-form-item label="状态" prop="banner_status">
              <el-radio-group v-model="form.banner_status">
                <el-radio
                  v-for="dict in banner_status_options"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>

           <el-form-item label="上传图片" prop="image_url">
             <template @click="uploadImage">
             <el-upload
               class="upload-demo"
               drag
               action="#"
               :multiple=false
               :http-request="uploadImage"
               :before-upload="beforeUpload"
               >
               <i class="el-icon-upload"></i>
               <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>

             </el-upload>
             </template>
           </el-form-item>

            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
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


import {list,create,update} from '@/api/banner/banner'
const { listUniversalLabelAndValue } = require('@/api/system/dict/type')
import {getFileMd5,checkMd5,upload} from '@/api/oos'

export default {
  name: "banner-list",

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
      bannerList: [],
      // 弹出层标题
      title: "",

      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      banner_status_options: [],
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
        title: undefined,
        between: undefined
      },

      rules: {
        title:[{
          required: true,
          message: '请输入标题',
          trigger: 'blur'
        }],
        target_url:[{
          required : true,
          message: '请输入活动地址',
          trigger: 'blur'
        },{
          pattern:  /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/,
          message: '请输入有效的活动地址',
          trigger: 'blur'
        }],
        sort: [{
          required : true,
          message: '请输入优先级',
          trigger: 'blur'
        }],
        banner_status: [{
          required : true,
          message: '请选择状态',
          trigger: 'blur'
        }],
        image_url: [{
          required : true,
          message: '请选择图片',
          trigger: 'blur'
        }]
      }

    };
  },
  watch: {

  },
  created() {
    this.getList();

    this.getBannerStatusList();

  },
  methods: {

    // 查看轮播图对应的活动地址
    clickTarget(url){
      window.open(url,'_blank')
    },

    beforeUpload(file) {
      if (file.type.indexOf("image/") === -1) {
        this.msgError("文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。");
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);

      }

      console.log("上传之前")
    },
    //覆盖默认的上传行为
    requestUpload(){

    },

    uploadImage(file){
      let f = file.file
      console.log("开始上传",file)
        getFileMd5(f, md5 => {
          checkMd5(md5).then(response => {
            if (response.data.length > 0) {
              this.form.image_url = response.data;
            } else {
              upload(f).then(response => {
                this.form.image_url = response.data;
              })
            }
          })
        })


    },

    statusFormat(row, column) {
      return this.selectDictLabel(this.banner_status_options, row.banner_status);
    },

    /** 查询轮播图列表 */
    getList() {
      this.loading = true;
      list(this.queryParams).then(response => {
          console.log("轮播图数据",response.list)
          this.bannerList = response.list;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    getBannerStatusList(){
      listUniversalLabelAndValue("status").then(resp => {
          this.banner_status_options = resp.data;
      })
    },


    // 状态修改
    handleStatusChange(row) {
      console.log("状态：：：：：",row.employees_status)
      let text = row.employees_status === 1 ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.name + '"用户吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeUserStatus(row.employees_number, row.employees_status);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.employees_status = row.employees_status === 1 ? "1" : "0";
        });
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
        title: undefined,
        image_url: undefined,
        target_url: undefined,
        remark: undefined,
        banner_status: undefined
      };

    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
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
      this.title = "添加轮播图";


    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeSelect();
      this.getUserGenderOption();

      // getUser(userId).then(response => {
      //   this.form = response.data;
      //   this.postOptions = response.posts;
      //   this.roleOptions = response.roles;
      //   this.form.postIds = response.postIds;
      //   this.form.roleIds = response.roleIds;
      //   this.open = true;
      //
      //   this.form.password = "";
      // });
      this.drawer = true;
      this.title = "修改用户";
      this.form.username = row.name;
      this.form.employees_number = row.employees_number;
      this.form.phone_number = row.phone_number;
      this.form.email = row.email;
      this.form.status = row.employees_status.toString();


    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$prompt('请输入"' + row.userName + '"的新密码', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
          resetUserPwd(row.userId, value).then(response => {
            this.msgSuccess("修改成功，新密码是：" + value);
          });
        }).catch(() => {});
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
            if (this.form.id === undefined){
              create(this.form).then(response => {
                  if (response.success){
                    this.drawer = false;
                    this.msgSuccess("创建轮播图成功")

                  }
              })
            }
        }

        this.getList();
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
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/user/export', {
        ...this.queryParams
      }, `user_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('system/user/importTemplate', {
        ...this.queryParams
      }, `user_${new Date().getTime()}.xlsx`)
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
