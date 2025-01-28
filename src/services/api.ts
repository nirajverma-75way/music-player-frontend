import {
    BaseQueryApi,
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
  } from "@reduxjs/toolkit/query";
  import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
  import { RootState } from "../store/store";
  import { resetTokens, setTokens } from "../store/reducers/authReducer";
  
  const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/",
    prepareHeaders: (headers, { getState, endpoint }) => {
      const state = getState() as RootState;
      const token = state.auth.accessToken; // Get accessToken from your Redux states
      // List of public endpoints where no token is required
      if ( token) {
        // Attach the token only for private endpoints
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });
  
  export const baseQueryWithReauth = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: {}) => {
    let result = await baseQuery(args, api, extraOptions);
    console.log(args)
    if ( !(args.url?.split("/")[0] === "users" && args?.method === "POST") && result.error && result.error.status === 401) {
      // Access token expired, attempt to refresh
      const state = api.getState() as RootState;
      const refreshToken = state.auth.refreshToken;
  
      if (refreshToken) {
        // Attempt token refresh
        const refreshResult = await baseQuery(
          {
            url: "users/ref-token",
            method: "GET",
            headers: {
              Authorization: `Bearer ${refreshToken}`, // Send the refresh token as Bearer
            },
          },
          api,
          extraOptions
        );
    
        if (refreshResult) {

            api.dispatch(setTokens({...refreshResult.data, user: state.auth.user}));
            localStorage.setItem("accessToken", refreshResult.data.accessToken);
            localStorage.setItem("refreshToken", refreshResult.data.refreshToken);
  
          // Retry the original request with the new access token
          result = await baseQuery(args, api, extraOptions);
        } else {
          // Refresh token failed, log the user out
          api.dispatch(resetTokens());
        }
        
      } else {
        api.dispatch(resetTokens());
        
      }
    }
  
    return result;
  };