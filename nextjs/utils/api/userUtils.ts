import userConnection from "../userConnection";

// ---------------- AUTH & USER ---------------- //

// Send OTP to email
export const sendOtp = async (email: string) => {
  const res = await userConnection.post("api/send-otp/", { email });
  return res.data;
};

// Verify OTP separately before registration
export const verifyOtp = async (email: string, otp: string) => {
  const res = await userConnection.post("api/verify-otp/", { email, otp });
  return res.data;
};

// Register user (only if OTP verified)
export const userRegister = async (data: any) => {
  const res = await userConnection.post("api/register/", data);
  return res.data;
};

// Login user
export const userLogin = async (data: any) => {
  const res = await userConnection.post("api/login/", data);
  return res.data;
};

// Get logged-in user profile
export const getUser = async () => {
  const res = await userConnection.get("api/profile/");
  return res.data;
};

// Update user profile
export const updateUser = async (data: any) => {
  const res = await userConnection.put("api/updateprofile/", data);
  return res.data;
};

// ---------------- RAZORPAY ---------------- //

// Create Razorpay order (with JWT token via userConnection)
export const createOrder = async (data: {
  amount: number;
  cart: any;
  address: string;
  phone: string;
}) => {
  const res = await userConnection.post("api/create-order/", data); // ✅ trailing slash + token
  return res.data; // will include order_id, amount, currency
};


// Verify Razorpay payment (HMAC signature check on backend)


export const verifyPayment = async (data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  const res = await userConnection.post("api/verify-payment/", data);
  return res.data; 
};


export const fetchOrderHistory = async () => {
  const res = await userConnection.get("api/order-history/");
  return res.data;
};