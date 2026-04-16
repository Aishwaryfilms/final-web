import merchPreview from "../assets/merch-preview.jpg";
import "./ShopSection.css";

// Update this list later with your real product images and descriptions.
const SHOP_ITEMS = [
  {
    id: "item-1",
    title: "YOU Core Hoodie",
    description: "Heavyweight hoodie with clean front branding.",
    image: merchPreview,
    status: "OUT OF STOCK",
  },
  {
    id: "item-2",
    title: "YOU Match Jersey",
    description: "Performance jersey designed for team identity.",
    image: merchPreview,
    status: "OUT OF STOCK",
  },
  {
    id: "item-3",
    title: "YOU Snapback",
    description: "Classic structured cap with tonal logo mark.",
    image: merchPreview,
    status: "OUT OF STOCK",
  },
  {
    id: "item-4",
    title: "YOU Utility Tee",
    description: "Daily-wear cotton tee with minimal graphics.",
    image: merchPreview,
    status: "OUT OF STOCK",
  },
  {
    id: "item-5",
    title: "YOU Track Pants",
    description: "Comfort-fit training pants for travel and practice.",
    image: merchPreview,
    status: "OUT OF STOCK",
  },
  {
    id: "item-6",
    title: "YOU Sleeve Set",
    description: "Compression sleeve set for competitive sessions.",
    image: merchPreview,
    status: "OUT OF STOCK",
  },
];

export default function ShopSection() {
  return (
    <section id="shop" className="reveal shop-simple-page">
      <header className="shop-simple-header">
        <div className="sec-label wipe">THE ARMORY</div>
        <h2 className="sec-h2">MERCH <span className="red">STORE</span></h2>
        <p className="shop-simple-sub">
          Official YOU eSports merchandise. Products are currently listed as out of stock and can be updated later.
        </p>
      </header>

      <div className="shop-simple-grid">
        {SHOP_ITEMS.map((item) => (
          <article className="shop-simple-card card" key={item.id}>
            <div className="shop-simple-media">
              <img src={item.image} alt={`${item.title} preview`} loading="lazy" decoding="async" />
            </div>
            <div className="shop-simple-body">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="shop-simple-stock out">{item.status}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
