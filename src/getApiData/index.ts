import axios from "axios"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getApiData =  async (url: string): Promise<any> => {
  try {
    const resp = await axios.get(url);
    return resp.data;
  } catch (err) {
    // Handle Error Here
    console.error(err);
    return Promise.reject(err);
  }
};

