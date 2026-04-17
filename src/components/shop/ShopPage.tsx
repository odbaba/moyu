/**
 * 商店页面组件
 * 提供购买和出售物品的功能
 * 复用背包系统的物品网格组件
 */

import './shop.css';

import React, { useState } from 'react';

import { getShopConfig } from '../../data/shopData';
import type { InventoryItem, Pet, PlayerResources, ShopItem, ShopType } from '../../types';
import {
  calculateSellPrice,
  canAffordPurchase,
  formatCurrency,
  generateRandomWeapon,
  generateShopPet,
  purchaseItem,
  sellItem,
} from '../../utils/shopUtils';

/**
 * 商店物品槽位组件属性接口
 */
interface ShopItemSlotProps {
  item: ShopItem | InventoryItem;
  mode: 'buy' | 'sell';
  shopType: ShopType;
  isSelected: boolean;
  onItemClick: (item: ShopItem | InventoryItem) => void;
}

/**
 * 商店物品槽位组件
 * 显示物品图标、名称和价格
 * 支持图片和emoji图标
 */
const ShopItemSlot: React.FC<ShopItemSlotProps> = ({
  item,
  mode,
  shopType,
  isSelected,
  onItemClick,
}) => {
  const [imageError, setImageError] = useState(false);

  /**
   * 处理图片加载失败
   */
  const handleImageError = () => {
    setImageError(true);
  };

  /**
   * 获取物品图片路径
   */
  const getItemImagePath = (): string | null => {
    if ('imagePath' in item && item.imagePath) {
      return item.imagePath;
    }

    return null;
  };

  /**
   * 渲染物品图标
   * 有图片路径且图片未加载失败时显示图片，否则显示emoji
   */
  const renderItemIcon = () => {
    const imagePath = getItemImagePath();

    if (imagePath && !imageError) {
      return (
        <img
          src={imagePath}
          alt={item.name}
          className="shop-item-image"
          onError={handleImageError}
        />
      );
    }

    return (
      <span className="shop-item-icon">
        {item.icon}
      </span>
    );
  };

  return (
    <div
      className={`shop-item-slot ${isSelected ? 'selected' : ''}`}
      onClick={() => onItemClick(item)}
    >
      <div className="shop-item-icon-wrapper">
        {renderItemIcon()}
      </div>
      <div className="shop-item-name">{item.name}</div>
      {mode === 'buy' && (
        <div className="shop-item-price">
          {shopType === 'gold' ? (
            <span className="price-gold">💰 {formatCurrency((item as ShopItem).priceGold)}</span>
          ) : (
            <span className="price-magic-stone">💎 {formatCurrency((item as ShopItem).priceMagicStone)}</span>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * 商店页面组件属性接口
 */
interface ShopPageProps {
  /** 商店类型 */
  shopType: ShopType;
  /** 玩家资源 */
  playerResources: PlayerResources;
  /** 背包物品列表 */
  inventoryItems: InventoryItem[];
  /** 背包最大格子数 */
  maxSlots?: number;
  /** 幻兽列表 */
  pets?: Pet[];
  /** 幻兽背包最大格子数 */
  maxPetSlots?: number;
  /** 购买物品回调 */
  onPurchase: (itemId: string, quantity: number, goldSpent: number, magicStoneSpent: number) => void;
  /** 购买幻兽数回调 */
  onPurchasePet: (pet: Pet, goldSpent: number, magicStoneSpent: number) => void;
  /** 出售物品回调 */
  onSell: (itemId: string, quantity: number, goldEarned: number, magicStoneEarned: number) => void;
  /** 关闭商店回调 */
  onClose: () => void;
}

/**
 * 商店页面组件
 * 实现购买和出售物品的功能
 */
const ShopPage: React.FC<ShopPageProps> = ({
  shopType,
  playerResources,
  inventoryItems,
  maxSlots = 1000,
  pets = [],
  maxPetSlots = 100,
  onPurchase,
  onPurchasePet,
  onSell,
  onClose,
}) => {
  // 商店配置
  const shopConfig = getShopConfig(shopType);

  // 当前模式：buy（购买）或 sell（出售）
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');

  // 选中的物品
  const [selectedItem, setSelectedItem] = useState<ShopItem | InventoryItem | null>(null);

  // 购买数量
  const [quantity, setQuantity] = useState(1);

  // 提示消息
  const [message, setMessage] = useState<string | null>(null);

  /**
   * 处理物品点击事件
   */
  const handleItemClick = (item: ShopItem | InventoryItem) => {
    setSelectedItem(item);
    setQuantity(1);
    setMessage(null);
  };

  /**
   * 处理购买操作
   * 无论成功或失败，都立即关闭弹窗，避免遮挡提示信息
   */
  const handlePurchase = () => {
    if (!selectedItem || mode !== 'buy') return;

    const shopItem = selectedItem as ShopItem;

    // 先关闭弹窗，避免遮挡提示信息
    setSelectedItem(null);

    // 检查是否是随机武器
    if (shopItem.id === 'random_weapon') {
      // 生成随机武器
      const weapon = generateRandomWeapon();
      // 这里需要调用父组件的添加装备函数
      // 暂时显示提示
      setMessage(`获得随机装备：${weapon.name}（${weapon.quality}）`);

      return;
    }

    // 检查是否是幻兽
    if (shopItem.type === 'pet') {
      // 检查幻兽背包是否已满
      if (pets.length >= maxPetSlots) {
        setMessage('幻兽背包已满，无法购买幻兽');

        return;
      }

      // 检查是否有足够的货币
      if (!canAffordPurchase(playerResources.gold, playerResources.magicStone, shopItem, 1, shopType)) {
        setMessage('货币不足，无法购买');

        return;
      }

      // 根据商品ID生成幻兽
      const pet = generateShopPet(shopItem.id);
      if (!pet) {
        setMessage('无效的幻兽商品');

        return;
      }

      // 调用父组件的购买幻兽回调函数
      onPurchasePet(pet, shopItem.priceGold, shopItem.priceMagicStone);

      return;
    }

    // 普通物品购买
    const result = purchaseItem(
      shopItem,
      quantity,
      shopType,
      playerResources,
      inventoryItems,
      maxSlots
    );

    if (result.success) {
      onPurchase(
        result.itemId!,
        result.quantity!,
        result.goldSpent || 0,
        result.magicStoneSpent || 0
      );
      setMessage(result.message);
    } else {
      setMessage(result.message);
    }
  };

  /**
   * 处理出售操作
   * 无论成功或失败，都立即关闭弹窗，避免遮挡提示信息
   */
  const handleSell = () => {
    if (!selectedItem || mode !== 'sell') return;

    const inventoryItem = selectedItem as InventoryItem;

    // 先关闭弹窗，避免遮挡提示信息
    setSelectedItem(null);

    const result = sellItem(inventoryItem, quantity);

    if (result.success) {
      onSell(result.itemId!, result.quantity!, result.goldEarned || 0, result.magicStoneEarned || 0);
      setMessage(result.message);
    } else {
      setMessage(result.message);
    }
  };

  /**
   * 关闭详情弹窗
   */
  const handleCloseDetail = () => {
    setSelectedItem(null);
    setMessage(null);
  };

  /**
   * 切换到购买模式
   */
  const handleSwitchToBuy = () => {
    setMode('buy');
    setSelectedItem(null);
    setMessage(null);
  };

  /**
   * 切换到出售模式
   */
  const handleSwitchToSell = () => {
    setMode('sell');
    setSelectedItem(null);
    setMessage(null);
  };

  /**
   * 渲染物品网格
   */
  const renderItemGrid = () => {
    const items = mode === 'buy' ? shopConfig.items : inventoryItems;

    return (
      <div className="shop-item-grid">
        {items.map((item) => (
          <ShopItemSlot
            key={item.id}
            item={item}
            mode={mode}
            shopType={shopType}
            isSelected={selectedItem?.id === item.id}
            onItemClick={handleItemClick}
          />
        ))}
      </div>
    );
  };

  /**
   * 渲染物品详情弹窗
   */
  const renderDetailModal = () => {
    if (!selectedItem) return null;

    const isBuying = mode === 'buy';
    const shopItem = isBuying ? (selectedItem as ShopItem) : null;
    const inventoryItem = isBuying ? null : (selectedItem as InventoryItem);

    // 计算价格
    // 购买模式：使用商店价格
    // 出售模式：使用 calculateSellPrice 计算物品价值的75%
    const buyPrice = isBuying
      ? shopType === 'gold'
        ? shopItem!.priceGold * quantity
        : shopItem!.priceMagicStone * quantity
      : 0;

    const sellPriceResult = !isBuying && inventoryItem
      ? calculateSellPrice({ ...inventoryItem, quantity })
      : { gold: 0, magicStone: 0 };

    // 检查是否可以购买
    const canBuy = isBuying
      ? canAffordPurchase(
        playerResources.gold,
        playerResources.magicStone,
          shopItem!,
          quantity,
          shopType
      )
      : true;

    /**
     * 获取物品图片路径
     */
    const getItemImagePath = (): string | null => {
      if ('imagePath' in selectedItem && selectedItem.imagePath) {
        return selectedItem.imagePath;
      }

      return null;
    };

    /**
     * 渲染物品图标
     */
    const renderItemIcon = () => {
      const imagePath = getItemImagePath();

      if (imagePath) {
        return (
          <img
            src={imagePath}
            alt={selectedItem.name}
            className="shop-detail-image"
            onError={(e) => {
              // 图片加载失败时显示emoji
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.innerHTML = `<span class="shop-detail-icon-emoji">${selectedItem.icon}</span>`;
              }
            }}
          />
        );
      }

      return (
        <span className="shop-detail-icon-emoji">
          {selectedItem.icon}
        </span>
      );
    };

    return (
      <div className="modal-overlay" onClick={handleCloseDetail}>
        <div className="modal-content shop-detail-modal" onClick={(e) => e.stopPropagation()}>
          <button className="close-modal" onClick={handleCloseDetail}>×</button>

          <div className="shop-detail-header">
            <div className="shop-detail-icon-wrapper">
              {renderItemIcon()}
            </div>
            <div className="shop-detail-info">
              <h3>{selectedItem.name}</h3>
              <p className="shop-detail-type">
                {isBuying ? shopItem!.type : inventoryItem!.type}
              </p>
            </div>
          </div>

          <div className="shop-detail-description">
            <p>{selectedItem.description}</p>
          </div>

          <div className="shop-detail-quantity">
            <label>数量：</label>
            <input
              type="number"
              min="1"
              max="99"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))}
            />
          </div>

          <div className="shop-detail-price">
            {isBuying ? (
              <>
                <span>总价：</span>
                {shopType === 'gold' ? (
                  <span className="price-gold">💰 {formatCurrency(buyPrice)}</span>
                ) : (
                  <span className="price-magic-stone">💎 {formatCurrency(buyPrice)}</span>
                )}
              </>
            ) : (
              <>
                <span>出售价格：</span>
                {sellPriceResult.gold > 0 && sellPriceResult.magicStone > 0 ? (
                  <>
                    <span className="price-gold">💰 {formatCurrency(sellPriceResult.gold)}</span>
                    <span className="price-magic-stone"> 💎 {formatCurrency(sellPriceResult.magicStone)}</span>
                  </>
                ) : sellPriceResult.gold > 0 ? (
                  <span className="price-gold">💰 {formatCurrency(sellPriceResult.gold)}</span>
                ) : sellPriceResult.magicStone > 0 ? (
                  <span className="price-magic-stone">💎 {formatCurrency(sellPriceResult.magicStone)}</span>
                ) : (
                  <span>无法出售</span>
                )}
              </>
            )}
          </div>

          {!canBuy && isBuying && (
            <div className="shop-error-message">
              {shopType === 'gold' ? '金币不足' : '魔石不足'}
            </div>
          )}

          <div className="shop-detail-buttons">
            <button className="cancel-button" onClick={handleCloseDetail}>
              取消
            </button>
            {isBuying ? (
              <button
                className="confirm-button"
                onClick={handlePurchase}
                disabled={!canBuy}
              >
                购买
              </button>
            ) : (
              <button className="confirm-button" onClick={handleSell}>
                出售
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="shop-page">
      {/* 商店头部 */}
      <div className="shop-header">
        <h2>{shopConfig.name}</h2>
        <p className="shop-description">{shopConfig.description}</p>
      </div>

      {/* 货币显示 */}
      <div className="shop-currency">
        <div className="currency-item">
          <span className="currency-icon">💰</span>
          <span className="currency-label">金币：</span>
          <span className="currency-value">{formatCurrency(playerResources.gold)}</span>
        </div>
        <div className="currency-item">
          <span className="currency-icon">💎</span>
          <span className="currency-label">魔石：</span>
          <span className="currency-value">{formatCurrency(playerResources.magicStone)}</span>
        </div>
      </div>

      {/* 模式切换按钮 */}
      <div className="shop-mode-buttons">
        <button
          className={`mode-button ${mode === 'buy' ? 'active' : ''}`}
          onClick={handleSwitchToBuy}
        >
          购买物品
        </button>
        {shopType === 'gold' && (
          <button
            className={`mode-button ${mode === 'sell' ? 'active' : ''}`}
            onClick={handleSwitchToSell}
          >
            出售物品
          </button>
        )}
        <button className="close-button" onClick={onClose}>
          关闭
        </button>
      </div>

      {/* 提示消息 */}
      {message && (
        <div className="shop-message">
          {message}
        </div>
      )}

      {/* 物品网格 */}
      {renderItemGrid()}

      {/* 物品详情弹窗 */}
      {renderDetailModal()}
    </div>
  );
};

export default ShopPage;
