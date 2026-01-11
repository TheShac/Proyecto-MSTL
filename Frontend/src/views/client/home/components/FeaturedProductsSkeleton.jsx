import React from "react";

const FeaturedProductsSkeleton = ({ items = 4 }) => {
  return (
    <div className="row row-cols-2 row-cols-md-4 g-4">
      {Array.from({ length: items }).map((_, idx) => (
        <div className="col" key={idx}>
          <div className="card h-100 shadow-sm border-0">
            <div className="placeholder-glow">
              <div className="placeholder w-100" style={{ height: 260 }}></div>
            </div>
            <div className="card-body">
              <p className="placeholder-glow mb-2">
                <span className="placeholder col-6"></span>
              </p>
              <p className="placeholder-glow mb-0">
                <span className="placeholder col-10"></span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedProductsSkeleton;
