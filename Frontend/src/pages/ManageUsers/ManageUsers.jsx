import React from 'react'
import './ManageUsers.css'
import UserForm from '../../components/UserForm/UserForm'
import UserList from '../../components/UserList/UserList'
const ManageUsers = () => {
  return (
    <div className="users-container text-light">
      <div className="left-column">
        <UserForm />
      </div>
      <div className="right-column">
        <UserList />
      </div>
    </div>
  )
}

export default ManageUsers
