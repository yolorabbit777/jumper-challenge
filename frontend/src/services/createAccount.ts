import axios from 'axios';

export const createAccount = async (address: string, signature: string) => {
  try {
    const response = await axios.post('/api/auth/create', {
      address,
      signature,
    }, {
      withCredentials: true // Important for cookies
    });

    if (response.data.status === true) {
      return true;
    }

    return true;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Account creation failed:', error.response.data.message);
      throw new Error(error.response.data.message);
    }
    console.error('Account creation failed:', error);
    throw error;
  }
};