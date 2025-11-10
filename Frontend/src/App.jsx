import React from 'react'
import Menubar from './components/MenuBar/Menubar'
import { Route, Router, Routes, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard/Dashboard'
import ManageCategory from './pages/ManageCategory/ManageCategory'
import ManageUsers from './pages/ManageUsers/ManageUsers'
import ManageItems from './pages/ManageItems/ManageItems'
import Explore from './pages/Explore/Explore'
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login/Login'

const App = () => {

  const location = useLocation();

  return (
    <div>
      {location.pathname !== "/login" && <Menubar />}
      <Toaster />
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/category' element={<ManageCategory />} />
        <Route path='/users' element={<ManageUsers />} />
        <Route path='/items' element={<ManageItems />} />
        <Route path='/explore' element={<Explore />} />
        <Route path='/login' element={<Login />} />

      </Routes>
    </div>
  )
}

export default App
