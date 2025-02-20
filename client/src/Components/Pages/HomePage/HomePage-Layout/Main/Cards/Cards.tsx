import React, { useState } from "react";
import {
  CardProps,
  AuthActionInterface,
  LikeResponse,
} from "../../../../../../Helpers/interfaces";
import { MdOutlineModeEdit, MdOutlineDelete, MdFavorite } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import "./Cards.css";
import { useDispatch } from "react-redux";
import jwtAxios from "../../../../../../Helpers/JwtAxios";

export function Card({
  vacation,
  isAdmin,
  setIdToDelete,
  setWantDelete,
  setError,
}: CardProps): JSX.Element {
  const [liked, setLiked] = useState<boolean>(vacation?.userLiked || false);
  const [animate, setAnimate] = useState(false);
  const [likesCount, setLikesCount] = useState<number>(
    vacation.likesCount || 0
  );

  const startDate: Date = new Date(vacation.vacation_start_date);
  const endDate: Date = new Date(vacation.vacation_end_date);

  const navigate = useNavigate();

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const dispatch = useDispatch();

  async function handleLike(): Promise<void> {
    try {
      const newLikedState = !liked;
      setLiked(newLikedState);
      setAnimate(true);
      setTimeout(() => setAnimate(false), 300);

      const post = await jwtAxios.post<LikeResponse>(
        `http://localhost:3001/vacations/Post/${liked ? "UnLike" : "Like"}/${
          vacation.vacations_id
        }`
      );

      if (post.status === 200) {
        setLikesCount((prevCount) =>
          newLikedState ? prevCount + 1 : prevCount - 1
        );
      }
    } catch (error: any) {
      setLiked((prevLiked) => !prevLiked);

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
    }
  }

  return (
    <div className="vacation-card">
      {!isAdmin && (
        <div className="likes" onClick={() => handleLike()}>
          <button className="likes-button">
            <MdFavorite
              className={`icon ${liked ? "liked" : ""} ${
                animate ? "liked-animation" : ""
              }`}
            />
          </button>
          <span className="span">{likesCount}</span>
        </div>
      )}

      <div ref={ref} className="image-container">
        {inView ? (
          <img
            src={`http://localhost:3001/${vacation.vacation_image}`}
            alt={vacation.vacation_destination}
            className="vacation-image"
          />
        ) : (
          <div className="image-placeholder">
            <img
              src={`http://localhost:3001/${vacation.vacation_image}`}
              alt={vacation.vacation_destination}
              className="vacation-image blur"
            />
          </div>
        )}
      </div>

      {isAdmin && (
        <div className="Card-Admin">
          <button
            className="EditBtn"
            onClick={() => {
              if (vacation.vacations_id === undefined) return;
              setIdToDelete(null);
              setWantDelete(false);
              navigate(`/Update/${vacation.vacations_id}`);
            }}
          >
            <MdOutlineModeEdit />
          </button>

          <button
            className="DeleteBtn"
            onClick={() => {
              if (vacation.vacations_id === undefined) return;
              setIdToDelete(vacation.vacations_id);
              setWantDelete(true);
            }}
          >
            <MdOutlineDelete />
          </button>
        </div>
      )}

      <div className="card-top">
        <h2 className="vacation-title">{vacation.vacation_destination}</h2>
        <p className="vacation-price">Price: ${vacation.vacation_price}</p>
      </div>

      <p className="vacation-description">{vacation.vacation_description}</p>
      <div className="dates">
        <p className="vacation-dates">
          Start Date: {startDate.toLocaleDateString()} <br />
        </p>

        <p className="vacation-dates">
          End Date: {endDate.toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
