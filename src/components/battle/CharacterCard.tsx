import React from 'react';
import type { BattleCharacter, BattlePet, Buff, BuffType } from '../../types';

/**
 * 角色卡片组件属性接口
 * 定义组件接收的参数类型
 * 支持接收 BattleCharacter（角色）或 BattlePet（幻兽）类型的数据
 */
interface CharacterCardProps {
  // 战斗角色或幻兽数据对象（使用联合类型支持两种数据类型）
  character: BattleCharacter | BattlePet;
}

/**
 * 类型守卫：判断是否为 BattlePet 类型
 * 通过检查 isMerged 属性是否存在来判断
 * @param character 角色或幻兽数据
 * @returns 是否为 BattlePet 类型
 */
const isBattlePet = (character: BattleCharacter | BattlePet): character is BattlePet => {
  // BattlePet 有 isMerged 属性，BattleCharacter 没有
  return 'isMerged' in character;
};

/**
 * 获取增益效果对应的颜色
 * 根据增益类型返回不同的颜色类名
 * @param type 增益效果类型
 * @returns 颜色类名
 */
const getBuffColor = (type: BuffType): string => {
  // 根据不同类型返回对应颜色
  switch (type) {
    case 'combat_power':
      return 'buff-combat-power'; // 战斗力增益 - 红色
    case 'attack':
      return 'buff-attack'; // 攻击力增益 - 橙色
    case 'defense':
      return 'buff-defense'; // 防御力增益 - 蓝色
    case 'speed':
      return 'buff-speed'; // 速度增益 - 绿色
    case 'critical':
      return 'buff-critical'; // 暴击增益 - 黄色
    case 'dodge':
      return 'buff-dodge'; // 闪避增益 - 紫色
    default:
      return 'buff-default'; // 默认颜色
  }
};

/**
 * 获取增益效果的图标
 * 根据增益类型返回对应的图标
 * @param type 增益效果类型
 * @returns 图标字符串
 */
const getBuffIcon = (type: BuffType): string => {
  // 根据不同类型返回对应图标
  switch (type) {
    case 'combat_power':
      return '⚔️'; // 战斗力图标
    case 'attack':
      return '🗡️'; // 攻击力图标
    case 'defense':
      return '🛡️'; // 防御力图标
    case 'speed':
      return '💨'; // 速度图标
    case 'critical':
      return '💥'; // 暴击图标
    case 'dodge':
      return '✨'; // 闪避图标
    default:
      return '⬆️'; // 默认图标
  }
};

/**
 * 渲染单个增益效果图标
 * @param buff 增益效果数据
 * @returns 增益效果 JSX 元素
 */
const renderBuff = (buff: Buff) => {
  return (
    <div 
      key={buff.id} 
      className={`buff-icon ${getBuffColor(buff.type)}`}
      title={`${buff.name}: +${buff.value}% (${buff.duration}回合)`}
    >
      {/* 增益图标 */}
      <span className="buff-icon-symbol">{getBuffIcon(buff.type)}</span>
      {/* 增益数值 */}
      <span className="buff-icon-value">+{buff.value}%</span>
    </div>
  );
};

/**
 * 角色卡片组件
 * 显示角色的基本信息，包括等级、战斗力、攻击力、生命值和魔法值进度条、增益效果
 * 支持显示 BattleCharacter（角色）和 BattlePet（幻兽）两种类型
 * 合体幻兽会显示特殊的"合体"标签和金色边框
 * @param props 组件属性，包含战斗角色或幻兽数据
 * @returns 角色卡片 JSX 元素
 */
const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  // 计算生命值百分比，用于进度条显示
  const hpPercentage = Math.max(0, Math.min(100, (character.currentHp / character.maxHp) * 100));
  
  // 判断是否为幻兽类型
  const isPet = isBattlePet(character);
  
  // 判断是否为合体幻兽（只有幻兽才有 isMerged 属性）
  const isMerged = isPet && character.isMerged;
  
  // 判断是否为角色类型（有 MP 和 buffs 属性）
  const hasMp = !isPet;
  const hasBuffs = !isPet && character.buffs && character.buffs.length > 0;
  
  // 计算魔法值百分比（仅角色有 MP）
  const mpPercentage = hasMp 
    ? Math.max(0, Math.min(100, ((character as BattleCharacter).currentMp / (character as BattleCharacter).maxMp) * 100))
    : 0;

  return (
    // 角色卡片容器，合体幻兽添加特殊样式类
    <div className={`character-card ${isMerged ? 'merged-pet' : ''}`}>
      {/* 角色名称显示区域，包含名称和合体标签 */}
      <div className="character-card-name-container">
        {/* 角色名称 */}
        <span className="character-card-name">
          {character.name}
        </span>
        {/* 合体标签：仅合体幻兽显示 */}
        {isMerged && (
          <span className="merged-tag">合体</span>
        )}
      </div>

      {/* 角色等级显示 */}
      <div className="character-card-level">
        Lv.{character.level}
      </div>

      {/* 角色战斗力显示（仅角色有战斗力属性） */}
      {!isPet && (
        <div className="character-card-combat-power">
          战斗力: {(character as BattleCharacter).combatPower}
        </div>
      )}

      {/* 角色攻击力范围显示 */}
      <div className="character-card-attack">
        攻击: {character.attackMin}-{character.attackMax}
      </div>

      {/* 生命值进度条区域 */}
      <div className="stat-bar-container compact">
        {/* 生命值进度条背景 */}
        <div className="stat-bar hp-bar compact">
          {/* 生命值数值显示（当前/最大）*/}
          <span className="stat-value-on-bar hp-value">
            {character.currentHp}/{character.maxHp}
          </span>
          {/* 生命值进度条填充 */}
          <div 
            className="stat-bar-fill hp-fill"
            style={{ width: `${hpPercentage}%` }}
          />
        </div>
      </div>

      {/* 魔法值进度条区域（仅角色显示） */}
      {hasMp && (
        <div className="stat-bar-container compact">
          {/* 魔法值进度条背景 */}
          <div className="stat-bar mp-bar compact">
            {/* 魔法值数值显示（当前/最大）*/}
            <span className="stat-value-on-bar mp-value">
              {(character as BattleCharacter).currentMp}/{(character as BattleCharacter).maxMp}
            </span>
            {/* 魔法值进度条填充 */}
            <div 
              className="stat-bar-fill mp-fill"
              style={{ width: `${mpPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* 增益效果图标区域（仅角色显示） */}
      {hasBuffs && (
        <div className="buffs-container">
          {/* 渲染所有增益效果 */}
          {(character as BattleCharacter).buffs.map(buff => renderBuff(buff))}
        </div>
      )}
    </div>
  );
};

export default CharacterCard;
