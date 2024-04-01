<script setup lang="ts">

await useAPI('/logout', { method: 'POST' })
useRouter().replace('/login')
</script>

<template>
  <div>Logging Out...</div>
</template>
