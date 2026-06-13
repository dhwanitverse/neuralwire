export function getApiErrorMessage(err: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (err && typeof err === 'object') {
    const axiosErr = err as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    if (axiosErr.response?.data?.message) return axiosErr.response.data.message;
    if (axiosErr.message) return axiosErr.message;
  }
  return fallback;
}
