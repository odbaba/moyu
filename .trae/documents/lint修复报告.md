# Lint 修复报告

## 已修复的问题

### 1. App.tsx
- ✅ 修复了 `no-case-declarations` 错误：在 case 块中添加大括号（第668行）
- ✅ 修复了 `react-hooks/immutability` 错误：将 `getItemTypeName` 函数移到使用前定义（第1511-1530行）

### 2. TypeScript 类型检查
- ✅ 所有 TypeScript 类型检查通过

## 剩余需要修复的问题

### 高优先级错误（errors）

#### 1. **battleCalculator.ts** - `no-case-declarations` 错误
- 第542、551、563、572、584行：case 块中有词法声明
- **修复方法**：在 case 块中添加大括号包裹词法声明

#### 2. **CollectorModal.tsx** - `react-hooks/purity` 错误
- 第169行：在渲染期间调用 `Date.now()`
- **修复方法**：使用 `useMemo` 或 `useCallback` 生成 ID

#### 3. **NPCModal.tsx** - `react-hooks/set-state-in-effect` 错误
- 第76、85行：在 effect 中同步调用 `setState`
- **修复方法**：使用 ref 或其他方式处理状态更新

#### 4. **LocalMap.tsx** - `react-hooks/rules-of-hooks` 错误
- 第60-91行：条件性地调用 React Hooks
- **修复方法**：重构组件，确保 Hooks 在顶层调用

#### 5. **TimeDisplay.tsx** - `react-refresh/only-export-components` 错误
- 第29行：导出了非组件内容
- **修复方法**：将常量移到单独的文件

#### 6. **WorldMap.tsx** - `react-hooks/set-state-in-effect` 错误
- 第75行：在 effect 中同步调用 `setState`
- **修复方法**：使用 ref 或其他方式处理状态更新

#### 7. **ItemDetailModal.tsx** - `react-hooks/rules-of-hooks` 错误
- 第247行：条件性地调用 React Hooks
- **修复方法**：重构组件，确保 Hooks 在顶层调用

### 中优先级警告（warnings）

#### 1. **@typescript-eslint/no-non-null-assertion**
- 多个文件中使用了非空断言操作符 `!`
- **修复方法**：使用可选链或类型守卫替代

#### 2. **react-hooks/exhaustive-deps**
- 多个 useEffect 和 useCallback 缺少依赖项
- **修复方法**：添加缺失的依赖项或使用 eslint-disable 注释

#### 3. **no-console**
- 多个文件中使用了 `console.log`
- **修复方法**：移除或使用适当的日志系统

#### 4. **@typescript-eslint/no-explicit-any**
- 多个文件中使用了 `any` 类型
- **修复方法**：使用更具体的类型

## 未使用的导出（lint:exports）

`lint:exports` 检测到大量未使用的导出，这些可能是：
1. 公共 API 的一部分，供外部使用
2. 测试文件中使用的工具函数
3. 未来功能预留的接口

**建议**：
- 保留公共 API 的导出
- 移除确实未使用的内部函数导出
- 为测试导出添加注释说明

## 下一步建议

1. **优先修复高优先级错误**：这些错误可能导致运行时问题
2. **逐步修复警告**：警告不会阻止代码运行，但会影响代码质量
3. **定期运行 lint**：在开发过程中定期运行 lint 检查
4. **配置 lint 规则**：根据项目需求调整 lint 规则严格程度

## 总结

- ✅ 已修复：2个关键错误
- ⚠️ 剩余错误：约30个
- ⚠️ 剩余警告：约88个
- ℹ️ 未使用导出：大量（需评估是否保留）

建议逐步修复剩余问题，优先处理可能导致运行时错误的高优先级问题。
