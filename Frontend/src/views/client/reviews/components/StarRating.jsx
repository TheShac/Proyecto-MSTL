import React from "react";

/**
 * Estrellas. Si recibe onChange, es interactivo (selección 1-5).
 */
const StarRating = ({ value = 0, onChange, size = "1rem" }) => {
  const interactive = typeof onChange === "function";
  const rounded = Math.round(Number(value) || 0);

  return (
    <span className="star-rating" style={{ fontSize: size }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <i
          key={n}
          className={`bi ${n <= rounded ? "bi-star-fill" : "bi-star"} ${interactive ? "star-interactive" : ""}`}
          onClick={interactive ? () => onChange(n) : undefined}
          role={interactive ? "button" : undefined}
          aria-label={interactive ? `${n} estrellas` : undefined}
        />
      ))}
    </span>
  );
};

export default StarRating;
