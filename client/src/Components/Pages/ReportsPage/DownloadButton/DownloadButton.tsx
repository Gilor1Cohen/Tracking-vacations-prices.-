import React from "react";
import { FaFileDownload } from "react-icons/fa";
import {
  AuthActionInterface,
  DownloadButtonProps,
} from "../../../../Helpers/interfaces";
import { useDispatch } from "react-redux";

import jwtAxios from "../../../../Helpers/JwtAxios";
import "./DownloadButton.css";

export function DownloadButton({
  setError,
  setIsLoading,
}: DownloadButtonProps): JSX.Element {
  const dispatch = useDispatch();

  async function handleDownloadCSV(): Promise<void> {
    try {
      setIsLoading(true);

      const response = await jwtAxios.get(
        "http://localhost:3001/Vacations/Get/DownloadCSV",
        {
          responseType: "blob",
        }
      );

      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "vacations.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 403 || error.response.status === 401) {
          dispatch<AuthActionInterface>({ type: "LoggedOut" });
          localStorage.removeItem("Token");
        } else {
          setError(error.response.data || "An unknown error occurred.");
        }
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      className="download-csv"
      onClick={() => {
        handleDownloadCSV();
      }}
    >
      Download CSV <FaFileDownload />
    </button>
  );
}
