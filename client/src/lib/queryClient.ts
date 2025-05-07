import { QueryClient } from '@tanstack/react-query';

interface ApiRequestOptions {
  on401?: 'returnNull' | 'throw';
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
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
        throw new Error('Unauthorized');
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
      
      return await response.json();
    } catch (error) {
      console.error(`Query error when fetching ${endpoint}:`, error);
      throw error;
    }
  };
}