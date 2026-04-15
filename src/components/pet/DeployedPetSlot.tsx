import './pet.css';

import React from 'react';

import type { Pet } from '../../types';
import { getPetEmoji } from '../common/utils';

/**
 * 出战幻兽栏组件属性接口
 * 定义组件接收的参数类型
 */
interface DeployedPetSlotProps {
  /**
   * 幻兽对象，如果为null表示该槽位为空
   */
  pet: Pet | null;
  /**
   * 槽位索引（0或1），用于显示位置编号
   */
  slotIndex: number;
  /**
   * 召回幻兽的回调函数
   * @param petId 要召回的幻兽ID
   */
  onRecall: (petId: string) => void;
  /**
   * 合体幻兽的回调函数
   * @param petId 要合体的幻兽ID
   */
  onMerge: (petId: string) => void;
  /**
   * 解体幻兽的回调函数
   * @param petId 要解体的幻兽ID
   */
  onUnmerge: (petId: string) => void;
}

/**
 * 出战幻兽栏组件
 * 用于显示单个出战幻兽的信息和操作按钮
 * 包含幻兽头像、生命值条、经验值条、召回和合体/解体按钮
 * 如果槽位为空，显示"空"占位符
 */
const DeployedPetSlot: React.FC<DeployedPetSlotProps> = ({
  pet,
  slotIndex,
  onRecall,
  onMerge,
  onUnmerge
}) => {
  /**
   * 计算生命值百分比
   * 用于显示生命值进度条
   */
  const hpPercent = pet ? Math.round((pet.hp / pet.mhp) * 100) : 0;

  /**
   * 计算经验值百分比
   * 用于显示经验值进度条
   */
  const expPercent = pet ? Math.round((pet.jy / pet.mjy) * 100) : 0;

  /**
   * 处理召回按钮点击
   */
  const handleRecall = () => {
    if (pet) {
      onRecall(pet.id);
    }
  };

  /**
   * 处理合体按钮点击
   */
  const handleMerge = () => {
    if (pet) {
      onMerge(pet.id);
    }
  };

  /**
   * 处理解体按钮点击
   */
  const handleUnmerge = () => {
    if (pet) {
      onUnmerge(pet.id);
    }
  };

  /**
   * 渲染空槽位
   * 显示"空"占位符
   */
  if (!pet) {
    return (
      <div className="deployed-pet-slot empty">
        <div className="slot-header">
          <span className="slot-index">位置 {slotIndex + 1}</span>
        </div>
        <div className="empty-slot-content">
          <span className="empty-icon">💨</span>
          <span className="empty-text">空</span>
        </div>
      </div>
    );
  }

  /**
   * 渲染有幻兽的槽位
   * 显示幻兽详细信息
   */
  return (
    <div className={`deployed-pet-slot ${pet.isMerged ? 'merged' : ''}`}>
      {/* 槽位头部：位置编号和合体状态 */}
      <div className="slot-header">
        <span className="slot-index">位置 {slotIndex + 1}</span>
        {pet.isMerged && <span className="merged-badge">合体中</span>}
      </div>

      {/* 幻兽信息区域 */}
      <div className="pet-info">
        {/* 幻兽头像 */}
        <div className="pet-avatar">
          <span className="pet-emoji">{getPetEmoji(pet.hs_name)}</span>
        </div>

        {/* 幻兽详细信息 */}
        <div className="pet-details">
          {/* 幻兽名称和等级 */}
          <div className="pet-name-row">
            <span className="pet-name">{pet.othername}</span>
            <span className="pet-level">Lv.{pet.dj}</span>
          </div>

          {/* 生命值进度条 */}
          <div className="pet-stat-bar">
            <div className="stat-label">❤️ 生命</div>
            <div className="stat-bar-container">
              <div
                className="stat-bar-fill hp-fill"
                style={{ width: `${hpPercent}%` }}
              />
              <span className="stat-bar-text">
                {pet.hp}/{pet.mhp}
              </span>
            </div>
          </div>

          {/* 经验值进度条 */}
          <div className="pet-stat-bar">
            <div className="stat-label">⭐ 经验</div>
            <div className="stat-bar-container">
              <div
                className="stat-bar-fill exp-fill"
                style={{ width: `${expPercent}%` }}
              />
              <span className="stat-bar-text">
                {expPercent}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 操作按钮区域 */}
      <div className="pet-actions">
        {/* 召回按钮 */}
        <button
          className="pet-action-button recall-button"
          onClick={handleRecall}
        >
          召回
        </button>

        {/* 合体/解体按钮 */}
        {pet.isMerged ? (
          <button
            className="pet-action-button unmerge-button"
            onClick={handleUnmerge}
          >
            解体
          </button>
        ) : (
          <button
            className="pet-action-button merge-button"
            onClick={handleMerge}
          >
            合体
          </button>
        )}
      </div>
    </div>
  );
};

export default DeployedPetSlot;
