/**
 * 技能学习工具函数
 * 处理技能书学习逻辑
 */

import type { InventoryItem, SkillDetail, SkillLearnResult } from '../types';

/**
 * 从技能书学习技能
 * @param skillBook 技能书物品
 * @param currentSkills 当前技能列表
 * @returns 学习结果
 */
export function learnSkillFromBook(
  skillBook: InventoryItem,
  currentSkills: SkillDetail[]
): SkillLearnResult {
  // 1. 验证是否为技能书
  if (skillBook.type !== 'skillBook') {
    return {
      success: false,
      message: '该物品不是技能书',
      updatedSkills: currentSkills
    };
  }

  // 2. 获取技能ID
  const skillId = skillBook.skillId;
  if (!skillId) {
    return {
      success: false,
      message: '技能书数据错误：缺少技能ID',
      updatedSkills: currentSkills
    };
  }

  // 3. 查找对应技能
  const skillIndex = currentSkills.findIndex(s => s.id === skillId);
  if (skillIndex === -1) {
    return {
      success: false,
      message: '未找到对应技能',
      updatedSkills: currentSkills
    };
  }

  const targetSkill = currentSkills[skillIndex];
  const isUpgrade = skillBook.isUpgrade || false;
  const targetLevel = skillBook.targetLevel || 1;
  const isIncrementalUpgrade = skillBook.isIncrementalUpgrade || false;

  // 4. 检查是否可以学习
  if (isUpgrade) {
    // 升级技能书：需要已学习该技能
    if (!targetSkill.isLearned) {
      return {
        success: false,
        message: `需要先学习 ${targetSkill.name} 技能`,
        updatedSkills: currentSkills
      };
    }

    // 逐级升级技能书（如高级斗志昂扬）：每次使用等级+1
    if (isIncrementalUpgrade) {
      // 斗志昂扬最高等级为5级
      const maxLevel = targetSkill.skillIndex === 4 ? 5 : (targetSkill.maxLevel || 2);

      if (targetSkill.level >= maxLevel) {
        return {
          success: false,
          message: `${targetSkill.name} 已达到最高等级`,
          updatedSkills: currentSkills
        };
      }
    } else {
      // 固定等级升级技能书：检查是否可以升级到目标等级（允许跳级升级）
      if (targetSkill.level >= targetLevel) {
        return {
          success: false,
          message: `${targetSkill.name} 已达到或超过该等级`,
          updatedSkills: currentSkills
        };
      }
    }
  } else {
    // 学习新技能书：需要未学习该技能
    if (targetSkill.isLearned) {
      return {
        success: false,
        message: `已经学会了 ${targetSkill.name}`,
        updatedSkills: currentSkills
      };
    }
  }

  // 5. 学习/升级技能
  const updatedSkills = [...currentSkills];
  const newSkill = { ...targetSkill };

  if (isUpgrade) {
    // 升级技能
    // 逐级升级：等级+1
    const newLevel = isIncrementalUpgrade ? targetSkill.level + 1 : targetLevel;
    newSkill.level = newLevel;
    newSkill.isLearned = true;
    updatedSkills[skillIndex] = newSkill;

    return {
      success: true,
      message: `恭喜！${targetSkill.name} 升级成功！当前等级：Lv.${newLevel}`,
      updatedSkills
    };
  } else {
    // 学习新技能
    newSkill.level = targetLevel;
    newSkill.isLearned = true;
    updatedSkills[skillIndex] = newSkill;

    return {
      success: true,
      message: `恭喜！学会了新技能：${targetSkill.name}`,
      updatedSkills
    };
  }
}

