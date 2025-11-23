<template>
  <div class="chat-container">
    <!-- Header -->
    <div class="chat-header">
      <h2>AI 助手</h2>
      <el-button @click="clearMessages" type="danger" size="small" plain>
        <el-icon><Delete /></el-icon>
        清空对话
      </el-button>
    </div>

    <!-- Messages Area -->
    <div class="chat-messages" ref="messagesContainer">
      <div v-if="messages.length === 0" class="empty-state">
        <el-icon :size="60" color="#909399"><ChatDotRound /></el-icon>
        <p>开始与 AI 助手对话</p>
      </div>

      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="['message-wrapper', message.role]"
      >
        <div class="message-avatar">
          <el-avatar :size="36" v-if="message.role === 'user'">
            <el-icon><User /></el-icon>
          </el-avatar>
          <el-avatar :size="36" v-else :style="{ backgroundColor: '#409eff' }">
            <el-icon><Cpu /></el-icon>
          </el-avatar>
        </div>
        <div class="message-content">
          <div class="message-header">
            <span class="message-sender">{{ message.role === 'user' ? '我' : 'AI 助手' }}</span>
            <span class="message-time">{{ message.time }}</span>
          </div>
          <div class="message-text" v-html="formatMessage(message.content)"></div>
        </div>
      </div>

      <!-- Typing Indicator -->
      <div v-if="isTyping" class="message-wrapper assistant">
        <div class="message-avatar">
          <el-avatar :size="36" :style="{ backgroundColor: '#409eff' }">
            <el-icon><Cpu /></el-icon>
          </el-avatar>
        </div>
        <div class="message-content">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="chat-input">
      <el-input
        v-model="inputMessage"
        type="textarea"
        :rows="3"
        placeholder="在此输入您的消息..."
        @keydown.enter.ctrl="sendMessage"
        :disabled="isTyping"
      />
      <div class="input-actions">
        <span class="input-hint">按 Ctrl + Enter 发送</span>
        <el-button
          type="primary"
          @click="sendMessage"
          :disabled="!inputMessage.trim() || isTyping"
          :loading="isTyping"
        >
          <el-icon><Promotion /></el-icon>
          发送
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup name="ai" lang="ts">
import { ref, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Delete, ChatDotRound, User, Cpu, Promotion } from '@element-plus/icons-vue'

interface Message {
  role: 'user' | 'assistant'
  content: string
  time: string
}

const messages = ref<Message[]>([
  {
    role: 'assistant',
    content: '您好！我是您的 AI 助手，有什么可以帮助您的吗？',
    time: getCurrentTime()
  }
])

const inputMessage = ref('')
const isTyping = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)

// Mock AI responses
const mockResponses = [
  '这是一个很好的问题！让我来帮您解答。',
  '我理解您的疑问。关于这个问题，我的看法是...',
  '根据您的描述，我建议采用以下方式...',
  '很有意思的观点！我对此的看法是...',
  '让我为您分析一下。根据我的理解...',
  '这是一个常见的问题。答案其实很简单...',
  '感谢您的提问。让我详细为您解释一下...'
]

function getCurrentTime(): string {
  const now = new Date()
  return now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

function formatMessage(content: string): string {
  // Simple formatting: convert line breaks to <br>
  return content.replace(/\n/g, '<br>')
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

function sendMessage() {
  if (!inputMessage.value.trim() || isTyping.value) return

  // Add user message
  messages.value.push({
    role: 'user',
    content: inputMessage.value,
    time: getCurrentTime()
  })

  const userInput = inputMessage.value
  inputMessage.value = ''
  scrollToBottom()

  // Simulate AI typing
  isTyping.value = true

  // Simulate AI response after delay
  setTimeout(() => {
    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)]
    messages.value.push({
      role: 'assistant',
      content: `${randomResponse}\n\nYou said: "${userInput}"`,
      time: getCurrentTime()
    })
    isTyping.value = false
    scrollToBottom()
  }, 1500 + Math.random() * 1000)
}

function clearMessages() {
  ElMessage.success('对话已清空')
  messages.value = [
    {
      role: 'assistant',
      content: '您好！我是您的 AI 助手，有什么可以帮助您的吗？',
      time: getCurrentTime()
    }
  ]
}
</script>

<style scoped lang="scss">
.chat-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px);
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-bottom: 1px solid #e4e7ed;

  h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
  }
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: #f5f7fa;

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #909399;

    p {
      margin-top: 16px;
      font-size: 16px;
    }
  }
}

.message-wrapper {
  display: flex;
  margin-bottom: 24px;
  animation: fadeIn 0.3s ease-in;

  &.user {
    flex-direction: row-reverse;

    .message-content {
      background: #409eff;
      color: #fff;
      margin-right: 12px;
      margin-left: 0;

      .message-header {
        .message-sender {
          color: rgba(255, 255, 255, 0.9);
        }
        .message-time {
          color: rgba(255, 255, 255, 0.7);
        }
      }
    }
  }

  &.assistant {
    .message-content {
      background: #fff;
      color: #303133;
      margin-left: 12px;
    }
  }
}

.message-avatar {
  flex-shrink: 0;
}

.message-content {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  .message-sender {
    font-weight: 600;
    font-size: 14px;
  }

  .message-time {
    font-size: 12px;
    color: #909399;
    margin-left: 12px;
  }
}

.message-text {
  line-height: 1.6;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 0;

  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #909399;
    animation: typing 1.4s infinite;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}

.chat-input {
  padding: 16px 24px;
  background: #fff;
  border-top: 1px solid #e4e7ed;

  .input-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;

    .input-hint {
      font-size: 12px;
      color: #909399;
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
}

:deep(.el-textarea__inner) {
  resize: none;
  font-family: inherit;
}
</style>
