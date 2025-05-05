
export function isAuthenticated() {
  const token = localStorage.getItem('token');
  return !!token;
}

export function logout() {
  localStorage.removeItem('token');
}

export function handleAuthError(error, navigate) {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('token');
    navigate('/');
  }
}
