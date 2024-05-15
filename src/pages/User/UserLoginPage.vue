<script setup lang="ts">
import {ref} from 'vue';
import myAxios from "../../plugins/myAxios.ts";
import {showFailToast, showSuccessToast} from "vant";
import {useRoute, useRouter} from "vue-router";

const router = useRouter()
const route = useRoute()

const userAccount = ref('');
const userPassword = ref('');

const onSubmit = async () => {
  const res = await myAxios.post('/user/login',{
    userAccount:userAccount.value,
    userPassword:userPassword.value
  })
  console.log(res,'用户登录')
  if(res.code == 0 && res.data){
    showSuccessToast('登录成功')
    window.location.href = route.query?.redirect as string ?? '/'
  }else{
    showFailToast('登录失败')
  }

};


</script>

<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset style="padding: 10px">
      <van-field
          v-model="userAccount"
          name="用户名"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
          v-model="userPassword"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
      />
    </van-cell-group>
    <div style="margin: 20px;">
      <van-button round block type="primary" native-type="submit">
        登录
      </van-button>
    </div>
  </van-form>

</template>

<style scoped>

</style>