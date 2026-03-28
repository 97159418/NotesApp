# 备忘录 - Notes App

仿苹果记事本风格的 Android 备忘录应用。

## 功能

- 笔记列表 + 搜索 + 标签筛选
- 新建 / 编辑 / 删除笔记
- 标签管理
- 暗色模式
- 导出 / 导入 JSON 备份
- SQLite 本地存储

## 技术栈

- React Native + Expo
- expo-sqlite (本地数据库)
- React Navigation (导航)

## 编译 APK

### 使用 GitHub Actions

1. Fork 或创建 GitHub 仓库
2. 在仓库 Settings → Secrets 中添加 `EXPO_TOKEN`（从 https://expo.dev/settings 获取）
3. 推送代码到 main 分支，或手动触发 Actions
4. 在 Actions 页面下载编译好的 APK

### 本地编译

```bash
npm install
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
```

APK 位于 `android/app/build/outputs/apk/release/app-release.apk`

## 项目结构

```
NotesApp/
├── App.js              # 入口 + 导航
├── theme.js            # 暗色/亮色主题
├── screens/
│   ├── HomeScreen.js   # 笔记列表 + 搜索 + 标签
│   └── EditScreen.js   # 编辑区
├── components/
│   ├── NoteCard.js     # 笔记卡片
│   ├── TagEditor.js    # 标签编辑器
│   └── Sidebar.js      # 侧栏
├── db/
│   └── database.js     # SQLite 封装
├── utils/
│   └── export.js       # 导出导入
└── .github/workflows/
    └── build.yml       # GitHub Actions APK 编译
```
