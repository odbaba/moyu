import React from 'react';

// 导入敌人相关类型定义
import type { EnemyData, EnemyInteractable } from '../../types';

/**
 * 敌人弹窗组件属性接口
 * @property isVisible - 是否显示弹窗
 * @property onClose - 关闭弹窗的回调函数
 * @property onAttack - 攻击按钮的回调函数
 * @property enemyData - 敌人交互数据，包含敌人列表和描述信息
 */
interface EnemyModalProps {
  isVisible: boolean;
  onClose: () => void;
  onAttack: () => void;
  enemyData: EnemyInteractable;
}

/**
 * 敌人弹窗组件
 * 显示敌人详细信息，提供攻击和离开按钮
 * 用于展示敌人列表及其属性（HP、攻击力、防御力等）
 */
const EnemyModal: React.FC<EnemyModalProps> = ({
  isVisible,
  onClose,
  onAttack,
  enemyData
}) => {
  // 如果不可见则返回null，不渲染任何内容
  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* 关闭按钮，点击调用onClose关闭弹窗 */}
        <button className="close-modal" onClick={onClose}>×</button>

        {/* 标题区域，显示敌人名称 */}
        <h3>{enemyData.name}</h3>

        {/* 描述区域，显示敌人描述文本 */}
        <div className="modal-description">
          <p>{enemyData.description}</p>
        </div>

        {/* 敌人列表展示区域 */}
        <div className="enemy-list" style={{ marginTop: '15px' }}>
          {enemyData.enemies.map((enemy: EnemyData, index: number) => (
            <div
              key={enemy.id || index}
              className="enemy-item"
              style={{
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                border: '1px solid #ddd'
              }}
            >
              {/* 敌人名称 */}
              <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>
                {enemy.name}
              </div>

              {/* 敌人属性展示 */}
              <div style={{ display: 'flex', gap: '15px', fontSize: '12px', color: '#666' }}>
                {/* HP生命值 */}
                <span>❤️ HP: {enemy.maxHp}</span>
                {/* 攻击力范围 */}
                <span>⚔️ 攻击: {enemy.attackMin}~{enemy.attackMax}</span>
                {/* 防御力 */}
                <span>🛡️ 防御: {enemy.defense}</span>
              </div>

              {/* 敌人描述（如果有） */}
              {enemy.description && (
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#888' }}>
                  {enemy.description}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 按钮区域，使用横向布局 */}
        <div className="modal-options" style={{ flexDirection: 'row', gap: '10px' }}>
          {/* 攻击按钮，红色背景，点击后执行攻击并关闭弹窗 */}
          <button
            className="option-button"
            style={{
              backgroundColor: '#ff4444',
              borderColor: '#ff6b6b',
              flex: 1
            }}
            onClick={() => {
              onAttack();
              onClose();
            }}
          >
            ⚔️ 攻击
          </button>

          {/* 离开按钮，默认样式，点击关闭弹窗 */}
          <button
            className="option-button"
            style={{ flex: 1 }}
            onClick={onClose}
          >
            离开
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnemyModal;
