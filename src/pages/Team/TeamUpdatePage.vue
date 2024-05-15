<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field name="stepper" label="最大人数">
        <template #input>
          <van-stepper v-model="commitData.maxNum" max="10" min="1"/>
        </template>
      </van-field>
      <van-field colon
                 v-model="commitData.teamName"
                 name="队伍名称"
                 label="队名"
                 placeholder="小鸡队~"
                 :rules="[{ required: true, message: '请输入队伍名称~' }]"
      />
      <van-field
          v-model="commitData.description"
          name="队伍简介"
          label="简介"
          placeholder="好多小猫~"
          :rules="[{ required: true, message: '请输入队伍简介' }]"
      />
      <van-field name="radio" label="队伍状态">
        <template #input>
          <van-radio-group v-model="commitData.status" direction="horizontal">
            <van-radio :name=0 icon-size="15px">公开</van-radio>
            <van-radio :name=1 icon-size="15px">加密</van-radio>
            <van-radio :name=2 icon-size="15px">私密</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field
          v-if="commitData.status === 1"
          v-model="commitData.password"
          type="password"
          name="设置密码"
          label="密码"
          placeholder="设置加入队伍时的密码"
          :rules="[{ required: true, message: '请输入加入队伍时的密码' }]"
      />
      <van-field
          v-model="commitData.expireTime"
          is-link
          readonly
          name="calendar"
          label="小队失效时间"
          :placeholder="commitData.expireTime ? commitData.expireTime : '不选不会失效哒!' "
          @click="showCalendar = true"
      />
      <van-calendar v-model:show="showCalendar" @confirm="onConfirm"/>
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {showFailToast, showSuccessToast} from "vant";
import myAxios from "../../plugins/myAxios.ts";


const route = useRoute()
const router = useRouter()

//获得要更新的队伍id
const id = parseInt(<string>route.query.id)

const commitData = ref({})

//队伍过期时间
const showCalendar = ref(false);
const onConfirm = (date) => {
  commitData.value.expireTime = `${date.getMonth() + 1}/${date.getDate()}`;
  showCalendar.value = false;
};

//获取之前的队伍信息
onMounted(async () => {
  if (id <= 0) {
    showFailToast("加载队伍失败，请重试")
    return
  }
  const res = await myAxios.get('/team/get', {params: {id}})

  if (res?.code === 0) {
    commitData.value = res.data;
  } else {
    showFailToast("加载队伍失败，请重试")
  }
})

//更新队伍信息
const onSubmit = async () => {
  const res = await myAxios.post('/team/update', commitData.value)

  if(res?.code === 0){
    showSuccessToast("更新队伍信息成功，好耶！")
    router.push({
      path:'/team',
      replace:true
    })
  }else {
    showFailToast("更新队伍失败，重新试试")
  }
}


</script>


<style scoped>

</style>