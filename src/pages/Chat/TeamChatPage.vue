<template>
  <div id="myJoinPage">
    <team-card-list :team-list="teamList"/>
    <van-empty v-if="!teamList || teamList.length<1" description="还未加入小队哦，选择一个你心仪的小队吧"/>
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

const searchTeamList = async ()=>{
  const res = await myAxios.get('/team/myJoinTeam')
  if(res?.code === 0){
    teamList.value = res.data
  }else {
    showFailToast("获取队伍失败，请刷新")
  }
}

onMounted(async () => {
  await searchTeamList()
})
console.log("teamList", teamList)


</script>

<style scoped>

</style>