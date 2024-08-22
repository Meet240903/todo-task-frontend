import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Menu from './components/Menu';
import TableView from './components/TableView';
import Register from './components/Register';
import UserDetails from './components/UserDetails';
import EditForm from './components/EditForm';

function App() {
  return (
  <>
    <div>
      <Menu/>
      <BrowserRouter>
        <Routes>
            <Route exact path='/' element={<TableView/>} />
            <Route exact path='/register' element={<Register/>} />
            <Route exact path='/user-details/:id' element={<UserDetails/>} />
            <Route exact path='/edit/:id' element={<EditForm/>} />
        </Routes>
      </BrowserRouter>
    </div>
  </>
  );
}

export default App;
