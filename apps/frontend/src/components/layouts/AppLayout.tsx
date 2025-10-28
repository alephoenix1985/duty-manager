import React from "react";
import { Layout, Typography, ConfigProvider } from "antd";
import { Image } from "../Image";

const { Content } = Layout;
const { Title } = Typography;

const accessibleTheme = {
  token: {
    colorPrimary: "#005A9E",
    colorError: "#C52A1A",
    colorLink: "#005A9E",
  },
};

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <ConfigProvider theme={accessibleTheme}>
      <Layout style={{ minHeight: "100vh" }}>
        <Layout.Header
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            background: "#262626",
            padding: "0 24px",
          }}
        >
          <Image
            src={`${process.env.PUBLIC_URL}/favicon.png`}
            alt="Duty Manager Logo"
            style={{ width: 48, height: 48 }}
          />
          <Title level={2} style={{ color: "white", margin: "0 0 0 16px" }}>
            Duty Manager
          </Title>
        </Layout.Header>
        <Content
          style={{
            width: "100%",
            maxWidth: 900,
            margin: "0 auto",
            padding: "48px 24px",
            background: "#fff",
          }}
        >
          {children}
        </Content>
      </Layout>
    </ConfigProvider>
  );
};
