import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Root from "../Components/Root/Root";
import Home from "../Components/Home/Home";
import AuthRoot from "../Components/Root/AuthRoot";
import Login from "../Components/Login/Login";
import Register from "../Components/Register/Register";
import AddAParcel from "../Components/AddAParcel/AddAParcel";
import MyDashboard from "../Components/Root/MyDashboard";
import MyParcels from "../Components/MyDashboard/MyParcels";
import Payment from "../Components/MyDashboard/Payment";
import PaymentSuccessful from "../Components/MyDashboard/PaymentSuccessful";
import History from "../Components/MyDashboard/History";
import BeARider from "../Components/BeARider/BeARider";
import ApproveRiders from "../Components/ApproveRiders/ApproveRiders";
import UsersManagement from "../Components/UsersManagement/UsersManagement";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import AdminRoute from "../AdminRoute/AdminRoute";
import ForbiddenPage from "../Components/ForbiddenPage/ForbiddenPage";
import Pickup from "../Components/Pickup/Pickup";
import RiderRoute from "../RiderRoute/RiderRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
        {
            index: true,
            element: <Home />
        },
        {
          path: "add-a-parcel",
          element: <PrivateRoute><AddAParcel /></PrivateRoute>
        },
        {
          path: "dashboard",
          element: <PrivateRoute><MyDashboard /></PrivateRoute>,
          children: [
            {
              index: true,
              element: <PrivateRoute><MyParcels /></PrivateRoute>
            },
            {
              path: "payment/:id",
              element: <PrivateRoute><Payment /></PrivateRoute>
            },
            {
              path: "payment-success",
              element: <PrivateRoute><PaymentSuccessful /></PrivateRoute>
            },
          ]
        },
        {
          path: "history",
          element: <PrivateRoute><History /></PrivateRoute>
        },
        {
          path: "be-a-rider",
          element: <PrivateRoute><BeARider /></PrivateRoute>
        },
        {
          path: "/approve-riders",
          element: <AdminRoute><ApproveRiders /></AdminRoute>
        },
        {
          path: "/users-management",
          element: <AdminRoute><UsersManagement /></AdminRoute>
        },
        {
          path: "/pickup-parcels",
          element: <RiderRoute><Pickup /></RiderRoute>
        }
    ],
  },
  {
    path: "/auth",
    element: <AuthRoot />,
    children: [
        {
          path: "login",
          element: <Login />
        },
        {
          path: "register",
          element: <Register />
        }
    ]
  },
  {
    path: "/forbidden",
    element: <ForbiddenPage />
  }
]);