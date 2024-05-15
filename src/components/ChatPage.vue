<script setup>
import {nextTick, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {showFailToast} from "vant";
import myAxios from "../plugins/myAxios.ts";
import getCurrentUser from "../common/getCurrentUser.ts";
// import V3Emoji from 'vue3-emoji'
// import 'vue3-emoji/dist/style.css'

const route = useRoute()
const router = useRouter()

const stats = ref({
  user: {
    id: 0,
    username: "",
    avatarUrl: ''
  },
  isCollapse: false,
  chatUser: {
    id: 0,
    username: ''
  },
  team: {
    id: 0,
    teamName: ''
  },
  chatType: null,
  text: "",
  messages: [],
  content: ''
})

// const optionsName = {
//   'Smileys & Emotion': '笑脸&表情',
//   'Food & Drink': '食物&饮料',
//   'Animals & Nature': '动物&自然',
//   'Travel & Places': '旅行&地点',
//   'People & Body': '人物&身体',
//   Objects: '物品',
//   Symbols: '符号',
//   Flags: '旗帜',
//   Activities: '活动'
// };


const appendText = (val) => {
  stats.value.text += val
}

let socket = null;
const heartbeatInterval = 30 * 1000; // 30秒
let heartbeatTimer = null;

const startHeartbeat = () => {
  heartbeatTimer = setInterval(() => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send("ping");
    }
  }, heartbeatInterval);
}

const stopHeartbeat = () => {
  clearInterval(heartbeatTimer);
  heartbeatTimer = null;
}

const chatRoom = ref(null)

onMounted(async () => {
  let {id, friendName, teamId, teamName, chatType} = route.query

  // stats.value.chatUser.id = Number.parseInt(route.query.id)
  // stats.value.chatUser.username = route.query.friendName
  // stats.value.team.id = Number.parseInt(route.query.teamId)
  // stats.value.team.teamName = route.query.teamName
  // //todo 补一下vue3的知识 速成！！！！
  // stats.value.chatType = Number.parseInt(route.query.chatType)

  stats.value.chatUser.id = Number.parseInt(id)
  stats.value.chatUser.username = friendName
  stats.value.team.id = Number.parseInt(teamId)
  stats.value.team.teamName = teamName
  stats.value.chatType = Number.parseInt(chatType)


  console.log("team.id", stats.value.team.id)
  console.log("team.teamName", stats.value.team.teamName)
  console.log("chatType", stats.value.chatType)

  stats.value.user = await getCurrentUser()
  console.log("stats", stats)

  if (stats.value.chatType === 0) {
    // 私聊 获取聊天信息
    const privateMessage = await myAxios.post(
        '/chat/privateChatMessage',
        {
          userId: stats.value.user.id,
          friendId: stats.value.chatUser.id,
        }
    )

    privateMessage?.data?.forEach(chatMessage => {
      if (chatMessage.isMy === true) {
        //当前用户发送的消息
        createContent(null, chatMessage.nowUser, chatMessage.message)
      } else {
        //远程用户发送的消息
        createContent(chatMessage.friendUser, null, chatMessage.message, null, chatMessage.sendTime)
      }
    })
  }

  if (stats.value.chatType === 1) {
    // 获取队伍聊天信息
    const teamChatMessage = await myAxios.post(
        '/chat/teamChatMessage',
        {
          userId: stats.value.user.id,
          friendId: stats.value.team.id,
        }
    )

    teamChatMessage?.data?.forEach(teamChatMessage => {
      if (teamChatMessage.isMy === true) {
        //远程用户发送的消息
        createContent(null, teamChatMessage.sendUser, teamChatMessage.message)
      } else {
        //当前用户发送的消息
        createContent(teamChatMessage.sendUser, null, teamChatMessage.message, null, teamChatMessage.sendTime)
      }
    })



  }

  init()
  // 内容始终显示最下方
  await nextTick()
  const lastElement = chatRoom.value.lastElementChild
  lastElement.scrollIntoView()

})

