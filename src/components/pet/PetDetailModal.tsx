import './pet.css';

import React from 'react';

import type { Pet } from '../../types';
import { formatGrowthRate, getPetAvatar, getPetQualityColor } from '../common/utils';

/**
 * 幻兽详情弹窗组件属性接口
 * 定义组件接收的参数类型
 */
interface PetDetailModalProps {
  /**
   * 是否显示弹窗
   */
  isVisible: boolean;
  /**
   * 关闭弹窗的回调函数
   */
  onClose: () => void;
  /**
   * 要显示的幻兽对象
   */
  pet: Pet | null;
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
 * 幻兽详情弹窗组件
 * 用于显示幻兽的详细信息，包括基础属性、成长属性、评分等
 * 以表格形式展示各项数据
 */
const PetDetailModal: React.FC<PetDetailModalProps> = ({
  isVisible,
  onClose,
  pet,
  onDeploy,
  canDeploy = true
}) => {
  /**
   * 处理点击遮罩层关闭弹窗
   */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  /**
   * 计算罕见度加分
   * 基于幻兽类型的基础评分
   */
  const getRarityBonus = (): number => {
    if (!pet) return 0;

    return pet.rating.pzbase;
  };

  // 如果弹窗不可见或没有幻兽数据，则不渲染
  if (!isVisible || !pet) return null;

  return (
    <div
      className="pet-detail-modal-overlay"
      onClick={handleOverlayClick}
    >
      <div className="pet-detail-modal-content">
        {/* 关闭按钮 */}
        <button
          className="pet-detail-close-button"
          onClick={onClose}
          aria-label="关闭"
        >
          ✕
        </button>

        {/* 幻兽头部信息：图标和名称 */}
        <div className="pet-detail-header">
          <div className="pet-detail-icon-wrapper">
            <img className="pet-detail-avatar-img" src={getPetAvatar(pet.hs_name)} alt={pet.hs_name} />
          </div>
          <h3
            className="pet-detail-name"
            style={{ color: getPetQualityColor(pet.qualityTitle) }}
          >
            {pet.othername}
          </h3>
        </div>

        {/* 详细信息表格 */}
        <div className="pet-detail-table">
          {/* 第一行：名字和品质称号 */}
          <div className="pet-detail-row">
            <div className="pet-detail-cell">
              <span className="cell-label">名字</span>
              <span className="cell-value">{pet.othername}</span>
            </div>
            <div className="pet-detail-cell">
              <span className="cell-label">品质称号</span>
              <span
                className="cell-value quality-value"
                style={{ color: getPetQualityColor(pet.qualityTitle) }}
              >
                {pet.qualityTitle}
              </span>
            </div>
          </div>

          {/* 第二行：等级和转世 */}
          <div className="pet-detail-row">
            <div className="pet-detail-cell">
              <span className="cell-label">等级</span>
              <span className="cell-value">{pet.dj}</span>
            </div>
            <div className="pet-detail-cell">
              <span className="cell-label">转世</span>
              <span className="cell-value">{pet.zs}次</span>
            </div>
          </div>

          {/* 第三行：生命和经验 */}
          <div className="pet-detail-row">
            <div className="pet-detail-cell">
              <span className="cell-label">生命</span>
              <span className="cell-value hp-value">{Math.round(pet.hp)}/{Math.round(pet.mhp)}</span>
            </div>
            <div className="pet-detail-cell">
              <span className="cell-label">经验</span>
              <span className="cell-value exp-value">{pet.jy}/{pet.mjy}</span>
            </div>
          </div>

          {/* 第四行：攻击和防御 */}
          <div className="pet-detail-row">
            <div className="pet-detail-cell">
              <span className="cell-label">攻击</span>
              <span className="cell-value attack-value">{pet.xgj}-{pet.dgj}</span>
            </div>
            <div className="pet-detail-cell">
              <span className="cell-label">防御</span>
              <span className="cell-value defense-value">{pet.fy}</span>
            </div>
          </div>

          {/* 第五行：防御成长率和评分 */}
          <div className="pet-detail-row">
            <div className="pet-detail-cell">
              <span className="cell-label">防御成长率</span>
              <span className="cell-value">{formatGrowthRate(pet.cz_fy)}</span>
            </div>
            <div className="pet-detail-cell">
              <span className="cell-label">防御评分</span>
              <span className="cell-value">{pet.rating.pz_cz_fy}</span>
            </div>
          </div>

          {/* 第六行：生命成长率和评分 */}
          <div className="pet-detail-row">
            <div className="pet-detail-cell">
              <span className="cell-label">生命成长率</span>
              <span className="cell-value">{formatGrowthRate(pet.cz_hp)}</span>
            </div>
            <div className="pet-detail-cell">
              <span className="cell-label">评分</span>
              <span className="cell-value">{pet.rating.pz_cz_hp}</span>
            </div>
          </div>

          {/* 第七行：攻击成长率和评分 */}
          <div className="pet-detail-row">
            <div className="pet-detail-cell">
              <span className="cell-label">攻击成长率</span>
              <span className="cell-value">{formatGrowthRate(pet.cz_xgj)}-{formatGrowthRate(pet.cz_dgj)}</span>
            </div>
            <div className="pet-detail-cell">
              <span className="cell-label">评分</span>
              <span className="cell-value">{pet.rating.pz_cz_xgj}-{pet.rating.pz_cz_dgj}</span>
            </div>
          </div>

          {/* 第八行：初始生命和评分 */}
          <div className="pet-detail-row">
            <div className="pet-detail-cell">
              <span className="cell-label">初始生命</span>
              <span className="cell-value">{pet.chp}</span>
            </div>
            <div className="pet-detail-cell">
              <span className="cell-label">评分</span>
              <span className="cell-value">{pet.rating.pz_chp}</span>
            </div>
          </div>

          {/* 第九行：初始攻击和评分 */}
          <div className="pet-detail-row">
            <div className="pet-detail-cell">
              <span className="cell-label">初始攻击</span>
              <span className="cell-value">{pet.cxgj}-{pet.cdgj}</span>
            </div>
            <div className="pet-detail-cell">
              <span className="cell-label">评分</span>
              <span className="cell-value">{pet.rating.pz_cxgj}-{pet.rating.pz_cdgj}</span>
            </div>
          </div>

          {/* 第十行：初始防御和评分 */}
          <div className="pet-detail-row">
            <div className="pet-detail-cell">
              <span className="cell-label">初始防御</span>
              <span className="cell-value">{pet.cfy}</span>
            </div>
            <div className="pet-detail-cell">
              <span className="cell-label">评分</span>
              <span className="cell-value">{pet.rating.pz_cfy}</span>
            </div>
          </div>

          {/* 第十一行：罕见度 */}
          <div className="pet-detail-row">
            <div className="pet-detail-cell full-width">
              <span className="cell-label">罕见度</span>
              <span className="cell-value rarity-value">+{getRarityBonus()}</span>
            </div>
          </div>

          {/* 总评分 */}
          <div className="pet-detail-total">
            <div className="total-label">总评分</div>
            <div
              className="total-value"
              style={{ color: getPetQualityColor(pet.qualityTitle) }}
            >
              {pet.pz}
            </div>
          </div>

          {/* 操作按钮区域 */}
          <div className="pet-detail-actions">
            {/* 出战按钮：未出战且可以出战时显示 */}
            {!pet.isDeployed && onDeploy && canDeploy && (
              <button
                className="pet-detail-button deploy"
                onClick={() => {
                  onDeploy(pet.id);
                  onClose();
                }}
              >
                出战
              </button>
            )}
            {/* 已出战提示 */}
            {pet.isDeployed && (
              <div className="pet-detail-deployed-info">
                <span className="deployed-text">已出战</span>
              </div>
            )}
            {/* 无法出战提示 */}
            {!pet.isDeployed && onDeploy && !canDeploy && (
              <div className="pet-detail-cannot-deploy">
                <span className="cannot-text">出战位置已满</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetailModal;
