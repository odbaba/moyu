# 封面页模块 (Cover Page)

游戏启动时的封面界面，展示游戏标题和操作按钮。

## 组件

### CoverPage

封面页组件，全屏居中布局，手机端一屏展示所有内容。

#### Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `onStartGame` | `() => void` | 是 | 点击"开始游戏"按钮的回调 |
| `onContinueGame` | `() => void` | 是 | 点击"继续游戏"按钮的回调 |
| `hasSaveData` | `boolean` | 是 | 是否存在存档数据，为 false 时"继续游戏"按钮禁用 |

#### 使用示例

```tsx
import { CoverPage } from './components/cover';

function App() {
  const [hasSaveData, setHasSaveData] = useState(false);

  return (
    <CoverPage
      onStartGame={() => console.log('开始新游戏')}
      onContinueGame={() => console.log('继续游戏')}
      hasSaveData={hasSaveData}
    />
  );
}
```