const init = () => {
  let userId = stats.value.chatUser.id.toString()
  let teamId = stats.value.team.id.toString()
  if (typeof (WebSocket) == "undefined") {
    showFailToast("您的浏览器不支持WebSocket")
  } else {
    let socketUrl = `ws://localhost:8080/api/websocket/${userId}/${teamId}`

    if (socket != null) {
      socket.close();
      socket = null;
    }
    // 开启一个websocket服务
    socket = new WebSocket(socketUrl);
    //打开事件
    socket.onopen = function () {
      startHeartbeat();
      console.log("websocket已打开");
    };

    //  浏览器接收消息，获得从服务端发送过来的文本消息
    socket.onmessage = function (msg) {
      if (msg.data === "pong") {
        return;
      }
      // 对收到的json数据进行解析，
      let data = JSON.parse(msg.data)
      console.log("消息：",data.sendTime)
      if (data.error) {
        showFailToast(data.error)
      }
      if (data.chatType === 0){
        //私聊的消息
        createContent(data.friendUser, null, data.message, data.isAdmin, data.sendTime)
      }
      if (data.chatType === 1 ){
        //队伍聊天的消息
        createContent(data.sendUser, null, data.message, data.isAdmin, data.sendTime)
      }

      nextTick(() => {
        const lastElement = chatRoom.value.lastElementChild
        lastElement.scrollIntoView()
      })

    };

    //关闭事件
    socket.onclose = function () {
      console.log("websocket已关闭");
      stopHeartbeat();
      // setTimeout(init, 5000); // 5秒后重连
    };

    //发生了错误事件
    socket.onerror = function () {
      console.log("websocket发生了错误");
    }
  }
}


const send = () => {
  if (stats.value.chatUser.id === 0) {
    return;
  }
  if (stats.value.chatUser.id === stats.value.user.id) {
    showFailToast("不能给自己发信息")
    return;
  }
  if (!stats.value.text.trim()) {
    showFailToast("请输入内容")
  }
  if (typeof (WebSocket) == "undefined") {
    showFailToast("您的浏览器不支持WebSocket")
  }
  console.log("您的浏览器支持WebSocket");
  let message = null;

// 确定 friendId 的值
  let friendId;
  if (stats.value.chatType === 0) {
    //私聊
    friendId = stats.value.chatUser.id;
  } else if (stats.value.chatType === 1) {
    //群聊
    friendId = stats.value.team.id;
  }

// 创建消息对象
  if (friendId !== undefined) {
    message = {
      userId: stats.value.user.id,
      friendId: friendId,
      message: stats.value.text,
      chatType: stats.value.chatType
    };
  }


  console.log(JSON.stringify(message))

  //发送消息
  socket.send(JSON.stringify(message));

  stats.value.messages.push({user: stats.value.user.id, text: stats.value.text})
  createContent(null, stats.value.user, stats.value.text)
  stats.value.text = '';
  nextTick(() => {
    const lastElement = chatRoom.value.lastElementChild
    lastElement.scrollIntoView()
  })


}

/**
 * 这个方法是用来将 json的聊天消息数据转换成 html的。
 */
const createContent = (remoteUser, nowUser, message, isAdmin, sendTime) => {
  // 当前用户消息
  let html;

  if (nowUser) {
    html =
        `
    <div class="message self">
    <div class="myInfo info">
    <img :alt=${nowUser.username} class="avatar" onclick="showUser(${nowUser.id})" src=${nowUser.avatarUrl ?? defaultPicture}>
     </div>
     <p class="text">${message}</p>
     </div>
    `
  } else if (remoteUser) {
    // remoteUser表示远程用户聊天消息，灰色的气泡
    html =
        `
    <div class="message other">
    <img :alt=${remoteUser.username} class="avatar" onclick="showUser(${remoteUser.id})" src=${remoteUser.avatarUrl ?? defaultPicture}>
    <div class="info">
    <span class="username">${remoteUser.username.length < 10 ? remoteUser.username : remoteUser.username.slice(0, 10)}&nbsp;&nbsp;&nbsp${sendTime}</span>
    <p class="${isAdmin ? 'admin text' : 'text'}" >${message}</p>
    </div>
    </div>
    `

  }
  stats.value.content += html;
}


</script>

