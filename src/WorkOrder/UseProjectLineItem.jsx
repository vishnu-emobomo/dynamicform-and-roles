// useProjectLineItem.js
import { useState, useEffect } from "react";
import apiClient from "../utlis/apiClient"; // Assuming apiClient is configured elsewhere

const useProjectLineItem = (projectLinePK) => {
  const [formData, setFormData] = useState({
    WorkOrderId: { value: "", type: "text" },
    Quantity: { value: "", type: "text" },
    Description: { value: "", type: "text" },
    ItemCode: { value: "", type: "text" },
  });

  useEffect(() => {
    const fetchProjectLineItemById = async () => {
      if (!projectLinePK) return;

      const projectLinePKs = encodeURIComponent(projectLinePK);

      try {
        const projectResponse = await apiClient.get(
          `/api/line-item/get-line-item-by-id/${projectLinePKs}`
        );

        const lineItem = projectResponse.data.data[0];

        if (lineItem) {
          const { Values } = lineItem;

          setFormData((prevState) => ({
            ...prevState,
            WorkOrderId: { value: Values?.WorkOrderId || "" },
            Quantity: { value: Values?.QTYSETS || "" },
            Description: { value: Values?.Description || "" },
            ItemCode: { value: Values?.ItemCode || "" },
          }));
        }
      } catch (error) {
        console.error("Error fetching line items:", error);
      }
    };

    fetchProjectLineItemById();
  }, [projectLinePK]);

  return formData;
};

export default useProjectLineItem;
