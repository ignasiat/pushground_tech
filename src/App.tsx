import React from 'react';
import {
  BrowserRouter, Route, Routes, Navigate
} from 'react-router-dom'
import './App.scss';
import Login from './Login';
import Header from './Header';
import Blog from './Blog';
import Features from './Features';
import Dashboard from './Dashboard'


function App(): JSX.Element {
  return (
    
    <BrowserRouter>
    <Header />
      <Routes>
        <Route path="*" element={<Navigate replace to="/login" />} />
        <Route path="/dashboard" element={<Dashboard />} />  
        <Route path="/features" element={<Features />} />
        <Route path="/blog"  element={<Blog/>} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
