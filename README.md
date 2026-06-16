# 活字预览 (movable-type-preview)

## 本地开发

```bash
npm install
npm run dev
```

## 本地质量检查

推送到远程仓库前，建议先在本地运行与 CI 流水线相同的检查命令，确保代码能通过自动化验证：

```bash
# 1. 安装依赖（使用 npm ci 保证与 CI 环境一致）
npm ci

# 2. 类型检查
npm run typecheck

# 3. 生产打包
npm run build
```

如需一次性完成类型检查与打包，可使用：

```bash
npm run build:check
```

## 可用脚本

| 命令 | 说明 |
|---|---|
| `npm run dev` | 启动开发服务器 |
| `npm run typecheck` | 仅执行 TypeScript 类型检查 |
| `npm run build` | 仅执行 Vite 生产打包 |
| `npm run build:check` | 类型检查 + 生产打包（与原 build 脚本行为一致） |
| `npm run preview` | 预览生产构建产物 |

## 持续集成

项目使用 GitHub Actions 进行自动化质量保障，流水线配置见 [.github/workflows/ci.yml](.github/workflows/ci.yml)。

流水线在以下事件触发：

- 推送到 `main` 分支
- 向 `main` 分支提交 Pull Request

流水线包含三个步骤，任一步骤失败即标记构建失败，结果会在 Pull Request 页面中显示：

1. **安装依赖** — `npm ci`，依据 `package-lock.json` 安装，确保可复现
2. **类型检查** — `npm run typecheck`，运行 `tsc -b` 进行 TypeScript 编译检查
3. **生产打包** — `npm run build`，运行 `vite build` 执行生产环境构建
