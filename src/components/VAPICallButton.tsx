import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, PhoneCall, PhoneOff, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useVAPI } from '@/hooks/useVAPI';
import { User } from '@/services/api';
import { CarContext } from '@/services/vapiService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VAPICallButtonProps {
  user: User;
  car: CarContext;
  assistantId?: string;
  customerId?: string;
  metadata?: Record<string, any>;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
  onCallStarted?: (callId: string) => void;
  onCallCompleted?: (callId: string, status: string) => void;
  onError?: (error: string) => void;
}

const VAPICallButton: React.FC<VAPICallButtonProps> = ({
  user,
  car,
  assistantId,
  customerId,
  metadata,
  className = '',
  variant = 'default',
  size = 'md',
  showStatus = true,
  onCallStarted,
  onCallCompleted,
  onError,
}) => {
  const {
    isCalling,
    callStatus,
    error,
    isConfigured,
    configStatus,
    makeCall,
    cancelCall,
    clearError,
  } = useVAPI();

  const [showDetails, setShowDetails] = useState(false);

  const handleMakeCall = async () => {
    try {
      clearError();
      const response = await makeCall(user, car, {
        assistantId,
        customerId,
        metadata,
      });
      
      onCallStarted?.(response.id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to make call';
      onError?.(errorMessage);
    }
  };

  const handleCancelCall = async () => {
    if (callStatus?.id) {
      try {
        await cancelCall(callStatus.id);
        onCallCompleted?.(callStatus.id, 'cancelled');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to cancel call';
        onError?.(errorMessage);
      }
    }
  };

  const getStatusIcon = () => {
    if (error) return <AlertCircle className="w-4 h-4 text-red-500" />;
    if (isCalling) return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
    if (callStatus) {
      switch (callStatus.status) {
        case 'completed':
          return <CheckCircle className="w-4 h-4 text-green-500" />;
        case 'in-progress':
          return <PhoneCall className="w-4 h-4 text-green-500 animate-pulse" />;
        case 'failed':
          return <AlertCircle className="w-4 h-4 text-red-500" />;
        default:
          return <Clock className="w-4 h-4 text-yellow-500" />;
      }
    }
    return <Phone className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (error) return 'Error';
    if (isCalling) return 'Calling...';
    if (callStatus) {
      switch (callStatus.status) {
        case 'queued':
          return 'Queued';
        case 'ringing':
          return 'Ringing';
        case 'in-progress':
          return 'In Progress';
        case 'completed':
          return 'Completed';
        case 'failed':
          return 'Failed';
        default:
          return callStatus.status;
      }
    }
    return 'Call Now';
  };

  const getButtonVariant = () => {
    if (error) return 'destructive';
    if (isCalling || (callStatus && ['queued', 'ringing', 'in-progress'].includes(callStatus.status))) {
      return 'secondary';
    }
    return variant;
  };

  const isDisabled = !isConfigured || !user.phone || isCalling;

  if (!isConfigured) {
    return (
      <div className={`${className}`}>
        <Button
          variant="outline"
          size={size}
          disabled
          className="w-full"
        >
          <AlertCircle className="w-4 h-4 mr-2" />
          VAPI Not Configured
        </Button>
        {showDetails && (
          <div className="mt-2 text-sm text-red-600">
            <p>Configuration errors:</p>
            <ul className="list-disc list-inside ml-2">
              {configStatus.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  if (!user.phone) {
    return (
      <div className={`${className}`}>
        <Button
          variant="outline"
          size={size}
          disabled
          className="w-full"
        >
          <AlertCircle className="w-4 h-4 mr-2" />
          Phone Number Required
        </Button>
        <p className="mt-1 text-sm text-gray-600">
          Please add your phone number to your profile to make calls.
        </p>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="flex items-center space-x-2">
        <Button
          onClick={isCalling || (callStatus && ['queued', 'ringing', 'in-progress'].includes(callStatus.status)) ? handleCancelCall : handleMakeCall}
          variant={getButtonVariant()}
          size={size}
          disabled={isDisabled}
          className="flex-1"
        >
          {getStatusIcon()}
          <span className="ml-2">
            {isCalling || (callStatus && ['queued', 'ringing', 'in-progress'].includes(callStatus.status)) ? 'Cancel Call' : 'Call Now'}
          </span>
        </Button>
        
        {showStatus && (callStatus || error) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="px-2"
          >
            {getStatusIcon()}
          </Button>
        )}
      </div>

      {showStatus && (callStatus || error) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-2"
        >
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon()}
                  <span className="text-sm font-medium">{getStatusText()}</span>
                </div>
                {callStatus?.id && (
                  <span className="text-xs text-gray-500">ID: {callStatus.id.slice(0, 8)}...</span>
                )}
              </div>
              
              {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
              )}
              
              {callStatus && (
                <div className="mt-2 text-xs text-gray-600">
                  <p>Phone: {callStatus.phoneNumber}</p>
                  {callStatus.duration && (
                    <p>Duration: {Math.round(callStatus.duration / 60)}m {callStatus.duration % 60}s</p>
                  )}
                  {callStatus.cost && (
                    <p>Cost: ${callStatus.cost.toFixed(2)}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-2"
        >
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Call Context</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xs space-y-1">
                <p><strong>Customer:</strong> {user.firstName} {user.lastName}</p>
                <p><strong>Vehicle:</strong> {car.year ? `${car.year} ` : ''}{car.make} {car.model} in {car.color}</p>
                <p><strong>Financing:</strong> {car.financingOption || 'Finance'}</p>
                {user.location && (
                  <p><strong>Location:</strong> {user.location.city}, {user.location.state}</p>
                )}
                {user.finance?.budgetRange && (
                  <p><strong>Budget:</strong> ${user.finance.budgetRange.min.toLocaleString()} - ${user.finance.budgetRange.max.toLocaleString()}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default VAPICallButton;
