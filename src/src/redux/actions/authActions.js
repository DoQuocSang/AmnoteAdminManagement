export const loginSuccess = (accessToken) => {
    return {
      type: 'LOGIN_SUCCESS',
      payload: {
        accessToken
      }
    };
  };
  
  export const logout = () => {
    return {
      type: 'LOGOUT'
    };
  };
  