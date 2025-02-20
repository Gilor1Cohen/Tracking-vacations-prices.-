import React, { useEffect } from "react";
import { Auth } from "../Pages/AuthPage/Auth";
import { HomePage } from "../Pages/HomePage/HomePage";
import { EditPage } from "../Pages/VacationManagement/EditPage/EditPage";
import { CreatePage } from "../Pages/VacationManagement/CreatePage/CreatePage";
import { AdminReportsPage } from "../Pages/ReportsPage/AdminReportsPage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  AuthStateInterface,
  AuthActionInterface,
  DecodedToken,
} from "../../Helpers/interfaces";
import "./App.css";
import { jwtDecode } from "jwt-decode";

export default function App(): JSX.Element {
  const isAuth = useSelector((state: AuthStateInterface) => state.isLoggedIn);
  const isAdmin = useSelector((state: AuthStateInterface) => state.isAdmin);
  const dispatch = useDispatch();

  useEffect(() => {
    async function checkAuth(): Promise<void> {
      try {
        const Token = localStorage.getItem("Token");

        if (!Token) {
          throw new Error("No token found");
        }

        const decodedToken = jwtDecode<DecodedToken>(Token);

        if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
          throw new Error("Token expired");
        }

        dispatch<AuthActionInterface>({
          type: "LoggedIn",
          payload: {
            isAdmin: decodedToken.role === "admin",
            id: decodedToken.Id,
            name: decodedToken.Name,
          },
        });
      } catch (error) {
        dispatch<AuthActionInterface>({ type: "LoggedOut" });
        localStorage.removeItem("Token");
        return;
      }
    }

    checkAuth();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {isAuth ? (
          <>
            <Route path="/" element={<HomePage />} />

            {isAdmin && (
              <>
                <Route path="/Create" element={<CreatePage />} />
                <Route path="/Update/:id" element={<EditPage />} />
                <Route path="/Reports" element={<AdminReportsPage />} />
              </>
            )}

            <Route path="*" element={<Navigate to="/" replace={true} />} />
          </>
        ) : (
          <>
            <Route path="/LogIn" element={<Auth />} />
            <Route path="/Register" element={<Auth />} />
            <Route path="*" element={<Navigate to="/LogIn" replace={true} />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}
