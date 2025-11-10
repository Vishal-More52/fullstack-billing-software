import React, { useState } from 'react'
import { deleteUser } from '../../Service/UserService';
import toast from 'react-hot-toast';

const UserList = ({ users = [], setUsers }) => {

  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteByUserId =  async(id)=>{
    try {
      await deleteUser(id);
      setUsers(prevUsers => prevUsers.filter(user =>user.userId !==id))
      toast.success("User Deleted")
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete user")
      
    }
  }


  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="mb-3">
        <div className="input-group">
          <input type="text"
            name='keyword'
            id='keyword'
            placeholder='Search by keyword'
            className='form-control'
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <span className="input-group-text bg-warning">
            <i className="bi bi-search"></i>
          </span>
        </div>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <div className="row g-3">
          {
            filteredUsers.length === 0 ? (
              <div className="col-12">
                <div className="card p-3 bg-dark text-center">
                  <p className="text-white mb-0">
                    {searchTerm ? "No users found matching your search" : "No users found"}
                  </p>
                </div>
              </div>
            ) : (
              filteredUsers.map((user)=>(
                <div key={user.userId} className="col-12">
                  <div className="card p-3 bg-dark">
                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1">
                        <h5 className='mb-1 text-white'>{user.name}</h5>
                        <p className="mb-0 text-white">{user.email}</p>
                      </div>
                      <div className="">
                        <button className="btn btn-danger btn-sm" onClick={()=>deleteByUserId(user.userId)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )
          }
        </div>
      </div>
    </div>
  )
}

export default UserList
