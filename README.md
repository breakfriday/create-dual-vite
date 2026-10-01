# @break_happy/create-dual-vite

DualVite 是一个基于 **React + TypeScript** 的应用开发脚手架，支持 **Web 部署**与**本地文件 / Electron 渲染进程**双目标构建。

采用 **Vite 8 + Rolldown + Oxc** 构建工具链，集成 **TanStack Router / Query**、**Zustand** 和 **Ant Design**，提供路由、状态管理、应用布局及统一请求层，为业务开发提供可扩展的基础结构。

## 技术栈

| 层级       | 技术方案           | 职责                                              |
| ---------- | ------------------ | ------------------------------------------------- |
| 应用开发   | React + TypeScript | 组件化开发与静态类型检查                          |
| 开发与构建 | Vite 8 + Rolldown  | 开发服务器、依赖预打包与生产打包                  |
| 编译转换   | Oxc                | TS/JSX 转换、React Refresh 转换与 JavaScript 压缩 |
| 路由管理   | TanStack Router    | 类型安全的文件路由与嵌套布局                      |
| 服务端状态 | TanStack Query     | 异步数据获取、缓存与更新                          |
| 客户端状态 | Zustand            | 全局 UI 状态、主题与认证状态管理                  |
| UI 与布局  | Ant Design         | UI 组件、应用布局、侧边导航与明暗主题             |
| HTTP 请求  | Axios              | 统一请求封装、认证令牌注入与错误处理              |

## 双目标构建

同一套应用代码支持两种构建目标：

- **Web**：使用 Browser History 路由，支持配置部署路径前缀。
- **本地文件 / Electron 渲染进程**：使用 Hash History 路由与相对资源路径，支持通过 `loadFile()` 加载构建产物。

## 构建工具链

开发阶段的依赖预打包与生产打包统一使用 **Rolldown**，TS/JSX 转换、React Refresh 转换及 JavaScript 压缩由 **Oxc** 完成。开发模式保留 Vite 默认的按需模块加载机制，类型检查通过 `pnpm check` 独立执行。

> TanStack 路由工具和 React Hooks ESLint 规则仍包含间接 Babel 依赖；Vite / React 的编译转换链路已使用 Oxc。

```bash
pnpm create @break_happy/dual-vite my-app
```

## Commands in a generated project

```bash
pnpm dev
pnpm build:web
pnpm build:filelocal
pnpm lint
```
