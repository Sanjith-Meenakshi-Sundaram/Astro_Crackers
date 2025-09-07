import { showToast } from './toast';

// Override the native alert function globally
export const setupGlobalToast = () => {
  // Store original alert function
  const originalAlert = window.alert;
  
  // Override window.alert with toast
  window.alert = (message) => {
    // Determine toast type based on message content
    const msg = message.toLowerCase();
    
    if (msg.includes('success') || msg.includes('✅') || msg.includes('added to cart') || 
        msg.includes('login successful') || msg.includes('registered successfully')) {
      showToast.success(message);
    } else if (msg.includes('error') || msg.includes('wrong') || msg.includes('failed') || 
               msg.includes('invalid') || msg.includes('not found')) {
      showToast.error(message);
    } else if (msg.includes('please') || msg.includes('login') || msg.includes('warning')) {
      showToast.warning(message);
    } else {
      showToast.info(message);
    }
  };

  // Return function to restore original alert if needed
  return () => {
    window.alert = originalAlert;
  };
};