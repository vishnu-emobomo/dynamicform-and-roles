import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import SubHeader from "../Components/SubHeader";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/system";
import { Backdrop, CircularProgress } from "@mui/material";
import apiClient from "../utlis/apiClient";
import Layout from "../VendorManagement/Vendor Layout/Layout";
import DynamicForm from "../VendorManagement/Vendor Layout/DynamicForm";
import useFormStructure from "../DynamicVendor/useFormStructure"

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-input::placeholder": {
    fontSize: "10px",
  },
});

const AddMaterials = () => {
  const formStructure = useFormStructure("Material");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    MaterialName: "",
    Grade: "",
    Dimension: "",
    MaterialId: "",
    Quantity: "",
    Comments: "",
    workOrderId: "-",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => {
      const updatedData = { ...prevState, [name]: value };

      // Calculate the MaterialId if necessary fields change
      if (name === 'MaterialName' || name === 'Grade' || name === 'Dimension') {
        const materialId = `${updatedData.MaterialName}${updatedData.Grade}-${updatedData.Dimension}`;
        updatedData.MaterialId = materialId;
      }

      return updatedData;
    });
  };

  const validateFormData = () => {
    // Check if any key attribute is empty
    if (!formData.MaterialName || !formData.Grade || !formData.Dimension || !formData.MaterialId) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!validateFormData()) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true); // Start loading

    try {
      const response = await apiClient.post(
        `/api/product/create-product`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data, ": the Product insert");

      if (response.data.result && response.data.result.success) {
        console.log("Material created successfully:", response.data.result.message);
        alert("Material inserted successfully");

        setFormData({
          MaterialName: "",
          Grade: "",
          Dimension: "",
          MaterialId: "",
          Quantity: "",
          Comments: "",
        });

        window.location.reload();
      } else {
        console.error("Error creating material:", response.data.result.message || "Unknown error");
        alert("Unable to insert the material");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("There was a network error, please try again.");
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <Layout>
      <DynamicForm
        formStructure={formStructure}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        name={"Material"}
      />
      <Backdrop open={loading} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: "#fff" }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Layout>
  );
};

export default AddMaterials;
