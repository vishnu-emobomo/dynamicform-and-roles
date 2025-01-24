// FormStructure.js
const formStructure = [
    {
      id: "CompanyName",
      label: "Company Name",
      type: "text",
      required: true,
    },
    {
      id: "CompanyEmail",
      label: "Company Email",
      type: "email",
    
      required: true,
    },
    {
      id: "Address",
      label: "Address",
      type: "text",
     
      required: false,
    },
    {
      id: "PhoneNumber",
      label: "Phone Number",
      type: "tel",
    
      required: true,
    },
    {
      id: "VendorStatus",
      label: "Vendor Status",
      type: "select",
      options: ["Active", "Inactive"],
      required: true,
    },
    {
      id: "Comments",
      label: "Comments",
      type: "textarea",
      rows: 3,
      required: false,
    },
  ];
  
  export default formStructure;
  