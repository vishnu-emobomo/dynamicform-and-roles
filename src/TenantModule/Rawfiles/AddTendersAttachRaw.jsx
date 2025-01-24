import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import SubHeader from "../../Components/SubHeader";
import { Box, Grid, Button, Tabs, Tab } from "@mui/material";
import TenderPDF from "../../PDFComponent/TenderPDF";
import MailOutlined from "@mui/icons-material/MailOutlined";
import PropTypes from "prop-types";
import AddTender from "./AddTender";
import Attachments from "../../AdditionalComponent/Attachments";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const defaultTermsAndConditions = `...`; // Your default terms

const AddTendersAttach = () => {
  const currentDate = new Date().toLocaleDateString("en-GB");
  const [attachmentData, setAttachmentData] = useState([]);
  const [value, setValue] = useState(0);

  const [formData, setFormData] = useState({
    EntityType: "Tender",
    Name: "TenderName",
    CreationDate: currentDate,
    Values: {
      Name: "",
      TenderCodenumber: "",
      Quantity: "",
      UnitPrice: "",
      TotalPrice: "",
      TenderStatus: "",
      CustomerName: "",
      Drawing: "",
      PONumber: "",
      PORecivedDate: "",
      TenderDuedate: "",
      Comments: "",
      TermsAndConditions: defaultTermsAndConditions,
    },
  });

  const handleFormDataChange = (updatedFormData) => {
    setFormData(updatedFormData);
  };

  useEffect(() => {
    console.log("Received formData in TenderPDF:", formData);
  }, [formData]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleAttachmentDataChange = (files) => {
    setAttachmentData(files); // Update attachment data with files from Attachments
    console.log("Files received in AddTendersAttach:", files);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Header />
      <SubHeader />
      <Grid container sx={{ flexGrow: 1, marginTop: "-80px", padding: 0 }} spacing={6}>
        <Grid item xs={12} md={2}>
          <Box sx={{ height: "calc(100vh - 112px)", backgroundColor: "white", borderRadius: "10px", marginLeft: "15px", display: "flex", flexDirection: "column", alignItems: "center" }}></Box>
        </Grid>

        <Grid item xs={12} md={9}>
          <Box sx={{ minHeight: "calc(100vh - 112px)", backgroundColor: "white", padding: 2, borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", marginLeft: "-80px" }}>
            <Grid container alignItems="center" spacing={3} justifyContent="space-between">
              <Grid item>
                <Box sx={{ width: "100%" }}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Grid container alignItems="center" justifyContent="space-between">
                      <Grid item>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                          <Tab label="Details" {...a11yProps(0)} />
                          <Tab label="Attachments" {...a11yProps(1)} sx={{ width: "150px" }} />
                        </Tabs>
                      </Grid>

                      <Grid item>
                        {value === 0 && (
                          <>
                            <Button className="add-tender" style={{ minWidth: '30px', minHeight: '30px', borderRadius: '50%', color: 'black', backgroundColor: 'rgb(255, 255, 255)' }}>
                              <MailOutlined fontSize="small" />
                            </Button>
                            <TenderPDF formData={formData} />
                          </>
                        )}
                      </Grid>
                    </Grid>
                  </Box>

                  <CustomTabPanel value={value} index={0}>
                    <AddTender initialFormData={formData} onFormDataChange={handleFormDataChange} attachmentData={attachmentData}           clearAttachments={() => setAttachmentData([])}  />
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={1}>
                    <Attachments onFilesAdded={handleAttachmentDataChange} 
                      existingFiles={attachmentData}  />
                  </CustomTabPanel>
                </Box>
              </Grid>
            </Grid>
            <br />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddTendersAttach;
