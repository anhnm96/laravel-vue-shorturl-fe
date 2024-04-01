<script setup lang="ts">
const { data: user } = await useAPI('/user')
</script>

<template>
  <p><strong>User Name:</strong> {{ user.name }}</p>
  <p><strong>User Email:</strong> {{ user.email }}</p>
</template>
