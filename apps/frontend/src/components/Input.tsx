import React from "react";
import { Input as AntInput, InputProps as AntInputProps } from "antd";

/**
 * @typedef {'large' | 'middle' | 'small'} InputSize
 */
export type InputSize = AntInputProps["size"];

/**
 * @interface CustomInputProps
 * @extends AntInputProps
 * @property {InputSize} [size] - The size of the input.
 */
export interface CustomInputProps extends AntInputProps {
  size?: InputSize;
}

/**
 * Custom Input component that wraps Ant Design's Input.
 * It provides a unified way to define input styles and configurations.
 * @param {CustomInputProps} props - The props for the Input component.
 * @returns {React.FC<CustomInputProps>} The Input component.
 */
export const Input: React.FC<CustomInputProps> = ({
  size = "middle",
  ...rest
}) => {
  return <AntInput size={size} {...rest} />;
};
