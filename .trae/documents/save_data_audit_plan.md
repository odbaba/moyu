# 存档数据完整性排查计划

## 目标
分模块逐个排查是否有应保存存档的数据，却未保存的情况。

## 当前存档结构 (SaveData)
存档文件位于 `src/utils/saveUtils.ts`，包含以下字段：
- version, currentLocation, timeSystem
- character, playerResources, equippedItems, inventory
- pets, skills
- militaryRank, battleExp, hasClaimedMilitaryPay
- nobleRank, princessRelationship
- isKingRescued, explorerUnlocked, mysteriousPersonTriggered
- wumingshiDefeated, warSoulSystemEnabled
- killedMonsters, spawnedBosses, spawnedSpecialMonsters
- dailyTaskState, mapChallengeState
- hasParticipatedPKToday, maid1DailyPurchaseCount
- hasPurchasedYearPig, hasUsedDianJiangYaoShuiToday
- petInstituteState

---

## 排查结果

### 模块1：角色数据 (CharacterData) ✅
**文件位置**: `src/types/index.ts` 第173行
**排查结果**:
- [x] CharacterData 接口所有字段都是 JSON 可序列化类型
- [x] 可选字段（baseHp, growthHp 等）是固定常量或动态计算值，不需要保存
- [x] equipment 对象正确保存
- [x] petBonus 和 equipmentBonus 是动态计算属性，不需要保存

### 模块2：幻兽数据 (Pet) ✅
**文件位置**: `src/types/index.ts` 第653行
**排查结果**:
- [x] Pet 接口所有字段都是 JSON 可序列化类型
- [x] **顿悟参数**: predj, premjy, prejy 正确保存
- [x] rating 对象正确保存
- [x] 幻化后属性更新正确保存
- [x] PetFusionModal 中 useExpOrbToLevelUp 已修复顿悟参数保留问题

### 模块3：技能数据 (SkillDetail) ✅
**文件位置**: `src/types/index.ts` 第439行
**排查结果**:
- [x] SkillDetail 接口所有字段都是 JSON 可序列化类型
- [x] isLearned 字段正确保存
- [x] level 字段正确保存
- [x] effect 和 cost 对象正确保存

### 模块4：装备数据 (EquipmentDetail) ✅
**文件位置**: `src/types/index.ts` 第144行
**排查结果**:
- [x] EquipmentDetail 接口所有字段都是 JSON 可序列化类型
- [x] 战魂属性 (soulType, soulLevel) 正确保存
- [x] 宝石属性 (gems, gemAttributes) 正确保存
- [x] 魔魂等级 (magicSoulLevel) 正确保存

### 模块5：背包物品 (InventoryItem) ✅
**文件位置**: `src/types/index.ts` 第270行
**排查结果**:
- [x] InventoryItem 接口所有字段都是 JSON 可序列化类型
- [x] 扩展类型 (EquipmentItem, GemItem 等) 正确保存
- [x] quantity 字段正确保存

### 模块6：公主关系 (PrincessRelationship) ✅
**文件位置**: `src/types/index.ts` 第1027行
**排查结果**:
- [x] PrincessRelationship 接口所有字段都是 JSON 可序列化类型
- [x] weeklyRoseGiftCount 字段正确保存
- [x] hasReceivedConfidantGift 字段正确保存

### 模块7：日常任务 (DailyTaskState) ✅
**文件位置**: `src/types/index.ts` 第1189行
**排查结果**:
- [x] DailyTaskState 接口所有字段都是 JSON 可序列化类型
- [x] currentTaskId, taskAcceptedAt, taskProgress 正确保存

### 模块8：地图挑战 (MapChallengeState) ✅
**文件位置**: `src/types/index.ts` 第1332行
**排查结果**:
- [x] MapChallengeState 接口所有字段都是 JSON 可序列化类型
- [x] ownerMap, mapReward, mapRace 正确保存

### 模块9：幻兽研究所 (PetInstituteState) ✅
**文件位置**: `src/types/index.ts` 第693行
**排查结果**:
- [x] PetInstituteState 接口所有字段都是 JSON 可序列化类型
- [x] techLevel, productionRate, stock, vipLevel 正确保存

### 模块10：玩家资源 (PlayerResources) ✅
**文件位置**: `src/types/index.ts` 第378行
**排查结果**:
- [x] PlayerResources 接口所有字段都是 JSON 可序列化类型
- [x] gold, magicStone, battleExp, merit 正确保存

### 模块11：App.tsx 状态变量 ✅
**文件位置**: `src/App.tsx`
**排查结果**:
- [x] 所有需要持久化的状态都有对应的存档字段
- [x] handleSaveGame 保存了所有必要状态
- [x] handleContinueGame 恢复了所有必要状态
- [x] UI/临时状态正确地不保存（如弹窗状态、浮动文字等）

### 模块12：数据修改入口点 ✅
**排查结果**:
- [x] 所有修改数据的函数都正确更新 React 状态
- [x] PetFusionModal 中 useExpOrbToLevelUp 已修复顿悟参数保留问题
- [x] executeFusion 正确设置顿悟参数
- [x] 所有修改都通过回调函数保存到状态

---

## 已发现并修复的问题

### 问题1：幻兽顿悟参数丢失（已修复）✅
**位置**: `src/components/pet/PetFusionModal.tsx` 第306行
**描述**: 使用满经验球升级幻兽时，临时清除了顿悟参数（predj, premjy, prejy），但升级后的结果直接保存，导致顿悟数据丢失。
**修复**: 在返回升级后的幻兽时，保留原始幻兽的顿悟参数：
```typescript
// 保留原始幻兽的顿悟参数（predj、prejy、premjy），避免顿悟数据丢失
const updatedPet: Pet = {
  ...result.pet,
  predj: pet.predj,
  prejy: pet.prejy,
  premjy: pet.premjy,
};
```

### 问题2：多次幻化顿悟参数被覆盖（已修复）✅
**位置**: `src/utils/petFusion.ts` 第430行
**描述**: 每次幻化都会直接覆盖顿悟参数，导致多次幻化后丢失最高的幻化前等级。
**场景**: 幻兽80级幻化后 predj=80，升到50级再次幻化时 predj=50，覆盖了之前的80级数据。
**修复**: 只有当幻化前等级 > 当前保存的顿悟等级时，才更新顿悟参数：
```typescript
// 保存幻化前等级、经验、升级需求（只有当当前等级高于已保存的顿悟等级时才更新）
// 这样可以保留最高的幻化前等级，确保顿悟能恢复到最高等级
if (mainPet.dj > mainPet.predj) {
  mainPet.predj = mainPet.dj;
  mainPet.prejy = mainPet.jy;
  mainPet.premjy = mainPet.mjy;
}
```

---

## 排查结论

经过对12个模块的全面排查，**存档数据完整性良好**。所有需要持久化的数据都已正确保存到存档中。

**发现的问题**已全部修复：
1. 幻兽顿悟参数在幻化界面使用经验球升级时会丢失
2. 多次幻化顿悟参数会被较低等级覆盖

### 不需要保存的数据类型
以下类型的数据正确地不保存到存档：
1. **UI状态**：弹窗显示状态、菜单状态、页面显示状态
2. **临时状态**：战斗状态、自动移动状态、浮动文字
3. **每日重置状态**：每日提示显示状态（hasShownSaturdayPKTip 等）
4. **动态计算属性**：petBonus、equipmentBonus、combatPower 等
5. **单独保存的设置**：音乐设置（isMusicEnabled, musicVolume）
