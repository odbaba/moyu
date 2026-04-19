/**
 * 幻化设置面板组件
 * 提供幻化相关的自动化设置选项
 * 包含自动放入副幻兽、自动使用经验球、自动幻化等功能开关
 */

import React from 'react';

/**
 * 幻化设置接口
 * 定义幻化自动化的各项设置
 */
export interface FusionSettings {
  autoAddSubPet: boolean; // 自动放入副幻兽
  autoUseExpOrb: boolean; // 自动使用经验球
  autoFusion: boolean; // 自动幻化
}

/**
 * 幻化设置面板属性接口
 */
export interface FusionSettingsPanelProps {
  isVisible: boolean; // 是否显示面板
  settings: FusionSettings; // 当前设置状态
  onSettingsChange: (settings: FusionSettings) => void; // 设置变更回调
}

/**
 * 单个设置选项的配置接口
 */
interface SettingOption {
  key: keyof FusionSettings; // 设置项的键名
  label: string; // 选项名称
  description: string; // 选项说明
}

/**
 * 幻化设置选项配置列表
 * 定义所有可用的设置选项及其说明
 */
const SETTING_OPTIONS: SettingOption[] = [
  {
    key: 'autoAddSubPet',
    label: '自动放入副幻兽',
    description: '幻化时自动选择背包中的幻兽作为副幻兽',
  },
  {
    key: 'autoUseExpOrb',
    label: '自动使用经验球',
    description: '幻化后自动使用背包中的经验球提升经验',
  },
  {
    key: 'autoFusion',
    label: '自动幻化',
    description: '满足条件时自动执行幻化操作',
  },
];

/**
 * 幻化设置面板组件
 * 用于配置幻化相关的自动化选项
 *
 * @param props - 组件属性
 * @param props.isVisible - 是否显示面板
 * @param props.settings - 当前设置状态
 * @param props.onSettingsChange - 设置变更回调函数
 */
const FusionSettingsPanel: React.FC<FusionSettingsPanelProps> = ({
  isVisible,
  settings,
  onSettingsChange,
}) => {
  /**
   * 处理复选框状态变更
   * 更新对应设置项的值并触发回调
   *
   * @param key - 设置项的键名
   * @param checked - 复选框是否选中
   */
  const handleCheckboxChange = (key: keyof FusionSettings, checked: boolean) => {
    // 创建新的设置对象，更新对应项的值
    const newSettings: FusionSettings = {
      ...settings,
      [key]: checked,
    };

    // 触发设置变更回调
    onSettingsChange(newSettings);
  };

  // 如果面板不可见，则不渲染
  if (!isVisible) {
    return null;
  }

  return (
    <div className="fusion-settings-panel">
      {/* 面板标题 */}
      <div className="fusion-settings-header">
        <h3>幻化设置</h3>
      </div>

      {/* 设置选项列表 */}
      <div className="fusion-settings-options">
        {SETTING_OPTIONS.map((option) => (
          <div key={option.key} className="fusion-setting-item">
            {/* 复选框容器 */}
            <label className="fusion-checkbox-wrapper">
              {/* 自定义复选框 */}
              <input
                type="checkbox"
                className="fusion-checkbox"
                checked={settings[option.key]}
                onChange={(e) => handleCheckboxChange(option.key, e.target.checked)}
              />
              {/* 自定义复选框外观 */}
              <span className="fusion-checkbox-custom"></span>
              {/* 选项名称 */}
              <span className="fusion-checkbox-label">{option.label}</span>
            </label>

            {/* 选项说明文字 */}
            <p className="fusion-setting-description">{option.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FusionSettingsPanel;
