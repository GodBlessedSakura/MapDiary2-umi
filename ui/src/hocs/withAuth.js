import { Navigate } from 'umi'

const withAuth = (Component) => () => {
  const isLogin = true
  if (isLogin) {
    return <Component />
  } else {
    return <Navigate to="/login" />
  }
}

export default withAuth
