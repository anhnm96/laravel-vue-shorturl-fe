export function handleInvalidForm(error: Ref<any | null>, node?: any) {
  if (error.value?.statusCode === 422) {
    node?.setErrors([], error.value.data.errors)
  }
}