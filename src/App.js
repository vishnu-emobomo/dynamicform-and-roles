import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useEffect, useState } from "react";
// import IntoScreen from "./Components/IntoScreen";
import Admin from "./Components/Admin";
import AddTender from "./TenantModule/AddTender";
import RegistrationForm from "./Components/Register";
import AddProject from "./TenantModule/AddProject";
import ManageTender from "./TenantModule/ManageTender";
import ManageProject from "./TenantModule/ManageProject";
import ProtectedRoute from "./Authorization/ProtectedRoute";
import LineItems from "./TenantModule/LineItems";
import UpdateTender from "./TenantModule/UpdateTender";
import AddPurchase from "./VendorManagement/AddPurchase";
import AddVendor from "./VendorManagement/AddVendor";
import ManageVendor from "./VendorManagement/ManageVendor";
import UpdateVendor from "./VendorManagement/UpdateVendor";
import {
  getToken,
  getUserFromToken,
} from "./utlis/tokenUtils";
import ManageMaterial from "./ProductModule/ManageMaterial";
import AddMaterial from "./ProductModule/AddMaterial";
import UpdateMaterial from "./ProductModule/UpdateMaterial";
import AddReceipt from "./VendorManagement/AddReceipt";
import ManagePurchase from "./VendorManagement/ManagePurchase";
import POLineItem from "./VendorManagement/POLineItem";
import ManageReceipt from "./VendorManagement/ManageReceipt";
import InventoryTranscation from "./Inventory/InventoryTranscation"
import ROLineItem from "./VendorManagement/ROLineItem";
import InventoryOnHand from "./Inventory/InventoryOnHand";
import AddWorkOrder from "./WorkOrder/AddWorkOrder";
import ManageWorkOrder from "./WorkOrder/ManageWorkOrder";
import UpdateWorkOrder from "./WorkOrder/UpdateWorkOrder";
import ManageWorkOrderTransactions from "./WorkOrder/ManageWorkOrderTransactions";
// import Attachments from "./AdditionalComponent/Attachments";
// import AddTendersAttach from "./TenantModule/AddTendersAttach";
import DynamicSearch from "./Components/DynamicSearch";
import AddCompany from "./VendorManagement/CompanyManagement/AddCompany";
import ManageCompany from "./VendorManagement/CompanyManagement/ManageCompany";
import UpdateCompany from "./VendorManagement/CompanyManagement/UpdateCompany";
import AddTools from "./ProductModule/AddTools";
import ManageTools from "./ProductModule/ManageTools";
import UpdateTools from "./ProductModule/UpdateTools";
import ToolsTransactions  from "./Tools/ToolsTransactions";
import ToolsInventoryOnHand from "./Tools/ToolsInventoryOnHand";
import AddMatWorkOrder from "./ProductWorkOrder/AddMatWorkOrder";
import ManageMatWorkOrder from "./ProductWorkOrder/ManageMatWorkOrder";
// import UploadFile from "./AdditionalComponent/UploadFile";
import FileUpload from "./AdditionalComponent/FileUpload";
import TestLogin from "./Components/TestLogin";
import DynamicAdmin from "./DynamicForm/DynamicAdmin";
import ObjectManager from "./DynamicForm/ObjectManager";
import PickList from "./DynamicForm/PickList";
import Roles from "./DynamicForm/Roles";
import AdjustForm from "./DynamicSettings/AdjustForm";
import AddField from "./DynamicSettings/AddField"
import AddDynamicVendor from "./DynamicVendor/AddDynamicVendor";
import AddPickList from "./DynamicSettings/AddPickList";
import UpdateDycForm from "./DynamicSettings/UpdateDycForm";
import AddLinkField from "./DynamicSettings/AddLinkField";

