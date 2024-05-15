<template>
  <div id="teamPage">
    <van-search
        v-model="searchText"
        placeholder="搜索队伍,输入关键词"
        input-align="center"
        clearable
        @search="doSearch"
    />
    <van-tabs v-model:active="active" sticky duration="0.3" color="red" @change="pubOrSecret">

      <van-tab title="全部" name="ALL"/>
      <van-tab name="PUBLIC" title="公开">
        <template #title>
          <van-icon name="fire-o" color="#ee0a24" size="16px"/>
          公开
        </template>
      </van-tab>
      <van-tab name="SECRET" title="加密">
        <template #title>
          <van-icon name="lock" size="16px"/>
          加密
        </template>
      </van-tab>
    </van-tabs>
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <van-button class="addTeam-button" icon="plus" type="primary" @click="doJoinTeam"/>
      <team-card-list :team-list="teamList"/>
      <van-empty v-if="!teamList || teamList.length<1" description="无队伍数据"/>
    </van-pull-refresh>
    <div v-if="teamList && teamList.length > 8">
      <van-pagination
          v-model="currentPage"
          :total-items="total"
          :show-page-size="4"
          force-ellipses
          @change="page"
      />
    </div>
  </div>
</template>
<!--<template>-->
<!--  <div id="teamPage">-->
<!--    <van-search v-model="searchText" placeholder="搜索队伍" @search="doSearch" />-->
<!--    <van-tabs v-model:active="active" @change="pubOrSecret">-->
<!--      <van-tab name="public" title="公开">-->
<!--        <template #title>-->
<!--          <van-icon name="fire-o" color="#ee0a24" size="16px"/>-->
<!--          公开-->
<!--        </template>-->
<!--      </van-tab>-->
<!--      <van-tab name="private" title="加密">-->
<!--        <template #title>-->
<!--          <van-icon name="lock" size="16px"/>-->
<!--          加密-->
<!--        </template>-->
<!--      </van-tab>-->
<!--    </van-tabs>-->
<!--    <div style="margin-bottom: 16px" />-->
<!--    <team-card-list :teamList="teamList" />-->
<!--    <van-empty v-if="teamList?.length < 1" description="数据为空"/>-->
<!--    <van-button class="add-button" type="primary" icon="plus" @click="doJoinTeam" />-->
<!--  </div>-->
<!--</template>-->


<script setup lang="ts">
import {onMounted, ref} from "vue";
import myAxios from '../../plugins/myAxios.ts'
import {showFailToast, showSuccessToast,} from "vant";
import {useRouter} from "vue-router";
import TeamCardList from "../../components/TeamCardList.vue";

const active = ref('ALL')
const pubOrSecret = (name) => {
  if (name === 'ALL') {
    page(searchText.value, null)
  }
  if (name === 'PUBLIC') {
    page(searchText.value, 0)
  }
  if (name === 'SECRET') {
    page(searchText.value, 1)
  }
}


const router = useRouter()

const doJoinTeam = () => {
  router.push({
    path: "/team/add"
  })
}


//队伍List
const teamList = ref([]);

//搜索关键词
const searchText = ref('')

onMounted(async () => {
  await page('', null)
})

//搜索
const doSearch = (val) => {
  page(val, null)
}

//分页查询
const currentPage = ref(1);
const total = ref()

//获取队伍列表
const page = async (val, status) => {
  console.log("searchText", val)
  const res = await myAxios.get('/team/list/page', {
    params: {
      pageNumber: currentPage.value,
      pageSize: 8,
      searchText: val,
      status: status
    }
  })
  if (res?.code === 0) {
    teamList.value = res.data.records
    total.value = res.data.total
  } else {
    showFailToast("无队伍，请刷新")
  }
}

//下拉刷新
const loading = ref(false);

const onRefresh = () => {
  setTimeout(() => {
    page('', null)
    // showSuccessToast('刷新成功');
    loading.value = false;
  }, 1000);
};


</script>

<style scoped>

</style>