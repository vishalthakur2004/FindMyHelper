import axios from 'axios';

export const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/user/refresh-token`,
      {},
      { withCredentials: true }
    );
    return response.data.accessToken;
  } catch (error) {
    console.error('Failed to refresh access token', error);
    throw error;
  }
};
