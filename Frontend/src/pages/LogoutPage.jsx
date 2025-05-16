import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { clearUserInfo } from '../features/userSlice';
import { persistStore } from "redux-persist";
import { store } from '../store/store';
import axios from 'axios';

function LogoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/user/logout`, {},
          {
            withCredentials: true,
          }
        );

        dispatch(clearUserInfo());
        persistStore(store).purge();
        navigate("/login");
      } catch (error) {
        console.error("Logout error:", error);
        dispatch(clearUserInfo());
        persistStore(store).purge();
        navigate("/login");
      }
    };

    logout();
  }, []);

  return <div>Logging out...</div>;
}

export default LogoutPage;
