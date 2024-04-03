import type { PaginatedResponse, Link, RawLink } from '@/types'
import type { Ref } from 'vue'

interface UseLinksOptions {
  queries?: Ref<Record<string, string | number>>
}

export const useLinks = ({ queries = ref({}) }: UseLinksOptions = {}) => {
  const slug = 'links'
  const paginatedData = ref<PaginatedResponse<Link>>()
  const item = ref<Link>()

  function adapter(link: RawLink): Link {
    return {
      ...link,
      created_at: new Date(link.created_at),
      updated_at: new Date(link.updated_at),
    }
  }

  // get all links
  async function index(qs?: Record<string, string | number>) {
    qs = { ...queries.value, ...qs }
    // @ts-expect-error page is number and that's ok
    const q = new URLSearchParams(qs).toString()
    const { data } = await useAPI<PaginatedResponse<RawLink>>(
      `/${slug}?${q}`
    )
    if (!data.value) return
    return (paginatedData.value = {
      ...data.value,
      data: data.value.data.map((i) => adapter(i)),
    })
  }
  watch(queries, index, { deep: true })

  // find one link by id
  async function find(id: string | number) {
    const { data } = await useAPI<RawLink>(`/${slug}/${id}`)
    if (!data.value) return
    return (item.value = adapter(data.value))
  }

  // create a new link
  async function create(payload: Partial<Link>) {
    const { data } = await useAPI<RawLink>(`/${slug}`, { method: 'POST', body: payload })
    if (!data.value) return
    return (item.value = adapter(data.value))
  }

  // update an existing link
  async function update(id: string | number, payload: Partial<Link>) {
    const { data, error } = await useAPI<RawLink>(`/${slug}/${id}`, { method: 'PUT', body: payload })
    if (error.value) throw createError({ data: error })
    if (!data.value) return
    return (item.value = adapter(data.value))
  }

  // delete an existing item
  async function destroy(id: string | number) {
    await useAPI(`/${slug}/${id}`, { method: 'DELETE' })
  }

  return {
    find,
    create,
    update,
    destroy,
    index,
    data: paginatedData,
    link: item,
  }
}