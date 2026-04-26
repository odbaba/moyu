/**
 * 幻兽幻化主界面组件
 * 提供幻兽幻化功能的完整交互界面（全屏页面形式）
 * 包含主副幻兽选择、幻化条件检查、幻化执行、结果展示等功能
 */

import './pet.css';

import React, { useEffect, useMemo, useState } from 'react';

import type { InventoryItem, Pet } from '../../types';
import { calculateScoreRequirement, checkFusionConditions, executeFusion } from '../../utils/petFusion';
import { gainExperience } from '../../utils/petGenerator';
import { getPetAvatar, getPetQualityColor } from '../common/utils';
import FusionHelpModal from './FusionHelpModal';
import FusionResultModal from './FusionResultModal';
import FusionSettingsPanel, { type FusionSettings } from './FusionSettingsPanel';
import PetSelectModal from './PetSelectModal';

/**
 * 幻兽幻化主界面组件属性接口
 * 定义组件接收的参数类型
 */
interface PetFusionModalProps {
  /** 是否显示页面 */
  isVisible: boolean;
  /** 关闭页面回调函数 */
  onClose: () => void;
  /** 所有幻兽数组 */
  pets: Pet[];
  /** 已出战的幻兽ID数组 */
  deployedPetIds: string[];
  /** 玩家等级 */
  playerLevel: number;
  /** 背包物品数组 */
  inventory: InventoryItem[];
  /** 更新幻兽数据回调 */
  onUpdatePet: (petId: string, updatedPet: Pet) => void;
  /** 移除幻兽数据回调 */
  onRemovePet: (petId: string) => void;
  /** 更新背包物品回调 */
  onUpdateInventory: (inventory: InventoryItem[]) => void;
}

/**
 * 幻兽幻化主界面组件
 * 用于执行幻兽幻化操作，提升主幻兽的属性成长率
 * 采用全屏页面形式，移动端优先设计
 *
 * @param props - 组件属性
 */
