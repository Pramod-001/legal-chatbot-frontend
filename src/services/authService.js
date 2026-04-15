const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

export const initializeGoogleAuth = (callback) => {
  if (!window.google) {
    console.error('Google Identity Services not loaded');
    return;
  }

  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: callback,
  });
};

export const renderGoogleButton = (elementId) => {
  if (!window.google) {
    console.error('Google Identity Services not loaded');
    return;
  }

  window.google.accounts.id.renderButton(
    document.getElementById(elementId),
    {
      theme: 'outline',
      size: 'large',
      type: 'standard',
      shape: 'pill',
      text: 'continue_with',
      width: '340',
    }
  );
};

export const decodeJwtResponse = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
};

export const extractUserData = (token) => {
  const payload = decodeJwtResponse(token);
  return {
    name: payload.name,
    firstName: payload.given_name,
    picture: payload.picture,
    email: payload.email,
  };
};
