// API service for backend communication
const API_BASE_URL = 'http://localhost:5001/api';

// Types for API responses
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  age?: number;
  location?: {
    city: string;
    state: string;
    country: string;
  };
  employmentStatus?: string;
  annualIncome?: number;
  creditScore?: number;
  preferences?: {
    purchaseType: string;
    monthlyBudget?: number;
    preferredTermMonths?: number;
    downPayment?: number;
    vehicleType: string;
    modelInterest: string[];
    features: string[];
  };
  financingHistory: any[];
  recommendations: any[];
  simulations: any[];
  financialTipsViewed: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message: string;
}

export interface ApiError {
  success: false;
  error: string;
  message?: string;
  missingFields?: string[];
  details?: string[];
}

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper function to set auth token in localStorage
const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

// Helper function to remove auth token from localStorage
const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

// Generic API request function
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'An error occurred');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error occurred');
  }
};

// Authentication API functions
export const authApi = {
  // Register a new user
  register: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    age?: number;
    location?: {
      city: string;
      state: string;
      country?: string;
    };
    employmentStatus?: string;
    annualIncome?: number;
    creditScore?: number;
    preferences?: {
      purchaseType?: string;
      monthlyBudget?: number;
      preferredTermMonths?: number;
      downPayment?: number;
      vehicleType?: string;
      modelInterest?: string[];
      features?: string[];
    };
  }): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    // Store token on successful registration
    if (response.success && response.data.token) {
      setAuthToken(response.data.token);
    }

    return response;
  },

  // Login user
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Store token on successful login
    if (response.success && response.data.token) {
      setAuthToken(response.data.token);
    }

    return response;
  },

  // Get user profile
  getProfile: async (): Promise<{ success: boolean; data: User }> => {
    return apiRequest<{ success: boolean; data: User }>('/users/profile');
  },

  // Update user profile
  updateProfile: async (userData: Partial<User>): Promise<{ success: boolean; data: User; message: string }> => {
    return apiRequest<{ success: boolean; data: User; message: string }>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    return apiRequest<{ success: boolean; message: string }>('/users/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  // Logout (clear token)
  logout: (): void => {
    removeAuthToken();
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!getAuthToken();
  },

  // Get current token
  getToken: (): string | null => {
    return getAuthToken();
  },
};

// Cars API functions
export const carsApi = {
  // Get all cars with optional filters
  getCars: async (params?: {
    limit?: number;
    page?: number;
    make?: string;
    model?: string;
    year?: number;
    bodyStyle?: string;
    minPrice?: number;
    maxPrice?: number;
    fuelType?: string;
    drivetrain?: string;
    status?: string;
    location?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/cars${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiRequest(endpoint);
  },

  // Get car by ID
  getCarById: async (id: string) => {
    return apiRequest(`/cars/${id}`);
  },

  // Search cars
  searchCars: async (query: string) => {
    return apiRequest(`/cars/search/${encodeURIComponent(query)}`);
  },
};

export default apiRequest;
