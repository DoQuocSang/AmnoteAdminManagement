import React from "react";
import "style.css";
import tw from "twin.macro";
import "tailwindcss/lib/css/preflight.css";
import AnimationRevealPage from "helpers/AnimationRevealPage";

import AdminLayout from "components/admin/layout/Layout";
import Dashboard from "pages/admin/dashboard/Dashboard";

//admin
import AdminLogin from "pages/admin/login/Login";
import AdminAllCustomer from "pages/admin/customer/AllCustomer"; 
import AdminAddOrUpdateCustomer from "pages/admin/customer/AddOrUpdateCustomer";
import AdminAllBank from "pages/admin/bank/AllBank";
import AdminAddOrUpdateBank from "pages/admin/bank/AddOrUpdateBank";
import AdminAllUnitCode from "pages/admin/unit-code/AllUnitCode";
import AdminAddOrUpdateUnitCode from "pages/admin/unit-code/AddOrUpdateUnitCode";
import AdminAllMaterialCode from "pages/admin/material-code/AllMaterialCode";
import AdminAddOrUpdateMaterialCode from "pages/admin/material-code/AddOrUpdateMaterialCode";
import NotFound404 from "pages/admin/other/NotFound404";

import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function App() {
  const loggedInUsername = sessionStorage.getItem("loggedInUsername");
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/dashboard");

  if (isAdminRoute && !loggedInUsername) {
    // Nếu đường dẫn là trang admin và chưa đăng nhập, chuyển hướng đến trang đăng nhập
    return <Navigate to="/" replace />;
  }

  return (
    <AnimationRevealPage>
      <Routes>
        <Route path="/" element={<AdminLogin />} />

        {loggedInUsername && (
        <Route path="/dashboard" element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/dashboard/all-customer" element={<AdminAllCustomer />} />
          <Route path="/dashboard/add-customer" element={<AdminAddOrUpdateCustomer type="add" />} />
          <Route path="/dashboard/update-customer/:id" element={<AdminAddOrUpdateCustomer type="update" />} />

          <Route path="/dashboard/all-bank" element={<AdminAllBank />} />
          <Route path="/dashboard/add-bank" element={<AdminAddOrUpdateBank type="add" />} />
          <Route path="/dashboard/update-bank/:id" element={<AdminAddOrUpdateBank type="update" />} />
       
          <Route path="/dashboard/all-unit-code" element={<AdminAllUnitCode />} />
          <Route path="/dashboard/add-unit-code" element={<AdminAddOrUpdateUnitCode type="add" />} />
          <Route path="/dashboard/update-unit-code/:id" element={<AdminAddOrUpdateUnitCode type="update" />} />

          <Route path="/dashboard/all-material-code" element={<AdminAllMaterialCode />} />
          <Route path="/dashboard/add-material-code" element={<AdminAddOrUpdateMaterialCode type="add" />} />
          <Route path="/dashboard/update-material-code/:id" element={<AdminAddOrUpdateMaterialCode type="update" />} />
        </Route>
        )}

        <Route path="*" element={<NotFound404 />} />

      </Routes>
    </AnimationRevealPage>
  )
}

export default App