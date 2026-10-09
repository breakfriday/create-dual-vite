import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CodeOutlined,
  HomeOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";
import { Button, Grid, Tooltip } from "antd";
import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { useThemeStore } from "@/store/useThemeStore";
import styles from "./AppLayout.module.css";

const menuItems = [
  { key: "/" as const, icon: <HomeOutlined />, label: "首页" },
  { key: "/about" as const, icon: <CodeOutlined />, label: "关于模板" },
];

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(true);
  const screens = Grid.useBreakpoint();
  const isCompact = screens.md === false;
  const menuCollapsed = isCompact || collapsed;
  const location = useLocation();
  const appTheme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const selectedPath = location.pathname.replace(/\/+$/, "") || "/";

  return (
    <div className={styles.appShell} data-collapsed={menuCollapsed}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <Button
            type="text"
            icon={menuCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed((value) => !value)}
            className={styles.collapseButton}
            aria-label={menuCollapsed ? "展开菜单" : "收起菜单"}
            title={menuCollapsed ? "展开菜单" : "收起菜单"}
            aria-expanded={!menuCollapsed}
            aria-controls="app-menu"
            disabled={isCompact}
          />
          <span className={styles.brandName}>DualVite</span>
        </div>
        <div className={styles.headerActions}>
          <Button
            type="text"
            className={styles.themeButton}
            icon={appTheme === "dark" ? <MoonOutlined /> : <SunOutlined />}
            onClick={() => setTheme(appTheme === "dark" ? "light" : "dark")}
            role="switch"
            aria-checked={appTheme === "dark"}
            aria-label="切换主题"
            title={appTheme === "dark" ? "切换到浅色主题" : "切换到深色主题"}
          />
        </div>
      </header>
      <div className={styles.mainLayout}>
        <aside className={styles.sideBar}>
          <nav id="app-menu" className={styles.menu} aria-label="主导航">
            {menuItems.map((item) => (
              <Tooltip
                key={item.key}
                title={menuCollapsed ? item.label : undefined}
                placement="right"
              >
                <Link
                  to={item.key}
                  className={styles.menuItem}
                  aria-label={item.label}
                  aria-current={selectedPath === item.key ? "page" : undefined}
                >
                  <span className={styles.menuIcon} aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className={styles.menuLabel}>{item.label}</span>
                </Link>
              </Tooltip>
            ))}
          </nav>
        </aside>
        <main className={styles.content}>
          <div className={styles.contentInner}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
