# NPC查询信息类交互统一添加弹窗显示计划

## 一、任务概述

为所有NPC查询信息类交互统一添加弹窗显示功能，确保信息不仅在日志中打印，还能通过弹窗直观展示给用户。

## 二、需求分析

### 当前问题
- 所有查询信息类交互仅通过 `setInteractionLog` 打印日志
- 用户需要滚动查看日志才能看到信息，不够直观
- 手机端用户体验不佳

### 目标
- 所有查询信息类交互同时打印日志和显示弹窗
- 弹窗内容需要合理换行，提升可读性
- 统一弹窗样式和交互方式

## 三、涉及交互类型

### 1. 国王NPC
- **viewEnemyInfo** - 查看魔族大军情报（6个选项）
  - 魔军突击队资料
  - 魔军守卫军资料
  - 魔军神秘部队资料
  - 魔军图腾兽资料
  - 魔的能量资料
  - 魔军主帅资料

### 2. 元帅NPC
- **queryBattleExp** - 战功查询
- **queryBossInfo** - 军情查询（BOSS位置）
- **showHelp** - 关于军衔

### 3. 首相NPC
- **showHelp** - 关于爵位

### 4. 丫环NPC
- **showHelp** - 游戏提示
- **showHelp** - 关于幻兽

### 5. 日常任务官
- **showHelp** - 关于日常任务

### 6. 地图赛报名官（多个地图）
- **viewProtectorReward** - 查看保护者每天的奖励

### 7. PK赛报名官
- **showHelp** - 查看奖品

### 8. 抽奖官
- **showHelp** - 关于抽奖

### 9. 幻兽幻化师
- **showHelp** - 关于幻化

### 10. 宝石合成师
- 查看合成配方（无actionType，仅result字段）

### 11. 幻兽研究所
- **viewInstituteInfo** - 研究所的当前信息
- **viewOlympicInfo** - 关于2008奥运使者

### 12. 2008奥运使者
- **viewOlympicProgress** - 查看任务进度

### 13. 探险家
- **showHelp** - 关于探险

### 14. 装备打造师
- **showHelp** - 关于提升魔魂等级
- **showHelp** - 关于提升品质
- **showHelp** - 关于装备开洞
- **showHelp** - 关于镶嵌宝石
- **showHelp** - 关于战魂

## 四、实施方案

### 步骤1：创建通用信息弹窗组件
**文件**: `src/components/common/InfoModal.tsx`

**功能**:
- 显示标题和内容
- 支持多行文本自动换行
- 支持自定义标题
- 统一关闭按钮样式
- 响应式设计，适配手机端

**Props接口**:
```typescript
interface InfoModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  content: string;
}
```

### 步骤2：在App.tsx中添加状态管理
**修改内容**:
- 添加弹窗显示状态: `showInfoModal`
- 添加弹窗标题状态: `infoModalTitle`
- 添加弹窗内容状态: `infoModalContent`
- 添加显示弹窗的辅助函数: `showInfoModalWithContent`

### 步骤3：修改所有查询信息类交互处理
**修改位置**: `src/App.tsx` 的 `handleNPCOptionSelect` 函数

**修改策略**:
1. 保留原有的 `setInteractionLog` 调用
2. 在日志打印后，调用弹窗显示函数
3. 对内容进行格式化处理，确保合理换行

**具体修改**:

#### 3.1 viewEnemyInfo（国王NPC）
```typescript
case 'viewEnemyInfo':
  if (actionParams?.enemyType) {
    const demonId = actionParams.enemyType as string;
    const dialogue = getDemonArmyDialogue(demonId);
    setInteractionLog(prev => [...prev, dialogue]);
    // 添加弹窗显示
    showInfoModalWithContent('魔族大军情报', dialogue);
  }
  break;
```

#### 3.2 queryBattleExp（元帅NPC）
```typescript
case 'queryBattleExp':
  const expResult = queryBattleExp(battleExp);
  const expMessage = `当前军衔：${expResult.currentRankName}\n当前战功：${expResult.currentExp}\n${
    expResult.nextRankName
      ? `下一级军衔：${expResult.nextRankName}\n所需战功：${expResult.nextRequirement}\n晋升进度：${expResult.progress}%`
      : '已达到最高军衔！'
  }`;
  setInteractionLog(prev => [...prev, expMessage]);
  // 添加弹窗显示
  showInfoModalWithContent('战功查询', expMessage);
  break;
```

#### 3.3 queryBossInfo（元帅NPC）
```typescript
case 'queryBossInfo':
  const bossStatus: Record<string, boolean> = {};
  spawnedBosses.forEach(bossId => {
    const match = bossId.match(/boss-(\d+)/);
    if (match) {
      bossStatus[`boss${match[1]}`] = true;
    }
  });
  const intelList = queryMilitaryIntel(bossStatus);
  const intelMessage = formatMilitaryIntel(intelList);
  setInteractionLog(prev => [...prev, intelMessage]);
  // 添加弹窗显示
  showInfoModalWithContent('军情查询', intelMessage);
  break;
```

#### 3.4 showHelp（多个NPC）
需要根据不同的 `actionParams.topic` 显示不同的标题和内容：

