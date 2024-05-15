<template>
  <div id="myTeamPage">
    <team-card-list :team-list="teamList"/>
    <van-empty v-if="!teamList || teamList.length<1" description="您还未有小队，尝试建立你的第一个小队吧！"/>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import myAxios from '../../plugins/myAxios.ts'
import {showFailToast,} from "vant";
import {useRouter} from "vue-router";
import TeamCardList from "../../components/TeamCardList.vue";

const router = useRouter()

//队伍List
const teamList = ref([]);

const getMyTeam = async ()=>{
  const res = await myAxios.get('/team/myTeam')

  if(res?.code === 0){
    teamList.value = res.data
  }else {
    showFailToast("获取队伍失败，请刷新")
  }
}

onMounted(async () => {
  await getMyTeam()
})
console.log("teamList", teamList)

</script>

<style scoped>

</style>