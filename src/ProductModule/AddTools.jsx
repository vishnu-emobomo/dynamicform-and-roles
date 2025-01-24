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
import { getUserId } from "../utlis/tokenUtils";
import apiClient from "../utlis/apiClient";
import { Backdrop, CircularProgress } from "@mui/material";
import useFormStructure from "../DynamicVendor/useFormStructure"; 
import { DynamicFormRounded } from "@mui/icons-material";
import Layout from "../VendorManagement/Vendor Layout/Layout";
import DynamicForm from "../VendorManagement/Vendor Layout/DynamicForm";

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-input::placeholder": {
    fontSize: "10px", // Adjust this to change only the placeholder size
  },
});

const AddTools = () => {
  const formStructure = useFormStructure("Tools");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    Name: "",
    Tools: "",
    Description: "",
    Quantity: "",
    Composition:"",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (formStructure.length > 0) {
      const initialData = formStructure.reduce((acc, field) => {
        acc[field.id] = field.type === "select" ? field.options[0] || "" : "";
        return acc;
      }, {});
      setFormData(initialData);
    }
  }, [formStructure]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setLoading(true); 

    console.log(formData,": for the tools insert");
    try {
      const response = await apiClient.post(
        `/api/tools/create-tools`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data, ": the Tools insert");

      // Check for a successful response
      if (response.data.result && response.data.result.success) {
        console.log(
          "Tools created successfully:",
          response.data.result.message
        );
        alert("Tools inserted successfully");

        // Reset the form to its initial state
        setFormData({
          Name: "",
          Type: "",
          Description: "",
          Quantity: "",
          Composition:"",
        });

        window.location.reload();
        
      } else {
        console.error(
          "Error creating Tools:",
          response.data.result.message || "Unknown error"
        );
        alert("Unable to insert the Tools");
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
      name={"Tools"}
    />
    <Backdrop open={loading} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: "#fff" }}>
      <CircularProgress color="inherit" />
    </Backdrop>
  </Layout>
  );
};

export default AddTools;