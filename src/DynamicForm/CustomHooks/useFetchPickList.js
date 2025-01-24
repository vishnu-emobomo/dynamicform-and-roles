import { useState, useEffect } from "react";
import apiClient from "../../utlis/apiClient";

const useFetchPickList= (module)=>{
    const [data,setData] = useState([]);
    const [attribute, setAttribute] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
          setLoading(true);
          try {
            const response = await apiClient.get("/api/Dynamic/PickList");
            console.log(response.data.data);
            setData(response.data.data);
            setLoading(false);
          } catch (error) {
            console.error("Error fetching the picklist:", error);
            setError(error);
            setLoading(false);
          }
        };
    
        fetchData();
      }, []);

    
  useEffect(() => {
    const fetchData = async (module) => {
      setLoading(true);
      console.log("Fetching data for module:", module);
  
      try {
        const response = await apiClient.get("/api/Dynamic/get-picklist-dropdown", {
          params: { Module: module },
        });
        console.log("Fetched attributes:", response.data);
        setAttribute(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching the picklist:", error);
      
        setLoading(false);
      }
    };
  
    // Trigger fetch only when `formData.Module` has a valid value
    if (module) {
      fetchData(module);
    }
  }, [module]);

      return { data, attribute, loading, error };
}

export default useFetchPickList;