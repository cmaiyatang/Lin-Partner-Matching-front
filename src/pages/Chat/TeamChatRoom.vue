<template>
  <div class="chat-container">
    <div class="content" ref="chatRoom" v-html="stats.content"></div>
    <div class="send">
      <textarea placeholder="聊点什么吧...." v-model="stats.text" @keyup.enter="send" class="input-text"></textarea>
      <button class="input-send-button" @click="send">
        发送
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';


const route = useRoute();

const stats = ref({
  user: {
    id: 0,
    username: '',
    avatarUrl: ''
  },
  chatUser: {
    id: 0,
    username: ''
  },
  text: '',
  content: ''
});

onMounted(async () => {
  stats.value.chatUser.id = Number(route.query.id);
  stats.value.chatUser.username = route.query.friendName;

  stats.value.user = await getCurrentUser();

  await loadChatMessages();
  await nextTick();
  scrollToBottom();
});

const loadChatMessages = async () => {
  const { user, chatUser } = stats.value;
  const privateMessage = await myAxios.post('/chat/privateChatMessage', {
    userId: user.id,
    friendId: chatUser.id
  });

  privateMessage?.data?.forEach(chatMessage => {
    const isMyMessage = chatMessage.isMy === true;
    createContent(isMyMessage ? null : chatUser, isMyMessage ? user : null, chatMessage.message);
  });
};

const send = async () => {
  const { chatUser, user, text } = stats.value;
  if (!text.trim()) {
    return;
  }

  const message = {
    userId: user.id,
    friendId: chatUser.id,
    message: text
  };

  socket.send(JSON.stringify(message));
  createContent(null, user, text);

  stats.value.text = '';
  await nextTick();
  scrollToBottom();
};

const createContent = (remoteUser, nowUser, message) => {
  const username = remoteUser ? remoteUser.username : nowUser.username;
  const avatarUrl = remoteUser ? remoteUser.avatarUrl : nowUser.avatarUrl;

  const html = `
    <div class="message ${remoteUser ? 'other' : 'self'}">
      <img :alt="${username}" class="avatar" src="${avatarUrl}">
      <div class="info">
        <span class="username">${username}</span>
        <p class="text">${message}</p>
      </div>
    </div>
  `;

  stats.value.content += html;
};

const scrollToBottom = () => {
  const chatRoom = ref('chatRoom');
  if (chatRoom.value) {
    chatRoom.value.scrollTop = chatRoom.value.scrollHeight;
  }
};

// WebSocket 相关代码，你可以根据需要添加或修改

</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.send {
  display: flex;
  align-items: center;
  padding: 10px;
}

.input-text {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
}

.input-send-button {
  margin-left: 10px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
}

.message {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.username {
  font-weight: bold;
}

.text {
  word-break: break-word;
}

.self {
  justify-content: flex-end;
}

.other {
  justify-content: flex-start;
}

</style>
