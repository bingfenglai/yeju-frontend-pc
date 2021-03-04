<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="用户名" prop="name">
      <el-input v-model="user.name" />
    </el-form-item>
    <el-form-item label="手机号码" prop="phone_number">
      <el-input v-model="user.phone_number" maxlength="11" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="user.email" maxlength="50" />
    </el-form-item>
    <el-form-item label="性别">
<!--      <el-radio-group v-model="user.genderOptions">-->
<!--        <el-radio label="0">男</el-radio>-->
<!--        <el-radio label="1">女</el-radio>-->
<!--      </el-radio-group>-->

      <el-select v-model="user.gender" placeholder="-请选择-" clearable size="small">
        <el-option
          v-for="dict in genderOptions"
          :key="dict.value"
          :label="dict.label"
          :value="dict.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
      <el-button type="danger" size="mini" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUserProfile } from "@/api/system/user";

const { listUniversalLabelAndValue } = require('@/api/system/dict/type')

export default {
  props: {
    user: {
      type: Object
    },

  },
  data() {
    return {
      genderOptions:{},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" }
        ],
        email: [
          { required: true, message: "邮箱地址不能为空", trigger: "blur" },
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phone_number: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getGenderOption();
  },
  methods: {
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateUserProfile(this.user).then(response => {
            this.msgSuccess("修改成功");
          });
        }
      });
    },
    close() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({ path: "/index" });
    },
    getGenderOption(){
      listUniversalLabelAndValue("gender").then(response => {
        this.genderOptions = response.data;
      })
    }
  }
};
</script>
