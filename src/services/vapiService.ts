// Vapi service for making voice calls to dealerships
export interface VapiCallRequest {
  assistantId: string;
  phoneNumberId: string;
  customer: {
    number: string;
  };
  assistantOverrides: {
    variableValues: {
      firstName: string;
      lastName: string;
      carMake: string;
      carModel: string;
      carYear: string;
      carColor: string;
      financeOrLease: string;
      carTrim?: string;
      carPrice?: string;
      carStockNumber?: string;
      dealershipName?: string;
      dealershipLocation?: string;
    };
  };
}

export interface VapiCallResponse {
  id: string;
  status: string;
  message?: string;
}

export interface VapiError {
  error: string;
  message?: string;
}

class VapiService {
  private readonly API_BASE_URL = 'https://api.vapi.ai';
  private readonly API_KEY = '859aa1cc-7583-4e20-977c-76fe4eb7c31f';
  private readonly ASSISTANT_ID = 'fdff7167-2070-47d0-a27d-246729b17134';
  private readonly PHONE_NUMBER_ID = '6eebbff3-f997-4c27-89f2-7b82a16e18b7';

  /**
   * Initiates a voice call to a customer about a specific car
   */
  async initiateCall(request: {
    customerPhone: string;
    firstName: string;
    lastName: string;
    carMake: string;
    carModel: string;
    carYear: string;
    carColor: string;
    financeOrLease: string;
    carTrim?: string;
    carPrice?: number;
    carStockNumber?: string;
    dealershipName?: string;
    dealershipCity?: string;
    dealershipState?: string;
  }): Promise<VapiCallResponse> {
    const callRequest: VapiCallRequest = {
      assistantId: this.ASSISTANT_ID,
      phoneNumberId: this.PHONE_NUMBER_ID,
      customer: {
        number: request.customerPhone,
      },
      assistantOverrides: {
        variableValues: {
          firstName: request.firstName,
          lastName: request.lastName,
          carMake: request.carMake,
          carModel: request.carModel,
          carYear: request.carYear,
          carColor: request.carColor,
          financeOrLease: request.financeOrLease,
          carTrim: request.carTrim || '',
          carPrice: request.carPrice ? `$${request.carPrice.toLocaleString()}` : '',
          carStockNumber: request.carStockNumber || '',
          dealershipName: request.dealershipName || '',
          dealershipLocation: request.dealershipCity && request.dealershipState 
            ? `${request.dealershipCity}, ${request.dealershipState}` 
            : '',
        },
      },
    };

    try {
      // Debug: Log the car information being sent to Vapi
      console.log('Vapi Call Request - Car Information:', {
        carMake: callRequest.assistantOverrides.variableValues.carMake,
        carModel: callRequest.assistantOverrides.variableValues.carModel,
        carYear: callRequest.assistantOverrides.variableValues.carYear,
        carColor: callRequest.assistantOverrides.variableValues.carColor,
        carTrim: callRequest.assistantOverrides.variableValues.carTrim,
        carPrice: callRequest.assistantOverrides.variableValues.carPrice,
        carStockNumber: callRequest.assistantOverrides.variableValues.carStockNumber,
        dealershipName: callRequest.assistantOverrides.variableValues.dealershipName,
        dealershipLocation: callRequest.assistantOverrides.variableValues.dealershipLocation,
      });

      const response = await fetch(`${this.API_BASE_URL}/call`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(callRequest),
      });

      if (!response.ok) {
        const errorData: VapiError = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to initiate call');
      }

      const data: VapiCallResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred while initiating call');
    }
  }

  /**
   * Gets the status of a call by ID
   */
  async getCallStatus(callId: string): Promise<VapiCallResponse> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/call/${callId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData: VapiError = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to get call status');
      }

      const data: VapiCallResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred while getting call status');
    }
  }

  /**
   * Validates a phone number format
   */
  validatePhoneNumber(phoneNumber: string): boolean {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Check if it's a valid US phone number (10 digits) or international (11+ digits)
    return cleaned.length >= 10 && cleaned.length <= 15;
  }

  /**
   * Formats a phone number for display
   */
  formatPhoneNumber(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    if (cleaned.length === 10) {
      // US format: (XXX) XXX-XXXX
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length === 11 && cleaned[0] === '1') {
      // US format with country code: +1 (XXX) XXX-XXXX
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    
    // Return as-is for international numbers
    return phoneNumber;
  }
}

export const vapiService = new VapiService();
