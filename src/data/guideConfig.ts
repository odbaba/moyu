/**
 * 引导步骤类型接口
 * 定义每个引导步骤的配置信息
 */
export interface GuideStep {
  /** 步骤唯一标识 */
  id: string;
  /** 目标元素的 CSS 选择器 */
  targetSelector: string;
  /** 引导文字 */
  text: string;
  /** 文字显示位置 */
  position: 'top' | 'bottom' | 'left' | 'right';
  /** 是否仅展示指引不自动派发点击事件（点击仅推进到下一步），默认 false */
  noAutoDispatch?: boolean;
}

/**
 * 引导配置数据
 * 包含游戏中所有新手引导步骤的配置
 *
 * 第一阶段：角色按钮引导
 * 第二阶段：武器栏引导
 * 第三阶段：选择装备引导
 * 第四阶段：装备确认引导
 * 第五阶段：关闭角色页面引导
 * 第六阶段：前往卡萨诺城引导
 * 第七阶段：装备打造师引导
 * 第八阶段：装备精炼引导
 * 第九阶段：选择宝石引导
 * 第十阶段：宝石列表说明
 * 第十一阶段：关闭宝石选择弹窗
 * 第十二阶段：关闭装备精炼弹窗
 * 第十三阶段：幻兽按钮引导
 * 第十四阶段：出战幻兽说明
 * 第十五阶段：关闭幻兽页面
 * 第十六阶段：幻兽幻化师引导
 * 第十七阶段：关于幻化引导
 * 第十八阶段：幻化帮助内容说明
 * 第十九阶段：关闭信息弹窗
 * 第二十阶段：前往皇宫引导
 * 第二十一阶段：日常任务官引导
 * 第二十二阶段：日常任务说明
 * 第二十三阶段：引导结束
 * 第二十四阶段：菜单按钮引导
 * 第二十五阶段：帮助按钮引导
 */
export const GUIDE_STEPS: GuideStep[] = [
  {
    id: 'guide-character-button',
    targetSelector: '.interact-button--char',
    text: '点击进入角色面板',
    position: 'bottom'
  },
  {
    id: 'guide-weapon-slot',
    targetSelector: '.equipment-grid-compact .equipment-card-compact:first-child',
    text: '点击装备武器',
    position: 'bottom'
  },
  {
    id: 'guide-first-equipment-item',
    targetSelector: '.equipment-select-modal-content .inventory-list-item:first-child',
    text: '点击选择武器',
    position: 'bottom'
  },
  {
    id: 'guide-equip-button',
    targetSelector: '.equipment-detail-modal-content .equip-button',
    text: '点击装备武器',
    position: 'bottom'
  },
  {
    id: 'guide-close-button',
    targetSelector: '.character-page-close-button',
    text: '点击关闭按钮，回到游戏主页',
    position: 'bottom'
  },
  {
    id: 'guide-kasanuocheng',
    targetSelector: '[data-location-id="kasanuocheng"]',
    text: '点击去往卡萨诺城',
    position: 'bottom'
  },
  {
    id: 'guide-equipment-refiner',
    targetSelector: '[data-interactable-id="npc_equipment_refiner"]',
    text: '装备打造师可以精炼你的装备，可提升装备品质，魔魂等级，装备开洞，镶嵌宝石，装备升级',
    position: 'top'
  },
  {
    id: 'guide-refine-option',
    targetSelector: '.npc-modal .option-button[data-option-index="0"]',
    text: '点击进入装备精炼页面',
    position: 'bottom'
  },
  {
    id: 'guide-gem-slot',
    targetSelector: '.refine-slot.gem-slot',
    text: '点击选择宝石',
    position: 'bottom'
  },
  {
    id: 'guide-gem-list',
    targetSelector: '.selection-list',
    text: '灵魂晶石可以概率提升装备的品质，增加装备的战斗力，魔魂晶石可以概率提升装备的魔魂等级增加装备的额外属性，幻魔晶石可以概率提升装备的使用等级，增加装备的基础属性',
    position: 'top',
    noAutoDispatch: true
  },
  {
    id: 'guide-selection-close',
    targetSelector: '.selection-close',
    text: '关闭',
    position: 'bottom'
  },
  {
    id: 'guide-refine-close',
    targetSelector: '.refine-close-modal',
    text: '关闭',
    position: 'bottom'
  },
  {
    id: 'guide-pet-button',
    targetSelector: '.interact-button--pet',
    text: '打开幻兽页面',
    position: 'bottom'
  },
  {
    id: 'guide-deployed-pets',
    targetSelector: '.deployed-pets-container',
    text: '合体中的幻兽可以增加角色的攻击、防御属性，并且在战斗中可以替角色承担伤害',
    position: 'top',
    noAutoDispatch: true
  },
  {
    id: 'guide-pet-page-close',
    targetSelector: '.pet-page-close-button',
    text: '关闭',
    position: 'bottom'
  },
  {
    id: 'guide-pet-fusion-master',
    targetSelector: '[data-interactable-id="npc_pet_fusion_master"]',
    text: '点击幻兽幻化师查看幻兽幻化功能',
    position: 'top'
  },
  {
    id: 'guide-about-fusion',
    targetSelector: '.npc-modal .option-button[data-option-index="1"]',
    text: '点击查看幻兽幻化帮助',
    position: 'bottom'
  },
  {
    id: 'guide-fusion-help-content',
    targetSelector: '.info-modal-content',
    text: '幻化可以根据副幻兽属性，大幅增加主幻兽的属性成长和基础属性',
    position: 'bottom',
    noAutoDispatch: true
  },
  {
    id: 'guide-info-modal-close',
    targetSelector: '.modal-content .close-modal',
    text: '关闭',
    position: 'bottom'
  },
  {
    id: 'guide-huanggong',
    targetSelector: '[data-location-id="huanggong"]',
    text: '点击去往皇宫',
    position: 'bottom'
  },
  {
    id: 'guide-daily-task',
    targetSelector: '[data-interactable-id="npc_daily_task"]',
    text: '点击查看日常任务',
    position: 'top'
  },
  {
    id: 'guide-daily-task-description',
    targetSelector: '.npc-modal .modal-description',
    text: '周一周二是提交宝石任务；周三周四是提交幻兽任务；周五是进入边境袭击敌人任务，可获得大量战功；周六是PK赛任务；周日是地下城任务，可以营救国王；',
    position: 'bottom',
    noAutoDispatch: true
  },
  {
    id: 'guide-final-close',
    targetSelector: '.npc-modal .close-modal',
    text: '你已了解游戏基本内容，请开始游戏自行探索吧',
    position: 'bottom'
  },
  {
    id: 'guide-menu-button',
    targetSelector: '.menu-button',
    text: '不知道干什么的时候，可以点击右下角菜单',
    position: 'top'
  },
  {
    id: 'guide-help-button',
    targetSelector: '.menu-popup .help-button',
    text: '查看帮助，有更精确的指引',
    position: 'left',
  }
];
