import React, { useState } from "react";
import { Skeleton } from "antd";

/**
 * @interface ImageProps
 * @extends React.ImgHTMLAttributes<HTMLImageElement>
 * @description Props for the custom Image component.
 */
interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

/**
 * A custom Image component that displays a skeleton while loading
 * and handles image loading errors.
 * @param {ImageProps} props - The props for the Image component.
 * @returns {React.ReactElement} The Image component.
 */
export const Image: React.FC<ImageProps> = ({ src, alt, style, ...rest }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  if (error) {
    return (
      <div
        style={{
          ...style,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f5f5",
          color: "#8c8c8c",
        }}
      >
        Image not found
      </div>
    );
  }

  return (
    <>
      {loading && <Skeleton.Image active style={style} />}
      <img
        src={src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        style={{ ...style, display: loading ? "none" : "block" }}
        {...rest}
      />
    </>
  );
};
