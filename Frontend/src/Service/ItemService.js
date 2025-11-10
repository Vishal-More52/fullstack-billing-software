import axios from "axios";

export const addItem = async(item, file) =>{
    const formData = new FormData();
    formData.append('item', JSON.stringify(item));
    if (file) {
        formData.append('file', file);
    }
    
    return await axios.post(`http://localhost:8080/api/v1.0/admin/items`, formData, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const deleteItem = async(itemId) =>{
    return await axios.delete(`http://localhost:8080/api/v1.0/admin/items/${itemId}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
}

export const fetchItems = async()=>{
    return await axios.get(`http://localhost:8080/api/v1.0/items`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
}