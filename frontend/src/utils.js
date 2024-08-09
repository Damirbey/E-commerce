
/*export function getError(err) {
    const message =
      err.response && err.response.data ? err.response.data.message : err.message;
    return message;
}*/
  
export function getError(err) {
  if (!err) {
      return 'An unknown error occurred'; // Default message for undefined error
  }
  if (err.response && err.response.data) {
      return err.response.data.message || 'An error occurred'; // Error message from server response
  }
  return err.message || 'An error occurred'; // Fallback error message
}