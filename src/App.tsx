import React from 'react';
import {
  BrowserRouter, Route, Routes, Navigate
} from 'react-router-dom'
import './App.scss';
import Login from './Login';
import Header from './Header';
import Blog from './Blog';
import Features from './Features';
import Dashboard from './Dashboard';
import {AuthProvider, RequireAuth} from './AuthSystem';


function App(): JSX.Element {
  return (
    <AuthProvider>   
      <BrowserRouter>
      <Header />
        <Routes>
          <Route path="*" element={<Navigate replace to="/login" />} />
          <Route path="/dashboard" element={
            <RequireAuth >
              <Dashboard />
            </RequireAuth>} />  
          <Route path="/features" element={<Features />} />
          <Route path="/blog"  element={<Blog/>} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
