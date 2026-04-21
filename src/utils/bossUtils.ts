/**
 * BOSS 工具函数模块
 * 提供 BOSS 刷新判定、敌人数据生成等功能
 */

import { bossSpawnConfigs, bossTemplates } from '../data/bossData';
import type { BossTemplate, EnemyData } from '../types';

/**
 * 刷新结果接口
 * 包含刷新的 BOSS ID 和对应的消息
 */
export interface BossSpawnResult {
  bossId: string; // BOSS 模板 ID
  interactableId: string; // 交互对象 ID
  message: string; // 刷新消息
}

/**
 * 根据概率随机判定是否刷新 BOSS
 * @param spawnChance 刷新概率（0-100）
 * @returns 是否刷新
 */
function rollSpawn(spawnChance: number): boolean {
  // 生成 0-99 的随机数，如果小于刷新概率则刷新
  return Math.floor(Math.random() * 100) < spawnChance;
}

/**
 * 执行所有 BOSS 的刷新判定
 * 根据每个 BOSS 的刷新概率随机决定是否刷新
 *
 * @returns 刷新结果列表（包含刷新的 BOSS ID 和消息）
 */
export function rollBossSpawns(): BossSpawnResult[] {
  const results: BossSpawnResult[] = [];

  // 遍历所有 BOSS 刷新配置
  for (const spawnConfig of bossSpawnConfigs) {
    // 获取 BOSS 模板
    const bossTemplate = bossTemplates[spawnConfig.bossTemplateId];
    if (!bossTemplate) {
      console.warn(`BOSS 模板不存在: ${spawnConfig.bossTemplateId}`);
      continue;
    }

    // 根据概率判定是否刷新
    if (rollSpawn(bossTemplate.spawnChance)) {
      // 生成刷新消息
      const message = `【BOSS出现】${bossTemplate.name} 出现在${bossTemplate.locationName}！`;

      results.push({
        bossId: bossTemplate.id,
        interactableId: spawnConfig.interactableId,
        message: message,
      });
    }
  }

  return results;
}

/**
 * 根据 BOSS 模板生成敌人数据
 * BOSS 的属性在范围内随机生成
 *
 * @param bossTemplate BOSS 模板
 * @param spawnId 刷新配置 ID（用于生成唯一敌人 ID）
 * @returns 敌人数据
 */
export function generateBossEnemyData(bossTemplate: BossTemplate, spawnId: string): EnemyData {
  // 在范围内随机生成生命值
  const maxHp = Math.floor(
    bossTemplate.minHp + Math.random() * (bossTemplate.maxHp - bossTemplate.minHp)
  );

  // 在范围内随机生成攻击力
  const attack = Math.floor(
    bossTemplate.baseAttackMin + Math.random() * (bossTemplate.baseAttackMax - bossTemplate.baseAttackMin)
  );

  // 使用基础防御
  const defense = bossTemplate.baseDefense;

  // 生成敌人数据
  const enemyData: EnemyData = {
    id: `${spawnId}_boss`,
    name: bossTemplate.name,
    maxHp: maxHp,
    attack: attack,
    defense: defense,
    description: bossTemplate.description,
  };

  return enemyData;
}

