import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";

export default function ProductCard({ p }) {
const nav = useNavigate();
const { add } = useCart();
const { user } = useAuth();

// ✅ আগে destructure
const { isFav, toggle } = useFavorites();

const imgs = useMemo(() => {
const arr = Array.isArray(p?.images) ? p.images : [];
return arr.filter(Boolean);
}, [p?._id]); // ✅ stable

const [idx, setIdx] = useState(0);

// ✅ Auto image change
useEffect(() => {
if (imgs.length <= 1) return;
setIdx(0);

const t = setInterval(() => {  
  setIdx((x) => (x + 1) % imgs.length);  
}, 2500);  

return () => clearInterval(t);

}, [imgs.length]);

const img = imgs[idx] || "https://via.placeholder.com/400x300?text=Product";

const onFav = (e) => {
e.preventDefault();
e.stopPropagation();

// ✅ যদি তুমি চাও login ছাড়া fav না হোক:  
if (!user) {  
  nav("/login");  
  return;  
}  

toggle(p._id);

};

return (
<div className="card" style={{ position: "relative" }}>
{/* ✅ image area */}
<div style={{ position: "relative" }}>
<Link to={/product/${p._id}}>
<img className="cardImg" src={img} alt={p?.title || ""} />
</Link>

{/* ❤️ Favorite icon (top-right) */}  
    <button  
      type="button"  
      onClick={onFav}  
      title="Priyo"  
      style={{  
        position: "absolute",  
        top: 10,  
        right: 10,  
        width: 36,  
        height: 36,  
        borderRadius: 999,  
        border: "none",  
        cursor: "pointer",  
        background: "rgba(255,255,255,0.9)",  
        boxShadow: "0 6px 20px rgba(0,0,0,0.12)",  
        display: "flex",  
        alignItems: "center",  
        justifyContent: "center",  
        zIndex: 5  
      }}  
    >  
      <span style={{ fontSize: 18, lineHeight: 1 }}>  
        {isFav(p._id) ? "❤️" : "🤍"}  
      </span>  
    </button>  

    {/* ✅ dots (only if multi images) */}  
    {imgs.length > 1 && (  
      <div  
        style={{  
          position: "absolute",  
          bottom: 10,  
          left: 0,  
          right: 0,  
          display: "flex",  
          justifyContent: "center",  
          gap: 6,  
          zIndex: 4  
        }}  
      >  
        {imgs.map((_, i) => (  
          <button  
            key={i}  
            type="button"  
            onClick={(e) => {  
              e.preventDefault();  
              e.stopPropagation();  
              setIdx(i);  
            }}  
            aria-label={`img-${i}`}  
            style={{  
              width: 8,  
              height: 8,  
              borderRadius: 999,  
              border: "none",  
              cursor: "pointer",  
              opacity: i === idx ? 1 : 0.35,  
              background: "#111"  
            }}  
          />  
        ))}  
      </div>  
    )}  
  </div>  

  <div className="cardBody">  
    <Link className="cardTitle" to={`/product/${p._id}`}>  
      {p.title}  
    </Link>  

    <div className="priceRow">  
      <span className="price">৳ {p.price}</span>  
    </div>  

    <div className="rowBetween" style={{ marginTop: 8 }}>  
      <button className="btnGhost" type="button" onClick={() => nav(`/product/${p._id}`)}>  
        View Product  
      </button>  

      <button  
        className="btnPink"  
        type="button"  
        onClick={() => {  
          add({  
            productId: p._id,  
            title: p.title,  
            price: p.price,  
            image: imgs[0] || "",  
            variant: "",  
            qty: 1  
          });  
          alert("✅ Added to cart");  
        }}  
      >  
        Add  
      </button>  
    </div>  
  </div>  
</div>

);
}