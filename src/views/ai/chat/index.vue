<template>
  <div class="pet-chat-container">
    <div class="chat-header">
      <div class="header-content">
        <div class="pet-avatar">
          <span>🐾</span>
        </div>
        <div class="header-text">
          <h3>宠物智能助手</h3>
          <p>随时为您解答养宠知识</p>
        </div>
      </div>
    </div>
    <div class="chat-body" ref="chatBody">
      <div v-for="(message, index) in messages" :key="index"
        :class="['chat-message', message.role === 'user' ? 'user-message' : 'ai-message']">
        <div v-if="message.role === 'assistant'" class="ai-avatar">🐾</div>
        <div class="message-wrapper">
          <div class="message-content">
            {{ message.content }}
          </div>
        </div>
      </div>
      <div v-if="loading" class="loading">
        <div class="ai-avatar">🐾</div>
        <div class="loading-content">
          <div class="loading-dots">
            <span></span><span></span><span></span>
          </div>
          <span class="loading-text">AI正在思考中...</span>
        </div>
      </div>
    </div>
    <div class="chat-footer">
      <div class="input-wrapper">
        <el-input v-model="inputMessage" placeholder="输入您想了解的养宠问题..." @keyup.enter="sendMessage" :disabled="loading"
          class="pet-input">
        </el-input>
        <el-button type="primary" @click="sendMessage" :loading="loading" class="send-btn">
          <span v-if="!loading">发送</span>
        </el-button>
      </div>
      <div class="quick-questions">
        <span class="tip">快捷问题：</span>
        <el-tag v-for="(q, i) in quickQuestions" :key="i" @click="setQuestion(q)" class="quick-tag">
          {{ q }}
        </el-tag>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { chatWithAI } from '@/api/ai/chat'

const messages = ref([
  {
    role: 'assistant',
    content: '🐾 您好！欢迎来到宠物智能助手！\n\n我是您专属的养宠小帮手，无论是宠物喂养、健康护理、行为训练还是日常护理方面的问题，都可以问我哦～\n\n请问有什么可以帮到您的吗？'
  }
])
const inputMessage = ref('')
const loading = ref(false)
const chatBody = ref(null)

const quickQuestions = [
  '如何给猫咪选择合适的猫粮？',
  '狗狗多久洗一次澡最合适？',
  '猫咪为什么喜欢蹭家具？',
  '如何训练猫咪使用猫砂盆？'
]

const setQuestion = (q) => {
  inputMessage.value = q
  sendMessage()
}

const sendMessage = async () => {
  if (!inputMessage.value.trim() || loading.value) return

  messages.value.push({
    role: 'user',
    content: inputMessage.value.trim()
  })

  const userMessage = inputMessage.value.trim()
  inputMessage.value = ''

  await nextTick()
  scrollToBottom()

  loading.value = true
  try {
    const response = await chatWithAI({
      model: "glm-4.7",
      messages: [
        {
          role: "user",
          content: userMessage
        }
      ],
      thinking: {
        type: "enabled"
      },
      max_tokens: 65536,
      temperature: 1.0
    })

    messages.value.push({
      role: 'assistant',
      content: response.data.choices[0].message.content
    })
  } catch (error) {
    console.error('API请求失败:', error)
    messages.value.push({
      role: 'assistant',
      content: '抱歉，遇到了点小问题，请稍后再试一次～ 🐾'
    })
  } finally {
    loading.value = false
    await nextTick()
    scrollToBottom()
  }
}

const scrollToBottom = () => {
  if (chatBody.value) {
    chatBody.value.scrollTop = chatBody.value.scrollHeight
  }
}

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.pet-chat-container {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #fff8f0 0%, #fef3e2 100%);
  min-height: 100vh;
}

.chat-header {
  padding: 20px 24px;
  background: linear-gradient(135deg, #ff9a56 0%, #ff6b95 100%);
  box-shadow: 0 4px 12px rgba(255, 107, 149, 0.3);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.pet-avatar {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.header-text h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.header-text p {
  margin: 4px 0 0 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
}

.chat-body {
  flex: 1;
  height: calc(100vh - 220px);
  padding: 20px 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chat-message {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  max-width: 85%;
}

.user-message {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.ai-message {
  align-self: flex-start;
}

.ai-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #ff9a56 0%, #ff6b95 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(255, 107, 149, 0.3);
}

.message-wrapper {
  max-width: 100%;
}

.user-message .message-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.message-content {
  padding: 14px 18px;
  border-radius: 18px;
  line-height: 1.6;
  font-size: 15px;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.user-message .message-content {
  background: linear-gradient(135deg, #ff9a56 0%, #ff6b95 100%);
  color: #ffffff;
  border-bottom-right-radius: 4px;
  box-shadow: 0 4px 12px rgba(255, 107, 149, 0.3);
}

.ai-message .message-content {
  background: #ffffff;
  color: #4a4a4a;
  border: 1px solid #f0e6d8;
  border-bottom-left-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.loading {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  max-width: 85%;
}

.loading-content {
  padding: 14px 18px;
  background: #ffffff;
  border: 1px solid #f0e6d8;
  border-radius: 18px;
  border-bottom-left-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.loading-dots {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, #ff9a56 0%, #ff6b95 100%);
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {

  0%,
  80%,
  100% {
    transform: scale(0);
  }

  40% {
    transform: scale(1);
  }
}

.loading-text {
  font-size: 13px;
  color: #999;
}

.chat-footer {
  padding: 16px 24px 20px;
  background: #ffffff;
  border-top: 1px solid #f0e6d8;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05);
}

.input-wrapper {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.pet-input {
  flex: 1;
}

.pet-input :deep(.el-input__wrapper) {
  background: #fef9f3;
  border: 2px solid #f0e6d8;
  border-radius: 24px;
  padding: 4px 20px;
  box-shadow: none;
  transition: all 0.3s ease;
}

.pet-input :deep(.el-input__wrapper:hover) {
  border-color: #ff9a56;
}

.pet-input :deep(.el-input__wrapper.is-focus) {
  border-color: #ff6b95;
  box-shadow: 0 0 0 3px rgba(255, 107, 149, 0.15);
}

.pet-input :deep(.el-input__inner) {
  color: #4a4a4a;
  font-size: 15px;
}

.pet-input :deep(.el-input__inner::placeholder) {
  color: #b8b8b8;
}

.send-btn {
  width: 80px;
  height: 42px;
  background: linear-gradient(135deg, #ff9a56 0%, #ff6b95 100%);
  border: none;
  border-radius: 21px;
  font-size: 15px;
  font-weight: 500;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(255, 107, 149, 0.3);
  transition: all 0.3s ease;
}

.send-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 107, 149, 0.4);
}

.send-btn:active {
  transform: translateY(0);
}

.quick-questions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.tip {
  font-size: 13px;
  color: #999;
}

.quick-tag {
  cursor: pointer;
  background: #fef9f3;
  border: 1px solid #f0e6d8;
  color: #ff6b95;
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 14px;
  transition: all 0.3s ease;
}

.quick-tag:hover {
  background: linear-gradient(135deg, #ff9a56 0%, #ff6b95 100%);
  color: #ffffff;
  border-color: transparent;
}

.chat-body::-webkit-scrollbar {
  width: 6px;
}

.chat-body::-webkit-scrollbar-track {
  background: transparent;
}

.chat-body::-webkit-scrollbar-thumb {
  background: #f0e6d8;
  border-radius: 3px;
}

.chat-body::-webkit-scrollbar-thumb:hover {
  background: #ff9a56;
}
</style>
