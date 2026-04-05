export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: any) => {
  if (error.response) {
    throw new ApiError(error.response.status, error.response.data?.message || 'API Error', error.response.data);
  } else if (error.request) {
    throw new ApiError(0, 'Network error: No response from server');
  } else {
    throw new ApiError(0, error.message || 'Unknown error');
  }
};

export const getUserFriendlyError = (error: any): string => {
  if (error instanceof ApiError) {
    switch (error.statusCode) {
      case 400:
        return 'Invalid input. Please check your information.';
      case 404:
        return 'Resource not found.';
      case 409:
        return 'This order already exists. Please check your order ID.';
      case 500:
        return 'Server error. Please try again later.';
      case 0:
        return error.message || 'Network error. Please check your connection.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred.';
};

export const logError = (error: any, context: string = '') => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Error] ${context}:`, error);
  }
  // In production, you might want to send to Sentry or similar
};
