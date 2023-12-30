<!--
 * @Author: 王大旭
 * @Date: 2023-04-24 15:20:05
 * @LastEditors: 王大旭
 * @LastEditTime: 2023-05-04 13:45:56
 * @Description:
-->

## VSCode 插件安装

[Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## 🚀 开发

```bash
# 配置
1. 一键安装 .vscode 目录中推荐的插件
2. node 版本 16+
3. pnpm 版本 8.x


# 克隆项目
git clone http://gitlab.devops.ztopays.com/zto-life1/open-platform.git

# 进入项目目录
cd open-platform

# 安装依赖
pnpm i

# 启动服务
pnpm dev
```

## ✔️ 预览

```bash
# 预览预发布环境
pnpm preview:stage

# 预览正式环境
pnpm preview:prod
```

## 📦️ 多环境打包

```bash
# 构建预发布环境
pnpm build:stage

# 构建正式环境
pnpm build:prod
```

## 🔧 代码检查

```bash
# 代码格式化
pnpm lint

# 单元测试
pnpm test
```

## Git 提交规范参考

```bash
  <type>(<scope>): <subject>
  git commit -m "fix: 修复了***的问题"
```

type 为必填项，用于指定 commit 的类型

- `build` 更改构建系统和外部依赖项或者更新某个依赖包
- `feat` 增加新的业务功能
- `test` 测试相关, 不涉及业务代码的更改
- `docs` 仅仅修改文档说明
- `chore` 更新依赖/修改脚手架配置等琐事
- `fix` 修复业务问题/BUG
- `perf` 优化性能
- `style` 更改代码风格, 不影响运行结果
- `refactor` 重构代码
- `revert` 撤销更改
- `workflow` 工作流改进
- `ci` 对 CI 配置文件和脚本的更改
- `types` 类型定义文件更改
- `wip` 开发中

scope（可选）更改的范围 例如受影响的模块或文件夹

subject 本次提交信息描述
