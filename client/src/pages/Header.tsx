import { Link, useLocation } from "react-router-dom";
import { Layout, Menu, Typography } from "antd";
import { ScheduleOutlined, BookOutlined, UserOutlined } from "@ant-design/icons";

const { Header: AntHeader } = Layout;
const { Title } = Typography;

export default function Header() {
  const location = useLocation();

  const menuItems = [
    { key: "/schedule", label: <Link to="/schedule">Расписание</Link>, icon: <ScheduleOutlined /> },
    { key: "/journal", label: <Link to="/journal">Журнал</Link>, icon: <BookOutlined /> },
    { key: "/login/admin", label: <Link to="/login/admin">Админ</Link>, icon: <UserOutlined /> },
  ];

  return (
    <AntHeader style={{ display: "flex", alignItems: "center", background: "#fff", padding: "0 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Title level={4} style={{ margin: 0, background: "black", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>
          Electronic Journal
        </Title>
      </div>
      <Menu mode="horizontal" items={menuItems} selectedKeys={[location.pathname]} style={{ flex: 1, justifyContent: "flex-end", borderBottom: "none", background: "transparent" }} />
    </AntHeader>
  );
}