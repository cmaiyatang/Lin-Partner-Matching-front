<template>
  <van-nav-bar
      :title="title"
      left-text="返回"
      right-text="按钮"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight">
    <template #right>
      <van-icon name="search" size="18"/>
    </template>
  </van-nav-bar>

  <!--  中间内容-->
  <div id="content">
    <router-view/>
  </div>
  <!--  底部导航栏-->
  <div>
    <van-tabbar route>
      <van-tabbar-item to="/" icon="home-o" name="Index">主页</van-tabbar-item>
      <van-tabbar-item to="/friend" icon="chat-o" name="chat">伙伴</van-tabbar-item>
      <!--    <van-tabbar-item :to="/teamChat" icon="friends-o" name="teamChat">队伍聊天室</van-tabbar-item>-->
      <!--     使用 router-link 包裹 van-tabbar-item，并通过 :to 属性传递路由路径和参数 -->
      <!--      <router-link :to="{ path: '/teamChat', query: { isTeamChatPage: 'true' } }">-->
      <!--        <van-tabbar-item  icon="friends-o" name="teamChat">队伍聊天室</van-tabbar-item>-->
      <!--      </router-link>-->
      <van-tabbar-item :to="{ path: '/teamChat', query: { isTeamChatPage: 'true' } }" icon="friends-o" name="teamChat">
        队伍聊天室
      </van-tabbar-item>
      <van-tabbar-item to="/team" icon="flag-o" name="Team">队伍</van-tabbar-item>
      <van-tabbar-item to="/user" icon="user-o" name="User">个人</van-tabbar-item>

    </van-tabbar>
  </div>
</template>
<script setup lang="ts">
import {useRouter} from 'vue-router'
import {ref} from "vue";
import routes from "../config/router.ts";

const router = useRouter()


// const onChange = (index: any) => showToast(`标签 ${index}`);

const onClickLeft = () => router.back()
const onClickRight = () => router.push('/search')

//页面标题
const DEFAULT_TITLE = '伙伴匹配'
const title = ref(DEFAULT_TITLE)

/**
 * 根据路由切换标题
 */
router.beforeEach((to, from) => {
  const toPath = to.path
  const route = routes.find((route) => {
    return toPath == route.path
  })
  title.value = route?.title ?? DEFAULT_TITLE
})


</script>

<style scoped>
#content {
  padding-bottom: 50px;
}
</style>
