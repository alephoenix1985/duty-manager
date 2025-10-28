import React from "react";
import { Button as AntButton, ButtonProps as AntButtonProps } from "antd";

type BaseButtonProps = Omit<AntButtonProps, "type">;

/**
 * @interface CustomButtonProps
 * @extends BaseButtonProps
 * @property {AntButtonProps['type']} [buttonType] - The visual style of the button. Maps to Ant Design's `type` prop.
 */
export interface CustomButtonProps extends BaseButtonProps {
  buttonType?: AntButtonProps["type"];
}

/**
 * Custom Button component that wraps Ant Design's Button.
 * It provides a unified way to define button styles and configurations.
 * @param {CustomButtonProps} props - The props for the Button component.
 * @returns {React.ReactElement} The Button component.
 */
export const Button: React.FC<CustomButtonProps> = ({
  buttonType = "default",
  children,
  ...rest
}) => {
  return (
    <AntButton type={buttonType} {...rest}>
      {children}
    </AntButton>
  );
};
