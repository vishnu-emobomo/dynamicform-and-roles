import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import "../ComponentCss/SubHeader.css";
import "../assets/css/general-sans.css";
export default function SubHeader() {
  const [selectedItem, setSelectedItem] = React.useState(null);
  const location = useLocation();

  React.useEffect(() => {
    const path = location.pathname;

    if (path.includes("/ManageTender")) {
      setSelectedItem("Tender Management");
    } else if (path.includes("/AddTender")) {
      setSelectedItem("Tender Management");
    } else if (path.includes("/UpdateTender")) {
      setSelectedItem("Tender Management");
    } else if (path.includes("/ManageProject")) {
      setSelectedItem("Project Management");
    } else if (path.includes("/AddProject")) {
      setSelectedItem("Project Management");
    } else if (path.includes("/LineItems")) {
      setSelectedItem("Project Management");
    } else if (path.includes("/AddPurchase")) {
      setSelectedItem("Purchase Order");
    } else if (path.includes("/ManagePurchase")) {
      setSelectedItem("Purchase Order");
    } else if (path.includes("/POLineItem")) {
      setSelectedItem("Purchase Order");
    } else if (path.includes("/AddVendor")) {
      setSelectedItem("Vendor Management");
    } else if (path.includes("/ManageVendor")) {
      setSelectedItem("Vendor Management");
    } else if (path.includes("/updatevendor")) {
      setSelectedItem("Vendor Management");
    } else if (path.includes("/AddCompany")) {
      setSelectedItem("Vendor Management");
    } else if (path.includes("/ManageCompany")) {
      setSelectedItem("Vendor Management");
    } else if (path.includes("/updateCompany")) {
      setSelectedItem("Vendor Management");
    } else if (path.includes("/AddReceipt")) {
      setSelectedItem("Purchase Order");
    } else if (path.includes("/ManageReceipt")) {
      setSelectedItem("Purchase Order");
    } else if (path.includes("/ROLineItem")) {
      setSelectedItem("Purchase Order");
    } else if (path.includes("/AddMaterial")) {
      setSelectedItem("Product");
    } else if (path.includes("/ManageMaterial")) {
      setSelectedItem("Product");
    } else if (path.includes("/UpdateMaterial")) {
      setSelectedItem("Product");
    } else if (path.includes("/AddTools")) {
      setSelectedItem("Product");
    } else if (path.includes("/ManageTools")) {
      setSelectedItem("Product");
    } else if (path.includes("/UpdateTools")) {
      setSelectedItem("Product");
    } else if (path.includes("/InventoryTranscation")) {
      setSelectedItem("Inventory");
    } else if (path.includes("/InventoryOnHand")) {
      setSelectedItem("Inventory");
    } else if (path.includes("/ToolsTransactions")) {
      setSelectedItem("Inventory");
    } else if (path.includes("/ToolsInventoryOnHand")) {
      setSelectedItem("Inventory");
    } else if (path.includes("/ManageWorkOrder")) {
      setSelectedItem("Work Order");
    } else if (path.includes("/AddWorkOrder")) {
      setSelectedItem("Work Order");
    } else if (path.includes("/ManageMatWorkOrder")) {
      setSelectedItem("Work Order");
    } else if (path.includes("/AddMatWorkOrder")) {
      setSelectedItem("Work Order");
    } else if (path.includes("/UpdateWorkOrder")) {
      setSelectedItem("Work Order");
    } else if (path.includes("/FileUpload")) {
      setSelectedItem("File Upload");
    } else {
      setSelectedItem(null);
    }
  }, [location]);

  const renderLink = (to, label) => (
    <div style={{ marginRight: "20px", fontSize: "12px", color: "white" }}>
      <Link className="link" to={to}>
        <h5  style={{
          color: "#cc5500",
          fontSize: "14px",
          fontFamily: "GeneralSans-Regular, sans-serif",
          wordSpacing: "5px",
        }}>
          {label}
        </h5>
      </Link>
    </div>
  );

  return (
    <div
      style={{
        marginLeft: "10px",
        width: "60vw",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: "20px",
        alignItems: "center",
       
      }}
    >
      {(selectedItem === "Tender Management" ||
        selectedItem === "Project Management") && (
        <>
          {renderLink("/ManageTender", "Tender")}
          {renderLink("/ManageProject", "Project")}
        </>
      )}

      {selectedItem === "Vendor Management" && (
        <>
          {renderLink("/ManageVendor", "Vendor")}
          {renderLink("/ManageCompany", "Customer")}
        </>
      )}

      {selectedItem === "Purchase Order" && (
        <>
          {renderLink("/ManagePurchase", "Purchase Order")}
          {renderLink("/ManageReceipt", "Receipts")}
        </>
      )}

      {selectedItem === "Product" && (
        <>
          {renderLink("/ManageMaterial", "Material")}
          {renderLink("/ManageTools", "Tools")}
        </>
      )}

      {selectedItem === "Inventory" && (
        <>
          {renderLink("/InventoryTranscation", "Inventory Transactions")}
          {renderLink("/InventoryOnHand", "Inventory On Hand")}
          {renderLink("/ToolsTransactions", "Tools Transactions")}
          {renderLink("/ToolsInventoryOnHand", "Tools Inventory On Hand")}
        </>
      )}

      {selectedItem === "Work Order" && (
        <>
          {renderLink("/ManageWorkOrder", "Work Order")}
          {renderLink("/ManageWorkOrderTransactions", "Work Order Transactions")}
          {renderLink("/ManageMatWorkOrder", "Manage Material Work Order")}
        </>
      )}

      {selectedItem === "File Upload" && (
        <>
          {renderLink("/FileUpload", "Attachments")}
        </>
      )}

      {selectedItem === "Admin" && (
            <>
            {renderLink("/Admin", "ObjectManager")}
            </>
      )}
    </div>
  );
}