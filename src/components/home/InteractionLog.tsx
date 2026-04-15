import React, { useEffect, useRef } from 'react';

/**
 * 交互日志组件属性接口
 */
interface InteractionLogProps {
  /** 日志内容数组 */
  logs: string[];
}

/**
 * 交互日志组件
 * 显示交互日志列表
 */
const InteractionLog: React.FC<InteractionLogProps> = ({ logs }) => {
  const logRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="interaction-log" ref={logRef}>
      {logs.map((log, index) => (
        <div key={index} className="log-entry">{log}</div>
      ))}
    </div>
  );
};

export default InteractionLog;
