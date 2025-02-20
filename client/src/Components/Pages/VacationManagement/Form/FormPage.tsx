import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  VacationFormPageProps,
  VacationFormProps,
  AuthActionInterface,
} from "../../../../Helpers/interfaces";
import { IoMdArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import jwtAxios from "../../../../Helpers/JwtAxios";
import "./FormPage.css";

export function FormPage({
  isEdit,
  Id,
  vacation,
}: VacationFormPageProps): JSX.Element {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<VacationFormProps>();

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
      setValue("imageFile", file);
      setImageError(null);
    }
  }

  useEffect(() => {
    if (isEdit && vacation && Id) {
      reset({
        vacation: {
          vacation_destination: vacation.vacation?.vacation_destination || "",
          vacation_description: vacation.vacation?.vacation_description || "",
          vacation_start_date: vacation.vacation?.vacation_start_date
            ? new Date(
                new Date(vacation.vacation?.vacation_start_date).getTime() +
                  24 * 60 * 60 * 1000
              )
                .toISOString()
                .split("T")[0]
            : "",
          vacation_end_date: vacation.vacation?.vacation_end_date
            ? new Date(
                new Date(vacation.vacation?.vacation_end_date).getTime() +
                  24 * 60 * 60 * 1000
              )
                .toISOString()
                .split("T")[0]
            : "",
          vacation_price: vacation.vacation?.vacation_price || 0,
          vacation_image: vacation.vacation?.vacation_image || "",
        },
      });

      setPreviewImage(
        vacation.vacation?.vacation_image
          ? `http://localhost:3001/${vacation.vacation?.vacation_image}`
          : null
      );
    }
  }, [isEdit, vacation, Id, reset]);

  async function onFormSubmit(data: VacationFormProps): Promise<void> {
    try {
      setIsLoading(true);
      const formData = new FormData();

      formData.append(
        "vacation_destination",
        data.vacation?.vacation_destination || ""
      );
      formData.append(
        "vacation_description",
        data.vacation?.vacation_description || ""
      );
      formData.append(
        "vacation_start_date",
        data.vacation?.vacation_start_date || ""
      );
      formData.append(
        "vacation_end_date",
        data.vacation?.vacation_end_date || ""
      );
      formData.append(
        "vacation_price",
        data.vacation?.vacation_price?.toString() || "0"
      );

      if (Id !== null && Id !== undefined) {
        formData.append("vacation_id", Id.toString());
      }

      if (data.imageFile && data.imageFile.size > 0) {
        formData.append("vacation_image", data.imageFile);
      } else if (vacation && vacation.vacation?.vacation_image) {
        formData.append("vacation_image", vacation.vacation.vacation_image);
      } else {
        setImageError("Image is required");
        return;
      }

      const response = isEdit
        ? await jwtAxios.put<FormData>(
            `http://localhost:3001/Vacations/Put/UpdateVacation/${Id}`,
            formData
          )
        : await jwtAxios.post<FormData>(
            `http://localhost:3001/Vacations/Post/AddVacation`,
            formData
          );

      if (response.status === 200 || response.status === 201) {
        reset();
        navigate("/");
      }
    } catch (error: any) {
      if (error.response.status === 403 || 401) {
        dispatch<AuthActionInterface>({ type: "LoggedOut" });
        localStorage.removeItem("Token");
      } else {
        setError(error.response.data || "An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="Page">
      <h1 className="UpdatePage-H">
        {isEdit ? "Edit Vacation" : "Add Vacation"}
      </h1>
      <Link className="Link" to="/">
        <IoMdArrowBack />
      </Link>
      <form className="Form" onSubmit={handleSubmit(onFormSubmit)}>
        <div className="half-1">
          <label className="vacation_destination">Destination:</label>
          <input
            type="text"
            className="vacation_destination"
            {...register("vacation.vacation_destination", {
              required: "Destination is required",
            })}
            disabled={isLoading}
          />
          {errors.vacation?.vacation_destination && (
            <p className="error">
              {errors.vacation?.vacation_destination.message}
            </p>
          )}

          <label className="vacation_description">Description:</label>
          <textarea
            className="vacation_description"
            {...register("vacation.vacation_description", {
              required: "Description is required",
            })}
            disabled={isLoading}
          />
          {errors.vacation?.vacation_description && (
            <p className="error">
              {errors.vacation?.vacation_description.message}
            </p>
          )}
        </div>
        <div className="half-2">
          <label className="vacation_start_date">Start Date:</label>
          <input
            type="date"
            className="vacation_start_date"
            {...register("vacation.vacation_start_date", {
              required: "Start date is required",
              validate: {
                notPast: (value) =>
                  isEdit ||
                  new Date(value) >= new Date() ||
                  "Start date cannot be in the past",
              },
            })}
            disabled={isLoading}
          />
          {errors.vacation?.vacation_start_date && (
            <p className="error">
              {errors.vacation?.vacation_start_date.message}
            </p>
          )}

          <label className="vacation_end_date">End Date:</label>
          <input
            type="date"
            className="vacation_end_date"
            {...register("vacation.vacation_end_date", {
              required: "End date is required",
              validate: {
                notPast: (value) =>
                  isEdit ||
                  new Date(value) >= new Date() ||
                  "End date cannot be in the past",
                notBeforeStart: (value) =>
                  new Date(value) >=
                    new Date(watch("vacation.vacation_start_date")) ||
                  "End date cannot be before start date",
              },
            })}
            disabled={isLoading}
          />
          {errors.vacation?.vacation_end_date && (
            <p className="error">
              {errors.vacation?.vacation_end_date.message}
            </p>
          )}

          <label className="vacation_price">Price:</label>
          <input
            type="number"
            className="vacation_price"
            {...register("vacation.vacation_price", {
              required: "Price is required",
              validate: {
                positive: (value) => value > 0 || "Price must be positive",
                maxLimit: (value) =>
                  value <= 10000 || "Price cannot exceed 10,000",
              },
            })}
            disabled={isLoading}
          />

          {errors.vacation?.vacation_price && (
            <p className="error">{errors.vacation.vacation_price.message}</p>
          )}

          <label className="vacation_image">Image:</label>
          {previewImage && (
            <img
              src={previewImage}
              id="PreviewImage"
              onClick={() => {
                const inputElement = document.getElementById(
                  "imageInput"
                ) as HTMLInputElement;
                inputElement.click();
              }}
            />
          )}
          <input
            type="file"
            id="imageInput"
            accept="image/jpeg, image/png"
            className={previewImage ? "hidden" : ""}
            onChange={(e) => {
              if (e.target.files && e.target.files?.length > 0) {
                handleImageChange(e);
              } else {
                console.log("No file selected");
              }
            }}
          />
          {imageError && <p className="error">{imageError}</p>}
        </div>
        <input
          disabled={isLoading}
          type="submit"
          value={
            isLoading ? "Loading..." : isEdit ? "Edit vacation" : "Add vacation"
          }
          className="submit"
        />

        {error && <p className="error">{error}</p>}
      </form>
    </section>
  );
}
