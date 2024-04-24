// import DashboardAdmin from "./DashboardAdmin";
// import AboutPage from './AboutPage';
// import ContactPage from './ContactPage';

const routes = [
  { path: '/users', component: 'User Management', access: 'admin' },
  { path: '/buildings', component: 'Building Management', access: 'both' },
  { path: '/attendeeReports', component: 'Reports', access: 'both' },
  { path: '/settings', component: 'Settings', access: 'both' },
  { path: '/logout', component: 'Logout', access: 'both' },

  // Additional routes
];

export default routes;
