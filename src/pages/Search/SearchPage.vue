<template>
  <form action="/public">
    <van-search
        v-model="searchText"
        show-action
        placeholder="筛选标签"
        @search="onSearch"
        @cancel="onCancel"
    />
  </form>
  <div v-if="tagList.length>0">
    <van-divider
        :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }"
    >
      已选标签
    </van-divider>

    <van-row ustify="space-around" gutter="12">
      <van-col v-for="tag in tagList">
        <van-tag plain color="#ffe1e1" text-color="#ad0000" :show="show" closeable size="medium" type="primary"
                 @close="close(tag)">
          {{ tag }}
        </van-tag>
      </van-col>
    </van-row>

  </div>

  <van-divider
      :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }"
  >
    选择标签
  </van-divider>

  <van-tree-select
      v-model:main-active-index="mainTag"
      v-model:active-id="tagList"
      :items="searchTagLists"
  />
  <div style="padding:16px">
    <van-button block type="primary" @click="doSearchUser">搜索用户</van-button>
  </div>

</template>
<script setup lang="ts">
import {ref} from 'vue';
import {useRouter} from "vue-router";
import {Toast} from "vant";

const router = useRouter()

const searchText = ref('');


const tagLists = [
  {
    text: '年级',
    children: [
      {text: '大一', id: '大一'},
      {text: '大二', id: '大二'},
      {text: '大三', id: '大三'},
    ],
  },
  {
    text: '爱好',
    children: [
      {text: '流行音乐', id: '流行音乐'},
      {text: '古典音乐', id: '古典音乐'},
      {text: '篮球', id: '篮球'},
      {text: '台球', id: '台球'},
      {text: '爱吃', id: '爱吃'},
    ],
  },
  {
    text: '就业方向',
    children: [
      {text: 'Java', id: 'Java'},
      {text: 'Python', id: 'Python'},
      {text: 'C++', id: 'C++'},
      {text: '软件测试', id: '软件测试'},
    ],
  },
  {
    text: '性别',
    children: [
      {text: '男生', id: '男生'},
      {text: '女生', id: '女生'},
    ],
  },
];

let searchTagLists = ref(tagLists)


// 已选标签展示
const show = ref(true);
//删除标签
//将tagList集合中的值修改
const close = (tag) => {
  tagList.value = tagList.value.filter(item => {
    return item !== tag;
  })
};
//已选中的标签
const mainTag = ref(0);
const tagList = ref([]);

// 取消搜索
const onCancel = () => {
  searchText.value = '';
  searchTagLists.value = tagLists;
};

// const encodedTagNameList = tagList.map(tag => encodeURIComponent(tag));


//搜索标签
const onSearch = (val) => {
  //从过滤掉不含用户要搜索的标签 searchTagLists.value
  searchTagLists.value = tagLists.map(parentTag => {
    const newChildrenTag = [...parentTag.children]
    const newParentTag = {...parentTag}
    newParentTag.children = newChildrenTag.filter(tag => tag.text.includes(val))
    return newParentTag
  })
};

//搜索用户
const doSearchUser = () => {
  router.push({
    path: '/search/searchResult',
    query: {
      tags: tagList.value
    }
  })
}


</script>


<style scoped>

</style>