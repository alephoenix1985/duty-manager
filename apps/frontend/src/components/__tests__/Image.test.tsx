import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Image } from "../Image";

jest.mock("antd", () => {
  const Antd = jest.requireActual("antd");
  const MockSkeletonImage = () => <div data-testid="skeleton-image"></div>;
  return {
    ...Antd,
    Skeleton: {
      ...Antd.Skeleton,
      Image: MockSkeletonImage,
    },
  };
});

describe("Image Component", () => {
  it("should display a skeleton while loading", () => {
    render(<Image src="test.jpg" alt="test" />);
    expect(screen.getByTestId("skeleton-image")).toBeInTheDocument();
    const imageElement = screen.getByRole("img", { hidden: true });
    expect(imageElement).not.toBeVisible();
  });

  it("should display the image and hide the skeleton on load", () => {
    render(<Image src="test.jpg" alt="test" />);

    const imageElement = screen.getByRole("img", { hidden: true });
    fireEvent.load(imageElement);

    expect(screen.queryByTestId("skeleton-image")).not.toBeInTheDocument();
    expect(imageElement).toBeVisible();
    expect(imageElement).toHaveAttribute("src", "test.jpg");
  });

  it("should display an error message on load error", () => {
    render(<Image src="invalid.jpg" alt="test" />);

    const imageElement = screen.getByRole("img", { hidden: true });
    fireEvent.error(imageElement);

    expect(screen.queryByTestId("skeleton-image")).not.toBeInTheDocument();
    expect(imageElement).not.toBeVisible();
    expect(screen.getByText("Image not found")).toBeInTheDocument();
  });
});
