import React, { useEffect, useState } from "react";
import { FormPage } from "../Form/FormPage";
import { useParams } from "react-router-dom";
import { VacationFormProps } from "../../../../Helpers/interfaces";
import jwtAxios from "../../../../Helpers/JwtAxios";

export function EditPage(): JSX.Element {
  const [vacationData, setVacationData] = useState<VacationFormProps | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { id } = useParams();

  useEffect(() => {
    if (!id) {
      setError("Invalid ID. Please check the URL.");
      setIsLoading(false);
      return;
    }

    async function getVacationData(): Promise<void> {
      try {
        const get = await jwtAxios.get<VacationFormProps>(
          `http://localhost:3001/Vacations/Get/GetByID/${id}`
        );

        if (get.status === 200) {
          setVacationData(get.data);
        } else {
          setError("Failed to fetch vacation data. Please try again.");
        }
      } catch (error) {
        setError(error as string);
      } finally {
        setIsLoading(false);
      }
    }

    getVacationData();
  }, [id]);

  if (isLoading) {
    return (
      <div
        className="loading-message"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "1.5rem",
          color: "#555",
          textAlign: "center",
        }}
      >
        Loading vacation data...
      </div>
    );
  }

  if (!id) {
    return (
      <div className="error-message">Invalid ID. Please check the URL.</div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!vacationData) {
    return (
      <div className="error-message">
        No vacation data found. Please check the ID.
      </div>
    );
  }

  return (
    <section className="UpdatePage">
      <FormPage isEdit={true} Id={id} vacation={vacationData} />
    </section>
  );
}
