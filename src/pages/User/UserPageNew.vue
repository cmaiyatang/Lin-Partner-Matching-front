<script setup lang="ts">
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";

import myAxios from "../../plugins/myAxios.ts";
import {Dialog, showSuccessToast, Toast} from "vant";
import getCurrentUser from "../../common/getCurrentUser.ts";
import {defaultPicture} from "../../common/defaultPicture.ts";


const user = ref();
// const showPasswordDialog = ref(false);
const VanDialog = Dialog.Component;
const router = useRouter();

onMounted(async () => {
  let currentUser = await getCurrentUser();
  if (currentUser) {
    if (currentUser.tags && currentUser.tags != '[]') {
      currentUser.tags = JSON.parse(currentUser.tags)
    } else {
      currentUser.tags = "此用户暂未设置标签";
    }
    user.value = currentUser
  }
})

const loginOut = async () => {
  const loginOut = await myAxios.post("/user/logout")
  sessionStorage.clear()
  if (loginOut) {
    showSuccessToast("退出成功")
    router.replace("/user/login").catch(e => console.log(e))
  }
}

const toEdit = (val) => {
  const editUser = JSON.stringify(val)
  router.push({
    path: 'user/edit',
    query: {
      editUser
    }
  })
}

// const logOutValue = () => {
//   showPasswordDialog.value = true;
// }
//
// const doQuitCancel = () => {
//   showPasswordDialog.value = false;
// }


</script>

<template>
  <template v-if="user">
    <div>
      <div style="padding-top: 5px"></div>
      <div class="center">
        <van-image
            round
            width="10rem"
            height="10rem"
            :src="user.avatarUrl ? user.avatarUrl :defaultPicture"
        />
      </div>
    </div>
    <van-cell icon="label-o" center>
      <template #title>
        <span>我的标签</span>
      </template>
      <template #value>
        <van-tag v-if="user.tags == '此用户暂未设置标签'" plain type="danger" style="margin-top: 8px">
          {{ user.tags }}
        </van-tag>
        <van-tag v-else="user.tags != '此用户暂未设置标签'" v-for="tag in user.tags" plain type="danger"
                 style="margin-right: 8px;margin-top: 8px">
          {{ tag }}
        </van-tag>
      </template>
    </van-cell>
    <van-cell title="昵称" :value="user?.username" icon="manager-o"/>
    <van-cell title="账号" :value="user?.userAccount" icon="user-circle-o"/>
    <van-cell title="我创建的队伍" is-link to="/team/myTeam"/>
    <van-cell title="我加入的队伍" is-link to="/team/myJoinTeam"/>
    <van-cell title="个性签名" :value="user.profile"/>
    <van-cell title="编辑信息" @click="toEdit(user)" icon="ellipsis"/>
    <van-space style="margin: 13px" direction="vertical" fill>
      <van-button type="primary" color="red" @click="loginOut" block>退出登录</van-button>
    </van-space>
    <!--    <van-space style="margin: 13px" direction="vertical" fill>-->
    <!--      <van-button type="primary" color="red" @click="logOutValue" block>退出登录</van-button>-->
    <!--    </van-space>-->
    <!--&lt;!&ndash;    是否注销&ndash;&gt;-->
    <!--    <van-dialog v-model:show="showPasswordDialog" title="是否确认退出登录" show-cancel-button @confirm="loginOut"-->
    <!--                @cancel="doQuitCancel">-->
    <!--    </van-dialog>-->
  </template>
</template>

<style scoped>
@import "../../assets/css/userPage.css";
@import "../../assets/css/public.css";
</style>
