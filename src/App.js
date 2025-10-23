import React from 'react';
import {Routes,Route,BrowserRouter} from 'react-router-dom';
import Begin from './Mediaid_frontend/Begin.js';
import Login from './Mediaid_frontend/Login.js';
import Signup from './Mediaid_frontend/Signup.js';
import Dia from './Mediaid_frontend/Dia.js';
import Find from './Mediaid_frontend/Find.js';
import Pills from './Mediaid_frontend/Pills.js';
import Profile from './Mediaid_frontend/Profile.js';
import DonorApprove from "./Mediaid_frontend/DonorApprove"; // import the new component

import './index.css';
import ProtectedRoute from './components/ProtectedRoute.jsx';
export default function App(){
  return(
  <BrowserRouter>
  <Routes>
    <Route path='/' element={<Begin />}></Route>
    <Route path='/login' element={<Login />}></Route>
    <Route path='/signup' element={<Signup />}></Route>
      <Route path='/profile' element={<Profile />}></Route>
            <Route path='/donor-approve' element={<DonorApprove />}></Route>

    <Route path='/dia' element={<ProtectedRoute><Dia /></ProtectedRoute>}></Route>
    <Route path='/find' element={<ProtectedRoute><Find /></ProtectedRoute>}></Route>
    <Route path='/pills' element={<ProtectedRoute><Pills /></ProtectedRoute>}></Route>
    
  </Routes>
  </BrowserRouter>
  )
}
