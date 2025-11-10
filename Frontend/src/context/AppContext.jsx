import { createContext, useEffect, useState } from "react";

import { fetchCategories } from "../Service/CategoryService";
import { fetchItems } from "../Service/ItemService";

export const AppContext = createContext(null);

export const AppContextProvider = (props) => {

  const [auth, setAuth] = useState({ token: null, role: null });
  const [itemsData,setItemsData] = useState([])
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
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
    setItemsData
  }
  return <AppContext.Provider value={contextValue}>
    {props.children}
  </AppContext.Provider>
}