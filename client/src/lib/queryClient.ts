import { QueryClient } from '@tanstack/react-query';

interface ApiRequestOptions {
  on401?: 'returnNull' | 'throw';
}

// Enhanced configuration for TanStack Query v5
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: 2,
      staleTime: 30 * 1000, // 30 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes
      // Default query function that will be used if no queryFn is provided
      queryFn: async ({ queryKey }: { queryKey: any }) => {
        const endpoint = queryKey[0];
        
        try {
          const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });
          
          if (!response.ok) {
            const errorMessage = `Error ${response.status}: ${response.statusText}`;
            throw new Error(errorMessage);
          }
          
          return await response.json();
        } catch (error) {
          console.error(`Query error for ${endpoint}:`, error);
          throw error;
        }
      }
    },
  },
});

export async function apiRequest(
  method: string,
  endpoint: string,
  body?: any
): Promise<Response> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(endpoint, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: response.statusText,
    }));
    
    throw new Error(errorData.message || 'An error occurred');
  }

  return response;
}

export function getQueryFn(options: ApiRequestOptions = {}) {
  const { on401 = 'throw' } = options;
  
  return async ({ queryKey }: { queryKey: any }) => {
    const endpoint = queryKey[0];
    
    try {
      // Add a small delay to prevent overwhelming the server with concurrent requests
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (response.status === 401) {
        console.log(`401 Unauthorized when fetching ${endpoint}`);
        if (on401 === 'returnNull') {
          return null;
        }
        throw new Error('Unauthorized - Please log in');
      }
      
      if (!response.ok) {
        let errorMessage = response.statusText;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // JSON parse error, use status text
        }
        
        throw new Error(errorMessage || `Failed to fetch data from ${endpoint}`);
      }
      
      // Cache the successful response
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Query error when fetching ${endpoint}:`, error);
      // If it's a network error, provide a more helpful message
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Network error: Could not connect to the server. Please check your connection.`);
      }
      throw error;
    }
  };
}