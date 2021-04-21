<template>

<div class="app-container">

<!--  查询表单开始-->
  <div>
  <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
    <el-form-item label="社区名称" prop="name">
      <el-input
        v-model="queryParams.name"
        placeholder="请输入社区名称"
        clearable
        size="small"
        @keyup.enter.native="handleQuery"
      />
    </el-form-item>
    <el-form-item label="社区地址" prop="detailed_address">
      <el-input
        v-model="queryParams.detailed_address"
        placeholder="社区地址"
        clearable
        size="small"
        @keyup.enter.native="handleQuery"
      />
    </el-form-item>

    <el-form-item label="添加时间" prop="date_range">
      <el-date-picker type="daterange" v-model="queryParams.between" format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd" :style="{width: '100%'}" start-placeholder="开始日期"
                      end-placeholder="结束日期" range-separator="-" clearable></el-date-picker>
    </el-form-item>

    <el-form-item>
      <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
    </el-form-item>
  </el-form>

  <el-row :gutter="10" class="mb8">


    <el-col :span="1.5">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['basedata:community:create']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          :disabled="multiple"
          icon="el-icon-plus"
          size="mini"
          @click="handleDeleteBatch"
          v-hasPermi="['basedata:community:removeBatch']"
        >批量删除</el-button>
      </el-col>
      <el-button
        type="warning"
        icon="el-icon-plus"
        size="mini"
        @click="handleExport"
        v-hasPermi="['basedata:community:export']"
      >导出</el-button>
    </el-col>


    <right-toolbar :showSearch.sync="showSearch" @queryTable="handleQuery"></right-toolbar>
  </el-row>

  </div>

<!--  表格开始-->

    <el-table
      v-loading="loading"
      :data="list"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="name" label="社区名称" align="center" :show-overflow-tooltip="true" ></el-table-column>
      <el-table-column prop="address_info.area_name" label="省份" align="center" ></el-table-column>
      <el-table-column prop="address_info.city_name" label="市" align="center" ></el-table-column>
      <el-table-column prop="address_info.area_name" label="县(区)" align="center" ></el-table-column>

      <el-table-column prop="detailed_address" align="center" label="详细地址" :show-overflow-tooltip="true"></el-table-column>

      <el-table-column label="创建时间" align="center" prop="create_time" />
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
                     v-hasPermi="['basedata:community:edit']"
          >修改</el-button>

          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basedata:community:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

  <pagination
    v-show="total>0"
    :total="total"
    :page.sync="queryParams.pageNum"
    :limit.sync="queryParams.pageSize"
    @pagination="getCommunityList"
  />


  <!--  抽屉开始-->

  <el-drawer
    :title="title"
    :visible.sync="drawer"
    :before-close="cancel"

  >
    <div class="demo-drawer__content" >
      <el-form ref="form" :model="form" :rules="rules" size="medium" label-width="100px">
        <el-col :span="24">
          <el-form-item label="社区名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入社区名称" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="省份" prop="province_id">
            <el-select filterable
                       v-model="form.province_id"
                       placeholder="请选择省份"
                       clearable
                       @change="handleProvinceOptionChange"
                       :style="{width: '100%'}">
              <el-option v-for="(item, index) in province_Options" :key="index" :label="item.label"
                         :value="item.value" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="市" prop="city_id">
            <el-select :disabled="cityOptionsDisabled"
                       filterable
                       @change="handleCityOptionChange"
                       v-model="form.city_id"
                       placeholder="请选择市"
                       clearable :style="{width: '100%'}">
              <el-option v-for="(item, index) in city_Options" :key="index" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="县(区)" prop="area_id" v-if="formAreaSelectShow">
            <el-select :disabled="areaOptionsDisabled"
                       filterable
                       v-model="form.area_id"
                       placeholder="请选择县(区)"
                       clearable
                       :style="{width: '100%'}">
              <el-option v-for="(item, index) in area_Options" :key="index" :label="item.label"
                         :value="item.value" ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="详细地址" prop="detailed_address">
            <el-input v-model="form.detailed_address" placeholder="请输入详细地址" clearable
                      :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入备注"
                      :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>


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

import {getList,addCommunity,updateCommunity,deleteCommunityById,deleteBatchCommunityByIds} from '@/api/community/community'
import {getDistrictOptionListByParentId,getDistrictOptionListById} from '@/api/district/district'
const { listUniversalLabelAndValue } = require('@/api/system/dict/type')

