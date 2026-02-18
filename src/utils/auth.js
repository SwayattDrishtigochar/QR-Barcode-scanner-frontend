// Authentication utility for basic frontend authentication

const AUTH_KEY = "bin_scanner_auth";
const AUTH_DURATION = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

/**
 * Check if user is authenticated
 * @returns {boolean} - true if authenticated and not expired
 */
export const isAuthenticated = () => {
  try {
    const authData = localStorage.getItem(AUTH_KEY);
    if (!authData) return false;

    const { timestamp } = JSON.parse(authData);
    const now = Date.now();

    // Check if authentication has expired
    if (now - timestamp > AUTH_DURATION) {
      localStorage.removeItem(AUTH_KEY);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
};

/**
 * Validate credentials against environment variables
 * @param {string} username
 * @param {string} password
 * @returns {boolean} - true if credentials are valid
 */
export const validateCredentials = (username, password) => {
  const validUsername = import.meta.env.VITE_USERNAME;
  const validPassword = import.meta.env.VITE_PASSWORD;

  return username === validUsername && password === validPassword;
};

/**
 * Save authentication to localStorage
 */
export const saveAuthentication = () => {
  const authData = {
    timestamp: Date.now(),
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
};

/**
 * Clear authentication
 */
export const clearAuthentication = () => {
  localStorage.removeItem(AUTH_KEY);
};

/**
 * Prompt user for credentials and validate
 * @returns {boolean} - true if user authenticated successfully
 */
export const promptForCredentials = () => {
  // Check if already authenticated
  if (isAuthenticated()) {
    return true;
  }

  let attempts = 0;
  const maxAttempts = 3; // Limit consecutive attempts to prevent infinite loops

  while (attempts < maxAttempts) {
    const username = prompt("Please enter username:");

    // User cancelled
    if (username === null) {
      return false;
    }

    const password = prompt("Please enter password:");

    // User cancelled
    if (password === null) {
      return false;
    }

    // Validate credentials
    if (validateCredentials(username, password)) {
      saveAuthentication();
      alert("Authentication successful!");
      return true;
    } else {
      attempts++;
      if (attempts < maxAttempts) {
        alert("Invalid credentials. Please try again.");
      } else {
        alert(
          "Too many failed attempts. Please refresh the page to try again.",
        );
        return false;
      }
    }
  }

  return false;
};
