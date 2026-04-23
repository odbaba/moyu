import './skill.css';

import React, { useCallback, useState } from 'react';

import { exampleSkills } from '../../data/skillData';
import type { SkillDetail } from '../../types';
import SkillDetailModal from './SkillDetailModal';
import SkillList from './SkillList';

/**
 * 技能主页面组件属性接口
 * 定义组件接收的参数类型
 */
interface SkillPageProps {
  /** 是否显示页面 */
  isVisible: boolean;
  /** 技能数据数组，默认为 exampleSkills */
  skills?: SkillDetail[];
  /** 关闭按钮点击回调 */
  onClose: () => void;
  /** 技能升级回调 */
  onUpgradeSkill?: (skillId: string) => void;
  /** 当前金币数量（用于判断是否可以升级） */
  gold?: number;
}

/**
 * 技能主页面组件
 * 整合技能列表展示和技能详情弹窗功能
 * 作为独立的全屏页面显示
 * 移动端布局：垂直列表展示所有技能
 */
const SkillPage: React.FC<SkillPageProps> = ({
  isVisible,
  skills = exampleSkills,
  onClose,
  onUpgradeSkill,
  gold = 0
}) => {
  /** 当前选中的技能ID */
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);

  /** 技能详情弹窗显示状态 */
  const [showDetailModal, setShowDetailModal] = useState(false);

  /** 获取当前选中的技能对象 */
  const selectedSkill = skills.find((skill: SkillDetail) => skill.id === selectedSkillId) || null;

  /** 已学习的技能列表 */
  const learnedSkills = skills.filter((s: SkillDetail) => s.isLearned);

  /** 处理技能点击事件 */
  const handleSkillClick = useCallback((skill: SkillDetail) => {
    if (selectedSkillId === skill.id) {
      setSelectedSkillId(null);
      setShowDetailModal(false);
    } else {
      setSelectedSkillId(skill.id);
      setShowDetailModal(true);
    }
  }, [selectedSkillId]);

  /** 关闭技能详情弹窗 */
  const handleCloseDetailModal = useCallback(() => {
    setShowDetailModal(false);
    setSelectedSkillId(null);
  }, []);

  /** 处理技能升级 */
  const handleUpgradeSkill = useCallback((skillId: string) => {
    if (onUpgradeSkill) {
      onUpgradeSkill(skillId);
    }
  }, [onUpgradeSkill]);

  /** 处理覆盖层点击事件 */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 如果不可见，不渲染任何内容
  if (!isVisible) return null;

  return (
    <div className="skill-page-overlay" onClick={handleOverlayClick}>
      <div className="skill-page-container">
        {/* 顶部占位框 */}
        <div className="page-top-placeholder"></div>

        {/* 页面顶部标题和关闭按钮 */}
        <div className="skill-page-header">
          <h2 className="skill-page-title">技能列表</h2>
          <button
            className="skill-page-close-button"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* 技能统计信息 */}
        <div className="skill-stats">
          <div className="stat-item">
            <span className="stat-label">已学习:</span>
            <span className="stat-value">{learnedSkills.length}/6个技能</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">攻击技能:</span>
            <span className="stat-value">
              {learnedSkills.filter((s: SkillDetail) => ['single', 'aoe', 'multi'].includes(s.attackType)).length}个
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">增益技能:</span>
            <span className="stat-value">
              {learnedSkills.filter((s: SkillDetail) => s.attackType === 'buff').length}个
            </span>
          </div>
        </div>

        {/* 技能列表区域 */}
        <div className="skill-page-content">
          <SkillList
            skills={skills}
            selectedSkillId={selectedSkillId}
            onSkillClick={handleSkillClick}
          />
        </div>

        {/* 技能详情弹窗 */}
        <SkillDetailModal
          isVisible={showDetailModal}
          skill={selectedSkill}
          onClose={handleCloseDetailModal}
          onUpgrade={handleUpgradeSkill}
          gold={gold}
        />
      </div>
    </div>
  );
};

export default SkillPage;
