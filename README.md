# 记事本 Android App

仿苹果记事本的安卓应用。

## 功能
- 笔记列表 + 搜索 + 标签筛选
- 新建/编辑/删除笔记
- 标签管理
- 暗色模式
- 导出/导入 JSON
- SQLite 本地存储

## 构建 APK

### 1. 创建 GitHub 仓库
```bash
cd NotesApp
git init
git add .
git commit -m "initial"
git remote add origin https://github.com/你的用户名/NotesApp.git
git push -u origin main
```

### 2. 配置 Expo
1. 注册 https://expo.dev
2. 运行 `npx eas-cli login` 登录
3. 运行 `npx eas-cli build:configure` 配置
4. 获取 token: `npx eas-cli token`
5. 在 GitHub 仓库 Settings → Secrets → Actions 添加 `EXPO_TOKEN`

### 3. 触发构建
- 推送到 main 分支自动构建
- 或在 GitHub Actions 页面手动触发

### 4. 下载 APK
- 在 Actions 运行完成后，从 Artifacts 下载
- 或在 Expo 仪表盘下载

## 本地开发
```bash
npm install
npx expo start
```
用 Expo Go APP 扫码预览。
