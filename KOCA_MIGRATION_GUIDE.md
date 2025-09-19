# KOCA Design UI库替换指南

## 当前使用的Element Plus组件映射

### 布局组件
- `el-container` → `koca-container` 或 `k-container`
- `el-header` → `koca-header` 或 `k-header`
- `el-main` → `koca-main` 或 `k-main`

### 表格组件
- `el-table` → `koca-table` 或 `k-table`
- `el-table-column` → `koca-table-column` 或 `k-table-column`

### 表单组件
- `el-form` → `koca-form` 或 `k-form`
- `el-form-item` → `koca-form-item` 或 `k-form-item`
- `el-input` → `koca-input` 或 `k-input`
- `el-button` → `koca-button` 或 `k-button`
- `el-select` → `koca-select` 或 `k-select`
- `el-option` → `koca-option` 或 `k-option`
- `el-date-picker` → `koca-date-picker` 或 `k-date-picker`
- `el-input-number` → `koca-input-number` 或 `k-input-number`

### 反馈组件
- `el-dialog` → `koca-dialog` 或 `k-dialog`
- `el-message` → `koca-message` 或 `k-message`
- `el-message-box` → `koca-message-box` 或 `k-message-box`
- `el-tag` → `koca-tag` 或 `k-tag`
- `el-empty` → `koca-empty` 或 `k-empty`

### 导航组件
- `el-breadcrumb` → `koca-breadcrumb` 或 `k-breadcrumb`
- `el-breadcrumb-item` → `koca-breadcrumb-item` 或 `k-breadcrumb-item`

### 其他组件
- `el-card` → `koca-card` 或 `k-card`
- `el-row` → `koca-row` 或 `k-row`
- `el-col` → `koca-col` 或 `k-col`
- `el-icon` → `koca-icon` 或 `k-icon`

## 替换步骤

### 1. 更新package.json
```json
{
  "dependencies": {
    "vue": "^3.4.15",
    "koca-design": "^1.0.0", // 替换element-plus
    // 移除 "element-plus": "^2.4.4",
    // 移除 "@element-plus/icons-vue": "^2.3.1"
  }
}
```

### 2. 更新main.js
```javascript
import { createApp } from 'vue'
import App from './App.vue'
import KocaDesign from 'koca-design'
import 'koca-design/dist/style.css'
// 移除Element Plus相关导入

const app = createApp(App)

app.use(KocaDesign, {
  // KOCA Design配置
})

app.mount('#app')
```

### 3. 更新vite.config.js
```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// 如果KOCA Design支持自动导入，更新resolver
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { KocaDesignResolver } from 'koca-design/resolvers' // 假设的resolver

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [KocaDesignResolver()],
    }),
    Components({
      resolvers: [KocaDesignResolver()],
    }),
  ],
})
```

## 注意事项

1. **API差异**: 不同UI库的API可能有差异，需要检查：
   - 属性名称 (props)
   - 事件名称 (events)
   - 插槽名称 (slots)
   - 方法名称 (methods)

2. **样式调整**: 可能需要调整CSS样式以适配新的UI库

3. **图标系统**: 如果KOCA Design有不同的图标系统，需要相应替换

4. **主题配置**: 检查KOCA Design的主题配置方式

## 自动化替换工具

我已经为你创建了两个替换工具：

### 1. 快速替换脚本 (推荐)
```bash
./quick-migrate.sh
```

这个脚本会：
- 自动创建备份分支
- 批量替换所有 `el-*` 组件为 `k-*` 组件
- 替换 API 调用 (ElMessage → KMessage)
- 显示修改的文件列表

### 2. Node.js 替换工具
```bash
node migrate-to-koca.js
```

更精确的替换，包含错误处理和详细日志。

## 手动替换步骤

### 第一步：运行自动替换
```bash
# 创建备份
git add .
git commit -m "backup before KOCA migration"

# 运行快速替换
./quick-migrate.sh
```

### 第二步：更新依赖
```bash
# 卸载 Element Plus
npm uninstall element-plus @element-plus/icons-vue

# 安装 KOCA Design
npm install koca-design
```

### 第三步：更新配置文件

**src/main.js**:
```javascript
import { createApp } from 'vue'
import App from './App.vue'
import KocaDesign from 'koca-design'
import 'koca-design/dist/style.css'

const app = createApp(App)
app.use(KocaDesign)
app.mount('#app')
```

**vite.config.js**:
```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { KocaDesignResolver } from 'koca-design/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [KocaDesignResolver()],
    }),
    Components({
      resolvers: [KocaDesignResolver()],
    }),
  ],
})
```

### 第四步：验证和调试
```bash
# 启动开发服务器
npm run dev

# 检查控制台是否有错误
# 测试所有功能是否正常
```

## 可能需要手动调整的部分

1. **属性名差异** - 某些属性可能有不同命名
2. **事件名差异** - 事件触发方式可能不同  
3. **插槽名差异** - template slot 名称可能不同
4. **样式调整** - CSS 类名和样式可能需要调整
5. **图标系统** - 如果 KOCA 使用不同的图标库

## 回滚方案

如果遇到问题，可以快速回滚：
```bash
git checkout backup-before-koca-migration
```
