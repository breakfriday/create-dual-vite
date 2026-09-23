import { Card, List, Tag, Typography } from "antd";

export function AboutPage() {
  return <Card title="关于 DualVite"><Typography.Paragraph>这是脚手架自带的第二个页面，用于演示文件路由、菜单高亮和 Layout Outlet。</Typography.Paragraph><List bordered dataSource={["src/app：全局 Provider 与主题", "src/shared：API、store、运行时工具", "src/features：新增业务模块", "src/routes：TanStack 文件路由"]} renderItem={(item) => <List.Item><Tag color="blue">目录</Tag>{item}</List.Item>} /></Card>;
}
