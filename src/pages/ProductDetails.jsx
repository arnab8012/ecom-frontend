import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
const { id } = useParams();
const nav = useNavigate();
const { add } = useCart();

const [p, setP] = useState(null);
const [variant, setVariant] = useState("");
const [qty, setQty] = useState(1);

// ✅ gallery state
const [idx, setIdx] = useState(0);

useEffect(() => {
let alive = true;

(async () => {  
  const r = await api.get(`/api/products/${id}`);  
  if (!alive) return;  

  if (r.ok) {  
    setP(r.product);  
    const firstVar = r.product.variants?.[0]?.name || "";  
    setVariant(firstVar);  

    // ✅ reset gallery index  
    setIdx(0);  
  } else {  
    alert(r.message || "Not found");  
  }  
})();  

return () => (alive = false);

}, [id]);

const imgs = useMemo(() => {
const arr = Array.isArray(p?.images) ? p.images : [];
return arr.filter(Boolean);
}, [p?.images]);

// ✅ auto image change
useEffect(() => {
if (imgs.length <= 1) return;
const t = setInterval(() => {
setIdx((x) => (x + 1) % imgs.length);
}, 2500);
return () => clearInterval(t);
}, [imgs.length]);

if (!p) return <div className="container">Loading...</div>;

const mainImg =
imgs[idx] || "https://via.placeholder.com/800x500?text=Product";

const cartItem = {
productId: p._id,
title: p.title,
image: imgs[0] || mainImg,
variant,
qty,
price: p.price,
};

const prev = () => {
if (!imgs.length) return;
setIdx((x) => (x - 1 + imgs.length) % imgs.length);
};

const next = () => {
if (!imgs.length) return;
setIdx((x) => (x + 1) % imgs.length);
};

return (
<div className="container">
<div className="pd">
{/* ✅ LEFT: Gallery */}
<div>
<div style={{ position: "relative" }}>
<img
className="pdImg"
src={mainImg}
alt={p.title}
style={{ width: "100%", borderRadius: 14 }}
/>

{/* ✅ arrow buttons */}  
        {imgs.length > 1 && (  
          <>  
            <button  
              type="button"  
              onClick={prev}  
              style={{  
                position: "absolute",  
                left: 10,  
                top: "50%",  
                transform: "translateY(-50%)",  
                width: 40,  
                height: 40,  
                borderRadius: 999,  
                border: "none",  
                cursor: "pointer",  
                background: "rgba(0,0,0,0.45)",  
                color: "#fff",  
                fontSize: 20,  
              }}  
            >  
              ‹  
            </button>  

            <button  
              type="button"  
              onClick={next}  
              style={{  
                position: "absolute",  
                right: 10,  
                top: "50%",  
                transform: "translateY(-50%)",  
                width: 40,  
                height: 40,  
                borderRadius: 999,  
                border: "none",  
                cursor: "pointer",  
                background: "rgba(0,0,0,0.45)",  
                color: "#fff",  
                fontSize: 20,  
              }}  
            >  
              ›  
            </button>  
          </>  
        )}  

        {/* ✅ dots */}  
        {imgs.length > 1 && (  
          <div  
            style={{  
              position: "absolute",  
              left: 0,  
              right: 0,  
              bottom: 10,  
              display: "flex",  
              justifyContent: "center",  
              gap: 8,  
            }}  
          >  
            {imgs.map((_, i) => (  
              <button  
                key={i}  
                type="button"  
                onClick={() => setIdx(i)}  
                style={{  
                  width: 10,  
                  height: 10,  
                  borderRadius: 999,  
                  border: "none",  
                  cursor: "pointer",  
                  background: i === idx ? "#111" : "rgba(0,0,0,0.25)",  
                }}  
                aria-label={`img-${i}`}  
              />  
            ))}  
          </div>  
        )}  
      </div>  

      {/* ✅ thumbnails */}  
      {imgs.length > 1 && (  
        <div  
          style={{  
            display: "flex",  
            gap: 10,  
            marginTop: 12,  
            overflowX: "auto",  
            paddingBottom: 6,  
          }}  
        >  
          {imgs.map((url, i) => (  
            <button  
              key={i}  
              type="button"  
              onClick={() => setIdx(i)}  
              style={{  
                border: i === idx ? "2px solid #ff007a" : "1px solid #eee",  
                borderRadius: 12,  
                padding: 2,  
                background: "#fff",  
                cursor: "pointer",  
                flex: "0 0 auto",  
              }}  
              title={`Image ${i + 1}`}  
            >  
              <img  
                src={url}  
                alt=""  
                width="78"  
                height="60"  
                style={{ objectFit: "cover", borderRadius: 10 }}  
              />  
            </button>  
          ))}  
        </div>  
      )}  
    </div>  

    {/* ✅ RIGHT: Details */}  
    <div className="pdRight">  
      <h2>{p.title}</h2>  

      <div className="priceRow">  
        <span className="price">৳ {p.price}</span>  
        {p.compareAtPrice ? (  
          <span className="cut">৳ {p.compareAtPrice}</span>  
        ) : null}  
      </div>  

      <div className="muted">Delivery time: {p.deliveryDays}</div>  

      {p.variants?.length ? (  
        <div className="box">  
          <div className="lbl">Available variant:</div>  
          <select  
            value={variant}  
            onChange={(e) => setVariant(e.target.value)}  
            className="input"  
          >  
            {p.variants.map((v, i) => (  
              <option key={i} value={v.name}>  
                {v.name} (Stock: {v.stock})  
              </option>  
            ))}  
          </select>  
        </div>  
      ) : null}  

      <div className="box">  
        <div className="lbl">Quantity</div>  
        <div className="qtyRow">  
          <button  
            className="btnGhost"  
            onClick={() => setQty((q) => Math.max(1, q - 1))}  
            type="button"  
          >  
            -  
          </button>  
          <input  
            className="qtyInput"  
            value={qty}  
            onChange={(e) => setQty(Number(e.target.value || 1))}  
          />  
          <button  
            className="btnGhost"  
            onClick={() => setQty((q) => q + 1)}  
            type="button"  
          >  
            +  
          </button>  
        </div>  
      </div>  

      <div className="pdBtns">  
        <button  
          className="btnPinkFull"  
          onClick={() => {  
            add(cartItem);  
            nav("/cart");  
          }}  
          type="button"  
        >  
          Add to Cart  
        </button>  

        <button  
          className="btnDarkFull"  
          onClick={() => {  
            add(cartItem);  
            nav("/checkout");  
          }}  
          type="button"  
        >  
          Buy Now  
        </button>  
      </div>  

      <div className="box">  
        <h4>Description</h4>  
        <p className="muted">{p.description || "No description yet."}</p>  
      </div>  
    </div>  
  </div>  
</div>

);
}