function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const userDetails = getUserFromToken(token);
      console.log(userDetails);
      setUser(userDetails);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Admin />} />

        <Route path="/TestLogin" element={<TestLogin />} />
        
        <Route path="/register" element={<RegistrationForm />} />

        <Route 
          path="/DynamicSearch"
          element={<ProtectedRoute element={<DynamicSearch/>} user={user}/>}
        />

      <Route 
          path="/FileUpload"
          element={<ProtectedRoute element={<FileUpload/>} user={user}/>}
        />
{/* 
        <Route
          path="/UploadFile"
          element={<ProtectedRoute element={<UploadFile />} user={user} />}
        /> */}

        <Route 
          path="/DynamicAdmin"
          element={<ProtectedRoute element={<DynamicAdmin/>} user={user}/>}
        />


        <Route
          path="/AddTender"
          element={
            <ProtectedRoute
              element={<AddTender />}
              requiredPermissions={[
                { objectType: "Tender", permission: "CanCreate" },
              ]}
            />
          }
        />


        <Route
          path="/AddProject"
          element={<ProtectedRoute element={<AddProject />} user={user} />}
        />
        <Route
          path="/LineItems"
          element={<ProtectedRoute element={<LineItems />} user={user} />}
        />
        <Route
          path="/ManageTender"
          element={<ProtectedRoute element={<ManageTender />} user={user} />}
        />
        <Route
          path="/ManageProject"
          element={<ProtectedRoute element={<ManageProject />} user={user} />}
        />
        <Route
          path="/UpdateTender"
          element={<ProtectedRoute element={<UpdateTender />} user={user} />}
        />

        <Route
          path="/UpdateMaterial"
          element={<ProtectedRoute element={<UpdateMaterial/>} user={user} />}
        />
        <Route
          path="/AddPurchase"
          element={<ProtectedRoute element={<AddPurchase />} user={user} />}
        />
        
        <Route
          path="/ManagePurchase"
          element={<ProtectedRoute element={<ManagePurchase />} user={user} />}
        />

        <Route
          path="/POLineItem"
          element={<ProtectedRoute element={<POLineItem />} user={user} />}
        />  

        <Route
          path="/ManageVendor"
          element={<ProtectedRoute element={<ManageVendor />} user={user} />}
        />
        <Route
          path="/AddVendor"
          element={<ProtectedRoute element={<AddVendor />} user={user} />}
        />

        <Route
          path="UpdateVendor"
          element={<ProtectedRoute element={<UpdateVendor />} user={user} />}
        />

        <Route
          path="/ManageCompany"
          element={<ProtectedRoute element={<ManageCompany />} user={user} />}
        />
        <Route
          path="/AddCompany"
          element={<ProtectedRoute element={<AddCompany />} user={user} />}
        />

        <Route
          path="UpdateCompany"
          element={<ProtectedRoute element={<UpdateCompany />} user={user} />}
        />

        <Route
          path="/AddMaterial"
          element={<ProtectedRoute element={<AddMaterial/>} user={user} />}
        />

        <Route
          path="/ManageMaterial"
          element={<ProtectedRoute element={<ManageMaterial />} user={user} />}
        />

        <Route
          path="/AddTools"
          element={<ProtectedRoute element={<AddTools />} user={user} />}
        />

        <Route
          path="/ManageTools"
          element={<ProtectedRoute element={<ManageTools />} user={user} />}
        />

        <Route
          path="/UpdateTools"
          element={<ProtectedRoute element={<UpdateTools />} user={user} />}
        />

        <Route
          path="/ToolsInventoryOnHand"
          element={<ProtectedRoute element={<ToolsInventoryOnHand/>} user={user} />}
        />

        <Route
          path="/ToolsTransactions"
          element={<ProtectedRoute element={<ToolsTransactions/>} user={user} />}
        />

        <Route
          path="/AddReceipt"
          element={<ProtectedRoute element={<AddReceipt />} user={user} />}
        />


        <Route
          path="/ManageReceipt"
          element={<ProtectedRoute element={<ManageReceipt />} user={user} />}
        />

        <Route
          path="/ROLineItem"
          element={<ProtectedRoute element={<ROLineItem />} user={user} />}
        />

        <Route
          path="/InventoryTranscation"
          element={<ProtectedRoute element={<InventoryTranscation />} user={user} />}
        />

        <Route
          path="/InventoryOnHand"
          element={<ProtectedRoute element={<InventoryOnHand />} user={user} />}
        />

        <Route
          path="/ManageWorkOrder"
          element={<ProtectedRoute element={<ManageWorkOrder />} user={user} />}
        />

        <Route
          path="/AddWorkOrder"
          element={<ProtectedRoute element={<AddWorkOrder />} user={user} />}
        />

        <Route
          path="/ManageWorkOrderTransactions"
          element={
            <ProtectedRoute
              element={<ManageWorkOrderTransactions />}
              user={user}
            />
          }
        />

        <Route
          path="/UpdateWorkOrder"
          element={<ProtectedRoute element={<UpdateWorkOrder />} user={user} />}
        />

        <Route
          path="/AddMatWorkOrder"
          element={<ProtectedRoute element={<AddMatWorkOrder />} user={user} />}
        />

        <Route
          path="/ManageMatWorkOrder"
          element={<ProtectedRoute element={<ManageMatWorkOrder />} user={user} />}
        />

        <Route
          path="/ObjectManager"
          element={<ProtectedRoute element={<ObjectManager />} user={user} />}
        />

        <Route
          path="/PickList"
          element={<ProtectedRoute element={<PickList />} user={user} />}
        />

        <Route
          path="/Roles"
          element={<ProtectedRoute element={<Roles />} user={user} />}
        />

        <Route
          path="/AdjustForm/:moduleName"
          element={<ProtectedRoute element={<AdjustForm />} user={user} />}
        />

        <Route
          path="/AddField/:moduleName"
          element={<ProtectedRoute element={<AddField />} user={user} />}
        />

        <Route
          path="/AddDynamicVendor"
          element={<ProtectedRoute element={<AddDynamicVendor />} user={user} />}
        />

        <Route
          path="/AddPickList"
          element={<ProtectedRoute element={<AddPickList />} user={user} />}
        />

        <Route
          path="/AddLinkField"
          element={<ProtectedRoute element={<AddLinkField />} user={user} />}
        />

        <Route 
          path="/UpdateDycForm"
          element={<ProtectedRoute element={<UpdateDycForm />} user={user} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
