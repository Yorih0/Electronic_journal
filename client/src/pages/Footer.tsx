import { Layout, Typography } from "antd";

const { Footer: AntFooter } = Layout;
const { Text } = Typography;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <AntFooter
      style={{
        textAlign: "center",
        background: "#f0f2f5",
        padding: "24px 50px",
        marginTop: "auto",
      }}
    >
      <Text type="secondary">
        © {currentYear} Electronic Journal
      </Text>
    </AntFooter>
  );
}