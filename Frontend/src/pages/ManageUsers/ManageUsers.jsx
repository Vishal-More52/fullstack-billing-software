import React, { useEffect, useState } from 'react'
import './ManageUsers.css'
import UserForm from '../../components/UserForm/UserForm'
import UserList from '../../components/UserList/UserList'
import toast from 'react-hot-toast'
import { fetchUsers } from '../../Service/UserService.js'
const ManageUsers = () => {

  const [users , setUsers] = useState([]);
  const [loading,setLoading] = useState(false);

  useEffect(()=>{
    async function loadUsers(){
      try {
        setLoading(true);
        const response = await fetchUsers();
        if (response.data && Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          console.error("Unexpected response format:", response.data);
          toast.error("Unexpected response format from server");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        if (error.response) {
          console.error("Response status:", error.response.status);
          console.error("Response data:", error.response.data);
          if (error.response.status === 401) {
            toast.error("Unauthorized - Please login again");
          } else if (error.response.status === 403) {
            toast.error("Forbidden - Admin access required");
          } else {
            toast.error(error.response.data?.message || "Unable to fetch Users");
          }
        } else if (error.request) {
          console.error("Request made but no response:", error.request);
          toast.error("No response from server - Check if backend is running");
        } else {
          toast.error("Unable to fetch Users");
        }
      }
      finally{
        setLoading(false);
      }
    }
    loadUsers();
  },[])


  return (
    <div className="users-container text-light">
      <div className="left-column">
        <UserForm setUsers={setUsers}/>
      </div>
      <div className="right-column">
        <UserList users={users} setUsers={setUsers} />
      </div>
    </div>
  )
}

export default ManageUsers
