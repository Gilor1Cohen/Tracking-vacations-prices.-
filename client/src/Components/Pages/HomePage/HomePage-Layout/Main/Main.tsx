import React, { useState } from "react";
import { MainProps } from "../../../../../Helpers/interfaces";
import { Card } from "./Cards/Cards";
import { PageBtns } from "../../../PageBtns/PageBtns";
import { useDispatch } from "react-redux";
import { AuthActionInterface } from "../../../../../Helpers/interfaces";
import jwtAxios from "../../../../../Helpers/JwtAxios";
import "./Main.css";

export function Main({
  filteredVacations,
  filters,
  isAdmin,
  loadingData,
  error,
  currentPage,
  setCurrentPage,
  setLoadingData,
  setError,
}: MainProps): JSX.Element {
  const [numOfPages, setNumOfPages] = useState<number>(1);
  const [wantDelete, setWantDelete] = useState<boolean>(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);

  const dispatch = useDispatch();

  async function deleteVacation(id: string) {
    try {
      const deleteVacation = await jwtAxios.delete(
        `http://localhost:3001/Vacations/Delete/DeleteVacation/${id}`
      );

      if (deleteVacation.status === 200) {
        setIdToDelete(null);
        setWantDelete(false);
        window.location.reload();
      }
    } catch (error: any) {
      if (error.response.status === 403 || 401) {
        dispatch<AuthActionInterface>({ type: "LoggedOut" });
        localStorage.removeItem("Token");
      } else {
        setError(error.response.data || "An unknown error occurred.");
      }
    }
  }

  return (
    <>
      {wantDelete && (
        <div className={`DeleteCard ${wantDelete ? "visible" : ""}`}>
          <h1>Are you sure you want to delete this vacation?</h1>
          <div className="deleteBtns">
            <button
              className="No"
              onClick={() => {
                setWantDelete(false);
              }}
            >
              Cancel
            </button>
            <button
              className="Yes"
              onClick={() => {
                if (idToDelete) deleteVacation(idToDelete.toString());
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}

      <div id="Main-Cards">
        {loadingData ? (
          <div className="loading-message">Loading data...</div>
        ) : error ? (
          <p>{error.toString()}</p>
        ) : (
          <div className="vacation-grid">
            {filteredVacations.map((vacation) => {
              return (
                <Card
                  key={vacation.vacations_id}
                  vacation={vacation}
                  isAdmin={isAdmin}
                  setWantDelete={setWantDelete}
                  setIdToDelete={setIdToDelete}
                  setError={setError}
                />
              );
            })}
          </div>
        )}
      </div>

      <div
        className="btns"
        style={{
          position: "fixed",
          bottom: "50px",
          right: "27.5%",
        }}
      >
        <PageBtns
          currentPage={currentPage}
          numOfPages={numOfPages}
          filters={filters}
          loadingData={loadingData}
          setNumOfPages={setNumOfPages}
          setCurrentPage={setCurrentPage}
          setLoadingData={setLoadingData}
          setError={setError}
          setWantDelete={setWantDelete}
          setIdToDelete={setIdToDelete}
        />
      </div>
    </>
  );
}
