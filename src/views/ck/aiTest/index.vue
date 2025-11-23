<template>
  <div>
    <i-frame :src="url"></i-frame>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const url = ref('http://localhost:8081/chatui/index.html')
</script>
