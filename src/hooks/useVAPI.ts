// React hook for VAPI integration
import { useState, useCallback } from 'react';
import { vapiService, makeVAPICall, VAPICallResponse, VAPIError, CarContext } from '@/services/vapiService';
import { User } from '@/services/api';
import { isVAPIConfigured, getVAPIStatus } from '@/services/vapiConfig';

export interface UseVAPIReturn {
  // State
  isCalling: boolean;
  callStatus: VAPICallResponse | null;
  error: string | null;
  isConfigured: boolean;
  configStatus: ReturnType<typeof getVAPIStatus>;
  
  // Actions
  makeCall: (user: User, car: CarContext, options?: {
    assistantId?: string;
    customerId?: string;
    metadata?: Record<string, any>;
  }) => Promise<VAPICallResponse>;
  getCallStatus: (callId: string) => Promise<VAPICallResponse>;
  cancelCall: (callId: string) => Promise<boolean>;
  clearError: () => void;
  refreshCallStatus: () => Promise<void>;
}

export const useVAPI = (): UseVAPIReturn => {
  const [isCalling, setIsCalling] = useState(false);
  const [callStatus, setCallStatus] = useState<VAPICallResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const isConfigured = isVAPIConfigured();
  const configStatus = getVAPIStatus();

  const makeCall = useCallback(async (
    user: User, 
    car: CarContext, 
    options?: {
      assistantId?: string;
      customerId?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<VAPICallResponse> => {
    if (!isConfigured) {
      const errorMsg = 'VAPI is not properly configured. Please check your environment variables.';
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    if (!user.phone) {
      const errorMsg = 'User phone number is required for making calls.';
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    setIsCalling(true);
    setError(null);
    setCallStatus(null);

    try {
      const response = await makeVAPICall(user, car, options);
      setCallStatus(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to make call';
      setError(errorMessage);
      throw err;
    } finally {
      setIsCalling(false);
    }
  }, [isConfigured]);

  const getCallStatus = useCallback(async (callId: string): Promise<VAPICallResponse> => {
    if (!isConfigured) {
      const errorMsg = 'VAPI is not properly configured.';
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    try {
      const response = await vapiService.getCallStatus(callId);
      setCallStatus(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get call status';
      setError(errorMessage);
      throw err;
    }
  }, [isConfigured]);

  const cancelCall = useCallback(async (callId: string): Promise<boolean> => {
    if (!isConfigured) {
      const errorMsg = 'VAPI is not properly configured.';
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    try {
      const success = await vapiService.cancelCall(callId);
      if (success) {
        setCallStatus(null);
        setIsCalling(false);
      }
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel call';
      setError(errorMessage);
      throw err;
    }
  }, [isConfigured]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshCallStatus = useCallback(async (): Promise<void> => {
    if (callStatus?.id) {
      try {
        await getCallStatus(callStatus.id);
      } catch (err) {
        // Silently handle errors when refreshing status
        console.warn('Failed to refresh call status:', err);
      }
    }
  }, [callStatus?.id, getCallStatus]);

  return {
    // State
    isCalling,
    callStatus,
    error,
    isConfigured,
    configStatus,
    
    // Actions
    makeCall,
    getCallStatus,
    cancelCall,
    clearError,
    refreshCallStatus,
  };
};
