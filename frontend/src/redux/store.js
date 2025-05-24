import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js";
import postSlice from "./postSlice.js";
import socketSlice from "./socketSlice.js";
import chatSlice from "./chatSlice.js";
import rtnSlice from "./rtnSlice.js";

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { createFilter } from "redux-persist-transform-filter";

// Save auth slice but filter out any potential socket references
const saveAuthFilter = createFilter(
  "auth",
  ["user", "suggestedUsers", "userProfile", "selectedUser"], // Only save these parts of auth
  null
);

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: ["socketio"], // This prevents the socketio slice from being persisted
  transforms: [saveAuthFilter], // Apply our filter transform
};

const rootReducer = combineReducers({
  auth: authSlice,
  post: postSlice,
  socketio: socketSlice,
  chat: chatSlice,
  realTimeNotification: rtnSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          "socketio/setSocket", // Ignore the setSocket action
        ],
        ignoredPaths: ["socketio.socket"], // Ignore the socketio.socket path in state
      },
    }),
});
export default store;
