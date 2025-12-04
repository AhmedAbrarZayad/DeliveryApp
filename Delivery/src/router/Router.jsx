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
          element: <AddAParcel />
        },
        {
          path: "dashboard",
          element: <MyDashboard />,
          children: [
            {
              index: true,
              element: <MyParcels />
            },
            {
              path: "payment/:id",
              element: <Payment />
            },
            {
              path: "payment-success",
              element: <PaymentSuccessful />
            },
          ]
        },
        {
          path: "history",
          element: <History />
        },
        {
          path: "be-a-rider",
          element: <BeARider />
        },
        {
          path: "/approve-riders",
          element: <ApproveRiders />
        },
        {
          path: "/users-management",
          element: <UsersManagement />
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
  }
]);