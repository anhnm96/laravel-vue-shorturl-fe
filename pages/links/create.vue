<script setup lang="ts">
import { nanoid } from 'nanoid'

definePageMeta({
  middleware: ['auth'],
});

async function createLink(payload: { full_link: string }, node?: any) {
  const { error } = await useAPI('/links', {
    method: 'POST',
    body: { ...payload, short_link: nanoid(8) }
  })
  useRouter().push('/links')
  handleInvalidForm(error, node)
}
</script>

<template>
  <h1>Create New Link</h1>
  <GoBack>or go back to links</GoBack>
  <FormKit type="form" submit-label="Create Link" @submit="createLink">
    <FormKit label="Link" type="url" name="full_link" />
  </FormKit>
</template>
