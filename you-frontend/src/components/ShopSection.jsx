import { useEffect, useMemo, useState } from "react";
import "./ShopSection.css";
import merchPreview from "../assets/merch-preview.jpg";

const DEFAULT_STOCK_STATUS = "OUT OF STOCK";

export const DEFAULT_SHOP_ITEMS = [
  {
    id: "you-sticker-pack",
    title: "YOU Sticker Pack",
    description: "Official logo stickers with multiple badge variants for laptops, bottles, and gear cases.",
    status: DEFAULT_STOCK_STATUS,
    imageFileName: "you-sticker-pack.jpg",
  },
  {
    id: "you-wolf-cap",
    title: "YOU Wolf Cap",
    description: "Black curved cap with a red embroidered wolf emblem on the front panel.",
    status: DEFAULT_STOCK_STATUS,
    imageFileName: "you-wolf-cap.jpg",
  },
  {
    id: "you-essentials-tee",
    title: "YOU Essentials Tee",
    description: "Minimal black essentials tee with a clean red chest wolf logo.",
    status: DEFAULT_STOCK_STATUS,
    imageFileName: "you-essentials-tee.jpg",
  },
  {
    id: "you-pro-jersey-custom",
    title: "YOU Pro Jersey",
    description: "Official red-and-black match jersey with signature wolf artwork and team branding.",
    status: DEFAULT_STOCK_STATUS,
    imageFileName: "you-pro-jersey-front.jpg",
  },
];

const SHOP_ROUTE_PREFIX = "shop/";

const getDefaultMerchBasePath = () => {
  const basePath = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");
  return `${basePath}merch/`;
};

const shouldPreferWorkspaceRootMerch = () => {
  if (typeof window === "undefined") return false;
  const currentPath = String(window.location.pathname || "")
    .replace(/\\/g, "/")
    .toLowerCase();
  return currentPath.includes("/you-frontend/");
};

const getMerchImageCandidates = (fileName) => {
  const defaultPath = `${getDefaultMerchBasePath()}${fileName}`;
  if (!shouldPreferWorkspaceRootMerch()) return [defaultPath];
  return [`../merch/${fileName}`, defaultPath];
};

const getMerchImagePath = (fileName) => getMerchImageCandidates(fileName)[0];

const handleMerchImageError = (event) => {
  const currentImage = event.currentTarget;
  const merchFileName = currentImage.dataset.merchFileName;
  const currentCandidateIndex = Number(currentImage.dataset.merchCandidateIndex || "0");

  if (merchFileName) {
    const candidates = getMerchImageCandidates(merchFileName);
    const nextCandidateIndex = currentCandidateIndex + 1;
    if (nextCandidateIndex < candidates.length) {
      currentImage.dataset.merchCandidateIndex = String(nextCandidateIndex);
      currentImage.src = candidates[nextCandidateIndex];
      return;
    }
  }

  if (currentImage.dataset.fallbackApplied === "true") return;
  currentImage.dataset.fallbackApplied = "true";
  currentImage.src = merchPreview;
};