- **militaryRank**: 标题 "军衔系统说明"
- **nobleRank**: 标题 "爵位系统说明"
- **dailyTask**: 标题 "日常任务说明"
- **gameTips**: 标题 "游戏提示"
- **petSystem**: 标题 "关于幻兽"
- **pkReward**: 标题 "PK赛奖励"
- **lottery**: 标题 "抽奖系统说明"
- **petFusion**: 标题 "幻化系统说明"
- **explore**: 标题 "探险说明"
- **soulLevel**: 标题 "提升魔魂等级"
- **quality**: 标题 "提升品质"
- **socket**: 标题 "装备开洞"
- **gemInlay**: 标题 "镶嵌宝石"
- **warSoul**: 标题 "战魂系统"

#### 3.5 viewProtectorReward（地图赛报名官）
```typescript
case 'viewProtectorReward':
  if (currentNPCData?.location) {
    const config = getMapChallengeConfig(currentNPCData.location);
    if (config) {
      const desc = getMapChallengeDescription(config);
      setInteractionLog(prev => [...prev, desc]);
      // 添加弹窗显示
      showInfoModalWithContent('保护者奖励', desc);
    }
  }
  break;
```

#### 3.6 viewInstituteInfo（幻兽研究所）
```typescript
case 'viewInstituteInfo':
  const info = getInstituteInfo(petInstituteState);
  setInteractionLog(prev => [...prev, info]);
  // 添加弹窗显示
  showInfoModalWithContent('幻兽研究所信息', info);
  break;
```

#### 3.7 viewOlympicInfo（幻兽研究所）
```typescript
case 'viewOlympicInfo':
  const olympicInfo = '完成2008奥运任务后，幻兽研究所技术等级上限可提升至150级。';
  setInteractionLog(prev => [...prev, olympicInfo]);
  // 添加弹窗显示
  showInfoModalWithContent('关于2008奥运使者', olympicInfo);
  break;
```

#### 3.8 viewOlympicProgress（2008奥运使者）
需要查看现有实现并添加弹窗

#### 3.9 宝石合成师的"查看合成配方"
需要特殊处理，因为该选项没有 `actionType`，只有 `result` 字段
需要在 NPCModal 组件中识别并处理

### 步骤4：优化内容换行
**策略**:
- 使用 `\n` 作为换行符
- 在弹窗组件中将 `\n` 转换为 `<br/>` 或使用 `white-space: pre-line` CSS样式
- 对于长文本，自动添加适当的换行

### 步骤5：添加弹窗样式优化
**文件**: `src/components/common/common.css`

**新增样式**:
```css
/* 信息弹窗样式 */
.info-modal-content {
  white-space: pre-line;
  line-height: 1.8;
  font-size: 0.95rem;
  color: #f0f0f0;
  max-height: 60vh;
  overflow-y: auto;
  padding: 16px;
  background-color: #2a2a2a;
  border-radius: 6px;
  border: 1px solid #444;
}

.info-modal-content::-webkit-scrollbar {
  width: 6px;
}

.info-modal-content::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 3px;
}
```

### 步骤6：处理特殊案例

#### 6.1 宝石合成师的"查看合成配方"
该选项没有 `actionType`，需要在 `NPCModal.tsx` 中特殊处理：
- 检测 `option.result` 是否包含大量文本
- 如果是，则调用父组件传递的回调函数显示弹窗

#### 6.2 viewOlympicProgress
需要查看具体实现并添加弹窗支持

## 五、测试要点

### 5.1 功能测试
- [ ] 所有查询信息类交互都能正常显示弹窗
- [ ] 弹窗内容与日志内容一致
- [ ] 弹窗标题正确
- [ ] 弹窗可以正常关闭

### 5.2 样式测试
- [ ] 弹窗样式统一美观
- [ ] 内容换行合理，易于阅读
- [ ] 手机端显示正常
- [ ] 长文本可以滚动查看

### 5.3 兼容性测试
- [ ] 不影响现有功能
- [ ] 日志仍然正常打印
- [ ] 其他NPC交互不受影响

## 六、文件修改清单

### 新增文件
1. `src/components/common/InfoModal.tsx` - 信息弹窗组件

### 修改文件
1. `src/App.tsx` - 添加状态管理和弹窗显示逻辑
2. `src/components/common/common.css` - 添加弹窗样式
3. `src/components/common/NPCModal.tsx` - 处理特殊案例（可选）

## 七、实施顺序

1. 创建 InfoModal 组件
2. 在 App.tsx 中添加状态管理
3. 修改 viewEnemyInfo 交互（验证方案可行性）
4. 修改 queryBattleExp 和 queryBossInfo 交互
5. 修改所有 showHelp 交互
6. 修改 viewProtectorReward 交互
7. 修改 viewInstituteInfo 和 viewOlympicInfo 交互
8. 修改 viewOlympicProgress 交互
9. 处理宝石合成师特殊案例
10. 添加样式优化
11. 全面测试

## 八、注意事项

1. **保持日志功能**: 所有修改都要保留原有的日志打印功能
2. **统一标题格式**: 弹窗标题要简洁明了，与交互选项文本对应
3. **内容格式化**: 确保内容在弹窗中显示时换行合理
4. **性能优化**: 避免频繁创建和销毁弹窗组件
5. **移动端适配**: 确保弹窗在手机端显示效果良好
