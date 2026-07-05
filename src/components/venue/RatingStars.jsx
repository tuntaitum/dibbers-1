import React from "react";
import { Star } from "lucide-react";

export default function RatingStars({ rating = 0, reviewCount = 0, size = 16, showNumber = true }) {
  const rounded = Math.round(rating * 2) / 2;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(i => {
          const filled = i <= Math.floor(rounded);
          const half = !filled && i - 0.5 === rounded;
          return (
            <Star
              key={i}
              size={size}
              className={filled || half ? "fill-brand-orange text-brand-orange" : "text-muted-foreground/30"}
              style={half ? { fill: "url(#half)" } : undefined}
            />
          );
        })}
      </div>
      {showNumber && (
        <span className="font-semibold text-brand-brown text-sm">
          {rating > 0 ? rating.toFixed(1) : "New"}
        </span>
      )}
      {reviewCount > 0 && (
        <span className="text-muted-foreground text-xs">({reviewCount})</span>
      )}
    </div>
  );
}