import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/api";

const DIVISIONS = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh"
];

const BOOK_KEY = "shipping_book_v1";

function emptyShipping(user) {
  return {
    fullName: user?.fullName || "",
    phone1: user?.phone || "",
    phone2: "",
    division: "Dhaka",
    district: "",
    upazila: "",
    addressLine: "",
    note: ""
  };
}

function makeLabel(s) {
  const a = [s.fullName, s.phone1, s.division, s.district, s.upazila, s.addressLine]
    .filter(Boolean)
    .join(" | ");
  return a.length > 80 ? a.slice(0, 80) + "..." : a || "Address";
}

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function loadBook() {
  try {
    const b = JSON.parse(localStorage.getItem(BOOK_KEY) || "{}");
    return {
      selectedId: b?.selectedId || "",
      items: Array.isArray(b?.items) ? b.items : []
    };
  } catch {
    return { selectedId: "", items: [] };
  }
}

export default function Checkout() {
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const buyMode = sp.get("mode") === "buy"; // ✅ buy now mode

  const { items, clear, checkoutItem, clearBuyNow } = useCart(); // ✅ checkoutItem + clearBuyNow যোগ
  const { user } = useAuth();

  const token = api.token();

  const [book, setBook] = useState(loadBook());
  const [useNew, setUseNew] = useState(false);
  const [selectedId, setSelectedId] = useState(book.selectedId || "");

  const [shipping, setShipping] = useState(emptyShipping(user));

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const deliveryCharge = 110;

  // ✅ orderItems: buyMode হলে শুধু checkoutItem, না হলে cart items
  const orderItems = useMemo(() => {
    if (buyMode) return checkoutItem ? [checkoutItem] : [];
    return Array.isArray(items) ? items : [];
  }, [buyMode, items, checkoutItem]);

  const subTotal = useMemo(
    () => orderItems.reduce((s, it) => s + Number(it.price || 0) * Number(it.qty || 0), 0),
    [orderItems]
  );

  const total = subTotal + deliveryCharge;

  // ✅ when user loads / book changes -> set initial shipping
  useEffect(() => {
    const b = loadBook();
    setBook(b);

    const sid = b.selectedId || b.items?.[0]?.id || "";
    setSelectedId(sid);

    if (!sid) {
      setUseNew(true);
      setShipping(emptyShipping(user));
      return;
    }

    const found = b.items.find((x) => x.id === sid);
    if (found?.shipping) {
      setUseNew(false);
      setShipping({ ...emptyShipping(user), ...found.shipping });
    } else {
      setUseNew(true);
      setShipping(emptyShipping(user));
    }
    // eslint-disable-next-line
  }, [user?.id]);

  // ✅ when selectedId changes -> update shipping from book (only if not useNew)
  useEffect(() => {
    if (useNew) return;
    const found = book.items.find((x) => x.id === selectedId);
    if (found?.shipping) {
      setShipping({ ...emptyShipping(user), ...found.shipping });
    }
    // eslint-disable-next-line
  }, [selectedId]);

  if (!orderItems.length) return <div className="container">No item selected</div>;

  const validateShipping = () => {
    if (!shipping.fullName) return "Name required";
    if (!shipping.phone1) return "Phone required";
    if (!shipping.division) return "Division required";
    if (!shipping.district) return "District required";
    if (!shipping.upazila) return "Upazila/Thana required";
    if (!shipping.addressLine) return "Address required";
    return "";
  };

  const saveToBook = (ship) => {
    const current = loadBook();

    if (!useNew && selectedId) {
      const nextItems = current.items.map((x) =>
        x.id === selectedId ? { ...x, shipping: ship, label: x.label || makeLabel(ship) } : x
      );

      const next = { ...current, selectedId, items: nextItems };
      localStorage.setItem(BOOK_KEY, JSON.stringify(next));
      setBook(next);
      return;
    }

    const id = uid();
    const nextItems = [{ id, label: makeLabel(ship), shipping: ship }, ...(current.items || [])];

    const next = { selectedId: id, items: nextItems };
    localStorage.setItem(BOOK_KEY, JSON.stringify(next));

    setBook(next);
    setSelectedId(id);
    setUseNew(false);
  };

  const deleteAddress = (id) => {
    const current = loadBook();
    const nextItems = (current.items || []).filter((x) => x.id !== id);

    const nextSelected = current.selectedId === id ? nextItems[0]?.id || "" : current.selectedId;

    const next = { selectedId: nextSelected, items: nextItems };
    localStorage.setItem(BOOK_KEY, JSON.stringify(next));

    setBook(next);
    setSelectedId(nextSelected);

    if (!nextSelected) {
      setUseNew(true);
      setShipping(emptyShipping(user));
    } else {
      setUseNew(false);
      const found = nextItems.find((x) => x.id === nextSelected);
      if (found?.shipping) setShipping({ ...emptyShipping(user), ...found.shipping });
    }
  };

  const placeOrder = async () => {
    if (!token) {
      nav("/login");
      return;
    }

    const msg = validateShipping();
    if (msg) return alert(msg);

    saveToBook(shipping);

    const payload = {
      items: orderItems.map((x) => ({
        productId: x.productId,
        qty: x.qty,
        variant: x.variant
      })),
      shipping,
      paymentMethod
    };

    const r = await api.post("/api/orders", payload, token);
    if (!r?.ok) return alert(r?.message || "Order failed");

    // ✅ buyMode হলে cart clear করবে না
    if (buyMode) clearBuyNow?.();
    else clear?.();

    alert("✅ Order placed!");
    nav("/profile");
  };

  return (
    <div className="container">
      <h2>Shipping Details</h2>

      {/* ✅ Saved addresses */}
      {book.items?.length > 0 && (
        <div className="box" style={{ marginBottom: 14 }}>
          <div className="rowBetween">
            <b>Saved Addresses</b>

            <button
              type="button"
              className="btnGhost"
              onClick={() => {
                setUseNew(true);
                setShipping(emptyShipping(user));
              }}
            >
              + New Shipping Details
            </button>
          </div>

          {!useNew && (
            <div style={{ marginTop: 10 }}>
              {book.items.map((x) => (
                <div
                  key={x.id}
                  className="rowBetween"
                  style={{
                    padding: "8px 10px",
                    border: "1px solid #eee",
                    borderRadius: 8,
                    marginBottom: 8,
                    background: selectedId === x.id ? "#f7f7ff" : "#fff"
                  }}
                >
                  <label style={{ cursor: "pointer", flex: 1 }}>
                    <input
                      type="radio"
                      checked={selectedId === x.id}
                      onChange={() => setSelectedId(x.id)}
                      style={{ marginRight: 8 }}
                    />
                    {x.label}
                  </label>

                  <button
                    type="button"
                    className="btnGhost"
                    style={{ color: "crimson", borderColor: "#ffd6d6" }}
                    onClick={() => {
                      if (!confirm("Delete this address?")) return;
                      deleteAddress(x.id);
                    }}
                  >
                    🗑 Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          {useNew && (
            <div className="muted" style={{ marginTop: 10 }}>
              New address mode — নিচে নতুন ঠিকানা লিখে “Save & Use” করো
            </div>
          )}
        </div>
      )}

      <div className="box">
        <label className="lbl">আপনার নাম</label>
        <input
          className="input"
          value={shipping.fullName}
          onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
        />

        <label className="lbl">মোবাইল নাম্বার</label>
        <input
          className="input"
          value={shipping.phone1}
          onChange={(e) => setShipping({ ...shipping, phone1: e.target.value })}
        />

        <label className="lbl">মোবাইল নাম্বার 2 (optional)</label>
        <input
          className="input"
          value={shipping.phone2}
          onChange={(e) => setShipping({ ...shipping, phone2: e.target.value })}
        />

        <label className="lbl">বিভাগ</label>
        <select
          className="input"
          value={shipping.division}
          onChange={(e) => setShipping({ ...shipping, division: e.target.value })}
        >
          {DIVISIONS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <label className="lbl">জেলা</label>
        <input
          className="input"
          value={shipping.district}
          onChange={(e) => setShipping({ ...shipping, district: e.target.value })}
        />

        <label className="lbl">উপজেলা/থানা</label>
        <input
          className="input"
          value={shipping.upazila}
          onChange={(e) => setShipping({ ...shipping, upazila: e.target.value })}
        />

        <label className="lbl">সম্পূর্ণ ঠিকানা (থানা সহ লিখে দিবেন)</label>
        <input
          className="input"
          value={shipping.addressLine}
          onChange={(e) => setShipping({ ...shipping, addressLine: e.target.value })}
        />

        <label className="lbl">অর্ডার নোট (Optional)</label>
        <textarea
          className="input"
          rows={3}
          value={shipping.note}
          onChange={(e) => setShipping({ ...shipping, note: e.target.value })}
        />

        <div className="rowBetween" style={{ marginTop: 10 }}>
          <button
            type="button"
            className="btnGhost"
            onClick={() => {
              const msg = validateShipping();
              if (msg) return alert(msg);
              saveToBook(shipping);
              alert("✅ Address saved!");
            }}
          >
            Save & Use
          </button>

          {book.items?.length > 0 && (
            <button
              type="button"
              className="btnGhost"
              onClick={() => {
                setUseNew(false);
                const sid = book.selectedId || book.items?.[0]?.id || "";
                setSelectedId(sid);
                const found = book.items.find((x) => x.id === sid);
                if (found?.shipping) setShipping({ ...emptyShipping(user), ...found.shipping });
              }}
            >
              Use Saved Address
            </button>
          )}
        </div>

        <div className="box" style={{ marginTop: 12 }}>
          <div className="rowBetween">
            <span>Sub Total:</span>
            <b>৳ {subTotal}</b>
          </div>
          <div className="rowBetween">
            <span>Delivery Charge:</span>
            <b>৳ {deliveryCharge}</b>
          </div>
          <div className="rowBetween">
            <span>Total:</span>
            <b>৳ {total}</b>
          </div>
        </div>

        <div className="rowBetween" style={{ marginTop: 10 }}>
          <label className="radio">
            <input
              type="radio"
              checked={paymentMethod === "FULL_PAYMENT"}
              onChange={() => setPaymentMethod("FULL_PAYMENT")}
            />
            Full Payment
          </label>

          <label className="radio">
            <input
              type="radio"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
            />
            Cash On Delivery
          </label>
        </div>

        <button className="btnPinkFull" onClick={placeOrder} style={{ marginTop: 12 }}>
          অর্ডার নিশ্চিত করুন
        </button>
      </div>
    </div>
  );
}