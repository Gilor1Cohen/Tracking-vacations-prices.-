import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Main } from "./HomePage-Layout/Main/Main";
import { Aside } from "./HomePage-Layout/Aside/Aside";
import {
  Vacation,
  AuthStateInterface,
  VacationFilters,
  AllVacationResponse,
  AuthActionInterface,
} from "../../../Helpers/interfaces";

import jwtAxios from "../../../Helpers/JwtAxios";
import "./HomePage.css";

export function HomePage(): JSX.Element {
  const [vacationsData, setVacationsData] = useState<Vacation[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<VacationFilters>({
    Liked: false,
    NotStarted: false,
    HappeningNow: false,
  });

  const isAdmin = useSelector((state: AuthStateInterface) => state.isAdmin);

  const dispatch = useDispatch();

  useEffect(() => {
    async function setData(): Promise<void> {
      setLoadingData(true);
      setError(null);
      try {
        const get = await jwtAxios.get<AllVacationResponse>(
          `http://localhost:3001/Vacations/Get/GetByPage/${currentPage}?Liked=${filters.Liked}&NotStarted=${filters.NotStarted}&HappeningNow=${filters.HappeningNow}`
        );

        if (get.status === 200 && get.data.Data) {
          get.data.Data.length >= 1
            ? setVacationsData(get.data.Data)
            : setError("No Data Found.");
        } else {
          throw new Error(get.data.Error);
        }
      } catch (error: any) {
        if (error.response.status === 403 || error.response.status === 401) {
          dispatch<AuthActionInterface>({ type: "LoggedOut" });
          localStorage.removeItem("Token");
        } else {
          if (error.response) {
            setError(error.response.data?.Error || "Something went wrong");
          } else {
            setError("An unknown error occurred");
          }
        }
      } finally {
        setLoadingData(false);
      }
    }

    setData();
  }, [currentPage, filters]);

  return (
    <section id="HomePage-Section">
      <aside id="HomePage-Aside">
        <Aside isAdmin={isAdmin} filters={filters} setFilters={setFilters} />
      </aside>
      <main id="HomePage-Main">
        <Main
          filteredVacations={vacationsData}
          isAdmin={isAdmin}
          loadingData={loadingData}
          error={error}
          filters={filters}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setLoadingData={setLoadingData}
          setError={setError}
        />
      </main>
    </section>
  );
}
