import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  AuthInterface,
  AuthActionInterface,
  AuthResponse,
} from "../../../Helpers/interfaces";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

export function Auth(): JSX.Element {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthInterface>();

  async function onFormSubmit(data: AuthInterface): Promise<void> {
    setIsLoading(true);
    try {
      const post = await axios.post<AuthResponse>(
        `http://localhost:3001/Auth/Post/${
          location.pathname === "/LogIn" ? "LogIn" : "Register"
        }`,
        data
      );

      if (post.status === 201 || post.status === 200) {
        localStorage.setItem("Token", post.data.Token);

        if (location.pathname === "/LogIn") {
          dispatch<AuthActionInterface>({
            type: "LoggedIn",
            payload: {
              isAdmin: post.data.UserRole === "admin",
              id: post.data.UserID,
              name: post.data.UserName,
            },
          });
        } else {
          dispatch<AuthActionInterface>({
            type: "LoggedIn",
            payload: {
              isAdmin: false,
              id: post.data.UserID,
              name: post.data.UserName,
            },
          });
        }

        reset();
        navigate("/");
      } else {
        throw new Error(post.data.Error);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data?.Error || "Something went wrong");
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="Auth-Section">
      <h1 className="Auth-Title">
        {location.pathname === "/LogIn" ? "Log In" : "Register"}
      </h1>
      <form className="Auth-Form" onSubmit={handleSubmit(onFormSubmit)}>
        {location.pathname === "/Register" && (
          <>
            <input
              disabled={isLoading}
              className="Auth-Input"
              type="text"
              placeholder="First Name..."
              {...register("FirstName", { required: "First Name is required" })}
            />
            {errors.FirstName && (
              <p className="Error-Message">{errors.FirstName?.message}</p>
            )}

            <input
              disabled={isLoading}
              className="Auth-Input"
              type="text"
              placeholder="Last Name..."
              {...register("LastName", { required: "Last Name is required" })}
            />
            {errors.LastName && (
              <p className="Error-Message">{errors.LastName?.message}</p>
            )}
          </>
        )}

        <input
          disabled={isLoading}
          className="Auth-Input"
          type="email"
          placeholder="Email..."
          {...register("Email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Invalid email address",
            },
          })}
        />
        {errors.Email && (
          <p className="Error-Message">{errors.Email.message}</p>
        )}

        <div className="password-input-container">
          <input
            disabled={isLoading}
            className="Auth-Input"
            type={showPassword ? "text" : "password"}
            placeholder="Password..."
            {...register("Password", {
              required: "Password is required",
              minLength: {
                value: 4,
                message: "Password must be at least 4 characters long",
              },
            })}
          />
          <button
            disabled={isLoading}
            className="password-toggle-btn"
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              setShowPassword((prev) => !prev);
            }}
          >
            {showPassword ? <IoEye /> : <IoEyeOff />}
          </button>
        </div>
        {errors.Password && (
          <p className="Error-Message">{errors.Password.message}</p>
        )}

        <input
          className="Auth-Submit"
          type="submit"
          value={
            isLoading
              ? "Loading..."
              : location.pathname === "/LogIn"
              ? "Log In"
              : "Register"
          }
          disabled={isLoading}
        />
        {error && <p className="Error-Message">{error}</p>}
      </form>

      <p className="Auth-Footer">
        {location.pathname === "/LogIn" ? (
          <>
            Don't have an account?
            <Link
              className="AuthLink"
              to="/Register"
              onClick={(e) => {
                if (isLoading) {
                  e.preventDefault();
                } else {
                  reset();
                  setError(null);
                }
              }}
            >
              Register
            </Link>
          </>
        ) : (
          <>
            Already have an account?
            <Link
              className="AuthLink"
              to="/LogIn"
              onClick={(e) => {
                if (isLoading) {
                  e.preventDefault();
                } else {
                  reset();
                  setError(null);
                }
              }}
            >
              Log In
            </Link>
          </>
        )}
      </p>
    </section>
  );
}
