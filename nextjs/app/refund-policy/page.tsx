export default function RefundPolicy() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Cancellation & Refund Policy</h1>

      <h2 className="text-xl font-semibold mt-4">Order Cancellation</h2>
      <p>
        - Orders can be cancelled within <strong>30 hours</strong> of placing them. <br />
        - To cancel, contact us at 📧 <strong>kazuhastore8@gmail.com</strong> with your order details. <br />
        - Once the order has been shipped, cancellation is not allowed.
      </p>

      <h2 className="text-xl font-semibold mt-4">Refund Policy</h2>
      <p>
        - If cancellation is made within the allowed time, a full refund will be
        processed. <br />
        - Refunds are credited back to the original payment method. <br />
        - It may take <strong>4–5 working days</strong> for the refund to reflect
        in your account.
      </p>

      <h2 className="text-xl font-semibold mt-4">Exceptions</h2>
      <p>
        - Orders once shipped cannot be cancelled or refunded. <br />
        - No refunds will be issued for incorrect shipping details or failed
        deliveries due to customer error.
      </p>
    </div>
  );
}
