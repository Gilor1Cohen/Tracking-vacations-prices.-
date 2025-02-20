import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import {
  MaxVacationResponse,
  AuthActionInterface,
  PageBtnsProps,
} from "../../../Helpers/interfaces";
import jwtAxios from "../../../Helpers/JwtAxios";
import "./PageBtns.css";

export function PageBtns({
  currentPage,
  numOfPages,
  filters,
  loadingData,
  setCurrentPage,
  setNumOfPages,
  setLoadingData,
  setWantDelete,
  setIdToDelete,
}: PageBtnsProps): JSX.Element {
  const dispatch = useDispatch();

  function calcBtns(): number[] {
    const start: number = Math.max(1, currentPage - 2);
    const end: number = Math.min(numOfPages, currentPage + 2);
    const pages: number[] = [];

    for (let c: number = start; c <= end; c++) {
      pages.push(c);
    }
    return pages;
  }

  useEffect(() => {
    async function getNumOfPages(): Promise<void> {
      setLoadingData?.(true);
      try {
        const get = await jwtAxios.get<MaxVacationResponse>(
          `http://localhost:3001/Vacations/Get/GetMax?Liked=${filters.Liked}&NotStarted=${filters.NotStarted}&HappeningNow=${filters.HappeningNow}`
        );

        if (get.data && get.data.id) {
          const pages = Math.ceil(get.data.id / 10);
          setNumOfPages?.(pages);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error: any) {
        if (error.response.status === 403 || error.response.status === 401) {
          dispatch<AuthActionInterface>({ type: "LoggedOut" });
          localStorage.removeItem("Token");
        }
      } finally {
        setLoadingData?.(false);
      }
    }

    getNumOfPages();
  }, [filters]);

  return loadingData ? (
    <></>
  ) : (
    <div id="Main-Btns">
      <button
        onClick={() => {
          setIdToDelete?.(null);
          setWantDelete?.(false);
          if (currentPage - 1 > 0) {
            setCurrentPage(currentPage - 1);
          }
        }}
        disabled={currentPage - 1 === 0}
      >
        <IoChevronBackOutline />
      </button>
      {calcBtns().map((page, index) => (
        <button
          className={page === currentPage ? "selected" : ""}
          key={index}
          onClick={() => {
            setIdToDelete?.(null);
            setWantDelete?.(false);
            setCurrentPage(page);
          }}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => {
          setIdToDelete?.(null);
          setWantDelete?.(false);
          if (currentPage + 1 <= numOfPages) {
            setCurrentPage(currentPage + 1);
          }
        }}
        disabled={currentPage === numOfPages}
      >
        <IoChevronForwardOutline />
      </button>
    </div>
  );
}
