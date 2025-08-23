export default function ShippingPolicy() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Shipping Policy</h1>

      <h2 className="text-xl font-semibold mt-4">Order Processing</h2>
      <p>
        Orders are processed within <strong>2–3 business days</strong>. Customers
        will receive an email or SMS notification once the order is shipped.
      </p>

      <h2 className="text-xl font-semibold mt-4">Delivery Timeline</h2>
      <p>
        Our delivery timeline is between <strong>8–14 business days</strong>,
        depending on the customer’s location.
      </p>

      <h2 className="text-xl font-semibold mt-4">Shipping Coverage</h2>
      <p>
        Currently, we ship only within India. International shipping is not
        available at the moment.
      </p>

      <h2 className="text-xl font-semibold mt-4">Delays</h2>
      <p>
        While we strive to deliver on time, unforeseen courier or logistical
        delays may occur. We appreciate your understanding.
      </p>
    </div>
  );
}
