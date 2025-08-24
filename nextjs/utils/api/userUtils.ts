import userConnection from "../userConnection";

// Send OTP to email
export const sendOtp = async (email: string) => {
  const res = await userConnection.post('api/send-otp/', { email });
  return res.data;
};

// Verify OTP separately before registration
export const verifyOtp = async (email: string, otp: string) => {
  const res = await userConnection.post('api/verify-otp/', { email, otp });
  return res.data;
};

// Register user (only if OTP verified)
export const userRegister = async (data: any) => {
  const res = await userConnection.post('api/register/', data);
  return res.data;
};

export const userLogin = async (data: any) => {
  const res = await userConnection.post('api/login/', data);
  return res.data;
};

export const getUser = async () => {
  const res = await userConnection.get(`api/profile/`);
  return res.data;
};

export const updateUser = async (data: any) => {
  const res = await userConnection.put(`api/updateprofile/`, data);
  return res.data;
};



// Create Razorpay order
export async function createOrder(data: { 
  amount: number; 
  cart: any; 
  address: string; 
  phone: string;
}) {
  const res = await fetch("/api/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// Verify Razorpay payment
export const verifyPayment = async (data: any) => {
  const res = await userConnection.post('api/verify-payment/', data);
  return res.data;
};