export const getTokens = () => {
  const accessToken = localStorage.getItem('md2_access_token')
  const refreshToken = localStorage.getItem('md2_refresh_token')
  return {
    accessToken,
    refreshToken,
  }
}

export const clearTokens = () => {
  localStorage.removeItem('md2_access_token')
  localStorage.removeItem('md2_refresh_token')
  localStorage.removeItem('md2_user')
}

export const setTokens = (userName, accessToken, refreshToken) => {
  userName && localStorage.setItem('md2_user', userName)
  accessToken && localStorage.setItem('md2_access_token', accessToken)
  refreshToken && localStorage.setItem('md2_refresh_token', refreshToken)
}
