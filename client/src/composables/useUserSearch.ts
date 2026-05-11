// import { listUsersQuery } from '@/api/@pinia/colada.gen'
// import { useQuery } from '@pinia/colada'
// import { refDebounced } from '@vueuse/core'
// import { ref } from 'vue'

// export function useUserSearch(options = { limit: 10 }) {
//   const searchTerm = ref('')

//   // Debounce
//   const debouncedSearch = refDebounced(searchTerm, 400)

//   const query = useQuery(() =>
//     listUsersQuery({
//       query: {
//         search: debouncedSearch.value || undefined,
//         limit: options.limit,
//         page: 1,
//       },
//     }),
//   )

//   return {
//     searchTerm,
//     users: query.data,
//     status: query.status,
//     error: query.error,
//     refresh: query.refresh,
//   }
// }
