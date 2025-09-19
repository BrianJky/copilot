#!/bin/bash

# KOCA Design 快速替换脚本

echo "🚀 开始替换 Element Plus 为 KOCA Design..."

# 备份当前分支
echo "📦 创建备份分支..."
git checkout -b backup-before-koca-migration

# 1. 替换 Vue 文件中的组件标签
echo "🔄 替换组件标签..."

# 布局组件
find src -name "*.vue" -type f -exec sed -i '' 's/<el-container/<k-container/g' {} \;
find src -name "*.vue" -type f -exec sed -i '' 's/<\/el-container>/<\/k-container>/g' {} \;
find src -name "*.vue" -type f -exec sed -i '' 's/<el-header/<k-header/g' {} \;
find src -name "*.vue" -type f -exec sed -i '' 's/<\/el-header>/<\/k-header>/g' {} \;
find src -name "*.vue" -type f -exec sed -i '' 's/<el-main/<k-main/g' {} \;
find src -name "*.vue" -type f -exec sed -i '' 's/<\/el-main>/<\/k-main>/g' {} \;

# 表格组件
find src -name "*.vue" -type f -exec sed -i '' 's/<el-table/<k-table/g' {} \;
find src -name "*.vue" -type f -exec sed -i '' 's/<\/el-table>/<\/k-table>/g' {} \;
find src -name "*.vue" -type f -exec sed -i '' 's/<el-table-column/<k-table-column/g' {} \;

# 表单组件
find src -name "*.vue" -type f -exec sed -i '' 's/<el-form/<k-form/g' {} \;
find src -name "*.vue" -type f -exec sed -i '' 's/<\/el-form>/<\/k-form>/g' {} \;
find src -name "*.vue" -type f -exec sed -i '' 's/<el-form-item/<k-form-item/g' {} \;
find src -name "*.vue" -type f -exec sed -i '' 's/<\/el-form-item>/<\/k-form-item>/g' {} \;
find src -name "*.vue" -type f -exec sed -i '' 's/<el-input/<k-input/g' {} \;
find src -name "*.vue" -type f -exec sed -i '' 's/<el-button/<k-button/g' {} \;
find src -name "*.vue" -type f -exec sed -i '' 's/<el-select/<k-select/g' {} \;
find src -name "*.vue" -type f -exec sed -i '' 's/<\/el-select>/<\/k-select>/g' {} \;
find src -name "*.vue" -type f -exec sed -i '' 's/<el-option/<k-option/g' {} \;
find src -name "*.vue" -type f -exec sed -i '' 's/<el-date-picker/<k-date-picker/g' {} \;
find src -name "*.vue" -type f -exec sed -i '' 's/<el-input-number/<k-input-number/g' {} \;

# 反馈组件
find src -name "*.vue" -type f -exec sed -i '' 's/<el-dialog/<k-dialog/g' {} \;
find src -name "*.vue" -type f -exec sed -i '' 's/<\/el-dialog>/<\/k-dialog>/g' {} \;
find src -name "*.vue" -type f -exec sed -i '' 's/<el-tag/<k-tag/g' {} \;
find src -name "*.vue" -type f -exec sed -i '' 's/<\/el-tag>/<\/k-tag>/g' {} \;
find src -name "*.vue" -type f -exec sed -i '' 's/<el-empty/<k-empty/g' {} \;

# 导航组件
find src -name "*.vue" -type f -exec sed -i '' 's/<el-breadcrumb/<k-breadcrumb/g' {} \;
find src -name "*.vue" -type f -exec sed -i '' 's/<\/el-breadcrumb>/<\/k-breadcrumb>/g' {} \;
find src -name "*.vue" -type f -exec sed -i '' 's/<el-breadcrumb-item/<k-breadcrumb-item/g' {} \;
find src -name "*.vue" -type f -exec sed -i '' 's/<\/el-breadcrumb-item>/<\/k-breadcrumb-item>/g' {} \;

# 其他组件
find src -name "*.vue" -type f -exec sed -i '' 's/<el-card/<k-card/g' {} \;
find src -name "*.vue" -type f -exec sed -i '' 's/<\/el-card>/<\/k-card>/g' {} \;
find src -name "*.vue" -type f -exec sed -i '' 's/<el-row/<k-row/g' {} \;
find src -name "*.vue" -type f -exec sed -i '' 's/<\/el-row>/<\/k-row>/g' {} \;
find src -name "*.vue" -type f -exec sed -i '' 's/<el-col/<k-col/g' {} \;
find src -name "*.vue" -type f -exec sed -i '' 's/<\/el-col>/<\/k-col>/g' {} \;
find src -name "*.vue" -type f -exec sed -i '' 's/<el-icon/<k-icon/g' {} \;
find src -name "*.vue" -type f -exec sed -i '' 's/<\/el-icon>/<\/k-icon>/g' {} \;

# 2. 替换 JavaScript/TypeScript 文件中的 API 调用
echo "🔄 替换 API 调用..."
find src -name "*.js" -o -name "*.ts" -o -name "*.vue" | xargs sed -i '' 's/ElMessage/KMessage/g'
find src -name "*.js" -o -name "*.ts" -o -name "*.vue" | xargs sed -i '' 's/ElMessageBox/KMessageBox/g'

echo "✅ 组件标签替换完成！"

echo ""
echo "📝 接下来请手动完成以下步骤："
echo "1. 更新 package.json："
echo "   - 移除: element-plus, @element-plus/icons-vue"
echo "   - 添加: koca-design"
echo ""
echo "2. 更新 src/main.js："
echo "   - 替换 Element Plus 导入为 KOCA Design 导入"
echo ""
echo "3. 更新 vite.config.js："
echo "   - 替换 ElementPlusResolver 为 KocaDesignResolver"
echo ""
echo "4. 安装新依赖："
echo "   npm uninstall element-plus @element-plus/icons-vue"
echo "   npm install koca-design"
echo ""
echo "5. 测试应用功能是否正常"

# 显示更改的文件
echo ""
echo "📋 已修改的文件："
git diff --name-only
