import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
  name: "realTimeNotification",
  initialState: {
    likeNotification: [], // [1,2,3]
    commentNotification: [],
    followNotification: [],
    savePostNotification: [],
  },
  reducers: {
    setLikeNotification: (state, action) => {
      if (action.payload.type === "like") {
        state.likeNotification.push(action.payload);
      } else if (action.payload.type === "dislike") {
        state.likeNotification = state.likeNotification.filter(
          (item) => item.userId !== action.payload.userId
        );
      }
    },
    setCommentNotification: (state, action) => {
      if (action.payload.type === "comment") {
        state.commentNotification.push(action.payload);
      }
    },
    setFollowNotification: (state, action) => {
      if (action.payload.type === "follow") {
        state.followNotification.push(action.payload);
      } else if (action.payload.type === "unfollow") {
        state.followNotification = state.followNotification.filter(
          (item) => item.userId !== action.payload.userId
        );
      }
    },
    setSavePostNotification: (state, action) => {
      if (action.payload.type === "save") {
        state.savePostNotification.push(action.payload);
      } else if (action.payload.type === "unsave") {
        state.savePostNotification = state.savePostNotification.filter(
          (item) =>
            item.userId !== action.payload.userId ||
            item.postId !== action.payload.postId
        );
      }
    },
    clearNotifications: (state) => {
      state.likeNotification = [];
      state.commentNotification = [];
      state.followNotification = [];
      state.savePostNotification = [];
    },
  },
});
export const {
  setLikeNotification,
  setCommentNotification,
  setFollowNotification,
  setSavePostNotification,
  clearNotifications,
} = rtnSlice.actions;
export default rtnSlice.reducer;
