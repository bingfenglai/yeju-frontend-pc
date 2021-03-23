<template>
<div class="app-container">

      <el-form v-show="showSearch" ref="queryFrom" :inline="true" :model="queryParams"  size="medium" label-width="100px">
<!--        <el-col :span="8">-->

          <el-form-item label="出租方式" prop="rental_mode">
            <el-select
              v-model="queryParams.rental_mode"
              placeholder="请选择下拉选择"  clearable
                       :style="{width: '100%'}">
              <el-option
                v-for="dict in this.rental_mode_options"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
<!--        </el-col>-->
<!--        <el-col :span="8">-->
          <el-form-item label="创建时间" prop="date_range">
            <el-date-picker type="daterange" v-model="queryParams.date_range" format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd" :style="{width: '100%'}" start-placeholder="开始日期"
                            end-placeholder="结束日期" range-separator="-" clearable></el-date-picker>
          </el-form-item>
<!--        </el-col>-->
<!--        <el-col :span="8">-->
          <el-form-item label="房源状态" prop="house_status">
            <el-select v-model="queryParams.house_status" placeholder="请选择房源状态" clearable
                       :style="{width: '100%'}">
              <el-option
                v-for="dict in house_status"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
<!--        </el-col>-->
<!--        <el-col :span="12" offset="19">-->
          <el-form-item>
            <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
<!--        </el-col>-->
      </el-form>

  <el-row :gutter="10" class="mb8">


    <el-col :span="1.5">
      <el-button
        type="warning"
        icon="el-icon-download"
        size="mini"
        @click="handleExport"
        v-hasPermi="['product:house:export']"
      >导出</el-button>
    </el-col>

    <right-toolbar :showSearch.sync="showSearch" @queryTable="getHouseList"></right-toolbar>
  </el-row>


  <el-table
    :data="houseList"
    border
    v-loading="loading"
    @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" align="center" />
    <el-table-column
      fixed
      prop="house_id"
      label="房源编号"
      width="150"
      align="center">
    </el-table-column>
    <el-table-column
      prop="title"
      label="标题"
      :show-overflow-tooltip="true"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      prop="rent"
      label="租金（元/月）"
      width="120"
      align="center">
    </el-table-column>

    <el-table-column
      prop="rental_mode"
      label="出租方式"
      width="120"
      :formatter="rentalModeFormat"
      align="center">
    </el-table-column>

    <el-table-column
      prop="payment_method"
      label="支付方式"
      width="120"
      :formatter="paymentMethodFormat"
      align="center">
    </el-table-column>

    <el-table-column
      prop="house_status"
      label="状态"
      width="120"
      :formatter="statusFormat"
      align="center">
    </el-table-column>

    <el-table-column
      prop="create_time"
      label="创建时间"
      width="300"
      align="center">
    </el-table-column>

    <el-table-column

      label="操作"
      width="150"
       align="center">
      <template slot-scope="scope">

        <router-link :to="'/house/details/'+scope.row.house_id+'/'+scope.row.house_status" class="link-type">
          <el-button type="text" size="small"
                     v-hasPermi="['product:house:details']">详情</el-button>
        </router-link>
        &nbsp;
        <el-button type="text"
                   size="small"
                   v-hasPermi="['product:house:check']"
                    @click="handleCheck(scope.row)">审核</el-button>
      </template>
    </el-table-column>
  </el-table>

  <pagination
    v-show="total>0"
    :total="total"
    :page.sync="queryParams.currentPage"
    :limit.sync="queryParams.size"
    @pagination="getHouseList"
  />
</div>





</template>
<style>

.el-drawer__header span:focus {
  outline: 0;
}

</style>


<script>
import { findDetailsByIdAndStatus, findPage } from '@/api/product/house/house'
export default {
  name: 'index',
  data() {
    return{

      //选中的项集
      house_ids: [],

      shouDetails: '查看详情',
      // 显示搜索条件
      showSearch: true,

      houseList: [],
      queryParams:{
        currentPage: 1,
        size: 10,
        rental_mode: [],
        date_range: null,
        house_status: undefined,
      },
      // 遮罩层
      loading: true,

      house_status: [],

      rental_mode_options: [],

      payment_method: [],

      total: 0,

      single: true,
      multiple : false,

      houseDetails: undefined





  }
  },
  created() {
    this.getHouseList();
    this.getDicts("house_status").then(resp=>{
      this.house_status = resp.data
    })
    this.getDicts("rental_mode").then(resp=>{
      this.rental_mode_options = resp.data
    })
    this.getDicts("payment_method").then(resp => {
      this.payment_method =resp.data
    })
  },
  methods: {

    getHouseList(){

      findPage(this.queryParams.currentPage,this.queryParams.size).then(resp=>{
        this.houseList = resp.list
        this.total = resp.total
        this.loading  = false
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.house_ids = selection.map(item => item.house_id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },

    handleDelete(row) {
      const dictIds = row.house_id || this.house_ids;
      this.$confirm('是否确认删除字典编号为"' + dictIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        if (this.signal){

        }
      }).then(() => {
        this.getHouseList();
        this.msgSuccess("删除成功");
      })
    },

    statusFormat(row, column) {
      return this.selectDictLabel(this.house_status, row.house_status);
    },

    rentalModeFormat(row, column){
      return this.selectDictLabel(this.rental_mode_options,row.rental_mode)
    },
    paymentMethodFormat(row,column){
      return this.selectDictLabel(this.payment_method,row.payment_method)
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getHouseList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },

    resetForm(fromName){

    },

    handleCheck(row){
      findDetailsByIdAndStatus(row.house_id,row.house_status).then(response => {
          this.houseDetails = response.data;
      })
    }


  }

}



</script>


