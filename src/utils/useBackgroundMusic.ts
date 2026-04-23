import { useCallback, useEffect, useRef } from 'react';

/**
 * 背景音乐 Hook 配置选项
 */
interface UseBackgroundMusicOptions {
  /** 音乐文件路径 */
  src: string;
  /** 是否自动播放 */
  autoPlay?: boolean;
  /** 音量 (0-1) */
  volume?: number;
  /** 是否循环播放 */
  loop?: boolean;
}

/**
 * 背景音乐 Hook 返回值
 */
interface UseBackgroundMusicReturn {
  /** 播放音乐 */
  play: () => void;
  /** 暂停音乐 */
  pause: () => void;
  /** 切换播放/暂停 */
  toggle: () => void;
  /** 设置音量 */
  setVolume: (volume: number) => void;
  /** 是否正在播放 */
  isPlaying: boolean;
}

/**
 * 背景音乐管理 Hook
 *
 * 用于管理游戏背景音乐的播放、暂停、音量控制等功能
 *
 * @param options 配置选项
 * @returns 音乐控制方法和状态
 *
 * @example
 * ```tsx
 * const { play, pause, toggle, setVolume, isPlaying } = useBackgroundMusic({
 *   src: '/audio/background.mp3',
 *   autoPlay: true,
 *   volume: 0.5,
 *   loop: true
 * });
 * ```
 */
export function useBackgroundMusic(options: UseBackgroundMusicOptions): UseBackgroundMusicReturn {
  const {
    src,
    autoPlay = false,
    volume = 0.3,
    loop = true
  } = options;

  // 使用 ref 存储 audio 元素，避免重新创建
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // 使用 ref 存储播放状态，避免触发重新渲染
  const isPlayingRef = useRef(false);

  // 初始化音频元素
  useEffect(() => {
    // 创建 audio 元素
    const audio = new Audio(src);
    audio.loop = loop;
    audio.volume = volume;
    audioRef.current = audio;

    // 自动播放
    if (autoPlay) {
      audio.play().catch(error => {
        // 自动播放可能被浏览器阻止，这是正常的
        console.log('自动播放被浏览器阻止，需要用户交互后才能播放:', error);
      });
      isPlayingRef.current = true;
    }

    // 清理函数
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [src, autoPlay, loop]); // 移除 volume 依赖，避免重新创建 audio 元素

  // 单独处理音量变化，不重新创建 audio 元素
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // 播放音乐
  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error('播放音乐失败:', error);
      });
      isPlayingRef.current = true;
    }
  }, []);

  // 暂停音乐
  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      isPlayingRef.current = false;
    }
  }, []);

  // 切换播放/暂停
  const toggle = useCallback(() => {
    if (isPlayingRef.current) {
      pause();
    } else {
      play();
    }
  }, [play, pause]);

  // 设置音量
  const setVolume = useCallback((newVolume: number) => {
    if (audioRef.current) {
      // 确保音量在 0-1 范围内
      const clampedVolume = Math.max(0, Math.min(1, newVolume));
      audioRef.current.volume = clampedVolume;
    }
  }, []);

  return {
    play,
    pause,
    toggle,
    setVolume,
    isPlaying: isPlayingRef.current
  };
}
