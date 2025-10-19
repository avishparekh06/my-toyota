# VAPI Integration Setup Guide

This guide explains how to set up and use the VAPI (Voice AI Platform) integration for making phone calls with user and car context injection.

## Overview

The VAPI service allows you to make automated phone calls to users with contextual information about:
- **User Information**: First name, last name, phone number
- **Car Information**: Make, model, year, color, financing option
- **Additional Context**: User location, budget range, preferred features

## Environment Variables

Add the following environment variables to your `.env` file:

```bash
# Required
REACT_APP_VAPI_API_KEY=your_vapi_api_key_here

# Optional
REACT_APP_VAPI_BASE_URL=https://api.vapi.ai
REACT_APP_VAPI_ASSISTANT_ID=your_default_assistant_id
REACT_APP_VAPI_DEFAULT_ASSISTANT_ID=your_fallback_assistant_id
REACT_APP_VAPI_WEBHOOK_URL=your_webhook_url_for_call_events
```

## Getting Your VAPI API Key

1. Sign up for a VAPI account at [https://vapi.ai](https://vapi.ai)
2. Navigate to your dashboard
3. Go to API Keys section
4. Create a new API key
5. Copy the key and add it to your environment variables

## Getting Your Assistant ID

1. In your VAPI dashboard, go to Assistants
2. Create a new assistant or use an existing one
3. Copy the Assistant ID
4. Add it to your environment variables

## Usage Examples

### Basic Usage with VAPICallButton Component

```tsx
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import VAPICallButton from '@/components/VAPICallButton';
import { CarContext } from '@/services/vapiService';

const MyComponent: React.FC = () => {
  const { user } = useAuth();

  const car: CarContext = {
    make: 'Toyota',
    model: 'Camry',
    color: 'White',
    year: 2024,
    financingOption: 'Finance'
  };

  return (
    <VAPICallButton
      user={user}
      car={car}
      showStatus={true}
      onCallStarted={(callId) => console.log('Call started:', callId)}
      onCallCompleted={(callId, status) => console.log('Call completed:', callId, status)}
      onError={(error) => console.error('Call error:', error)}
    />
  );
};
```

### Using the VAPI Hook Directly

```tsx
import React from 'react';
import { useVAPI } from '@/hooks/useVAPI';
import { useAuth } from '@/contexts/AuthContext';
import { CarContext } from '@/services/vapiService';

const MyComponent: React.FC = () => {
  const { user } = useAuth();
  const { makeCall, isCalling, callStatus, error } = useVAPI();

  const car: CarContext = {
    make: 'Toyota',
    model: 'RAV4',
    color: 'Blue',
    year: 2024,
    financingOption: 'Lease'
  };

  const handleMakeCall = async () => {
    try {
      const response = await makeCall(user, car);
      console.log('Call response:', response);
    } catch (err) {
      console.error('Call failed:', err);
    }
  };

  return (
    <div>
      <button onClick={handleMakeCall} disabled={isCalling}>
        {isCalling ? 'Calling...' : 'Make Call'}
      </button>
      {error && <p className="error">{error}</p>}
      {callStatus && <p>Call Status: {callStatus.status}</p>}
    </div>
  );
};
```

### Using the Service Directly

```tsx
import { vapiService, makeVAPICall } from '@/services/vapiService';
import { CarContext } from '@/services/vapiService';

const car: CarContext = {
  make: 'Toyota',
  model: 'Highlander',
  color: 'Black',
  year: 2024,
  financingOption: 'Finance'
};

// Using the convenience function
const response = await makeVAPICall(user, car);

// Or using the service directly
const context = vapiService.createCallContext(user, car);
const response = await vapiService.makeCall({
  phoneNumber: user.phone,
  context,
  assistantId: 'your-assistant-id'
});
```

## Context Injection

The service automatically injects the following context into your VAPI calls:

### User Context
- `firstName`: User's first name
- `lastName`: User's last name
- `phoneNumber`: User's phone number
- `userLocation`: User's city and state (if available)
- `budgetRange`: User's budget range (if available)
- `preferredFeatures`: User's preferred car features (if available)

### Car Context
- `carMake`: Car manufacturer (e.g., "Toyota")
- `carModel`: Car model (e.g., "Camry")
- `carYear`: Car year (e.g., 2024)
- `carColor`: Car color (e.g., "White")
- `financingOption`: Financing preference ("Finance", "Lease", or "Cash")

### Example Context String
```
Customer: John Doe
Vehicle: 2024 Toyota Camry in White
Financing: Finance
Location: San Francisco, CA
Budget: $25,000 - $35,000
Preferred Features: Apple CarPlay, Heated Seats, Backup Camera
```

## Call Status Tracking

The service provides real-time call status updates:

- `queued`: Call is queued for processing
- `ringing`: Phone is ringing
- `in-progress`: Call is active
- `completed`: Call finished successfully
- `failed`: Call failed

## Error Handling

The service includes comprehensive error handling for:

- Missing API key
- Invalid phone numbers
- Network errors
- VAPI API errors
- Missing user phone numbers

## Phone Number Formatting

The service automatically formats phone numbers for VAPI:
- Removes all non-numeric characters
- Adds +1 prefix for 10-digit US numbers
- Preserves existing country codes

## Webhook Integration

To receive call events, set up a webhook URL in your VAPI dashboard and add it to your environment variables. The webhook will receive events for:

- Call started
- Call completed
- Call failed
- Call transcript available
- Call recording available

## Testing

1. Ensure all environment variables are set
2. Verify your VAPI API key is valid
3. Test with a valid phone number
4. Check the browser console for any errors
5. Monitor call status in the VAPI dashboard

## Troubleshooting

### Common Issues

1. **"VAPI Not Configured" Error**
   - Check that `REACT_APP_VAPI_API_KEY` is set
   - Verify the API key is valid

2. **"Phone Number Required" Error**
   - Ensure the user has a phone number in their profile
   - Check that the phone number is properly formatted

3. **Call Fails Immediately**
   - Verify the assistant ID is correct
   - Check that the phone number is valid
   - Ensure you have sufficient VAPI credits

4. **Context Not Appearing in Calls**
   - Check that the context string is being built correctly
   - Verify the assistant is configured to use the context

### Debug Mode

Enable debug logging by adding this to your component:

```tsx
import { vapiService } from '@/services/vapiService';

// Check configuration status
console.log('VAPI Status:', vapiService.getVAPIStatus());
```

## Security Considerations

- Never expose your VAPI API key in client-side code
- Use environment variables for all sensitive configuration
- Implement proper error handling to avoid exposing sensitive information
- Consider rate limiting for call requests
- Validate phone numbers before making calls

## Support

For VAPI-specific issues:
- Check the [VAPI Documentation](https://docs.vapi.ai)
- Contact VAPI support through their dashboard

For integration issues:
- Check the browser console for errors
- Verify all environment variables are set correctly
- Ensure the user has a valid phone number
