import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/v1/user/${userId}/profile`,
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setUserProfile(res.data.user));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, user?._id, dispatch]);
};
export default useGetUserProfile;
