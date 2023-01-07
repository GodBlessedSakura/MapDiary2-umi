export default [
  { exact: true, path: '/', component: './Home' },
  { path: '/signup', component: './Signup' },
  { path: '/login', component: './Login' },
  {
    path: '/settings',
    component: './UserSettings',
    // redirect: '/settings/user',
    routes: [
      { path: '/settings/user', component: './UserSettings/User' },
      { path: '/settings/privacy', component: './UserSettings/Privacy' },
      { path: '/settings/admin', component: './UserSettings/Admin' },
    ],
  },
]
