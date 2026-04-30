import './pet.css';

import React from 'react';

import type { Pet } from '../../types';
import { getPetAvatar, getPetQualityColor } from '../common/utils';

/**
 * 幻兽列表项组件属性接口
 * 定义组件接收的参数类型
 */
interface PetListItemProps {
  /**
   * 幻兽对象
   */
  pet: Pet;
  /**
   * 点击幻兽项时触发的回调函数
   * @param pet 被点击的幻兽对象
   */
  onClick: (pet: Pet) => void;
  /**
   * 出战幻兽的回调函数（可选）
   * @param petId 要出战的幻兽ID
   */
  onDeploy?: (petId: string) => void;
  /**
   * 召回幻兽的回调函数（可选）
   * @param petId 要召回的幻兽ID
   */
  onRecall?: (petId: string) => void;
  /**
   * 是否可以出战（可选，默认为true）
   * 当已有两只幻兽出战时，应该为false
   */
  canDeploy?: boolean;
  /**
   * 丢弃幻兽的回调函数（可选，仅对休息中的幻兽生效）
   * @param petId 要丢弃的幻兽ID
   */
  onDiscard?: (petId: string) => void;
}

/**
 * 幻兽列表项组件
 * 用于在幻兽列表中显示单个幻兽的基本信息
 * 包含幻兽头像、名称、等级和品质
 * 点击后触发onClick回调打开详情弹窗
 */
const PetListItem: React.FC<PetListItemProps> = ({
  pet,
  onClick,
  onDeploy,
  onRecall,
  canDeploy = true,
  onDiscard
}) => {
  /**
   * 处理点击事件
   */
  const handleClick = () => {
    onClick(pet);
  };

  /**
   * 处理出战按钮点击事件
   * 阻止事件冒泡，避免触发列表项点击
   */
  const handleDeployClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeploy && !pet.isDeployed && canDeploy) {
      onDeploy(pet.id);
    }
  };

  /**
   * 处理召回按钮点击事件
   * 阻止事件冒泡，避免触发列表项点击
   */
  const handleRecallClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRecall && pet.isDeployed) {
      onRecall(pet.id);
    }
  };

  /**
   * 处理丢弃按钮点击事件
   * 阻止事件冒泡，避免触发列表项点击
   */
  const handleDiscardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDiscard) {
      onDiscard(pet.id);
    }
  };

  /**
   * 获取幻兽状态标签
   * 显示出战或合体状态
   */
  const getStatusBadge = () => {
    if (pet.isMerged) {
      return <span className="pet-status-badge merged">合体中</span>;
    }
    if (pet.isDeployed) {
      return <span className="pet-status-badge deployed">出战中</span>;
    }

    return null;
  };

  return (
    <div
      className="pet-list-item"
      onClick={handleClick}
    >
      {/* 幻兽头像 */}
      <div className="pet-list-avatar">
        <img className="pet-list-avatar-img" src={getPetAvatar(pet.hs_name)} alt={pet.hs_name} />
      </div>

      {/* 幻兽信息 */}
      <div className="pet-list-info">
        {/* 幻兽名称 */}
        <div className="pet-list-name-row">
          <span
            className="pet-list-name"
            style={{ color: getPetQualityColor(pet.qualityTitle) }}
          >
            {pet.othername}
          </span>
          {getStatusBadge()}
        </div>

        {/* 幻兽品质称号和等级 */}
        <div className="pet-list-meta">
          <span
            className="pet-list-type"
            style={{ color: getPetQualityColor(pet.qualityTitle) }}
          >
            {pet.qualityTitle}
          </span>
          <span className="pet-list-level">Lv.{pet.dj}</span>
        </div>
      </div>

      {/* 出战/召回按钮 */}
      {pet.isDeployed ? (
        /* 已出战 - 显示召回按钮 */
        <button
          className="pet-recall-button"
          onClick={handleRecallClick}
        >
          召回
        </button>
      ) : (
        /* 未出战 - 显示出战和丢弃按钮 */
        <div className="pet-list-actions">
          <button
            className={`pet-deploy-button ${!canDeploy ? 'disabled' : ''}`}
            onClick={handleDeployClick}
            disabled={!canDeploy}
          >
            出战
          </button>
          <button
            className="pet-discard-button"
            onClick={handleDiscardClick}
          >
            丢弃
          </button>
        </div>
      )}
    </div>
  );
};

export default PetListItem;
