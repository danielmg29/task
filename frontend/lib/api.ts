// WHAT: Centralized API client
// WHY: Don't repeat fetch logic everywhere
// ADAPTIVE CONVERGENCE: Single point of configuration

/**
 * Base API configuration
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Generic API error class
 * WHY: Better error handling than generic Error
 */
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Generic fetch wrapper with error handling
 * 
 * WHAT: Wraps native fetch with common logic
 * WHY: DRY (Don't Repeat Yourself) principle
 * FIX: Handle responses with no content (like DELETE)
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Construct full URL
  const url = `${API_URL}${endpoint}`;
  
  // Default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  try {
    // Make the request
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    // Handle responses with no content (like DELETE)
    // Status 204 = No Content (successful delete)
    if (response.status === 204) {
      return null as T; // No data to return
    }
    
    // Try to parse JSON
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      // If JSON parsing fails but response was successful
      if (response.ok) {
        return null as T;
      }
      // If JSON parsing fails and response was an error
      throw new APIError(
        'Invalid response from server',
        response.status
      );
    }
    
    // Check for errors
    if (!response.ok) {
      throw new APIError(
        data.message || data.error || 'API request failed',
        response.status,
        data
      );
    }
    
    return data;
  } catch (error) {
    // Re-throw APIErrors as-is
    if (error instanceof APIError) {
      throw error;
    }
    
    // Wrap other errors
    console.error('API request error:', error);
    throw new APIError(
      'Network error or server unreachable',
      0,
      error
    );
  }
}

/**
 * Task API methods
 * 
 * WHAT: All task-related API calls in one place
 * WHY: Easy to find and maintain
 */
export const taskAPI = {
  /**
   * Get all tasks
   * GET /api/tasks/
   */
  async getAll() {
    return apiRequest<{ count: number; results: Task[] }>('/api/tasks/');
  },
  
  /**
   * Get single task by ID
   * GET /api/tasks/{id}/
   */
  async getById(id: number) {
    return apiRequest<Task>(`/api/tasks/${id}/`);
  },
  
  /**
   * Create new task
   * POST /api/tasks/
   */
  async create(data: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
    return apiRequest<Task>('/api/tasks/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  /**
 * Update existing task
 * PATCH /api/tasks/{id}/ (using PATCH instead of PUT for partial updates)
 */
  async update(id: number, data: Partial<Task>) {
    return apiRequest<Task>(`/api/tasks/${id}/`, {
      method: 'PATCH',  // Changed from PUT to PATCH
      body: JSON.stringify(data),
    });
  },
  
  /**
   * Delete task
   * DELETE /api/tasks/{id}/
   */
  async delete(id: number) {
    return apiRequest<void>(`/api/tasks/${id}/`, {
      method: 'DELETE',
    });
  },
};

/**
 * Task type definition
 * 
 * WHAT: TypeScript interface matching Django model
 * WHY: Type safety in frontend
 * NOTE: This is temporary - Week 2 we'll auto-generate this from backend schema
 */
export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}