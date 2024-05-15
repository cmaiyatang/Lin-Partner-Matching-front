<template>
  <van-skeleton title avatar :row="3" :loading="props.loading" v-for="user in props.userList">
    <van-card
        v-if="curUser.id !== user.id"
        :desc="user.profile"
        :title="user.username"
        :thumb="user.avatarUrl"
        style="padding: 10px"
    >
      <template #tags>
        <van-tag plain type="danger" v-for="tag in user.tags" style="margin: 20px 5px ">
          {{ tag }}
        </van-tag>
      </template>
      <template #footer>
        <van-button size="small" @click="toChatPage(user.id,user.username,0)">联系我</van-button>
      </template>
    </van-card>
  </van-skeleton>
</template>

<script setup lang="ts">
import {User} from '../model/User'
import {useRouter} from "vue-router";
import getCurrentUser from "../common/getCurrentUser.ts";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios.ts";

const router = useRouter()

interface UserCardListProps {
  loading: boolean;
  userList: User[];
}

const props = withDefaults(defineProps<UserCardListProps>(), {
  loading: true,
  userList: [] as User[]
})

console.log('userList', props.userList)

let curUser = ref()

onMounted(async () => {
  curUser = await getCurrentUser();

})


const toChatPage = (id:any,friendName:any,chatType = 0) => {

  router.push({
    path: '/chat',
    query: {
      id,
      friendName,
      chatType
    }
  })
}


</script>


<style scoped>
</style>