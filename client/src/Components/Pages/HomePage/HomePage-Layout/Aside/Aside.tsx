import React from "react";
import { FaPlus } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  AuthStateInterface,
  AuthActionInterface,
  AsideProps,
} from "../../../../../Helpers/interfaces";
import "./Aside.css";

export function Aside({
  isAdmin,
  filters,
  setFilters,
}: AsideProps): JSX.Element {
  const name = useSelector((state: AuthStateInterface) => state.name);
  const dispatch = useDispatch();

  function handleCheckboxChange(filterName: string, checked: boolean): void {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [filterName]: checked };

      if (filterName === "HappeningNow" && checked) {
        updatedFilters.NotStarted = false;
      }

      if (filterName === "NotStarted" && checked) {
        updatedFilters.HappeningNow = false;
      }

      return updatedFilters;
    });
  }

  return (
    <>
      <h1 id="H-Aside">Welcome {name}!</h1>
      <form id="HomePage-Aside-Form">
        {!isAdmin && (
          <label htmlFor="Liked">
            <input
              type="checkbox"
              id="Liked"
              checked={filters.Liked}
              onChange={(e) => handleCheckboxChange("Liked", e.target.checked)}
            />
            Only liked vacations
          </label>
        )}

        <label htmlFor="NotStarted">
          <input
            type="checkbox"
            id="NotStarted"
            checked={filters.NotStarted}
            onChange={(e) =>
              handleCheckboxChange("NotStarted", e.target.checked)
            }
          />
          Not started vacations
        </label>

        <label htmlFor="HappeningNow">
          <input
            type="checkbox"
            id="HappeningNow"
            checked={filters.HappeningNow}
            onChange={(e) =>
              handleCheckboxChange("HappeningNow", e.target.checked)
            }
          />
          Happening now vacations
        </label>
      </form>
      {isAdmin && (
        <div id="AdminBtns">
          <Link className="AdminBtns-Button" to="/Create">
            <FaPlus />
          </Link>
          <Link className="AdminBtns-Button" to="/Reports">
            <IoMdSettings />
          </Link>
        </div>
      )}
      <button
        id="LogOut"
        onClick={() => {
          dispatch<AuthActionInterface>({ type: "LoggedOut" });
          localStorage.removeItem("Token");
        }}
      >
        Log Out <FiLogOut id="LogOut-Icon" />
      </button>
    </>
  );
}
