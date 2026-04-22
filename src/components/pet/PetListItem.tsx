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
   * 是否可以出战（可选，默认为true）
   * 当已有两只幻兽出战时，应该为false
   */
  canDeploy?: boolean;
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
  canDeploy = true
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

  /**
   * 判断是否显示出战按钮
   * 未出战且提供了onDeploy回调时显示
   */
  const showDeployButton = !pet.isDeployed && onDeploy && canDeploy;

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

        {/* 幻兽类型和等级 */}
        <div className="pet-list-meta">
          <span className="pet-list-type">{pet.hs_name}</span>
          <span className="pet-list-level">Lv.{pet.dj}</span>
        </div>
      </div>

      {/* 出战按钮或品质称号标签 */}
      {showDeployButton ? (
        <button
          className="pet-deploy-button"
          onClick={handleDeployClick}
        >
          出战
        </button>
      ) : (
        <div
          className="pet-list-quality"
          style={{ backgroundColor: getPetQualityColor(pet.qualityTitle) }}
        >
          {pet.qualityTitle}
        </div>
      )}
    </div>
  );
};

export default PetListItem;
