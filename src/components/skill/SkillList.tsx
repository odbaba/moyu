import './skill.css';

import React, { useMemo } from 'react';

import { getSkillDisplayName } from '../../data/skillData';
import type { SkillDetail } from '../../types';
import { getAttackTypeName } from '../../utils/skillUtils';
import { getRarityClassName } from '../common/utils';

/**
 * 技能列表组件属性接口
 */
interface SkillListProps {
  /** 技能数据数组 */
  skills: SkillDetail[];
  /** 当前选中的技能ID */
  selectedSkillId: string | null;
  /** 点击技能时触发的回调函数 */
  onSkillClick: (skill: SkillDetail) => void;
}

/**
 * 技能列表组件
 * 以垂直列表形式展示所有技能
 * 移动端优化：每个技能项占据整行
 */
const SkillList: React.FC<SkillListProps> = ({
  skills,
  selectedSkillId,
  onSkillClick
}) => {
  /** 渲染技能列表项 */
  const skillItems = useMemo(() => {
    return skills.map(skill => {
      const isSelected = selectedSkillId === skill.id;
      const isLearned = skill.isLearned;

      return (
        <div
          key={skill.id}
          className={`skill-list-item ${isSelected ? 'selected' : ''} ${!isLearned ? 'not-learned' : ''}`}
          onClick={() => onSkillClick(skill)}
        >
          {/* 技能图标 */}
          <span className="skill-icon">
            {skill.icon}
          </span>

          {/* 技能信息：名称和等级 */}
          <div className="skill-info">
            <span className={`skill-name ${getRarityClassName(skill.rarity)}`}>
              {getSkillDisplayName(skill)}
            </span>
            <span className="skill-level">
              {skill.skillIndex === 4
                ? `Lv.${skill.level}/${skill.maxLevel}`
                : skill.isLearned ? `Lv.${skill.level}/${skill.maxLevel}` : '未学习'
              }
            </span>
          </div>

          {/* 技能类型标签 */}
          <span className="skill-type-tag">
            {getAttackTypeName(skill.attackType)}
          </span>

          {/* 学习状态标记 */}
          {!isLearned && (
            <span className="skill-learn-tag">
              {skill.learnMethod === 'skillBook' ? '技能书' : '亲密度'}
            </span>
          )}
        </div>
      );
    });
  }, [skills, selectedSkillId, onSkillClick]);

  return (
    <div className="skill-list">
      {skillItems}
    </div>
  );
};

export default SkillList;
