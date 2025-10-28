import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Input } from "../Input";

jest.mock("antd", () => {
  const Antd = jest.requireActual("antd");
  const ActualReact = jest.requireActual("react");

  const MockInput = ActualReact.forwardRef(
    ({ value, onChange, placeholder, size }: any, ref: any) => (
      <input
        ref={ref}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        data-size={size}
      />
    ),
  );
  return {
    ...Antd,
    Input: MockInput,
  };
});

describe("Input Component", () => {
  it("should render with a placeholder", () => {
    render(<Input placeholder="Enter text..." />);
    expect(screen.getByPlaceholderText("Enter text...")).toBeInTheDocument();
  });

  it("should call the onChange handler when text is entered", () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);

    const inputElement = screen.getByRole("textbox");
    fireEvent.change(inputElement, { target: { value: "Hello" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: "Hello" }),
      }),
    );
  });

  it("should display the correct value", () => {
    render(<Input value="Initial value" onChange={() => {}} />);
    const inputElement = screen.getByRole("textbox");
    expect(inputElement).toHaveValue("Initial value");
  });

  it("should pass the correct size to the underlying Ant Design input", () => {
    render(<Input size="large" />);
    const inputElement = screen.getByRole("textbox");
    expect(inputElement).toHaveAttribute("data-size", "large");
  });
});
