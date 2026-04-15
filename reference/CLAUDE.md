# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a reference repository for 魔域1.03 (Moyu 1.03), a decompiled Flash MMORPG game. The codebase contains:
- **817 ActionScript 2.0 files** - Decompiled game logic (NOT ActionScript 3.0)
- **Extracted SWF assets** - Images, shapes, sounds, sprites, buttons, morphshapes, texts
- **Technical documentation** - Comprehensive Chinese docs analyzing game systems

This is an analysis/reference project, not a runnable codebase. There are no build commands, tests, or package managers.

## Directory Structure

```
reference/
├── scripts/                 # Decompiled ActionScript code
│   ├── DefineSprite_XXX/    # Game object sprites (characters, items, skills, etc.)
│   │   └── frame_N/DoAction.as  # Object logic per frame
│   ├── DefineButton2_XXX/   # Button definitions with click handlers
│   ├── frame_N/             # Main timeline frame logic (maps, game flow)
│   └── .claude/skills/      # AS3 coding skill (for reference only)
├── docs/project_docs/       # Chinese technical documentation
├── assets/                  # Game assets organized by type
├── shapes/, images/, sounds/, sprites/, buttons/, frames/, morphshapes/, texts/, symbolClass/  # Extracted SWF elements
└── public/                  # Public assets
```

## ActionScript 2.0 Code Patterns

The decompiled code is ActionScript 2.0, not AS3. Key patterns:

```actionscript
// Global object access via _root
_root.xinxi        // Player info (DefineSprite_932)
_root.zhuangbei    // Equipment system (DefineSprite_561)
_root.beibao       // Inventory system
_root.jineng       // Skill system (DefineSprite_731)
_root.zhanchang    // Battle system
_root.czmb0/1      // Active pets (出征幻兽)
_root.creatething  // Item drop system (DefineSprite_443)

// Button events
on (release) { /* click handler */ }
on (rollOver) { /* hover */ }
on (dragOut) { /* drag start */ }

// Object methods pattern
setprop()   // Set properties
upxx()      // Update display
hitsb()     // Attack logic
byhit()     // Receive damage
flashdata() // Refresh/sync data
```

## Core Game Systems

| System | Main File | Key Functions |
|--------|-----------|---------------|
| Player (xinxi) | `DefineSprite_932/frame_1/DoAction.as` | `flashdata()`, `hitsb()`, `byhit()`, `flashzdl()`, `have_exp()` |
| Monster (gw) | `DefineSprite_124_怪物对象/frame_1/DoAction.as` | `hitsb()`, `byhit()`, death drops |
| Equipment | `DefineSprite_164_武器`, `189_头盔`, `214_手镯`, `239_项链`, `264_衣服`, `289_战鞋` | Quality, magic soul, sockets |
| Pet (huanshou) | `DefineSprite_139_空幻兽对象/frame_1/DoAction.as` | Growth, fusion, battle assist |
| Skills | `DefineSprite_23_星魔剑`, `27_高级风斩`, etc. | `hitsb()` with skill multipliers |
| Item Drops | `DefineSprite_443/frame_1/DoAction.as` | `drop1()`, `drop2()` |
| Maps | `frame_8` to `frame_28` | Monster spawns, NPC placement |

## Key Attribute Systems

### Player Core Attributes
- `dj`: Level (1-132 max)
- `hp/mhp`: Current/max HP
- `tl/mtl`: Current/max stamina
- `xgj/dgj`: Min/max attack
- `fy`: Defense
- `zdl`: Total combat power
- `xy`: Luck (0-100)
- `jxdj`: Military rank (0-11)
- `jwdj`: Nobility rank (0-6)
- `gzgx`: Princess relationship (0-6)

### Equipment Attributes
- `dj`: Equipment level
- `pz`: Quality (0-4: white→green→blue→purple→orange)
- `mhdj`: Magic soul level (0-12)
- `dong`: Socket count (0-2)
- `dong1/dong2`: Socketed gems

## Combat Power Formula

```
zdl = base(dj) + military_rank(jxzdl) + nobility(jwzdl)
    + pet1(hs1zdl) + pet2(hs2zdl)
    + equipment_quality(zbpzzdl) + magic_soul(mhdjzdl)
    + sockets(dongzdl) + gems(bszdl)
    + skill_bonus(jnzdl) + war_soul(zhzdl)
```

## Damage Calculation

```
base_damage = xgj + random(dgj - xgj + 1)
skill_damage = base_damage × skill_multiplier
zdl_modifier = ±(zdl_diff × 0.01~0.05)
final_damage = skill_damage × zdl_modifier - target_defense
```

Hit types (0-7): normal(1.0x), crit(1.5x), dodge(0x), various specials(0.6x-1.2x)

## Documentation Reference

See `docs/project_docs/` for comprehensive Chinese documentation:
- `00_索引与概览.md` - Index and overview
- `01_角色系统.md` - Character system
- `02_幻兽系统.md` - Pet system
- `03.1_物品系统_装备类.md` - Equipment
- `03.2_物品系统_消耗品宝石特殊道具.md` - Consumables, gems, special items
- `05_技能系统.md` - Skills
- `06_地图系统.md` - Maps
- `AS代码全面分析总结.md` - Complete code analysis summary

## Skill: ActionScript 3 Coding

The repository includes an AS3 coding skill at `scripts/.claude/skills/actionscript3-coding/`. Note that the actual game code is AS2, not AS3. Use this skill for reference when creating modern AS3/AIR implementations, but do not apply AS3 syntax to the existing AS2 code.
