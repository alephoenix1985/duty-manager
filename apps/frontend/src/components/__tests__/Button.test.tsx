import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Button } from "../Button";

jest.mock("antd", () => {
  const Antd = jest.requireActual("antd");
  const MockButton = ({ children, onClick, type, disabled }: any) => (
    <button onClick={onClick} data-type={type} disabled={disabled}>
      {children}
    </button>
  );
  return {
    ...Antd,
    Button: MockButton,
  };
});

describe("Button Component", () => {
  it("should render with the correct text", () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("should call the onClick handler when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    fireEvent.click(screen.getByText("Click Me"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should pass the correct type to the underlying Ant Design button", () => {
    render(<Button buttonType="primary">Primary Button</Button>);
    const buttonElement = screen.getByRole("button");
    expect(buttonElement).toHaveAttribute("data-type", "primary");
  });

  it("should be disabled when the disabled prop is true", () => {
    render(<Button disabled>Disabled Button</Button>);
    const buttonElement = screen.getByRole("button");
    expect(buttonElement).toBeDisabled();
  });
});