<template>
  <div class="chat-container">
    <!--    //消息展示区域-->
    <div class="content" ref="chatRoom" v-html="stats.content"></div>
    <div class="send">
      <!--      <V3Emoji-->
      <!--          :recent="true"-->
      <!--          @click-emoji="appendText"-->
      <!--          :options-name="optionsName"-->
      <!--          size="big"-->
      <!--      />-->
      <textarea placeholder="聊点什么吧...." v-model="stats.text" @keyup.enter="send" class="input-text"></textarea>
      <button class="input-send-button" @click="send">
        <svg class="icon" style="width: 45px;height: 45px;vertical-align: middle;fill: currentColor;overflow: hidden;"
             viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <path
              d="M925.558 97.72c-0.292-0.154-1.582-0.719-4.739-0.719-2.941 0-8.151 0.521-16.343 2.979-36.058 12.923-754.37 270.362-773.606 276.872-0.939 0.318-1.934 0.651-2.974 0.999-6.376 2.134-14.312 4.789-21.199 7.962-4.428 2.04-7.167 3.719-8.829 4.928 17.832 15.715 119.575 97.983 147.656 120.663l564.222-327.071-432.705 429.86 50.076 61.687-0.298 0.242c71.737 87.846 178.502 218.056 196.953 239.206 3.79-4.609 9.658-15.269 13.893-31.349l0.32-1.068c4.197-12.448 271.564-726.894 284.955-762.677 5.193-16.388 2.925-21.894 2.618-22.514z"
              fill="#53AFFD"/>
          <path d="M360.942 646.668l-23.209 58.122 1.062-0.53 22.366-57.321z" fill="#53AFFD"/>
          <path
              d="M952.158 78.229c-4.725-6.476-13.998-14.195-31.339-14.195-7.7 0-16.304 1.478-26.303 4.516l-0.769 0.254c-7.542 2.703-754.41 270.378-773.445 276.821-0.906 0.307-1.865 0.628-2.868 0.962-20.672 6.918-48.985 16.392-53.687 38.008-1.601 7.358-0.929 18.539 11.361 30.017l0.284 0.257c17.603 15.689 128.736 105.481 152.37 124.56l59.231 227.524 31.165-15.563 0.833 0.333 0.373-0.935 89.425-44.655c39.865 48.793 184.043 225.075 193.933 234.965l0.122 0.056c7.568 7.413 15.352 8.846 20.552 8.846h0.007c12.054 0 22.763-7.486 31.827-22.486 5.649-9.349 10.661-21.497 14.14-34.496 7.164-20.075 188.713-505.43 284.587-761.613l0.259-0.747c7.436-23.193 6.761-40.343-2.058-52.429z m-314.493 805.75c-4.234 16.08-10.103 26.74-13.893 31.349-18.451-21.149-125.216-151.36-196.953-239.206l0.298-0.242-50.076-61.687 432.705-429.86-564.222 327.071c-28.08-22.68-129.823-104.948-147.656-120.663 1.661-1.209 4.401-2.889 8.829-4.928 6.886-3.173 14.823-5.828 21.199-7.962 1.04-0.348 2.035-0.681 2.974-0.999 19.236-6.51 737.548-263.949 773.606-276.872 8.192-2.458 13.402-2.979 16.343-2.979 3.157 0 4.447 0.565 4.739 0.719 0.307 0.62 2.575 6.125-2.617 22.513-13.391 35.783-280.759 750.229-284.955 762.677l-0.321 1.069zM337.733 704.79l23.208-58.122 0.22 0.27 30.678 37.792-58.245 32.857 5.2-13.328-1.061 0.531z m267.594-363.852l-259.134 257.43-2.423 2.408-40.964 102.585-41.809-162.821 344.33-199.602z"
              fill=""/>
          <path d="M343.769 600.777l2.423-2.408 259.135-257.431-344.331 199.603 41.808 162.821z" fill="#FFFFFF"/>
          <path d="M391.84 684.731l-30.679-37.792-22.366 57.321-5.201 13.328z" fill="#1083EA"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<style>
@import "../assets/css/chat.css";


</style>
