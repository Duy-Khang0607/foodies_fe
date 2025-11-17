import React, { useState } from "react";
import Menubar from "./components/Menubar/Menubar";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Contact from "./pages/Contact/Contact";
import FoodDetails from "./pages/FoodDetails/FoodDetails";
import ExploreFood from "./pages/ExploreFood/ExploreFood";
import Cart from "./pages/Cart/Cart";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Checkout from "./pages/Checkout/Checkout";
import NotFound from "./components/NotFound/NotFound";
import Profile from "./components/Profile/Profile";
import Authentication from "./HOC/Authentication";
import CartRestoreNotification from "./components/CartRestoreNotification/CartRestoreNotification";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import ChangePassword from "./pages/ChangePassword/ChangePassword";
import Footer from "./components/Footer/Footer";
import MenubarAdmin from "./components/MenubarAdmin/MenubarAdmin";
import Sidebar from "./components/Sidebar/Sidebar";
import ListFood from "./pages/ListFood/ListFood";
import AddFood from "./pages/AddFood/AddFood";
import Orders from "./pages/Orders/Orders";
import "./App.css";

// Layout component với Authentication + Menubar
const AuthenticatedLayout = ({ children }) => {
  return (
    <Authentication>
      <Menubar />
      {children}
      <Footer />
    </Authentication>
  );
};

const AdminLayout = ({ children }) => {
  const [isSidebar, setIsSidebar] = useState(false)
  const toggleSidebar = () => {
    setIsSidebar(!isSidebar)
  }
  return (
    <Authentication>
      <div className="d-flex" id="wrapper">
        <Sidebar isSidebar={isSidebar} />
        <div className={`${isSidebar ? 'closed' : ''}`} id="page-content-wrapper">
          <MenubarAdmin toggleSidebar={toggleSidebar} />
          <div className="container-fluid">
            {children}
          </div>
        </div>
      </div>
    </Authentication>
  );
};

// Layout component không có Menubar - full screen
const FullScreenLayout = ({ children }) => {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      {children}
    </div>
  );
};

const App = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <CartRestoreNotification />
      <Routes>
        {/* Routes với Authentication + Menubar */}
        <Route
          path="/"
          element={
            <AuthenticatedLayout>
              <Home />
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/explore"
          element={
            <AuthenticatedLayout>
              <ExploreFood />
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <AuthenticatedLayout>
              <Contact />
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/cart"
          element={
            <AuthenticatedLayout>
              <Cart />
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/checkout"
          element={
            <AuthenticatedLayout>
              <Checkout />
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/food-detail/:id"
          element={
            <AuthenticatedLayout>
              <FoodDetails />
            </AuthenticatedLayout>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route
          path="/profile"
          element={
            <Authentication>
              <Profile />
            </Authentication>
          }
        />

        {/* Routes với AdminLayout */}
        <Route
          path="/admin"
          element={<Navigate to="/admin/list-food" replace />}
        />
        <Route
          path="/admin/list-food"
          element={
            <AdminLayout>
              <ListFood />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/add-food"
          element={
            <AdminLayout>
              <AddFood />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/order-food"
          element={
            <AdminLayout>
              <Orders />
            </AdminLayout>
          }
        />

        {/* Routes không có Menubar - Full screen */}
        <Route
          path="*"
          element={
            <FullScreenLayout>
              <NotFound />
            </FullScreenLayout>
          }
        />

      </Routes>
    </>
  );
};

export default App;
