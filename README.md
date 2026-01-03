# koi-electron

<h2 align="center">
基于electron、vue、nestjs的跨平台桌面构建方案
</h2>

## 整体介绍

- 前端：基于 `Vue3` + `TypeScript` 编写；
- 后端：采用 `nestjs` + `typeorm` + `sqlite3`编写；
- 构建工具：采用rsbuild+turbo构建，极快的启动速度，一键启动、一键构建；

主要技术栈为：

- 前端

| 名称                       | 版本     | 名称           | 版本     |
|--------------------------|--------|--------------|--------|
| Vue                      | 3.5.x  | TypeScript   | 5.9.3  |
| rsbuild                  | 1.7.1  | element-plus | 2.13.0 |
| vueuse                   | 14.1.0 | Pinia        | 3.0.4  |
| 详见 `koi-ui/package.json` | 😁     | 🥰           | 🤗     |

- 后端

| 名称                | 版本     |
|-------------------|--------|
| @nestjs/common    | 11.1.x |
| @nestjs/jwt       | 1.7.1  |
| sqlite3           | 5.1.7  |
| typeorm           | 0.3.28 |
| 详见 `package.json` | 😁     | 

开发环境:

| 名称   | 版本      | 名称  | 版本     |
|------|---------|-----|--------|
| node | 24.12.0 | npm | 11.6.2 |

## 项目结构介绍
```text
.
├── README.md
├── koi-server  接口
│    ├── eslint.config.mjs
│    ├── nest-cli.json
│    ├── package.json
│    ├── src
│    ├── test
│    ├── tsconfig.build.json
│    ├── tsconfig.json
│    ├── types
│    └── webpack.config.js
├── koi-ui  渲染进程
│    ├── components.d.ts
│    ├── electron   主进程
│    ├── eslint.config.mjs
│    ├── package.json
│    ├── rsbuild.config.ts
│    ├── src
│    ├── tsconfig.json
│    └── types
├── logo.icns
├── logo.png
├── package-lock.json
├── package.json    
└── turbo.json  turbo的配置文件

```

## 安装

```shell
npm i
```

## 开发

```shell
npm run dev
```

## 编译

```shell
npm run build
```
