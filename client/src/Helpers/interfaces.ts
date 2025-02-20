export interface DecodedToken {
  Id: string;
  Name: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface AuthInterface {
  FirstName?: string;
  LastName?: string;
  Email: string;
  Password: string;
}

export interface AuthResponse {
  UserID: string;
  UserRole: string;
  UserName: string;
  Token: string;
  Error?: string;
}

export interface AuthStateInterface {
  isLoggedIn: boolean;
  isAdmin: boolean;
  id: string;
  name: string;
}

export interface AuthActionInterface {
  type: "LoggedIn" | "LoggedOut";
  payload?: {
    isAdmin: boolean;
    id: string;
    name: string;
  };
  [key: string]: any;
}

export interface AuthResponse {
  role: "admin" | "user";
  Id: string;
  Name: string;
  message?: string;
}

export interface Vacation {
  vacations_id?: number;
  vacation_destination: string;
  vacation_description: string;
  vacation_start_date: string;
  vacation_end_date: string;
  vacation_price: number;
  vacation_image: string | File;
  likesCount?: number;
  userLiked?: boolean;
}

export interface MaxVacationResponse {
  id: number;
}
export interface AllVacationResponse {
  Error?: string;
  Data?: Vacation[];
}

export interface VacationFilters {
  Liked: boolean;
  NotStarted: boolean;
  HappeningNow: boolean;
}

export interface CardProps {
  vacation: Vacation;
  isAdmin: boolean;
  setIdToDelete: React.Dispatch<React.SetStateAction<number | null>>;
  setWantDelete: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface PageBtnsProps {
  currentPage: number;
  numOfPages: number;
  filters: VacationFilters;
  loadingData: boolean;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setNumOfPages?: React.Dispatch<React.SetStateAction<number>>;
  setLoadingData?: React.Dispatch<React.SetStateAction<boolean>>;
  setError?: React.Dispatch<React.SetStateAction<string | null>>;
  setIdToDelete?: React.Dispatch<React.SetStateAction<number | null>>;
  setWantDelete?: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface MainProps {
  filteredVacations: Vacation[];
  filters: VacationFilters;
  isAdmin: boolean;
  loadingData: boolean;
  error: string | null;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setLoadingData: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface AsideProps {
  isAdmin: boolean;
  filters: VacationFilters;
  setFilters: React.Dispatch<React.SetStateAction<VacationFilters>>;
}

export interface VacationFormProps {
  vacation: Vacation | null;
  imageFile: File | null;
}

export interface VacationFormPageProps {
  isEdit: boolean;
  Id: number | string | null;
  vacation: VacationFormProps | null;
}

export interface LikeResponse {
  message: string;
}

export interface VacationLikesResponse {
  vacation_destination: string;
  likes_count: number;
}

export interface ReportResponse {
  data?: VacationLikesResponse[];
  message?: string;
}

export interface GraphProps {
  data: VacationLikesResponse[];
}

export interface PageGraphBtnsProps {
  currentPage: number;
  numOfPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setNumOfPages: React.Dispatch<React.SetStateAction<number>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface DownloadButtonProps {
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
