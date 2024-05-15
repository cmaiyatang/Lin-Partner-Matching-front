<template>
  <user-card-list :user-list="userList" :loading="loading"/>
  <van-empty v-if="tags?.length <= 0" description="请选择标签呦~"/>
  <van-empty v-if="(!userList || userList.length<1) && tags?.length >=1" description="无搜索用户！"/>
</template>

<script setup lang="ts">
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import myAxios from '../../plugins/myAxios.ts'
import {showFailToast} from "vant";
import setArrayTags from '../../common/setArrayTags.ts'
import UserCardList from "../../components/UserCardList.vue";
import qs from "qs";

const route = useRoute()
//将tags数组转换为逗号分隔的字符串
const {tags} = route.query//解构

console.log("tags", tags)

//用户List
const userList = ref([]);

const loading = ref(false)

onMounted(async () => {
  loading.value = true
  userList.value = await myAxios.get('/user/search/tags', {
    params: {
      tagNameList: tags
    },
    // 如果是get请求，且params是数组类型如arr=[1,2]，则转换成arr=1&arr=2
    paramsSerializer: function (params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }

  }).then(function (res) {
    if (res) {
      return res.data
    }
  })
      .catch(function (error) {
        console.log('/user/search/tags error', error)
        showFailToast('请求失败')
      })
  //将字符串类型的标签数据转换为数组
  setArrayTags(userList)
  loading.value = false
})


</script>


<style scoped>

</style>