import React, { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext';
import { deleteItem } from '../../Service/ItemService';
import toast from 'react-hot-toast';

const ItemList = () => {
  
  const context = useContext(AppContext);
  
  if (!context) {
    return <div>Loading...</div>;
  }
  
  const { itemsData = [], setItemsData } = context;
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = itemsData.filter((item) => {
    return item.name?.toLowerCase().includes(searchTerm.toLowerCase());
  })


  const removeItem = async (itemId)=>{
    try {
      const response = await deleteItem(itemId);
      if(response.status ===204){
        const updatedItems = itemsData.filter(item => item.itemId !==itemId)
        setItemsData(updatedItems);
        toast.success("Item deleted")
      }
      else{
        toast.error("Unable to delete item")
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete item")
      
    }
  }

  return (
    <div className='category-list-container' style={{ height: '100vh', overflowY: 'auto', overflowX: 'hidden' }}>

      <div className="row pe-2">
        <div className="input-group mb-3">
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

      <div className="row g-3 pe-2">
        {filteredItems.length === 0 ? (
          <div className="col-12">
            <div className="card p-3 bg-dark text-center">
              <p className="text-white mb-0">
                {searchTerm ? "No items found matching your search" : "No items found"}
              </p>
            </div>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div className="col-12" key={item.itemId}>
              <div className="card p-3 bg-dark">
                <div className="d-flex align-items-center">
                  <div className="item-image me-3">
                    <img src={item.imgUrl} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-1 text-white">{item.name}</h6>
                    <p className="mb-0 text-white">Category : {item.categoryName}</p>
                    <span className="mb-0 text-block badge rounded-pill text-bg-warning">
                      &#8377;{item.price}
                    </span>
                  </div>
                  <div className="">
                    <button className="btn btn-danger btn-sm" onClick={()=>removeItem(item.itemId)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ItemList
