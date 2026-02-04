import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Cart() {
  const nav = useNavigate();
  const { user } = useAuth();
  const { items, inc, dec, remove, clear } = useCart();

  const list = Array.isArray(items) ? items : [];

  const subtotal = list.reduce((s, x) => {
    const price = Number(x?.price) || 0;
    const qty = Number(x?.qty) || 0;
    return s + price * qty;
  }, 0);

  const goCheckout = () => {
    if (!list.length) return;
    if (!user) nav("/login");
    else nav("/checkout");
  };

  return (
    <div className="container">
      <div className="rowBetween" style={{ marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>Cart</h2>
        <button className="btnGhost" type="button" onClick={() => nav(-1)}>
          ← Back
        </button>
      </div>

      {!list.length ? (
        <div className="box">
          Your cart is empty. <Link to="/shop">Go to shop</Link>
        </div>
      ) : (
        <>
          <div className="cartList">
            {list.map((x) => {
              const id = x?._id || x?.id;
              const title = x?.title || "Product";
              const img =
                x?.images?.[0] ||
                x?.image ||
                x?.thumb ||
                "https://via.placeholder.com/120";

              const price = Number(x?.price) || 0;
              const qty = Number(x?.qty) || 1;

              return (
                <div className="cartItem" key={id}>
                  <Link to={`/product/${id}`} className="cartThumb">
                    <img
                      src={img}
                      alt={title}
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/120";
                      }}
                    />
                  </Link>

                  <div className="cartInfo">
                    <Link to={`/product/${id}`} className="cartTitle">
                      {title}
                    </Link>

                    <div className="cartMeta">
                      <span className="cartPrice">৳ {price}</span>
                      <span className="cartLine">× {qty} = ৳ {price * qty}</span>
                    </div>

                    <div className="cartActions">
                      <div className="qtyBox">
                        <button type="button" onClick={() => dec(id)} className="qtyBtn">
                          −
                        </button>
                        <span className="qtyNum">{qty}</span>
                        <button type="button" onClick={() => inc(id)} className="qtyBtn">
                          +
                        </button>
                      </div>

                      <button type="button" className="btnDanger" onClick={() => remove(id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cartSummary">
            <div className="sumRow">
              <span>Subtotal</span>
              <b>৳ {subtotal}</b>
            </div>

            <div className="sumBtns">
              <button className="btnSoft" type="button" onClick={clear}>
                Clear Cart
              </button>

              <button className="btnPrimary" type="button" onClick={goCheckout}>
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}