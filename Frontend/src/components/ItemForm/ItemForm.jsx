import React, { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import { addItem } from '../../Service/ItemService'
import toast from 'react-hot-toast'

const ItemForm = () => {

    const context = useContext(AppContext);
    
    if (!context) {
        return <div>Loading...</div>;
    }
    
    const {categories = [], setItemsData, itemsData = [], setCategories} = context;
    const [image,setImage]=useState(null);
    const [loading,setLoading] = useState(false)
    const [data,setData] = useState({
        name:"",
        categoryId:"",
        price:"",
        description:"",
    });

    const onChangeHandler = (e)=>{
        const name = e.target.name;
        const value = e.target.value;
        setData((data)=>({...data,[name]: value}));
    }

    const onSubmitHandler = async (e) =>{
        e.preventDefault();
        
        if(!image)
        {
            toast.error("Please select an image");
            return;
        }

        setLoading(true);
        try {
            const response = await addItem(data, image);
            if(response.status === 201){
                setItemsData([...itemsData, response.data]);
                
                // Update category item count if needed
                if (setCategories) {
                    setCategories((prevCategories) =>
                        prevCategories.map((category) => 
                            category.categoryId === data.categoryId 
                                ? {...category, items: (category.items || 0) + 1} 
                                : category
                        )
                    );
                }
                
                toast.success("Item added successfully");
                setData({
                    name:"",
                    description:"",
                    price:"",
                    categoryId:"",
                });
                setImage(null);
            } else {
                toast.error("Unable to add item");
            }
        } catch (error) {
            console.error("Error adding item:", error);
            toast.error(error.response?.data?.message || "Unable to add item");
        } finally {
            setLoading(false);
        }
    }



    return (

        <div className="item-form-container" style={{ height: '100vh', overflowY: 'auto', overflowX: 'hidden' }}>
            <div>
                <div className='mx-2 mt-2'>
                    <div className="row">
                        <div className="card col-md-8 form-container">
                            <div className="card-body">
                                <form onSubmit={onSubmitHandler} >
                                    <div className="mb-3">
                                        <label htmlFor="image" className='form-label' style={{ cursor: 'pointer' }}>
                                            <img src={image ? URL.createObjectURL(image) : assets.upload} alt="" width={48} />
                                        </label>
                                        <input type="file" name='image' id='image' className='form-control' hidden accept="image/*" onChange={(e)=>setImage(e.target.files[0])} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="name" className='form-label'>Name</label>
                                        <input type="text" name='name' id="name" className='form-control' placeholder='Item Name' onChange={onChangeHandler} value={data.name} required/>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="category" className='form-label'>
                                            Category
                                        </label>
                                        <select name="categoryId" id="category" className='form-control' onChange={onChangeHandler} value={data.categoryId} required>
                                            <option value="">-- SELECT CATEGORY --</option>
                                            {categories.map((category,index)=>(
                                                <option key={index} value={category.categoryId}>{category.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="price" className='form-label' >Price</label>
                                        <input type="number" name="price" id="price" className='form-control' placeholder='&#8377;200.00' onChange={onChangeHandler} value={data.price} required/>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="description" className='form-label'>Description</label>
                                        <textarea rows="5" name='description' id="description" className='form-control' placeholder='Write content here ..' onChange={onChangeHandler} value={data.description}></textarea>
                                    </div>

                                    <button type='submit' className='btn btn-warning w-100' disabled={loading}>{loading ? "Loading..." : "Save"}</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ItemForm

//stop on 6.40.06
