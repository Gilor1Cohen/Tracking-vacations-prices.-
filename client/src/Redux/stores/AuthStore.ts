import { createStore } from "redux";
import {
  AuthStateInterface,
  AuthActionInterface,
} from "../../Helpers/interfaces";

const initialState: AuthStateInterface = {
  isLoggedIn: false,
  isAdmin: false,
  id: "",
  name: "",
};

export function AuthState(
  state: AuthStateInterface = initialState,
  action: AuthActionInterface
): AuthStateInterface {
  switch (action.type) {
    case "LoggedIn":
      if (action.payload) {
        return {
          ...state,
          isLoggedIn: true,
          isAdmin: action.payload.isAdmin,
          id: action.payload.id,
          name: action.payload.name,
        };
      } else return state;
    case "LoggedOut":
      return { ...state, isLoggedIn: false, isAdmin: false, id: "", name: "" };
    default:
      return state;
  }
}

const AuthStore = createStore(AuthState);
export default AuthStore;