const getActiveProductIdFromHash = () => {
  if (typeof window === "undefined") return null;
  const hashValue = window.location.hash.replace(/^#\/?/, "");
  if (!hashValue.toLowerCase().startsWith(SHOP_ROUTE_PREFIX)) return null;

  const encodedId = hashValue.slice(SHOP_ROUTE_PREFIX.length);
  if (!encodedId) return null;

  try {
    return decodeURIComponent(encodedId);
  } catch {
    return null;
  }
};

const openShopCatalog = () => {
  if (typeof window === "undefined") return;
  window.location.hash = "shop";
};

const openProductPage = (productId) => {
  if (typeof window === "undefined") return;
  window.location.hash = `shop/${encodeURIComponent(String(productId))}`;
};

const trimText = (value) => (typeof value === "string" ? value.trim() : "");

const parseShopImagesField = (value) => {
  if (Array.isArray(value)) return value;

  const trimmed = trimText(value);
  if (!trimmed) return [];

  try {
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [trimmed];
  }
};

const normalizeShopImage = (value, index) => {
  if (typeof value === "string") {
    const trimmed = trimText(value);
    if (!trimmed) return null;

    const looksLikeUrl = /^(https?:\/\/|data:|blob:|\/|\.\/|\.\.\/)/i.test(trimmed);
    return {
      id: `shop-image-${index + 1}`,
      img: looksLikeUrl ? trimmed : null,
      imageFileName: looksLikeUrl ? "" : trimmed,
    };
  }

  if (!value || typeof value !== "object") return null;

  const img = trimText(value.img || value.src || value.url || value.dataUrl) || null;
  const imageFileName = trimText(
    value.imageFileName
      || value.image_file_name
      || value.fileName
      || value.file_name
  );

  if (!img && !imageFileName) return null;

  return {
    id: String(value.id || `shop-image-${index + 1}`),
    img,
    imageFileName,
  };
};

const isRenderableShopImage = (image) => Boolean(
  trimText(image?.img) || trimText(image?.imageFileName || image?.image_file_name)
);

const uniqueShopImages = (images) => {
  const seen = new Set();
  const unique = [];

  images.forEach((image, index) => {
    const normalized = normalizeShopImage(image, index);
    if (!normalized) return;

    const dedupeKey = `${normalized.img || ""}|${normalized.imageFileName || ""}`;
    if (seen.has(dedupeKey)) return;
    seen.add(dedupeKey);

    unique.push(normalized);
  });

  return unique;
};

const buildShopImageList = (item, ensureFallback = true) => {
  const hasExplicitImages = [
    item?.images,
    item?.imageGallery,
    item?.image_gallery,
    item?.image_gallery_json,
    item?.imageUrls,
    item?.image_urls,
  ].some((value) => Array.isArray(value) || (typeof value === "string" && trimText(value) !== ""));

  const imageSources = [
    ...parseShopImagesField(item?.images),
    ...parseShopImagesField(item?.imageGallery),
    ...parseShopImagesField(item?.image_gallery),
    ...parseShopImagesField(item?.image_gallery_json),
    ...parseShopImagesField(item?.imageUrls),
    ...parseShopImagesField(item?.image_urls),
  ];

  const images = uniqueShopImages(imageSources);

  if (!images.length && !hasExplicitImages) {
    const fallbackImage = normalizeShopImage(
      {
        id: "shop-primary",
        img: item?.img || null,
        imageFileName: item?.imageFileName || item?.image_file_name,
      },
      0
    );

    if (fallbackImage) images.push(fallbackImage);
  }

  if (!images.length && ensureFallback) {
    images.push({ id: "shop-fallback", img: merchPreview, imageFileName: "" });
  }

  return images.map((image, index) => ({
    id: String(image.id || `shop-image-${index + 1}`),
    img: trimText(image.img) || null,
    imageFileName: trimText(image.imageFileName || image.image_file_name),
  }));
};

const normalizeShopItem = (item, index) => {
  const rawImages = buildShopImageList(item, false);
  const renderableImages = rawImages.filter(isRenderableShopImage);

  const legacyPrimary = normalizeShopImage(
    {
      id: "shop-legacy-primary",
      img: item?.img || null,
      imageFileName: item?.imageFileName || item?.image_file_name,
    },
    0
  );

  const images = renderableImages.length
    ? renderableImages
    : (legacyPrimary && isRenderableShopImage(legacyPrimary)
      ? [legacyPrimary]
      : [{ id: "shop-fallback", img: merchPreview, imageFileName: "" }]);

  const primaryImage = images[0] || { id: "shop-fallback", img: merchPreview, imageFileName: "" };

  return {
    id: String(item?.id || `merch-item-${index + 1}`),
    title: String(item?.title || item?.name || `Merch Item ${index + 1}`),
    description: String(item?.description || "Description coming soon."),
    status: String(item?.status || DEFAULT_STOCK_STATUS),
    imageFileName: primaryImage.imageFileName,
    img: primaryImage.img,
    images,
  };
};

const resolveShopImageSource = (image) => {
  if (image?.img) return image.img;
  if (image?.imageFileName) return getMerchImagePath(image.imageFileName);
  return merchPreview;
};

export default function ShopSection({ items = DEFAULT_SHOP_ITEMS }) {
  const [activeProductId, setActiveProductId] = useState(() => getActiveProductIdFromHash());
  const [activeProductImageIndex, setActiveProductImageIndex] = useState(0);
  const [hoveredCardId, setHoveredCardId] = useState("");
  const [stockActionMessage, setStockActionMessage] = useState("");

  const shopItems = useMemo(() => {
    const source = Array.isArray(items) ? items : DEFAULT_SHOP_ITEMS;
    return source.map((item, index) => normalizeShopItem(item, index));
  }, [items]);

  useEffect(() => {
    const syncProductFromHash = () => {
      setActiveProductId(getActiveProductIdFromHash());
      setActiveProductImageIndex(0);
      setHoveredCardId("");
      setStockActionMessage("");
    };

    window.addEventListener("hashchange", syncProductFromHash);
    return () => window.removeEventListener("hashchange", syncProductFromHash);
  }, []);

  const activeProduct = useMemo(
    () => shopItems.find((item) => item.id === activeProductId) || null,
    [activeProductId, shopItems]
  );

  const activeProductImages = activeProduct?.images?.length
    ? activeProduct.images
    : [{ id: "shop-fallback", img: merchPreview, imageFileName: "" }];

  useEffect(() => {
    if (!activeProduct) return;
    if (activeProductImageIndex < activeProductImages.length) return;
    setActiveProductImageIndex(0);
  }, [activeProduct, activeProductImageIndex, activeProductImages.length]);

  const activeProductImage = activeProductImages[activeProductImageIndex] || activeProductImages[0];
  const hasGallery = activeProductImages.length > 1;

  const goToProductImage = (nextIndex) => {
    if (!activeProductImages.length) return;
    const imageCount = activeProductImages.length;
    const normalizedIndex = ((nextIndex % imageCount) + imageCount) % imageCount;
    setActiveProductImageIndex(normalizedIndex);
  };

  const notifyOutOfStock = (actionLabel) => {
    if (!activeProduct) return;
    setStockActionMessage(`OUT OF STOCK: ${activeProduct.title} is unavailable for ${actionLabel}.`);
  };

  if (activeProductId && !activeProduct) {
    return (
      <section id="shop" className="reveal shop-simple-page">
        <header className="shop-simple-header">
          <button type="button" className="shop-back-btn" onClick={openShopCatalog}>
            BACK TO SHOP
          </button>
          <div className="sec-label wipe">THE ARMORY</div>
          <h2 className="sec-h2">PRODUCT <span className="red">NOT FOUND</span></h2>
          <p className="shop-simple-sub">
            This product link is invalid or no longer available in the catalog.
          </p>
        </header>
      </section>
    );
  }

  if (activeProduct) {
    return (
      <section id="shop" className="reveal shop-simple-page">
        <header className="shop-simple-header">
          <button type="button" className="shop-back-btn" onClick={openShopCatalog}>
            BACK TO SHOP
          </button>
          <div className="sec-label wipe">PRODUCT PAGE</div>
          <h2 className="sec-h2">{activeProduct.title}</h2>
        </header>

        <article className="shop-product-shell card">
          <figure className="shop-product-media">
            <div className="shop-product-image-stage">
              <img
                src={resolveShopImageSource(activeProductImage)}
                alt={`${activeProduct.title} product image ${activeProductImageIndex + 1}`}
                data-merch-file-name={activeProductImage.imageFileName}
                data-merch-candidate-index="0"
                loading="lazy"
                decoding="async"
                onError={handleMerchImageError}
              />
            </div>

            {hasGallery && (
              <div className="shop-product-gallery-controls">
                <button
                  type="button"
                  className="shop-product-gallery-btn"
                  onClick={() => goToProductImage(activeProductImageIndex - 1)}
                >
                  PREV
                </button>
                <span className="shop-product-gallery-index">
                  {activeProductImageIndex + 1} / {activeProductImages.length}
                </span>
                <button
                  type="button"
                  className="shop-product-gallery-btn"
                  onClick={() => goToProductImage(activeProductImageIndex + 1)}
                >
                  NEXT
                </button>
              </div>
            )}

            {hasGallery && (
              <div className="shop-product-thumb-row">
                {activeProductImages.map((image, index) => (
                  <button
                    type="button"
                    key={image.id || `${activeProduct.id}-${index}`}
                    className={`shop-product-thumb ${index === activeProductImageIndex ? "active" : ""}`}
                    onClick={() => goToProductImage(index)}
                    aria-label={`Show image ${index + 1} for ${activeProduct.title}`}
                  >
                    <img
                      src={resolveShopImageSource(image)}
                      alt={`${activeProduct.title} thumbnail ${index + 1}`}
                      data-merch-file-name={image.imageFileName}
                      data-merch-candidate-index="0"
                      loading="lazy"
                      decoding="async"
                      onError={handleMerchImageError}
                    />
                  </button>
                ))}
              </div>
            )}
          </figure>

          <div className="shop-product-content">
            <p className="shop-product-copy">{activeProduct.description}</p>

            <div className="shop-product-meta">
              <span className="shop-product-tag">OFFICIAL YOU MERCH</span>
              <span className="shop-simple-stock out">{activeProduct.status}</span>
            </div>

            <div className="shop-cta-row">
              <button type="button" className="shop-cta-btn shop-cta-secondary" onClick={() => notifyOutOfStock("add to cart")}>
                ADD TO CART
              </button>
              <button type="button" className="shop-cta-btn shop-cta-primary" onClick={() => notifyOutOfStock("checkout")}>
                BUY NOW
              </button>
            </div>

            <p className="shop-stock-alert">
              {stockActionMessage || `${activeProduct.title} is currently out of stock.`}
            </p>
          </div>
        </article>
      </section>
    );
  }

  return (
    <section id="shop" className="reveal shop-simple-page">
      <header className="shop-simple-header">
        <div className="sec-label wipe">THE ARMORY</div>
        <h2 className="sec-h2">MERCH <span className="red">STORE</span></h2>
        <p className="shop-simple-sub">
          Official YOU eSports merchandise. Click any product card to open its page.
        </p>
      </header>

      <div className="shop-simple-grid">
        {shopItems.length === 0 ? (
          <article className="shop-simple-card card" aria-live="polite">
            <div className="shop-simple-body">
              <h3>NO MERCH LISTED</h3>
              <p>Use the admin panel to add your first merch item.</p>
            </div>
          </article>
        ) : shopItems.map((item) => (
          <article
            className="shop-simple-card card shop-card-button"
            key={item.id}
            role="button"
            tabIndex={0}
            onClick={() => {
              setHoveredCardId("");
              openProductPage(item.id);
            }}
            onMouseEnter={() => setHoveredCardId(item.id)}
            onMouseLeave={() => setHoveredCardId("")}
            onFocus={() => setHoveredCardId(item.id)}
            onBlur={() => setHoveredCardId("")}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setHoveredCardId("");
                openProductPage(item.id);
              }
            }}
            aria-label={`Open ${item.title} product page`}
          >
            <div className="shop-card-media">
              {item.images.length > 1 && (
                <span className="shop-card-hint">
                  {hoveredCardId === item.id ? "ALT VIEW" : "HOVER TO FLIP"}
                </span>
              )}
              <img
                src={resolveShopImageSource(
                  hoveredCardId === item.id && item.images[1] ? item.images[1] : item.images[0]
                )}
                alt={`${item.title} preview image`}
                data-merch-file-name={
                  hoveredCardId === item.id && item.images[1]
                    ? item.images[1].imageFileName
                    : item.images[0].imageFileName
                }
                data-merch-candidate-index="0"
                loading="lazy"
                decoding="async"
                onError={handleMerchImageError}
              />
            </div>

            <div className="shop-simple-body">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="shop-card-footer">
                <span className="shop-simple-stock out">{item.status}</span>
                <span className="shop-card-open">VIEW PRODUCT</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
