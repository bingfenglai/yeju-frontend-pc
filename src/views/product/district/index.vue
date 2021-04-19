<template>

<div class="app-container">

<!--  查询表单开始-->
  <div>
  <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
    <el-form-item label="地域名称" prop="name">
      <el-input
        v-model="queryParams.name"
        placeholder="请输入地域名称"
        clearable
        size="small"
        @keyup.enter.native="handleQuery"
      />
    </el-form-item>
    <el-form-item label="地域类型" prop="type">
      <el-select v-model="queryParams.type" placeholder="地域类型" clearable size="small">
        <el-option
          v-for="dict in this.districtTypeOptions"
          :key="dict.value"
          :label="dict.label"
          :value="dict.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
    </el-form-item>
  </el-form>

  <el-row :gutter="10" class="mb8">


    <el-col :span="1.5">
      <el-button
        type="warning"
        icon="el-icon-plus"
        size="mini"
        @click="handleExport"
        v-hasPermi="['basedata:district:export']"
      >导出</el-button>
    </el-col>

    <right-toolbar :showSearch.sync="showSearch" @queryTable="handleQuery"></right-toolbar>
  </el-row>

  </div>

<!--  表格开始-->

    <el-table
      v-loading="loading"
      :lazy=true
      :load="handleLoadChildNode"
      :data="districtList"
      row-key="district_id"
      :tree-props="{children: 'children_list', hasChildren: 'has_children'}"
    >
      <el-table-column prop="name" label="地域名称" align="center" :show-overflow-tooltip="true" ></el-table-column>
      <el-table-column prop="type" label="地域类型" align="center" :formatter="typesFormat"></el-table-column>

      <el-table-column prop="hierarchy" align="center" label="所处层级" :formatter="hierarchyFormat"></el-table-column>

      <el-table-column label="创建时间" align="center" prop="create_time" />
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
                     v-hasPermi="['basedata:district:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAddSameLevel(scope.row)"
            v-hasPermi="['basedata:district:add']"
          >新增同级</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAddSubordinate(scope.row)"
            v-hasPermi="['basedata:district:add']"
          >新增下级</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basedata:district:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>


  <!--  抽屉开始-->

  <el-drawer
    :title="title"
    :visible.sync="drawer"
    :before-close="cancel"

  >
    <div class="demo-drawer__content" >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="地域名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入地域名称" clearable :style="{width: '100%'}">
          </el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注"
                    :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
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
import Treeselect from "@riophae/vue-treeselect"
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {getDirectChildNodeById,queryDistrictTree,queryDistrictTree2,createDistrict,updateDistrictById,deleteDistrictById} from '@/api/district/district'


const { listUniversalLabelAndValue } = require('@/api/system/dict/type')

export default {
  name: 'district',
  components: { Treeselect },
  data(){
    return {
      title: undefined,
      drawer: false,
      loading: true,
      queryParams:{
        name: undefined,
        type: undefined,
      },
      typeOptions: [],
      showSearch: true,
      districtList:[],
      districtHierarchyOptions: [],
      districtTypeOptions: [],
      form:{
        name: undefined,
        type: undefined,
        hierarchy: undefined,
        parent_id: undefined,
        district_id: undefined,
        remark: undefined
      },
      rules: {
        name: [{
          required: true,
          message: '请输入地域名称',
          trigger: 'blur'
        }],
        remark: [],
      },
    }
  },
  created() {
    this.getDistrictHierarchy();
    this.getDistrictType();
    this.getDistrictTree();
  },
  methods:{

    handleLoadChildNode(row,treeNode, resolve){
      setTimeout(() => {
        getDirectChildNodeById(row.district_id).then(resp=>{
          row.children_list = this.handleTree(resp.data,"district_id");
          resolve(row.children_list)
        })

      }, 1000);

    },

    resetForm(){
      this.form.parent_id = undefined;
      this.form.hierarchy = undefined;
      this.form.type = undefined;
      this.form.name = undefined;
      this.form.remark = undefined;
      this.form.district_id = undefined;
    },

    submitForm(){
      if(this.form.district_id===undefined){
        createDistrict(this.form).then(resp=>{
          if (resp.success){
            this.msgSuccess("新增地域成功");
          }

          this.drawer = false;
          this.resetForm();
          this.getDistrictTree();
        })
      }else {
        updateDistrictById(this.form).then(resp => {
          if (resp.success){
            this.msgSuccess("修改地域成功");
          }
          this.drawer = false;
          this.resetForm();
          this.getDistrictTree();

        })
      }
    },

    cancel(){
      this.drawer = false;
      this.resetForm();
    },

    typesFormat(row){
      return this.selectDictLabel(this.districtTypeOptions, row.type);
    },

    hierarchyFormat(row){
      return this.selectDictLabel(this.districtHierarchyOptions,row.hierarchy)
    },

    getDistrictType(){
      listUniversalLabelAndValue("district_type").then(resp=>{
        this.districtTypeOptions = resp.data;
      })
    },

    getDistrictHierarchy(){
      listUniversalLabelAndValue("district_hierarchy").then(resp=>{
        this.districtHierarchyOptions = resp.data;
      })
    },

    getDistrictTree(){

      // queryDistrictTree2().then(resp=>{
      //   this.districtList = this.handleTree(resp.data,"district_id")
      //   this.loading = false
      // })

      getDirectChildNodeById(0).then(resp=>{
        this.districtList = this.handleTree(resp.data,"district_id");
        this.loading = false
      })



    },

    //条件查询处理方法
    handleQuery(){
        console.log(this.queryParams)
        queryDistrictTree(this.queryParams).then(resp=>{
          this.loading = true
          this.districtList = this.handleTree(resp.data,"district_id");
          this.loading = false;
          this.resetQuery();
        })



    },

    //条件查询 查询条件重置方法
    resetQuery(){
      this.queryParams.name = undefined;
      this.queryParams.type = undefined;

    },

    //新增下级地域
    handleAddSubordinate(row){
      this.drawer = true;
      this.title = '新增下级地域';
      this.form.parent_id = row.district_id;
      this.form.hierarchy = row.hierarchy + 1;
      this.form.type = row.type + 1;
    },

    //新增同级地域
    handleAddSameLevel(row){
      this.drawer = true;
      this.title = '新增同级地域';
      this.form.parent_id = row.parent_id;
      this.form.hierarchy = row.hierarchy;
      this.form.type = row.type;
    },

    handleExport(){

    },

    handleUpdate(){

    },

    handleDelete(row){

      // deleteDistrictById(row.district_id).then(resp=>{
      //
      // })
    },

  }
}
</script>

<style scoped>

</style>
