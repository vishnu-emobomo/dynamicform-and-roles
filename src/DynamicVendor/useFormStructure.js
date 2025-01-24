import { useEffect, useState } from "react";
import apiClient from "../utlis/apiClient"; // Replace with your actual API client

const useFormStructure = (moduleName) => {
  const [formStructure, setFormStructure] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.post(`/api/Dynamic/Get-Fields-By-Module`, {
          ModuleName: moduleName,
        });

        const data = response.data?.data?.[0]?.Values || [];
        console.log("Raw API Data:", data); // Debugging

        // Transform API data into desired structure
        const transformedData = data.map((item) => ({
          id: item.id,
          label: item.label,
          type: item.type,
          required: item.required || false,
          ...(item.type === "select" && { options: item.options || [] }),
          ...(item.type === "textarea" && { rows: item.rows || 3 }),
        }));

        console.log("Transformed Form Structure:", transformedData);
        setFormStructure(transformedData);
      } catch (error) {
        console.error("Error fetching form structure:", error);
      }
    };

    fetchData();
  }, [moduleName]);

  return formStructure;
};

export default useFormStructure;
