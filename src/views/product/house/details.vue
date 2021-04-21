<template>

  <div class="app-container">

    <div >



      <el-row>
        <el-form
          ref="form"
          :model="houseDetails">

          <el-row>
            <el-divider><span style="font-weight: bolder">基础信息</span></el-divider>
          </el-row>

          <el-row>
            <el-col :span="14" offset="5">
              <el-form-item label="标题" prop="title">{{houseDetails.title}}</el-form-item>
            </el-col>

            <el-col :span="7" offset="5">
              <el-form-item label="租金" prop="rent" style="color: #C03639; font-weight: bolder">￥ {{houseDetails.rent}}</el-form-item>
            </el-col>

            <el-col :span="7" offset="5">
              <el-form-item label="租赁方式" prop="rental_mode" style=" font-weight: bolder"> {{houseDetails.rental_mode}}</el-form-item>
            </el-col>

            <el-col :span="7" offset="5">
              <el-form-item label="支付方式" prop="payment_method" style=" font-weight: bolder"> {{houseDetails.payment_method}}</el-form-item>
            </el-col>

            <el-col :span="7" offset="5">
              <el-form-item label="房屋户型" prop="house_type" style=" font-weight: bolder"> {{houseDetails.house_type}}</el-form-item>
            </el-col>

            <el-col :span="7" offset="5">
              <el-form-item label="建筑面积" prop="covered_area" style=" font-weight: bolder"> {{houseDetails.covered_area}}</el-form-item>
            </el-col>

            <el-col :span="7" offset="5">
              <el-form-item label="使用面积" prop="use_area" style=" font-weight: bolder"> {{houseDetails.use_area}}</el-form-item>
            </el-col>

            <el-col :span="7" offset="5">
              <el-form-item label="楼层" prop="floors" style=" font-weight: bolder"> {{houseDetails.floors}}</el-form-item>
            </el-col>

            <el-col :span="7" offset="5">
              <el-form-item label="朝向" prop="house_orientation" style=" font-weight: bolder"> {{houseDetails.house_orientation}}</el-form-item>
            </el-col>

            <el-col :span="7" offset="5">
              <el-form-item label="装修类型" prop="house_decoration_type" style=" font-weight: bolder"> {{houseDetails.house_decoration_type}}</el-form-item>
            </el-col>

            <el-col :span="7" offset="5">
              <el-form-item label="配套设施" prop="house_facilities" style=" font-weight: bolder"> {{houseDetails.house_facilities}}</el-form-item>
            </el-col>

            <el-col :span="7" offset="5">
              <el-form-item label="状态" prop="house_status" style=" font-weight: bolder"> {{houseDetails.house_status}}</el-form-item>
            </el-col>

            <el-col :span="7" offset="5">
              <el-form-item label="创建时间" prop="create_time" style=" font-weight: bolder"> {{houseDetails.create_time}}</el-form-item>
            </el-col>

            <el-col :span="14" offset="5">
              <el-form-item label="详细地址" prop="details_address" style=" font-weight: bolder"> {{houseDetails.details_address}}</el-form-item>
            </el-col>

            <el-col :span="14" offset="5">
              <el-form-item label="描述" prop="descs" style=" font-weight: bolder"> {{houseDetails.descs}}</el-form-item>
            </el-col>


          </el-row>

          <el-row>
            <el-divider><span style="font-weight: bolder">其他信息</span></el-divider>
          </el-row>

          <el-row>

            <el-col :span="7" offset="5">
              <el-form-item label="电费" prop="rent" >
                <span style="color: #C03639; font-weight: bolder">￥ {{houseDetails.electricity_price}} </span>/度
              </el-form-item>
            </el-col>

            <el-col :span="7" offset="5">
              <el-form-item label="水费" prop="rent" >
                <span style="color: #C03639; font-weight: bolder">￥ {{houseDetails.water_price}}</span> /吨
              </el-form-item>
            </el-col>

            <el-col :span="7" offset="5">
              <el-form-item label="是否有热水" prop="rent" >
                <span v-if="houseDetails.hot_water===true"
                      style="font-weight: bolder">有</span>
                <span v-else
                      style="font-weight: bolder">没有</span>
                </el-form-item>
            </el-col>

            <el-col :span="7" offset="5">
              <el-form-item label="是否有厨房" prop="rent" >
                <span v-if="houseDetails.have_kitchen===true"
                      style="font-weight: bolder">有</span>
                <span v-else
                      style="font-weight: bolder">没有</span>
              </el-form-item>
            </el-col>

            <el-col :span="7" offset="5">
              <el-form-item label="是否有客厅" prop="rent" >
                <span v-if="houseDetails.have_living_root===true"
                      style="font-weight: bolder">有</span>
                <span v-else
                      style="font-weight: bolder">没有</span>
              </el-form-item>
            </el-col>

            <el-col :span="7" offset="5">
              <el-form-item label="是否有阳台" prop="rent" >
                <span v-if="houseDetails.have_balcony===true"
                      style="font-weight: bolder">有</span>
                <span v-else
                      style="font-weight: bolder">没有</span>
              </el-form-item>
            </el-col>

            <el-col :span="7" offset="5">
              <el-form-item label="是否有窗户" prop="rent" >
                <span v-if="houseDetails.have_window===true"
                      style="font-weight: bolder">有</span>
                <span v-else
                      style="font-weight: bolder">没有</span>
              </el-form-item>
            </el-col>

            <el-col :span="7" offset="5">
              <el-form-item label="是否有独立卫生间" prop="rent" >
                <span v-if="houseDetails.separate_toilet===true"
                      style="font-weight: bolder">有</span>
                <span v-else
                      style="font-weight: bolder">没有</span>
              </el-form-item>
            </el-col>

            <el-col :span="7" offset="5">
              <el-form-item label="是否支持拎包入住" prop="rent" >
                <span v-if="houseDetails.check_in_with_bags===true"
                      style="font-weight: bolder">有</span>
                <span v-else
                      style="font-weight: bolder">没有</span>
              </el-form-item>
            </el-col>

            <el-col :span="7" offset="5">
              <el-form-item label="是否有电梯" prop="rent" >
                <span v-if="houseDetails.have_elevator===true"
                      style="font-weight: bolder">有</span>
                <span v-else
                      style="font-weight: bolder">没有</span>
              </el-form-item>
            </el-col>

            <el-col :span="7" offset="5">
              <el-form-item label="是否有车位" prop="rent" >
                <span v-if="houseDetails.parking_space===true"
                      style="font-weight: bolder">有</span>
                <span v-else
                      style="font-weight: bolder">没有</span>
              </el-form-item>
            </el-col>

            <el-col :span="7" offset="5">
              <el-form-item label="性别限制" prop="rent" >
                <span v-if="houseDetails.gender_restrictions===true"
                      style="font-weight: bolder">有</span>
                <span v-else
                      style="font-weight: bolder">没有</span>
              </el-form-item>
            </el-col>

            <el-col :span="7" offset="5">
              <el-form-item label="空调" prop="rent" >
                <span v-if="houseDetails.it_air_conditioned===true"
                      style="font-weight: bolder">有</span>
                <span v-else
                      style="font-weight: bolder">没有</span>
              </el-form-item>
            </el-col>

            <el-col :span="7" offset="5">
              <el-form-item label="供暖" prop="rent" >
                <span v-if="houseDetails.whether_the_heating===true"
                      style="font-weight: bolder">有</span>
                <span v-else
                      style="font-weight: bolder">没有</span>
              </el-form-item>
            </el-col>


          </el-row>

          <el-row>
            <el-divider><span style="font-weight: bolder">审核材料</span></el-divider>
          </el-row>

          <el-row>
            <el-image v-for="item in this.houseDetails.house_resource_info_bean_list" :key="item" :src="item.file_url" lazy></el-image>
          </el-row>


        </el-form>
      </el-row>


    </div>
  </div>

</template>
<style scoped>

</style>

<script>
import {findDetailsByIdAndStatus} from '@/api/product/house/house'

export default {
  name: 'details',
  data() {
      return{
        loading: true,

        house_id: undefined,

        house_status: undefined,

        houseDetails:undefined

  }
  },
  created() {
    this.house_id = this.$route.params && this.$route.params.house_id;
    this.house_status = this.$route.params && this.$route.params.houseStatus
    this.getHouseDetails();
  },

  methods: {

      getHouseDetails(){
        return findDetailsByIdAndStatus(this.house_id,this.house_status).then(resp => {
          this.houseDetails = resp.data
          this.loading = false
        })
      }
  }
}
</script>


