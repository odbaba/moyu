import React, { useEffect, useRef } from 'react';

/**
 * 菜单组件属性接口
 * 定义菜单组件接收的参数类型
 */
interface MenuProps {
  /** 菜单是否打开 */
  isOpen: boolean;
  /** 切换菜单打开状态的回调 */
  onToggle: () => void;
  /** 显示大地图的回调 */
  onShowMap: () => void;
  /** 显示角色信息页面的回调 */
  onShowCharacter: () => void;
  /** 显示背包页面的回调 */
  onShowInventory: () => void;
  /** 显示技能页面的回调 */
  onShowSkill: () => void;
  /** 显示幻兽页面的回调 */
  onShowPet: () => void;
  /** 保存游戏的回调 */
  onSaveGame: () => void;
  /** 显示设置页面的回调 */
  onShowSettings: () => void;
  /** 显示帮助页面的回调 */
  onShowHelp: () => void;
}

/**
 * 菜单组件
 * 显示在右下角的菜单按钮和弹出菜单
 * 包含角色信息、幻兽、背包、技能、大地图、保存游戏、设置、帮助等功能入口
 */
const Menu: React.FC<MenuProps> = ({
  isOpen,
  onToggle,
  onShowMap,
  onShowCharacter,
  onShowInventory,
  onShowSkill,
  onShowPet,
  onSaveGame,
  onShowSettings,
  onShowHelp
}) => {
  // 菜单容器引用，用于检测点击是否在菜单外部
  const menuRef = useRef<HTMLDivElement>(null);

  /**
   * 点击菜单外部时关闭菜单
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 如果菜单打开且点击不在菜单容器内部，则关闭菜单
      if (isOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onToggle();
      }
    };

    // 添加全局点击事件监听
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  /**
   * 处理保存游戏点击
   * 保存后关闭菜单
   */
  const handleSaveGame = () => {
    onSaveGame();
    onToggle();
  };

  /**
   * 处理设置按钮点击
   * 打开设置页面后关闭菜单
   */
  const handleShowSettings = () => {
    onShowSettings();
    onToggle();
  };

  /**
   * 处理帮助按钮点击
   * 打开帮助页面后关闭菜单
   */
  const handleShowHelp = () => {
    onShowHelp();
    onToggle();
  };

  return (
    <div className="menu-container" ref={menuRef}>
      {/* 菜单按钮 */}
      <button className="menu-button" onClick={onToggle}>
        ☰
      </button>
      {/* 菜单弹出层 */}
      {isOpen && (
        <div className="menu-popup">
          <button onClick={onShowCharacter}>角色信息</button>
          <button onClick={onShowPet}>幻兽</button>
          <button onClick={onShowInventory}>背包</button>
          <button onClick={onShowSkill}>技能</button>
          <button onClick={onShowMap}>大地图</button>
          <button onClick={handleSaveGame}>保存游戏</button>
          <button onClick={handleShowSettings}>设置</button>
          <button className="help-button" onClick={handleShowHelp}>帮助</button>
        </div>
      )}
    </div>
  );
};

export default Menu;
