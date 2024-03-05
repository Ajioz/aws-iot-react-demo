import React, { useState, useContext, useEffect } from "react";
import { useCallback } from "react";

const AppContext = React.createContext();

/* 
  const viniScale = [
    { category: "eScale",  name: "Name", dbName: "dbName" }, 
    { category: "sniffer", name: "Name", dbName: "dbName" }
  ]; 
*/

let data = localStorage.getItem("viniScale") || [];

const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState({ status: false });
  const [saveItem, setSaveItem] = useState(data);
  
  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      if (saveItem.length !== 0) data = JSON.parse(data);
      return setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [cart]);

  useEffect(() => {
    fetchItems();
    let parsedItem = [];
    if (saveItem.length > 0) parsedItem = JSON.parse(saveItem);
    if (parsedItem.length > 0) {
      if (parsedItem.length > 1) return setCart({ ...cart, status: true });
      else return setCart({ ...cart, status: false });
    }
    setSaveItem(data);
  }, [saveItem]);

  const vinItems = (obj) => {
    let getArray = localStorage.getItem("viniScale") || [];
    let newArray = [];
    if (getArray.length !== 0) {
      newArray = JSON.parse(getArray);
    }
    if (Object.keys(obj).length !== 0) {
      localStorage.setItem("viniScale", JSON.stringify([...newArray, obj]));
    }
    setSaveItem(JSON.stringify([...newArray, obj]));
  };

  return (
    <AppContext.Provider value={{ loading, cart, saveItem, vinItems }}>
      {children}
    </AppContext.Provider>
  );
};

// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
