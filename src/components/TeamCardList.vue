<template>
  <!--      队伍头像默认为队长的头像-->
  <van-card
      v-for="team in props.teamList"
      :desc="team.description"
      :title="`${team.teamName}`"
      :thumb="cuteCat"
      style="padding: 10px"
  >
    <template #tags>
      <van-tag plain type="danger" style="margin-right: 8px; margin-top: 8px">
        {{
          teamStatusEnum[team.status]
        }}
      </van-tag>
    </template>
    <template #bottom>
      <div>
        {{ '队伍人数' + team.hasJoinNum + '/' + team.maxNum }}
      </div>
      <div v-if="team.expireTime">
        {{ '过期时间' + team.expireTime }}
      </div>
      <div>
        {{ '创建时间' + team.createTime }}
      </div>
    </template>
    <template #footer>
      <div v-if="$route.query.isTeamChatPage !== 'true'">
        <van-button
            v-if="(team.userId !== currentUser?.id) && !team.hasJoin"
            size="mini"
            plain type="primary"
            @click="doPreJoinTeam(team)">加入队伍
        </van-button>
        <van-button
            v-if="team.userId === currentUser?.id"
            size="mini"
            plain type="primary"
            @click="doUpdateTeam(team.id)">编辑队伍信息
        </van-button>
        <van-button
            v-if="team.userId === currentUser?.id"
            size="mini"
            plain type="danger"
            @click="cleanTeam(team.id)">解散队伍
        </van-button>
        <van-button
            v-if="(team.userId !== currentUser?.id) && team.hasJoin"
            size="mini"
            plain type="danger"
            @click="quitTeam(team)">退出队伍
        </van-button>
      </div>
      <van-button
          v-if="$route.query.isTeamChatPage === 'true'"
          size="mini"
          plain type="primary"
          @click="joinTeamChatRoom(team.id,team.teamName)">交流病情
      </van-button>
    </template>
  </van-card>
  <van-dialog v-model:show="joinSecretTeam" title="该小队已加密~" show-cancel-button
              @confirm="doJoinTeam"
              @cancel="cancelJoin">

    <van-cell-group inset>
      <van-field v-model="password" placeholder="请输入密码"/>
    </van-cell-group>
  </van-dialog>
</template>

<script setup lang="ts">
import {Team} from '../model/Team'
import cuteCat from '../assets/pictures/不是哥们.jpg'
import {teamStatusEnum} from "../common/TeamStatusEnum.ts";
import myAxios from "../plugins/myAxios.ts";
import {showFailToast, showSuccessToast} from "vant";
import getCurrentUser from "../common/getCurrentUser.ts";
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter()

interface teamCardListProps {
  teamList: Team[];
}

const props = withDefaults(defineProps<teamCardListProps>(), {
  teamList: [] as Team[]
})

//加入加密的队伍
const joinSecretTeam = ref(false)
const joinTeamId = ref(0)
const password = ref()

//在加入队伍之前，判断是否为加密队伍
const doPreJoinTeam = (team) => {
  joinTeamId.value = team.id
  if (team.status === 0) {
    //不是加密队伍
    doJoinTeam()
  } else {
    //加密队伍 显示输入密码框
    joinSecretTeam.value = true
  }
}

const doJoinTeam = async () => {
  const res = await myAxios.post('/team/join', {
    teamId: joinTeamId.value,
    password: password.value
  })
  if (res.code === 0) {
    showSuccessToast('加入队伍成功')
  } else {
    showFailToast('加入队伍失败' + (res.description ? `, ${res.description}` : ''))
  }
  cancelJoin()
}

const cancelJoin = () => {
  joinTeamId.value = 0
  password.value = ''
}


//获得当前登录用户
const currentUser = ref({})
onMounted(async () => {
  currentUser.value = await getCurrentUser()
})


//更新队伍信息
const doUpdateTeam = async (id) => {
  //跳转到队伍更新页面
  router.push({
    path: '/team/update',
    query: {
      id
    }
  })
}


//解散队伍
const cleanTeam = async (teamId) => {
  const res = await myAxios.post('/team/delete', {
    id: teamId
  })
  if (res.code === 0) {
    showSuccessToast('解散队伍成功')

  } else {
    showFailToast('解散队伍失败' + (res.description ? `, ${res.description}` : ''))
  }
}


//退出队伍
const quitTeam = async (team) => {
  const res = await myAxios.post('/team/quit', {
    id: team.value.id
  })
  if (res.code === 0) {
    showSuccessToast('退出队伍成功')

  } else {
    showFailToast('退出队伍失败' + (res.description ? `, ${res.description}` : ''))
  }
}

//加入队伍聊天室

const joinTeamChatRoom = (teamId:any, teamName:any) => {
  router.push({
    path: "/chat",
    query: {
      teamId: teamId,
      teamName,
      chatType:1
    }
  })
}


</script>


<style scoped>
</style>