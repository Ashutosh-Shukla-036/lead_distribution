export const getToken = () => sessionStorage.getItem("token");
export const setToken = (token) => sessionStorage.setItem("token", token);
export const clearToken = () => sessionStorage.removeItem("token");

export const logout = () => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("authState");
    window.location.href = "/login"; 
  }
};

