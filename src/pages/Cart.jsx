import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, remove, setQty, clear } = useCart();
  const nav = useNavigate();

  const subTotal = items.reduce((s, it) => s + it.price * it.qty, 0);

  return (
    <div className="container">
      <h2>Cart</h2>
      {items.length === 0 ? (
        <div className="box">
          Cart empty. <Link to="/">Go Home</Link>
        </div>
      ) : (
        <>
          <div className="cartList">
            {items.map((it, idx) => (
              <div className="cartItem" key={idx}>
                <img src={it.image} alt="" className="cartImg" />
                <div className="cartInfo">
                  <div className="cardTitle">{it.title}</div>
                  <div className="muted">{it.variant ? `Variant: ${it.variant}` : ""}</div>
                  <div className="priceRow">
                    <span className="price">৳ {it.price}</span>
                  </div>

                  <div className="qtyRow">
                    <button className="btnGhost" onClick={() => setQty(it.productId, it.variant, it.qty - 1)}>-</button>
                    <input
                      className="qtyInput"
                      value={it.qty}
                      onChange={(e) => setQty(it.productId, it.variant, e.target.value)}
                    />
                    <button className="btnGhost" onClick={() => setQty(it.productId, it.variant, it.qty + 1)}>+</button>

                    <button className="btnGhost" onClick={() => remove(it.productId, it.variant)}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="box">
            <div className="rowBetween">
              <b>Sub Total</b>
              <b>৳ {subTotal}</b>
            </div>
            <div className="rowBetween">
              <button className="btnGhost" onClick={clear}>Clear</button>
              <button className="btnPinkFull" onClick={() => nav("/checkout")}>
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
