# 背包页面功能 Spec

## Why
用户需要一个背包页面来管理游戏中的物品资源，包括查看金币、魔石和各类物品，这是游戏的核心功能之一。

## What Changes
- 新增背包页面模块 (`components/inventory`)
- 在菜单中添加背包入口
- 创建背包相关数据类型和数据文件
- 实现物品展示和详情弹窗功能

## Impact
- Affected specs: 菜单系统
- Affected code: `components/home/Menu.tsx`, `App.tsx`

## ADDED Requirements

### Requirement: 背包页面入口
系统应在菜单区域提供背包页面的访问入口。

#### Scenario: 用户打开背包页面
- **WHEN** 用户点击菜单中的"背包"按钮
- **THEN** 系统显示背包页面

### Requirement: 顶部资源信息展示
系统应在背包页面顶部清晰显示用户当前拥有的金币和魔石数目。

#### Scenario: 显示资源信息
- **GIVEN** 用户已打开背包页面
- **WHEN** 页面加载完成
- **THEN** 顶部区域显示金币图标和数量、魔石图标和数量
- **AND** 金币和魔石采用不同的视觉样式区分

### Requirement: 物品网格展示
系统应采用网格布局展示用户拥有的所有物品。

#### Scenario: 显示物品列表
- **GIVEN** 用户已打开背包页面
- **WHEN** 页面加载完成
- **THEN** 物品以网格形式排列
- **AND** 每个格子为等尺寸正方形
- **AND** 每个物品显示图标和数量
- **AND** 支持横向和纵向滚动

### Requirement: 物品详情弹窗
系统应支持用户点击物品查看详细信息。

#### Scenario: 查看物品详情
- **GIVEN** 用户已打开背包页面
- **WHEN** 用户点击任意物品格子
- **THEN** 弹出物品详情弹窗
- **AND** 弹窗显示物品名称、图标、属性、获取途径、详细描述
- **AND** 用户可点击关闭按钮或弹窗外部关闭弹窗

### Requirement: 响应式设计
背包页面应适配不同屏幕尺寸。

#### Scenario: 移动端适配
- **GIVEN** 用户在移动设备上访问
- **WHEN** 打开背包页面
- **THEN** 页面布局自适应屏幕尺寸
- **AND** 物品格子大小适中，便于触摸操作

### Requirement: 加载状态反馈
系统应在数据加载时提供适当的状态反馈。

#### Scenario: 显示加载状态
- **GIVEN** 用户打开背包页面
- **WHEN** 数据正在加载
- **THEN** 显示加载指示器
- **AND** 加载完成后显示实际内容

## MODIFIED Requirements

### Requirement: 菜单功能扩展
菜单组件需要新增背包入口按钮。

#### Scenario: 菜单显示背包按钮
- **GIVEN** 用户打开菜单
- **WHEN** 菜单展开
- **THEN** 显示"背包"按钮选项
