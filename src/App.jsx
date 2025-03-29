import { Route, Routes, Navigate } from 'react-router';
import Navbar from './components/Navbar';
import Userlist from './components/Userlist';
import Login from './components/Login';
import { useState } from 'react';

function App() {
  const [token, settoken] = useState(localStorage.getItem('token'))
  console.log(token)

  return (
    <>
      <Navbar token={token} settoken={settoken} />
      <Routes>
        {/* If token exists, redirect to Userlist, else show Login */}
        <Route path="/" element={token ? <Navigate to="/users" /> : <Login settoken={settoken} />} />
        <Route path="/users" element={token ? <Userlist /> : <Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
