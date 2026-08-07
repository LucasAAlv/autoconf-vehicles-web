import { QueryClient } from "@tanstack/react-query";

// Query key convention: ['vehicles', params] for the list, ['vehicle', id]
// for a single record, ['auth', 'me'] for the current session.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
