import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import {
  VacationLikesResponse,
  ReportResponse,
  AuthActionInterface,
} from "../../../Helpers/interfaces";
import { useDispatch } from "react-redux";
import { Graph } from "./Graph/Graph";
import { DownloadButton } from "./DownloadButton/DownloadButton";
import { PageBtns } from "../PageBtns/PageBtns";
import jwtAxios from "../../../Helpers/JwtAxios";
import "./AdminReportsPage.css";

export function AdminReportsPage(): JSX.Element {
  const [numOfPages, setNumOfPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [data, setData] = useState<VacationLikesResponse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  useEffect(() => {
    async function getData(): Promise<void> {
      try {
        setIsLoading(true);
        setError(null);

        const getData = await jwtAxios.get<ReportResponse>(
          `http://localhost:3001/Vacations/Get/Reports/${currentPage}`
        );

        if (getData.status === 200 && Array.isArray(getData.data)) {
          setError(null);
          setData(getData.data);
        } else {
          setError("No data found.");
        }
      } catch (error: any) {
        console.log();

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

    getData();
  }, [dispatch, currentPage]);

  return (
    <section id="AdminReportsPage">
      <Link className="Link" to="/">
        <IoMdArrowBack />
      </Link>

      <main>
        {isLoading ? (
          <div className="loading-message">Loading data...</div>
        ) : error ? (
          <p>{error.toString()}</p>
        ) : data && data.length > 0 ? (
          <>
            <div
              className="btns"
              style={{
                position: "fixed",
                bottom: "15px",
                right: "36%",
              }}
            >
              <PageBtns
                currentPage={currentPage}
                numOfPages={numOfPages}
                filters={{
                  Liked: false,
                  NotStarted: false,
                  HappeningNow: false,
                }}
                loadingData={isLoading}
                setNumOfPages={setNumOfPages}
                setCurrentPage={setCurrentPage}
                setLoadingData={setIsLoading}
              />
            </div>

            <div className="graph-container">
              <Graph data={data} />
            </div>

            <div className="btn">
              <DownloadButton setError={setError} setIsLoading={setIsLoading} />
            </div>
          </>
        ) : (
          <p>No data available</p>
        )}
      </main>
    </section>
  );
}
