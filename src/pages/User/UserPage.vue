//如果user为空不显示
<template>
  <template v-if="user">
    <van-cell title="头像">
      <img :src="user.avatarUrl" style="height: 48px" alt="头像">
    </van-cell>
    <van-cell title="昵称" :value="user.username"/>
    <van-cell title="账号" :value="user.userAccount"/>
    <van-cell title="个性签名" :value="user.profile"/>

    <van-cell-group inset>
      <van-cell title="我的小队" value="瞧一瞧" style="background-color: #feff"  @click="toMyTeam"/>
      <van-cell title="我加入的队伍" value="看一看" style="background-color: #feff"  @click="toMyJoinTeam"/>
    </van-cell-group>

    <van-cell title="编辑资料" is-link @click="toEdit(user)"/>
    <!--    <van-cell title="手机号" is-link :value="user.phone" @click="toEdit(user)"/>-->
    <!--    <van-cell title="邮箱" is-link :value="user.email" @click="toEdit(user)"/>-->
    <!--    <van-cell title="星球编号" :value="user.planetCode"/>-->
    <!--    <van-cell title="注册时间" :value="user.createTime"/>-->
    <van-button type="danger" size="small" style="margin:20px 16px;float: right" @click="logout">退出登录</van-button>
  </template>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {showFailToast, showSuccessToast} from "vant";
import getCurrentUser from "../../common/getCurrentUser.ts";
import myAxios from "../../plugins/myAxios.ts";

const router = useRouter()
const user = ref()

//获取当前登录用户
onMounted(async () => {
  // const res = await myAxios.get('/user/currentUser')
  const res = await getCurrentUser()
  console.log(res)
  if (res) {
    user.value = res;
    // showSuccessToast('获取用户信息成功')
  } else {
    showFailToast('获取用户信息失败')
  }
})


const toEdit = (val) => {
  const editUser = JSON.stringify(val)
  router.push({
    path: 'user/edit',
    query: {
      editUser
    }
  })
}

//跳转到我的小队界面
const toMyTeam = () => {
  router.push({
    path: '/team/myTeam'
  })
}


//跳转到我加入的小队界面
const toMyJoinTeam = () => {
  router.push({
    path: '/team/myJoinTeam'
  })
}

//用户退出登录
const logout = async () => {
  const res = await myAxios.post('/user/logout')
  if (res?.code === 0) {
    showSuccessToast("退出登录成功")
    router.replace('/user/login')
  } else {
    showFailToast("注销失败，请重试")
  }
}

</script>

<style scoped>

</style>