const PetFusionModal: React.FC<PetFusionModalProps> = ({
  isVisible,
  onClose,
  pets,
  deployedPetIds,
  playerLevel,
  inventory,
  onUpdatePet,
  onRemovePet,
  onUpdateInventory,
}) => {
  // ==================== 状态管理 ====================

  /** 主幻兽状态 */
  const [mainPet, setMainPet] = useState<Pet | null>(null);

  /** 副幻兽状态 */
  const [subPet, setSubPet] = useState<Pet | null>(null);

  /** 幻化设置状态 */
  const [settings, setSettings] = useState<FusionSettings>({
    autoAddSubPet: false,
    autoUseExpOrb: false,
    autoFusion: false,
  });

  /** 是否显示幻兽选择弹窗 */
  const [showSelectModal, setShowSelectModal] = useState(false);

  /** 选择类型（主幻兽或副幻兽） */
  const [selectType, setSelectType] = useState<'main' | 'sub'>('main');

  /** 是否显示帮助弹窗 */
  const [showHelpModal, setShowHelpModal] = useState(false);

  /** 是否显示设置面板 */
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);

  /** 是否显示结果弹窗 */
  const [showResultModal, setShowResultModal] = useState(false);

  /** 幻化结果文本 */
  const [fusionResult, setFusionResult] = useState('');

  // ==================== 页面打开时同步最新数据 ====================

  /**
   * 当页面打开或幻兽数据变化时，同步主幻兽和副幻兽的最新数据
   * 保留用户之前的选择，同时确保数据是最新的
   * 如果幻兽被删除（如被放生），则自动清空
   */
  useEffect(() => {
    if (isVisible) {
      // 同步主幻兽数据
      if (mainPet) {
        const latestMainPet = pets.find(pet => pet.id === mainPet.id);
        setMainPet(latestMainPet || null);
      }
      // 同步副幻兽数据
      if (subPet) {
        const latestSubPet = pets.find(pet => pet.id === subPet.id);
        setSubPet(latestSubPet || null);
      }
    }
  }, [isVisible, pets]);

  // ==================== 计算属性 ====================

  /**
   * 计算副幻兽评分要求
   * 根据主幻兽评分动态计算
   */
  const scoreRequirement = useMemo(() => {
    if (!mainPet) return 0;

    return calculateScoreRequirement(mainPet.pz);
  }, [mainPet]);

  /**
   * 检查背包中是否有满经验球
   */
  const hasFullExpOrb = useMemo(() => {
    return inventory.some(item => item.name === '满经验球' && (item.quantity || 0) > 0);
  }, [inventory]);

  /**
   * 检查幻化条件
   * 返回是否可以幻化以及错误信息
   */
  const fusionCheck = useMemo(() => {
    // 当开启自动使用经验球时，跳过等级检查
    const skipLevelCheck = settings.autoUseExpOrb && hasFullExpOrb;

    return checkFusionConditions(mainPet, subPet, skipLevelCheck);
  }, [mainPet, subPet, settings.autoUseExpOrb, hasFullExpOrb]);

  /**
   * 获取需要排除的幻兽ID列表
   * 选择主幻兽时排除副幻兽，选择副幻兽时排除主幻兽
   */
  const excludePetIds = useMemo(() => {
    const ids: string[] = [];
    if (selectType === 'main' && subPet) {
      ids.push(subPet.id);
    }
    if (selectType === 'sub' && mainPet) {
      ids.push(mainPet.id);
    }

    return ids;
  }, [selectType, mainPet, subPet]);

  // ==================== 自动幻化功能 ====================

  /**
   * 自动放入副幻兽功能
   * 当开启自动放入副幻兽且选择了主幻兽且没有副幻兽时，自动执行放入
   */
  useEffect(() => {
    // 检查是否开启自动放入副幻兽
    if (!settings.autoAddSubPet) {
      return;
    }

    // 检查是否已选择主幻兽
    if (!mainPet) {
      return;
    }

    // 检查是否已有副幻兽（避免重复放入）
    if (subPet) {
      return;
    }

    // 执行自动放入副幻兽（延迟执行，避免状态更新冲突）
    const timer = setTimeout(() => {
      handleAutoAddSubPet();
    }, 300);

    return () => clearTimeout(timer);
    // 注意：handleAutoAddSubPet 依赖 mainPet、pets、scoreRequirement、deployedPetIds
    // 这些变化时需要重新执行，但函数本身是稳定的，所以不加入依赖
  }, [settings.autoAddSubPet, mainPet, subPet]);

  /**
   * 自动幻化功能
   * 当开启自动幻化且玩家等级 >= 40 且满足幻化条件时，自动执行幻化
   */
  useEffect(() => {
    // 检查是否开启自动幻化
    if (!settings.autoFusion) {
      return;
    }

    // 检查玩家等级是否 >= 40
    if (playerLevel < 40) {
      // 提示玩家等级不足
      setFusionResult(`⚠️ 玩家等级未达到40级，无法使用自动幻化功能\n\n当前等级：${playerLevel}级\n需要等级：40级`);
      setShowResultModal(true);
      // 自动取消自动幻化的勾选
      setSettings(prev => ({ ...prev, autoFusion: false }));

      return;
    }

    // 检查是否已选择主幻兽和副幻兽
    if (!mainPet || !subPet) {
      return;
    }

    // 直接调用检查函数，避免依赖 useMemo 计算结果的时序问题
    const skipLevelCheck = settings.autoUseExpOrb && hasFullExpOrb;
    const checkResult = checkFusionConditions(mainPet, subPet, skipLevelCheck);

    // 检查是否满足幻化条件
    if (!checkResult.canFuse) {
      return;
    }

    // 执行自动幻化（延迟执行，避免状态更新冲突）
    const timer = setTimeout(() => {
      handleFusion();
    }, 500);

    return () => clearTimeout(timer);
  }, [settings.autoFusion, playerLevel, mainPet, subPet, settings.autoUseExpOrb, hasFullExpOrb]);

  // ==================== 事件处理函数 ====================

  /**
   * 处理点击遮罩层关闭页面
   * @param e 鼠标事件对象
   */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  /**
   * 打开幻兽选择弹窗
   * @param type 选择类型（main=主幻兽，sub=副幻兽）
   */
  const openSelectModal = (type: 'main' | 'sub') => {
    setSelectType(type);
    setShowSelectModal(true);
  };

  /**
   * 处理幻兽选择
   * @param pet 被选中的幻兽
   */
  const handlePetSelect = (pet: Pet) => {
    if (selectType === 'main') {
      setMainPet(pet);
    } else {
      setSubPet(pet);
    }
    setShowSelectModal(false);
  };

  /**
   * 清空主幻兽
   */
  const clearMainPet = () => {
    setMainPet(null);
  };

  /**
   * 清空副幻兽
   */
  const clearSubPet = () => {
    setSubPet(null);
  };

  /**
   * 使用满经验球升级幻兽到50级以上
   * @param pet 需要升级的幻兽
   * @returns 升级后的幻兽，如果无法升级则返回原幻兽
   */
  const useExpOrbToLevelUp = (pet: Pet): { success: boolean; pet: Pet; message?: string } => {
    // 检查幻兽等级是否已经 >= 50
    if (pet.dj >= 50) {
      return { success: true, pet };
    }

    // 检查背包中是否有满经验球
    const expOrbIndex = inventory.findIndex(item => item.name === '满经验球' && (item.quantity || 0) > 0);
    if (expOrbIndex === -1) {
      return { success: false, pet, message: '背包中没有满经验球' };
    }

    // 使用满经验球（给予27000经验，幻兽获得双倍即54000经验）
    // 注意：在幻化场景下，临时清除 predj 避免顿悟机制干扰，并跳过等级限制
    const petForUpgrade = { ...pet, predj: 0, prejy: 0, premjy: 0 };
    const result = gainExperience(petForUpgrade, 27000, playerLevel, true);

    // 检查是否升级到50级或以上（50级就可以幻化）
    if (result.pet.dj < 50) {
      return { success: false, pet: result.pet, message: `经验球经验不足以升级到50级（当前${result.pet.dj}级）` };
    }

    // 减少背包中的满经验球数量
    const newInventory = [...inventory];
    if (newInventory[expOrbIndex].quantity > 1) {
      newInventory[expOrbIndex] = {
        ...newInventory[expOrbIndex],
        quantity: newInventory[expOrbIndex].quantity - 1,
      };
    } else {
      newInventory.splice(expOrbIndex, 1);
    }
    onUpdateInventory(newInventory);

    return { success: true, pet: result.pet, message: `使用满经验球，幻兽升级到${result.pet.dj}级` };
  };

  /**
   * 执行幻化操作
   * 检查条件后执行幻化，显示结果弹窗
   */
  const handleFusion = () => {
    // 再次检查条件（防止状态变化）
    if (!fusionCheck.canFuse) {
      return;
    }

    // 如果开启自动使用经验球且主幻兽等级 < 50，先使用经验球升级
    let currentMainPet = mainPet;
    if (settings.autoUseExpOrb && mainPet && mainPet.dj < 50) {
      const levelUpResult = useExpOrbToLevelUp(mainPet);
      if (!levelUpResult.success) {
        // 升级失败，显示错误信息
        setFusionResult(`❌ 幻化失败：${levelUpResult.message || '无法使用经验球升级幻兽'}`);
        setShowResultModal(true);

        return;
      }
      // 更新主幻兽
      currentMainPet = levelUpResult.pet;
      onUpdatePet(mainPet.id, levelUpResult.pet);
    }

    // 执行幻化（需要深拷贝主幻兽，避免直接修改原对象）
    const mainPetCopy = JSON.parse(JSON.stringify(currentMainPet));
    const result = executeFusion(mainPetCopy, subPet!);

    // 显示结果弹窗
    setFusionResult(result.result);
    setShowResultModal(true);

    // 更新主幻兽数据（父组件和本地状态都需要更新）
    onUpdatePet(currentMainPet!.id, result.updatedPet);
    setMainPet(result.updatedPet);

    // 移除副幻兽数据
    onRemovePet(subPet!.id);

    // 清空副幻兽选择
    setSubPet(null);
  };

  /**
   * 自动放入副幻兽
   * 优先选择符合要求的评分最低的奇异兽
   * 没有奇异兽则选择符合要求的评分最低的同类型幻兽
   */
  const handleAutoAddSubPet = () => {
    if (!mainPet) {
      return;
    }

    // 筛选符合条件的幻兽的通用条件检查函数
    const isEligible = (pet: Pet) => {
      // 评分必须满足要求
      const meetsScoreRequirement = pet.pz >= scoreRequirement;
      // 不能是已选的主幻兽
      const isNotMainPet = pet.id !== mainPet.id;
      // 不能是已出战的幻兽
      const isNotDeployed = !deployedPetIds.includes(pet.id);

      return meetsScoreRequirement && isNotMainPet && isNotDeployed;
    };

    // 1. 优先查找符合条件的奇异兽，按评分升序排序
    const strangePets = pets
      .filter(pet => pet.hs_name === '奇异兽' && isEligible(pet))
      .sort((a, b) => a.pz - b.pz);

    // 如果有符合条件的奇异兽，选择评分最低的
    if (strangePets.length > 0) {
      setSubPet(strangePets[0]);

      return;
    }

    // 2. 没有奇异兽，查找符合条件的同类型幻兽，按评分升序排序
    const sameTypePets = pets
      .filter(pet => pet.hs_name === mainPet.hs_name && isEligible(pet))
      .sort((a, b) => a.pz - b.pz);

    // 如果有符合条件的同类型幻兽，选择评分最低的
    if (sameTypePets.length > 0) {
      setSubPet(sameTypePets[0]);
    }
  };

  /**
   * 关闭结果弹窗
   */
  const closeResultModal = () => {
    setShowResultModal(false);
    setFusionResult('');
  };

  /**
   * 处理设置变更
   * @param newSettings 新的设置状态
   */
  const handleSettingsChange = (newSettings: FusionSettings) => {
    setSettings(newSettings);
  };

  // ==================== 渲染函数 ====================

  /**
   * 渲染幻兽框
   * @param type 幻兽类型（main=主幻兽，sub=副幻兽）
   * @param pet 幻兽对象
   */
  const renderPetSlot = (type: 'main' | 'sub', pet: Pet | null) => {
    const isMain = type === 'main';
    const emptyText = isMain ? '请放入主幻兽' : '请放入副幻兽';

    return (
      <div
        className={`fusion-pet-slot ${pet ? 'has-pet' : 'empty'} ${isMain ? 'main' : 'sub'}`}
        onClick={() => openSelectModal(type)}
      >
        {pet ? (
          <>
            {/* 幻兽信息 */}
            <div className="fusion-pet-info">
              {/* 幻兽头像 */}
              <div className="fusion-pet-avatar">
                <img className="fusion-pet-avatar-img" src={getPetAvatar(pet.hs_name)} alt={pet.hs_name} />
              </div>

              {/* 幻兽详情 */}
              <div className="fusion-pet-details">
                {/* 幻兽名称 */}
                <div className="fusion-pet-name-row">
                  <span
                    className="fusion-pet-name"
                    style={{ color: getPetQualityColor(pet.qualityTitle) }}
                  >
                    {pet.othername}
                  </span>
                </div>

                {/* 幻兽属性 */}
                <div className="fusion-pet-attrs">
                  <span className="fusion-pet-type">{pet.hs_name}</span>
                  <span className="fusion-pet-level">Lv.{pet.dj}</span>
                </div>

                {/* 品质和评分 */}
                <div className="fusion-pet-meta">
                  <span
                    className="fusion-pet-quality"
                    style={{ backgroundColor: getPetQualityColor(pet.qualityTitle) }}
                  >
                    {pet.qualityTitle}
                  </span>
                  <span className="fusion-pet-score">评分:{pet.pz}</span>
                </div>
              </div>
            </div>

            {/* 清空按钮 */}
            <button
              className="fusion-pet-clear"
              onClick={(e) => {
                e.stopPropagation();
                if (isMain) {
                  clearMainPet();
                } else {
                  clearSubPet();
                }
              }}
              aria-label="清空"
            >
              ×
            </button>
          </>
        ) : (
          // 空状态
          <div className="fusion-pet-empty">
            <span className="fusion-pet-empty-icon">🐾</span>
            <span className="fusion-pet-empty-text">{emptyText}</span>
          </div>
        )}
      </div>
    );
  };

  // 如果页面不可见，则不渲染
  if (!isVisible) return null;

  return (
    <div className="pet-fusion-page-overlay" onClick={handleOverlayClick}>
      <div className="pet-fusion-page-container">
        {/* 顶部占位框 */}
        <div className="page-top-placeholder"></div>

        {/* 页面顶部标题栏 */}
        <div className="pet-fusion-page-header">
          <h2 className="pet-fusion-page-title">🔮 幻兽幻化</h2>
          <button
            className="pet-fusion-page-close-button"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* 主要内容区域 */}
        <div className="pet-fusion-page-content">
          {/* 上部：幻兽选择区域 */}
          <div className="pet-fusion-pets-section">
            {/* 主幻兽框 */}
            <div className="pet-fusion-pet-wrapper">
              <div className="pet-fusion-pet-label">主幻兽</div>
              {renderPetSlot('main', mainPet)}
            </div>

            {/* 幻化箭头图标 */}
            <div className="pet-fusion-arrow">
              <span>⚔️</span>
            </div>

            {/* 副幻兽框 */}
            <div className="pet-fusion-pet-wrapper">
              <div className="pet-fusion-pet-label">副幻兽</div>
              {renderPetSlot('sub', subPet)}
            </div>
          </div>

          {/* 中部：评分显示区域 */}
          <div className="pet-fusion-scores-section">
            <div className="pet-fusion-score-item">
              <span className="pet-fusion-score-label">主幻兽评分</span>
              <span className="pet-fusion-score-value main">
                {mainPet ? mainPet.pz : '-'}
              </span>
            </div>
            <div className="pet-fusion-score-item">
              <span className="pet-fusion-score-label">副幻兽评分</span>
              <span className="pet-fusion-score-value sub">
                {subPet ? subPet.pz : '-'}
              </span>
            </div>
            <div className="pet-fusion-score-item">
              <span className="pet-fusion-score-label">评分要求</span>
              <span className="pet-fusion-score-value requirement">
                {scoreRequirement > 0 ? `≥${scoreRequirement}` : '无要求'}
              </span>
            </div>
          </div>

          {/* 错误提示区域 */}
          {!fusionCheck.canFuse && fusionCheck.errors.length > 0 && (
            <div className="pet-fusion-errors-section">
              {fusionCheck.errors.map((error, index) => (
                <div key={index} className="pet-fusion-error-item">
                  ⚠️ {error}
                </div>
              ))}
            </div>
          )}

          {/* 自动使用经验球提示 */}
          {settings.autoUseExpOrb && mainPet && mainPet.dj < 50 && (
            <div className="pet-fusion-info-section">
              <div className="pet-fusion-info-item">
                💡 已开启自动使用经验球，幻化时将消耗1个满经验球升级幻兽
                {!hasFullExpOrb && <span style={{ color: '#ff6b6b' }}>（背包中无满经验球）</span>}
              </div>
            </div>
          )}

          {/* 设置面板（可展开/收起） */}
          {showSettingsPanel && (
            <div className="pet-fusion-settings-section">
              <FusionSettingsPanel
                isVisible={showSettingsPanel}
                settings={settings}
                onSettingsChange={handleSettingsChange}
              />
            </div>
          )}

          {/* 下部：操作按钮区域 */}
          <div className="pet-fusion-actions-section">
            {/* 开始幻化按钮 */}
            <button
              className="pet-fusion-button primary"
              disabled={!fusionCheck.canFuse}
              onClick={handleFusion}
            >
              ⚡ 开始幻化
            </button>

            {/* 辅助按钮组 */}
            <div className="pet-fusion-secondary-actions">
              <button
                className="pet-fusion-button secondary"
                onClick={() => setShowHelpModal(true)}
              >
                ❓ 帮助
              </button>
              <button
                className="pet-fusion-button secondary"
                disabled={!mainPet}
                onClick={handleAutoAddSubPet}
              >
                🔄 自动放入
              </button>
              <button
                className={`pet-fusion-button secondary ${showSettingsPanel ? 'active' : ''}`}
                onClick={() => setShowSettingsPanel(!showSettingsPanel)}
              >
                设置
              </button>
            </div>
          </div>
        </div>

        {/* 幻兽选择弹窗 */}
        <PetSelectModal
          isVisible={showSelectModal}
          onClose={() => setShowSelectModal(false)}
          pets={pets}
          deployedPetIds={deployedPetIds}
          onSelect={handlePetSelect}
          excludePetIds={excludePetIds}
          excludeDeployed={selectType === 'sub'}
          title={selectType === 'main' ? '选择主幻兽' : '选择副幻兽'}
        />

        {/* 帮助弹窗 */}
        <FusionHelpModal
          isVisible={showHelpModal}
          onClose={() => setShowHelpModal(false)}
        />

        {/* 结果弹窗 */}
        <FusionResultModal
          isVisible={showResultModal}
          onClose={closeResultModal}
          result={fusionResult}
        />
      </div>
    </div>
  );
};

export default PetFusionModal;
