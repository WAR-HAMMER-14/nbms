import './assets/css/style.css';
import './assets/css/bootstrap-menu.css';
import './assets/css/media.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import Users from './components/Users';
import PageTitle from './components/PageTitle';
import Logout from './components/Logout';
import AddUser from './components/AddUser';
import EditUser from './components/EditUser';
import BuildingAccess from './components/BuildingAccess';
import Buildings from './components/Buildings';
import AddBuilding from './components/AddBuilding';
import EditBuilding from './components/EditBuilding';
import PreviewBuilding from './components/PreviewBuilding';
import ViewBuilding from './components/ViewBuilding';
import Header from './components/includes/Header';
import Footer from './components/includes/Footer';
import ViewUser from './components/ViewUser';
import Settings from './components/Settings';
import AttendeeReports from './components/AttendeeReports';
import DashboardAdmin from './components/DashboardAdmin';
import EditAttendee from './components/EditAttendee';
import SetPassword from './components/SetPassword';
import ForgotPass from './components/ForgotPass';
import DashboardUser from './components/DashboardUser';
import AccessDenied from './components/AccessDenied';
import BuildingViewPublic from './components/BuildingViewPublic';

function App() {

  return (
    <div className="App">
		<BrowserRouter basename='/bms'>
			<Header />
			<Routes>
				<Route path='/admin' element={<AdminLogin />} />
				<Route path='/dashboard' element={ <DashboardAdmin /> } />
				<Route path='/users' element={ <Users />} />
				<Route path='/logout' element={<Logout />} />
				<Route path='/addUser' element={ <AddUser />} />
				<Route path='/editUser' element={ <EditUser/>} />
				<Route path='/buildingAccess' element={ <BuildingAccess/>} />
				<Route path='/buildings' element={ <Buildings/>} />
				<Route path='/addBuilding' element={ <AddBuilding/>} />
				<Route path='/editBuilding' element={ <EditBuilding/>} />
				<Route path='/previewBuilding' element={ <PreviewBuilding/>} />
				<Route path='/viewBuilding' element={ <ViewBuilding/>} />
				<Route path='/viewUser' element={ <ViewUser/>} />
				<Route path='/settings' element={<Settings/>} />
				<Route path='/attendeeReports' element={ <AttendeeReports/>} />
				<Route path='/editAttendee' element={<EditAttendee/>} />
				<Route path='/setPassword' element={<SetPassword/>} />
				<Route path='/forgotPass' element={<ForgotPass/>} />
				<Route path='/dashboardUser' element={ <DashboardUser/> } />
				<Route path='/stratanumber/:number' element={ <BuildingViewPublic/> } />
			</Routes>
			<Footer />
		</BrowserRouter>
    </div>
  );
}

export default App;
