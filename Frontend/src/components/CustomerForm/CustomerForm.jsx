import React from 'react'
import './CustomerForm.css'
const CustomerForm = ({customerName,mobileNumber,setMobileNumber,setCustomerName}) => {
    return (
        <div className='p-3'>
            <div className="mb-3">
                <div className="d-flex align-items-center gap-2">
                    <label htmlFor="customerName" className="col-4">Customer Name</label>
                    <input type="text" className='form-control form-control-sm' id='customerName' onChange={(e)=>setCustomerName(e.target.value)} value={customerName} />
                </div>
            </div>
            <div className="mb-3">
                <div className="d-flex align-items-center gap-2">
                    <label htmlFor="mobilenumber" className="col-4">Mobile Number</label>
                    <input type="text" className='form-control form-control-sm' id='mobilenumber' onChange={(e)=>setMobileNumber(e.target.value)} value={mobileNumber} />
                </div>
            </div>
            
        </div>
    )
}

export default CustomerForm
