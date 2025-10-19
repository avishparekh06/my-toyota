// VAPI service for making phone calls with user and car context injection
import { User } from './api';

// VAPI Configuration
const VAPI_BASE_URL = 'https://api.vapi.ai';
const VAPI_API_KEY = process.env.REACT_APP_VAPI_API_KEY || '';

// Types for VAPI integration
export interface CarContext {
  make: string;
  model: string;
  color: string;
  year?: number;
  price?: number;
  financingOption?: 'Finance' | 'Lease' | 'Cash';
}

export interface VAPICallContext {
  firstName: string;
  lastName: string;
  carColor: string;
  carMake: string;
  carModel: string;
  carYear?: number;
  financingOption: string;
  phoneNumber: string;
  // Additional context that might be useful
  userLocation?: string;
  budgetRange?: {
    min: number;
    max: number;
  };
  preferredFeatures?: string[];
}

export interface VAPICallRequest {
  phoneNumber: string;
  context: VAPICallContext;
  assistantId?: string;
  customerId?: string;
  metadata?: Record<string, any>;
}

export interface VAPICallResponse {
  id: string;
  status: 'queued' | 'ringing' | 'in-progress' | 'completed' | 'failed';
  phoneNumber: string;
  customerId?: string;
  startedAt?: string;
  endedAt?: string;
  transcript?: string;
  recordingUrl?: string;
  cost?: number;
  duration?: number;
}

export interface VAPIError {
  message: string;
  code?: string;
  details?: any;
}

// Helper function to format phone number for VAPI
const formatPhoneNumber = (phone: string): string => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Add +1 if it's a 10-digit US number
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  }
  
  // Add + if it's an 11-digit number starting with 1
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned}`;
  }
  
  // Return as-is if it already has country code
  return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
};

// Helper function to build context string for VAPI
const buildContextString = (context: VAPICallContext): string => {
  const contextParts = [
    `Customer: ${context.firstName} ${context.lastName}`,
    `Vehicle: ${context.carYear ? context.carYear + ' ' : ''}${context.carMake} ${context.carModel} in ${context.carColor}`,
    `Financing: ${context.financingOption}`,
  ];

  if (context.userLocation) {
    contextParts.push(`Location: ${context.userLocation}`);
  }

  if (context.budgetRange) {
    contextParts.push(`Budget: $${context.budgetRange.min.toLocaleString()} - $${context.budgetRange.max.toLocaleString()}`);
  }

  if (context.preferredFeatures && context.preferredFeatures.length > 0) {
    contextParts.push(`Preferred Features: ${context.preferredFeatures.join(', ')}`);
  }

  return contextParts.join('\n');
};

// Main VAPI service class
export class VAPIService {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || VAPI_API_KEY;
    this.baseUrl = VAPI_BASE_URL;
    
    if (!this.apiKey) {
      console.warn('VAPI API key not provided. Please set REACT_APP_VAPI_API_KEY environment variable.');
    }
  }

  // Create context from user and car data
  createCallContext(user: User, car: CarContext): VAPICallContext {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      carColor: car.color,
      carMake: car.make,
      carModel: car.model,
      carYear: car.year,
      financingOption: car.financingOption || 'Finance',
      phoneNumber: user.phone || '',
      userLocation: user.location ? `${user.location.city}, ${user.location.state}` : undefined,
      budgetRange: user.finance?.budgetRange,
      preferredFeatures: user.personal?.featurePreferences,
    };
  }

  // Make a phone call using VAPI
  async makeCall(request: VAPICallRequest): Promise<VAPICallResponse> {
    if (!this.apiKey) {
      throw new Error('VAPI API key is required');
    }

    if (!request.phoneNumber) {
      throw new Error('Phone number is required');
    }

    try {
      const formattedPhone = formatPhoneNumber(request.phoneNumber);
      const contextString = buildContextString(request.context);

      const callData = {
        phoneNumber: formattedPhone,
        assistantId: request.assistantId || process.env.REACT_APP_VAPI_ASSISTANT_ID,
        customerId: request.customerId || request.context.firstName.toLowerCase() + '_' + request.context.lastName.toLowerCase(),
        context: contextString,
        metadata: {
          ...request.metadata,
          carMake: request.context.carMake,
          carModel: request.context.carModel,
          carColor: request.context.carColor,
          carYear: request.context.carYear,
          financingOption: request.context.financingOption,
          userFirstName: request.context.firstName,
          userLastName: request.context.lastName,
        }
      };

      const response = await fetch(`${this.baseUrl}/call`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(callData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`VAPI API error: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`);
      }

      const result = await response.json();
      return result as VAPICallResponse;

    } catch (error) {
      console.error('VAPI call failed:', error);
      throw error;
    }
  }

  // Get call status
  async getCallStatus(callId: string): Promise<VAPICallResponse> {
    if (!this.apiKey) {
      throw new Error('VAPI API key is required');
    }

    try {
      const response = await fetch(`${this.baseUrl}/call/${callId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`VAPI API error: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`);
      }

      const result = await response.json();
      return result as VAPICallResponse;

    } catch (error) {
      console.error('Failed to get call status:', error);
      throw error;
    }
  }

  // Cancel a call
  async cancelCall(callId: string): Promise<boolean> {
    if (!this.apiKey) {
      throw new Error('VAPI API key is required');
    }

    try {
      const response = await fetch(`${this.baseUrl}/call/${callId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      return response.ok;

    } catch (error) {
      console.error('Failed to cancel call:', error);
      throw error;
    }
  }

  // Get call history for a customer
  async getCallHistory(customerId: string, limit: number = 10): Promise<VAPICallResponse[]> {
    if (!this.apiKey) {
      throw new Error('VAPI API key is required');
    }

    try {
      const response = await fetch(`${this.baseUrl}/call?customerId=${customerId}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`VAPI API error: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`);
      }

      const result = await response.json();
      return result.calls || [];

    } catch (error) {
      console.error('Failed to get call history:', error);
      throw error;
    }
  }
}

// Create a singleton instance
export const vapiService = new VAPIService();

// Convenience function to make a call with user and car context
export const makeVAPICall = async (
  user: User, 
  car: CarContext, 
  options?: {
    assistantId?: string;
    customerId?: string;
    metadata?: Record<string, any>;
  }
): Promise<VAPICallResponse> => {
  if (!user.phone) {
    throw new Error('User phone number is required for VAPI calls');
  }

  const context = vapiService.createCallContext(user, car);
  
  return vapiService.makeCall({
    phoneNumber: user.phone,
    context,
    ...options,
  });
};

// Export types for use in other components
export type { VAPICallContext, VAPICallRequest, VAPICallResponse, VAPIError, CarContext };
