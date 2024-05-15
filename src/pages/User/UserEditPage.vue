<template>
  <van-form @submit="onsubmit">
    <van-cell-group inset>
      <van-field name="uploader" label="头像上传">
        <template #input>
          <van-uploader v-model="fileList" multiple:max-count="1"
                        name="asyncValidator"
          />
        </template>
      </van-field>
      <van-field
          v-model="editUser.username"
          label="姓名"
      />
      <van-field
          v-model="editUser.phone"
          label="手机号"
      />
      <!--       <van-field-->
      <!--           v-model="editUser.gender"-->
      <!--           label="性别"-->
      <!--       />-->
      <van-field name="radio" label="性别">
        <template #input>
          <van-radio-group v-model="checked" direction="horizontal" @click="change">
            <van-radio :name="1">男</van-radio>
            <van-radio :name="0">女</van-radio>
          </van-radio-group>
        </template>
      </van-field>

      <van-field
          v-model="editUser.email"
          label="邮箱"
      />
      <van-field
          v-model="editUser.profile"
          label="个性签名"
      />
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>
</template>
<script setup lang="ts">
import {ref} from 'vue';
import {useRoute, useRouter} from "vue-router";
import {showFailToast, showSuccessToast} from "vant";
import myAxios from "../../plugins/myAxios.ts";


const route = useRoute()
const router = useRouter()
const user = JSON.parse(<string>route.query.editUser)
const editUser = ref({
  username: user.username,
  phone: user.phone,
  email: user.email,
  gender: user.gender,
  avatarUrl: user.avatarUrl,
  profile:user.profile,
})

//修改用户性别
const checked = ref(editUser.value.gender);
const change = () => {
  editUser.value.gender = checked
  console.log(editUser.value.gender)
}

// https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTP4cwOlwN5rojLZ9HdxpNARM1X1YhQl6IiwHHIlmw7Vg&s
const fileList = ref([
  {url: editUser.value.avatarUrl, isImage: true},
  // Uploader 根据文件后缀来判断是否为图片文件
  // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
]);

const avatarUrlString = fileList.value.map(file => file.url).join(',')
editUser.value.avatarUrl = avatarUrlString


//用户提交数据
const onsubmit = async () => {

  //用户上传多张图片
  if (fileList.value.length > 1) {
    showFailToast('只可上传一张图片')
    return
  }
  //用户没有上传图片
  if (fileList.value.length < 1) {
    showFailToast('请上传一张图片')
    return
  }

  await myAxios.post('/user/updateUser',
      JSON.stringify(editUser.value)
      , {
        headers: {
          'Content-Type': 'application/json'
        },
        // withCredentials: true,
      }
  ).then(function (res) {
    console.log('/user/search/tags succeed', res)
    // showSuccessToast('请求成功')
    if (res.data == 1)
      showSuccessToast('修改信息成功')
      router.replace('/user')
  })
      .catch(function (error) {
        console.log('/user/search/tags error', error)
        showFailToast('请求失败')
      })
}


</script>


<style scoped>

</style>