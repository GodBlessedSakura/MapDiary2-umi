import { Navigate } from 'umi'

const withAuth = (Component) => () => {
  const isLogin = localStorage.getItem('md2_user') && localStorage.getItem('md2_access_token')
  if (isLogin) {
    return <Component />
  } else {
    return <Navigate to="/login" />
  }
}

export default withAuth
