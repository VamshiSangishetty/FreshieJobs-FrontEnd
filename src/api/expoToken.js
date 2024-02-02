import client from "./client"

export const createToken = async (token) => {
    try {
      const { data } = await client.post("/post/token", token);
      return data;
    } catch (error) {
      const { response } = error;
      if (response?.data) {
        return response.data;
      }
      return { error: error.message || error };
    }
  };

  export const getToken = async (token) => {
    try {
      const { data } = await client.get(`/post/singleToken/${token}`);
      return data;
    } catch (error) {
      const { response } = error;
      if (response?.data) {
        return response.data;
      }
      return { error: error.message || error };
    }
  };