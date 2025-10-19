// VAPI configuration and environment variables
export interface VAPIConfig {
  apiKey: string;
  baseUrl: string;
  assistantId?: string;
  defaultAssistantId?: string;
  webhookUrl?: string;
  maxRetries: number;
  timeout: number;
}

// Default VAPI configuration
export const defaultVAPIConfig: VAPIConfig = {
  apiKey: process.env.REACT_APP_VAPI_API_KEY || 'a7d5c493-c159-4a3a-97d4-2b150427aea2', // Hardcoded API key for testing
  baseUrl: process.env.REACT_APP_VAPI_BASE_URL || 'https://api.vapi.ai',
  assistantId: process.env.REACT_APP_VAPI_ASSISTANT_ID || '2efecb4a-5295-4f74-9ee0-7ea4d8478b73', // Hardcoded assistant ID for testing
  defaultAssistantId: process.env.REACT_APP_VAPI_DEFAULT_ASSISTANT_ID,
  webhookUrl: process.env.REACT_APP_VAPI_WEBHOOK_URL,
  maxRetries: 3,
  timeout: 30000, // 30 seconds
};

// Validate VAPI configuration
export const validateVAPIConfig = (config: VAPIConfig): string[] => {
  const errors: string[] = [];

  if (!config.apiKey) {
    errors.push('VAPI API key is required. Set REACT_APP_VAPI_API_KEY environment variable.');
  }

  if (!config.baseUrl) {
    errors.push('VAPI base URL is required. Set REACT_APP_VAPI_BASE_URL environment variable.');
  }

  if (!config.assistantId && !config.defaultAssistantId) {
    errors.push('VAPI assistant ID is required. Set REACT_APP_VAPI_ASSISTANT_ID or REACT_APP_VAPI_DEFAULT_ASSISTANT_ID environment variable.');
  }

  return errors;
};

// Get VAPI configuration with validation
export const getVAPIConfig = (): VAPIConfig => {
  const config = { ...defaultVAPIConfig };
  const errors = validateVAPIConfig(config);
  
  if (errors.length > 0) {
    console.warn('VAPI configuration issues:', errors);
  }
  
  return config;
};

// Environment variables documentation
export const VAPI_ENV_VARS = {
  REACT_APP_VAPI_API_KEY: 'Your VAPI API key for authentication',
  REACT_APP_VAPI_BASE_URL: 'VAPI API base URL (default: https://api.vapi.ai)',
  REACT_APP_VAPI_ASSISTANT_ID: 'Default VAPI assistant ID for making calls',
  REACT_APP_VAPI_DEFAULT_ASSISTANT_ID: 'Fallback assistant ID if no specific one is provided',
  REACT_APP_VAPI_WEBHOOK_URL: 'Webhook URL for receiving call events (optional)',
} as const;

// Helper function to check if VAPI is properly configured
export const isVAPIConfigured = (): boolean => {
  const errors = validateVAPIConfig(defaultVAPIConfig);
  return errors.length === 0;
};

// Helper function to get configuration status
export const getVAPIStatus = (): {
  configured: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors = validateVAPIConfig(defaultVAPIConfig);
  const warnings: string[] = [];
  
  if (!defaultVAPIConfig.webhookUrl) {
    warnings.push('Webhook URL not configured. Call events will not be received.');
  }
  
  return {
    configured: errors.length === 0,
    errors,
    warnings,
  };
};
