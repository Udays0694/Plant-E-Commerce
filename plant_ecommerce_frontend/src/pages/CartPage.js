import React, { useMemo, useState } from 'react';
import { useCart } from '../contexts/CartContext';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState('COD'); // NEW STATE: Default is COD

  const totalPrice = useMemo(() => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce((acc, item) => acc + item.cost * item.quantity, 0);
  }, [cartItems]);

  const handlePlaceOrderClick = async () => {
    if (!cartItems || cartItems.length === 0) return alert("Cart is empty");

    const orderPayload = {
      userId: 14, // Later fetch dynamically
      productIdWithQuantity: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      "total Amount": totalPrice,
      payment_method: paymentMethod, // NEW FIELD
    };

    try {
      const response = await fetch('http://localhost:5000/orders/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      const result = await response.json();
      console.log("Order placed:", result);

      alert("Order placed successfully!");
      clearCart();
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Failed to place order.");
    }
  };

  return (
    <div className="cart-page">
      <h1>Your Shopping Cart</h1>

      <div className="cart-items">
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="cart-item" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <img
                src={`http://localhost:5000/${item.image_path}`}
                alt={item.general_name}
                width="100"
              />
              <div>
                <h3>{item.general_name}</h3>
                <p>Price: ${item.cost}</p>
                <p>Subtotal: ${item.cost * item.quantity}</p>
                <label>Quantity: </label>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                />
                <br />
                <button onClick={() => removeFromCart(item.id)}>
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Payment Method Selection */}
      <div className="payment-method" style={{ marginTop: '2rem' }}>
        <h2>Select Payment Method:</h2>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="COD">Cash on Delivery</option>
          <option value="PayPal">PayPal</option>
          <option value="Card">Credit/Debit Card</option>
        </select>
      </div>

      <div className="cart-summary" style={{ marginTop: '2rem' }}>
        <h2>Cart Summary</h2>
        <p>Total Price: ${totalPrice}</p>
        <button onClick={handlePlaceOrderClick}>Place Order</button>
      </div>
    </div>
  );
};

export default CartPage;
