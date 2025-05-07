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
        credentials: 'include',
      });
      
      if (response.status === 401) {
        if (on401 === 'returnNull') {
          return null;
        }
        throw new Error('Unauthorized');
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: response.statusText,
        }));
        
        throw new Error(errorData.message || `Failed to fetch data from ${endpoint}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Query error:', error);
      throw error;
    }
  };
}