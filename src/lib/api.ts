interface WaitlistData {
    email: string;
  }
  
  interface FeedbackData {
    email: string;
    frustration: string;
    ai_coach_ask: string;
    least_confident_area: string;
    other_suggestions?: string;
  }
  
  interface ApiResponse {
    message: string;
    status: string;
  }
  
  class ApiError extends Error {
    constructor(public status: number, message: string) {
      super(message);
      this.name = 'ApiError';
    }
  }
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
  
  async function makeApiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };
  
    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          response.status,
          errorData.detail || `HTTP ${response.status}: ${response.statusText}`
        );
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(0, 'Network error or server unavailable');
    }
  }
  
  export async function submitToWaitlist(data: WaitlistData): Promise<ApiResponse> {
    return makeApiRequest<ApiResponse>('/api/waitlist', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  export async function submitFeedback(data: FeedbackData): Promise<ApiResponse> {
    return makeApiRequest<ApiResponse>('/api/feedback', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  export { ApiError };