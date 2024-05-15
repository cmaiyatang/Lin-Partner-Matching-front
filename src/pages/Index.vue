<template>
  <van-swipe :autoplay="3000" lazy-render>
    <van-swipe-item v-for="image in images" :key="image">
      <img :src="image" style="width: 100%;height: 150px;"/>
    </van-swipe-item>
  </van-swipe>
  <van-cell center title="心动模式">
    <template #right-icon>
      <van-switch v-model="isMatchMode" size="24" @change="defaultOrMatch"/>
      <!--      <van-switch v-model="isMatchMode" size="24"/>-->
    </template>
  </van-cell>
  <van-pull-refresh v-model="refresh" @refresh="onRefresh">
    <div id="userPage">
      <user-card-list :user-list="userList" :loading="loading"/>
      <!--        <van-empty v-if="!userList || userList.length < 1" description="无数据"/>-->
      <div v-if="userList && userList.length > 0">
        <van-pagination
            v-model="currentPage"
            :total-items="total"
            :show-page-size="4"
            force-ellipses
            @change="page"
        />
      </div>
    </div>
  </van-pull-refresh>

</template>

<script setup lang="ts">
import {onMounted, ref,} from "vue";
import myAxios from '../plugins/myAxios.ts'
import {showFailToast} from "vant";
import UserCardList from "../components/UserCardList.vue";
import setArrayTags from "../common/setArrayTags.ts";

//是否是心动模式 匹配用户
const isMatchMode = ref<boolean>(false)

// 用户List
const userList = ref([]);
// 总条数
let total = ref();
// 当前页码
let currentPage = ref(1);
const loading = ref(false)

const images = [
  'src/assets/pictures/起来嗨呀.jpg',
  'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg',
];

const loadingData = async () => {
  if (isMatchMode.value) {
    //匹配用户，心动模式
    loading.value = true
    try {
      const res = await myAxios.get('/user/match', {
        params: {
          num: 10,
        }
      });
      if (res.code === 0) {
        console.log('/user/match succeed', res);
        userList.value = res.data;
        await setArrayTags(userList);
        total.value = res.data.total;

      } else {
        console.log('/user/match failed');
        showFailToast('请求失败');
      }
    } catch (error) {
      console.error('/user/match error', error);
      showFailToast('请求失败');
    }
    loading.value = false
  } else {
    //查询所有用户
    //默认查询所有用户
    loading.value = true
    try {
      const res = await myAxios.get('/user/recommendUser', {
        params: {
          pageNumber: currentPage.value,
          pageSize: 8
        }
      });
      if (res.code === 0) {
        console.log('/user/recommendUser succeed', res);
        userList.value = res.data.records;
        await setArrayTags(userList);
        total.value = res.data.total;

      } else {
        console.log('/user/recommendUser failed');
        showFailToast('请求失败');
      }
    } catch (error) {
      console.error('/user/recommendUser error', error);
      showFailToast('请求失败');
    }
    loading.value = false
  }
}


onMounted(async () => {
  await loadingData()
});

const page = async () => {
  await loadingData()// 调用获取数据的方法
};

const defaultOrMatch = async () => {
  await loadingData()

}

//下拉刷新
const refresh = ref(false);
const onRefresh = () => {
  setTimeout(() => {
    loadingData()
    // showSuccessToast('刷新成功');
    refresh.value = false;
  }, 1000);
};




</script>

<style scoped>
</style>