export default {
  name: 'community',

  data(){
    return {
      title: undefined,
      drawer: false,
      loading: true,
      multiple: true,
      queryParams:{
        currentPage: 1,
        size: 10,
      },
      total: 0,
      typeOptions: [],
      currentListAreaOptions: [],
      showSearch: true,
      List:[],
      statusOptions: [],
      TypeOptions: [],
      form:{
        name:             undefined,
        province_id:      undefined,
        city_id:          undefined,
        area_id:          undefined,
        detailed_address: undefined,
        remark:           undefined,
        community_id: undefined
      },
      formAreaSelectShow: true,
      province_Options: [],
      city_Options: [],
      area_Options: [],
      cityOptionsDisabled : true,
      areaOptionsDisabled: true,
      rules: {
        name: [{
          required: true,
          message: '请输入社区名称',
          trigger: 'blur'
        }],
        province_id: [{
          required: true,
          message: '请选择省份',
          trigger: 'change'
        }],
        city_id: [{
          required: true,
          message: '请选择市',
          trigger: 'change'
        }],
        area_id: [{
          required: true,
          message: '请选择县(区)',
          trigger: 'change'
        }],
        detailed_address: [{
          required: true,
          message: '请输入详细地址',
          trigger: 'blur'
        }],

      },

    }
  },
  created() {
    this.getCommunityList()
  },
  methods:{

    areaFormat(row,column){
      return this.selectDictLabel(this.currentListAreaOptions,row.area_id);
    },

    getAreaLabel(){
      console.log("chaxun label")
      for (const community of this.List) {
        console.log("sssss")
        getDistrictOptionListById(community.area_id).then(resp=>{
            this.currentListAreaOptions.push(resp.data)
        })
      }

      for(let i = 0;i<this.List.length;i++){
        console.log("qqq")

      }
    },

    handleProvinceOptionChange(selection){
      this.form.city_id = undefined;
      this.form.area_id = undefined;
      getDistrictOptionListByParentId(selection).then(resp=>{
        this.city_Options = resp.data;
        this.cityOptionsDisabled = false;
      })
    },

    handleCityOptionChange(value){
      this.form.area_id=  undefined
      getDistrictOptionListByParentId(value).then(resp=>{
        this.area_Options = resp.data;
        if (resp.data===undefined||resp.data==null||resp.data.length===0){
          this.formAreaSelectShow = false;
        }else {
          this.areaOptionsDisabled = false;
        }
      })
    },

    handleSelectionChange(selection){
      this.ids = selection.map(item => item.community_id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },

    handleDeleteBatch(){

    },


    resetForm(){
      this.form.name = undefined
      this.form.province_id = undefined
      this.form.city_id = undefined
      this.form.area_id = undefined
      this.form.detailed_address = undefined
      this.form.remark = undefined
      this.form.community_id = undefined

      this.cityOptionsDisabled = true
      this.areaOptionsDisabled = true
      this.formAreaSelectShow = true
    },

    submitForm(){
      if(this.form.community_id===undefined){
        addCommunity(this.form).then(resp=>{
          if(resp.success){
            this.msgSuccess("添加社区成功");
          }
          this.getCommunityList()
        })
      }else {

      }
    },

    cancel(){
      this.drawer = false;
      this.resetForm();
    },

    getCommunityList(){
      this.loading = true
      getList(this.queryParams).then(resp=>{
        this.list = resp.list
        this.total = resp.total;
        this.getAreaLabel();
        this.loading = false
      })
    },

    //条件查询处理方法
    handleQuery(){

    },

    //条件查询 查询条件重置方法
    resetQuery(){


    },

    //新增下级地域
    handleAdd(row){
      this.resetForm();
      this.title  = "添加社区";
      this.drawer = true
      this.getProvinceList();
    },

    getProvinceList(){
      getDistrictOptionListByParentId(1).then(resp=>{
        this.province_Options = resp.data;
      })
    },

    handleExport(){

    },

    handleUpdate(){

    },

    handleDelete(row){
      deleteCommunityById(row.community_id).then(resp=>{
        if(resp.success){
          this.msgSuccess("删除成功")
        }
        this.getCommunityList();
      })
    },

  }
}
</script>

<style scoped>

</style>
