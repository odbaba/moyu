# Checklist

## 类型定义验证
- [x] CharacterData 接口包含基础属性常量(baseHp, baseStamina, baseAttackMin, baseAttackMax, baseDefense)
- [x] CharacterData 接口包含成长系数字段(growthHp, growthStamina, growthAttackMin, growthAttackMax, growthDefense)
- [x] CharacterData 接口包含 equipmentBonus 字段
- [x] EquipmentDetail 接口包含战魂属性(soulType, soulLevel)
- [x] EquipmentDetail 接口包含基础属性和追加属性字段

## 装备属性计算验证
- [x] 武器基础攻击计算正确（最小攻击=10×等级，最大攻击=30×等级）
- [x] 衣服基础防御计算正确（防御=8×等级）
- [x] 头盔基础防御计算正确（防御=6×等级）
- [x] 战鞋基础防御计算正确（防御=4×等级）
- [x] 项链基础攻击计算正确（最小攻击=8×等级，最大攻击=20×等级）
- [x] 手镯基础攻击计算正确（最小攻击=5×等级，最大攻击=15×等级）
- [x] 魔魂追加属性计算正确（追加值=Math.floor(基础值/10)×魔魂等级）

## 角色属性计算验证
- [x] 角色基础生命值计算正确（500+50×等级）
- [x] 角色基础体力值计算正确（100+10×等级）
- [x] 角色基础攻击力计算正确（45+10×等级）
- [x] 角色基础防御力计算正确（80+8×等级）
- [x] 装备攻击力加成正确应用到角色
- [x] 装备防御力加成正确应用到角色
- [x] 天魂战魂攻击力百分比加成正确计算
- [x] 地魂战魂闪避率加成正确计算

## 战斗力计算验证
- [x] 装备品质战斗力计算正确（pz×3）
- [x] 宝石洞战斗力计算正确（dong×3）
- [x] 战魂战斗力加成正确计算
- [x] 总战斗力显示正确

## UI显示验证
- [x] 角色信息页面显示动态计算的属性值
- [x] 装备加成数值正确显示（如有装备）
- [x] 战魂加成百分比正确显示（如有战魂）
- [x] 战斗力详情弹窗显示各部分贡献
