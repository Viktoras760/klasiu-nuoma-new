import "bootstrap/dist/css/bootstrap.min.css";
import APIController from './Controllers/APIController';
import Guest from './Views/NavBar/GuestNav';
import Auth from './Views/NavBar/AuthNav';

function App() {

  const { getToken } = APIController();

  if (!getToken()) {
    return <Guest />
  }

  return (
    <Auth />
  );
}

export default App;
