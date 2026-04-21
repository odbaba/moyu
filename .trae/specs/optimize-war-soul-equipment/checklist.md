# 战魂系统装备属性优化检查清单（更新版）

## 战魂套装压制函数检查
- [x] calculateTianHunSetBonus 已重命名为 calculateTianHunSetSuppression
- [x] 天魂套装压制计算正确（套装等级 × 2%，最高10%）
- [x] calculateDiHunSetBonus 已重命名为 calculateDiHunSetSuppression
- [x] 地魂套装压制计算正确（套装等级 × 5%，最高25%）
- [x] calculateWarSoulPKCombatPower 已删除
- [x] 所有旧函数名的引用已清理

## 敌人创建战魂压制检查
- [x] createEnemyFromEnemyData 增加 warSoulSetInfo 参数
- [x] 天魂套装激活时怪物战斗力正确压制
- [x] 地魂套装激活时怪物生命值正确压制
- [x] createEnemyFromTemplate 增加 warSoulSetInfo 参数
- [x] 天魂/地魂套装压制效果与参考文档一致
- [x] 原始属性值已保存用于详情显示（含 warSoulSuppression 字段）

## 战斗组件集成检查
- [x] Battle.tsx 中调用 checkWarSoulSet 获取套装信息
- [x] 套装信息正确传递给敌人创建函数
- [x] 天魂套装激活时显示战斗日志提示
- [x] 地魂套装激活时显示战斗日志提示
- [x] 提示内容与参考文档一致

## 怪物详情弹窗检查
- [x] EnemyDetailModal 增加 warSoulSetInfo prop
- [x] 天魂套装激活时战斗力行显示压制后值（-X%）
- [x] 地魂套装激活时生命值行显示压制后值（-X%）
- [x] 新增战魂套装压制提示区域
- [x] 无套装时正常显示，无压制信息

## BattleCharacter 类型检查
- [x] originalCombatPower 可选字段已添加
- [x] originalMaxHp 可选字段已添加
- [x] warSoulSuppression 可选字段已添加

## 文档检查
- [x] equipmentRefine.md 战魂套装效果说明已修正
- [x] 天魂套装怪物战斗力压制说明已添加
- [x] 地魂套装怪物生命值压制说明已添加
