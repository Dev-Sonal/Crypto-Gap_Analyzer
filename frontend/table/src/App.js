import logo from './logo.svg';
import './App.css';
import Table from './components/table'
import { BrowserRouter,Routes,Route} from 'react-router-dom';
import UserProfilePage from './components/profile';
function App() {
  return (
    <div className="App">
          <BrowserRouter>
          <Routes>
          <Route path='/'  element={<Table/>}/>
          <Route path='/userprofile'   element={<UserProfilePage/>}/>
          </Routes>
          </BrowserRouter>
    </div>
  );
}

export default App;
