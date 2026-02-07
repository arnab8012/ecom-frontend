// src/pages/Cart.jsx

import "../styles/cart.css"; // ✅ এইটা যোগ করো (না থাকলে cart page unstyled হবে)

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

  const formatBDT = (n) => `৳ ${Math.round(Number(n) || 0).toLocaleString("en-US")}`;

  const goCheckout = () => {
    if (!list.length) return;
    if (!user) nav("/login");
    else nav("/checkout");
  };

  return (
    <div className="container cartPage">
      <div className="rowBetween cartHead" style={{ marginBottom: 12 }}>
        <h2 className="cartTitleH" style={{ margin: 0 }}>
          Cart
        </h2>

        <button className="btnGhost cartBackBtn" type="button" onClick={() => nav(-1)}>
          ← Back
        </button>
      </div>

      {!list.length ? (
        <div className="box cartEmpty">
          Your cart is empty. <Link to="/shop">Go to shop</Link>
        </div>
      ) : (
        <>
          <div className="cartList cartListPremium">
            {list.map((x) => {
              const id = x?._id || x?.id;
              const title = x?.title || "Product";

              const img =
                x?.images?.[0] ||
                x?.image ||
                x?.thumb ||
                "https://via.placeholder.com/320x240?text=Product";

              const price = Number(x?.price) || 0;
              const qty = Number(x?.qty) || 1;

              return (
                <div className="cartItem cartItemPremium" key={id || title}>
                  <Link to={`/product/${id}`} className="cartThumb cartThumbPremium">
                    <img
                      src={img}
                      alt={title}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/320x240?text=Product";
                      }}
                    />
                  </Link>

                  <div className="cartInfo cartInfoPremium">
                    <Link to={`/product/${id}`} className="cartTitle cartTitleLinkPremium">
                      {title}
                    </Link>

                    <div className="cartMeta cartMetaPremium">
                      <span className="cartPrice cartPricePremium">{formatBDT(price)}</span>
                      <span className="cartLine cartLinePremium">
                        × {qty} = {formatBDT(price * qty)}
                      </span>
                    </div>

                    <div className="cartActions cartActionsPremium">
                      <div className="qtyBox qtyBoxPremium">
                        <button
                          type="button"
                          onClick={() => dec(id)}
                          className="qtyBtn qtyBtnPremium"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>

                        <span className="qtyNum qtyNumPremium">{qty}</span>

                        <button
                          type="button"
                          onClick={() => inc(id)}
                          className="qtyBtn qtyBtnPremium"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="btnDanger btnDangerPremium"
                        onClick={() => remove(id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cartSummary cartSummaryPremium">
            <div className="sumRow sumRowPremium">
              <span>Subtotal</span>
              <b>{formatBDT(subtotal)}</b>
            </div>

            <div className="sumBtns sumBtnsPremium">
              <button className="btnSoft cartClearBtn" type="button" onClick={clear}>
                Clear Cart
              </button>

              <button className="btnPrimary cartCheckoutBtn" type="button" onClick={goCheckout}>
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}