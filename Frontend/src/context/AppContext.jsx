import { createContext, useEffect, useState } from "react";

import { fetchCategories } from "../Service/CategoryService";
import { fetchItems } from "../Service/ItemService";

export const AppContext = createContext(null);

export const AppContextProvider = (props) => {

  const [auth, setAuth] = useState({ token: null, role: null });
  const [itemsData,setItemsData] = useState([])
  const [categories, setCategories] = useState([]);
const [cartItems, setCartItems] = useState([])

// Add to cart function
  const addToCart = (item) =>{
    const existingItem = cartItems.find(cartItem =>cartItem.name === item.name);
    if(existingItem){
      setCartItems(cartItems.map(cartItem => cartItem.name === item.name ?{...cartItem,quantity: cartItem.quantity + 1} : cartItem))
    }else{
      setCartItems([...cartItems,{...item,quantity:1}])
    }
  }

  //romove from the cart
  const removeFromCart =(itemId)=>{
    setCartItems(cartItems.filter(item =>item.itemId !== itemId))

  }

  //update cart item
  const updateQuantity =(itemId,newQuantity)=>{
    setCartItems(cartItems.map(item => item.itemId === itemId ? {...item,quantity: newQuantity} : item));

  }

  // useEffect to store role and token in local storage
  useEffect(() => {
    async function loadData() {

      try {
        if(localStorage.getItem("token") && localStorage.getItem("role")){
          setAuthData(
            localStorage.getItem("token"),
            localStorage.getItem("role",localStorage.getItem("role"))
          );
        }
        const response = await fetchCategories();
        const itemResponse = await fetchItems();
        setCategories(response.data);
        setItemsData(itemResponse.data);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }
    loadData();
  }, [])

  const setAuthData = (token, role) => {
    setAuth({ token, role });
  }

  const contextValue = {
    categories,
    setCategories,
    auth,
    setAuthData,
    itemsData,
    setItemsData,
    addToCart,
    cartItems,
    removeFromCart,
    updateQuantity,
  }
  return <AppContext.Provider value={contextValue}>
    {props.children}
  </AppContext.Provider>
}