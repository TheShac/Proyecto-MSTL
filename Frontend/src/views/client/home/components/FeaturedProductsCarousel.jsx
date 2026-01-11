import React, { useEffect, useMemo, useState } from "react";
import FeaturedProductCard from "./FeaturedProductCard";
import FeaturedProductsSkeleton from "./FeaturedProductsSkeleton";
import { getFeaturedProducts } from "../services/homeService";
import "./FeaturedProductsCarousel.css";

const AUTOPLAY_MS = 5000;

const getItemsPerView = () => {
  const w = window.innerWidth;
  if (w < 576) return 1; // xs
  if (w < 768) return 2; // sm
  if (w < 992) return 3; // md
  return 4; // lg+
};

const FeaturedProductsCarousel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [itemsPerView, setItemsPerView] = useState(getItemsPerView());
  const [pageIndex, setPageIndex] = useState(0);

  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const onResize = () => setItemsPerView(getItemsPerView());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        const res = await getFeaturedProducts({ limit: 12 });
        if (res?.success) setProducts(res.data || []);
      } catch (e) {
        console.error("Error cargando destacados:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const totalPages = useMemo(() => {
    if (!products.length) return 0;
    return Math.ceil(products.length / itemsPerView);
  }, [products, itemsPerView]);

  useEffect(() => {
    if (pageIndex > totalPages - 1) setPageIndex(0);
  }, [itemsPerView, totalPages, pageIndex]);

  const prev = () => {
    setPageIndex((p) => {
      if (!totalPages) return 0;
      return p === 0 ? totalPages - 1 : p - 1;
    });
  };

  const next = () => {
    setPageIndex((p) => {
      if (!totalPages) return 0;
      return p === totalPages - 1 ? 0 : p + 1;
    });
  };

  // ✅ AUTOPLAY
  useEffect(() => {
    if (isPaused) return;
    if (loading) return;
    if (totalPages <= 1) return;

    const id = setInterval(() => {
      setPageIndex((p) => (p === totalPages - 1 ? 0 : p + 1));
    }, AUTOPLAY_MS);

    return () => clearInterval(id);
  }, [isPaused, loading, totalPages]);

  const trackStyle = {
    transform: `translateX(-${pageIndex * 100}%)`,
  };

  if (loading) return <FeaturedProductsSkeleton items={itemsPerView} />;
  if (!products.length) return null;

  return (
    <div
      className="fp-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div className="fp-carousel-header">
        <button
          type="button"
          className="btn btn-outline-dark btn-sm fp-arrow"
          onClick={prev}
          aria-label="Anterior"
        >
          <i className="bi bi-chevron-left"></i>
        </button>

        <div className="fp-dots">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              type="button"
              className={`fp-dot ${i === pageIndex ? "active" : ""}`}
              onClick={() => setPageIndex(i)}
              aria-label={`Ir a página ${i + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          className="btn btn-outline-dark btn-sm fp-arrow"
          onClick={next}
          aria-label="Siguiente"
        >
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>

      <div className="fp-viewport">
        <div className="fp-track" style={trackStyle}>
          {Array.from({ length: totalPages }).map((_, p) => {
            const start = p * itemsPerView;
            const slice = products.slice(start, start + itemsPerView);

            return (
              <div className="fp-slide" key={p}>
                <div className="row g-4">
                  {slice.map((prod) => (
                    <div
                      key={prod.id_producto}
                      className={`col-12 col-sm-6 ${
                        itemsPerView === 3 ? "col-md-4" : "col-md-3"
                      }`}
                    >
                      <FeaturedProductCard product={prod} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProductsCarousel;
