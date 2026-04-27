import * as Haptics from 'expo-haptics';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import DuoBird from '../../components/DuoBird';
import { AppColors } from '../../constants/theme';

const { width } = Dimensions.get('window');

interface NodeData {
  id: number;
  title: string;
  description: string;
  x: number;
  y: number;
  icon: string;
  accentColor: string;
  xpReward: number;
  lessonRoute?: '/lesson/arrays' | '/lesson/sorting' | '/lesson/trees';
  badge: 'lesson' | 'checkpoint' | 'treasure';
}

interface NodeInsightData {
  node: NodeData;
  score: number;
  xp: number;
  accuracy: number;
  streakDays: number;
  accentColor: string;
  badgeTextColor: string;
  cardBg: string;
  icon: string;
}

interface LessonNodeResult {
  score: number;
  correct: number;
  total: number;
  xp: number;
  passed: boolean;
  timestamp: number;
}

const NODE_SIZE = 68;
const NODE_RADIUS = NODE_SIZE / 2;
const PATH_WIDTH = width - 40;
const CENTER_X = PATH_WIDTH / 2;
const SWING = 75;
const VERTICAL_SPACING = 140;
const INITIAL_Y = 80;
const TOTAL_NODES = 15;

const X_OFFSETS = [
  0,
  SWING,
  SWING,
  0,
  0,
  -SWING,
  -SWING,
  0,
  0,
  SWING,
  SWING,
  0,
  -SWING,
  -SWING,
  0,
];

const NODE_BLUEPRINTS: Array<{
  title: string;
  description: string;
  icon: string;
  accentColor: string;
  xpReward: number;
  lessonRoute?: '/lesson/arrays' | '/lesson/sorting' | '/lesson/trees';
  badge: 'lesson' | 'checkpoint' | 'treasure';
}> = [
  {
    title: 'Arrays',
    description: 'Learn how arrays store and access data.',
    icon: '📦',
    accentColor: AppColors.blue,
    xpReward: 50,
    lessonRoute: '/lesson/arrays',
    badge: 'lesson',
  },
  {
    title: 'Linked Lists',
    description: 'Learn dynamic sequential data structures.',
    icon: '🔗',
    accentColor: AppColors.primary,
    xpReward: 45,
    badge: 'lesson',
  },
  {
    title: 'Stacks',
    description: 'Understand LIFO behavior and push/pop operations.',
    icon: '🥞',
    accentColor: AppColors.orange,
    xpReward: 45,
    badge: 'lesson',
  },
  {
    title: 'Queues',
    description: 'Explore FIFO flow for scheduling and buffering.',
    icon: '🚦',
    accentColor: AppColors.purple,
    xpReward: 45,
    badge: 'lesson',
  },
  {
    title: 'Checkpoint!',
    description: 'Milestone unlocked. Keep your streak alive!',
    icon: '🎁',
    accentColor: AppColors.blue,
    xpReward: 65,
    badge: 'checkpoint',
  },
  {
    title: 'Hash Tables',
    description: 'Key-value lookups and collision handling.',
    icon: '🗂️',
    accentColor: AppColors.primary,
    xpReward: 55,
    badge: 'lesson',
  },
  {
    title: 'Trees',
    description: 'Visualize DFS and BFS traversal strategies.',
    icon: '🌳',
    accentColor: AppColors.purple,
    xpReward: 60,
    lessonRoute: '/lesson/trees',
    badge: 'lesson',
  },
  {
    title: 'Heaps',
    description: 'Priority queues and heap ordering rules.',
    icon: '⛰️',
    accentColor: AppColors.orange,
    xpReward: 55,
    badge: 'lesson',
  },
  {
    title: 'Sorting',
    description: 'Master ordering data with classic algorithms.',
    icon: '↕️',
    accentColor: AppColors.blue,
    xpReward: 60,
    lessonRoute: '/lesson/sorting',
    badge: 'lesson',
  },
  {
    title: 'Checkpoint!',
    description: 'You reached another progress milestone!',
    icon: '🎁',
    accentColor: AppColors.blue,
    xpReward: 70,
    badge: 'checkpoint',
  },
  {
    title: 'Graphs',
    description: 'Navigate vertices, edges, and shortest paths.',
    icon: '🕸️',
    accentColor: AppColors.primary,
    xpReward: 65,
    badge: 'lesson',
  },
  {
    title: 'Tries',
    description: 'Prefix searching and autocomplete logic.',
    icon: '🔤',
    accentColor: AppColors.orange,
    xpReward: 65,
    badge: 'lesson',
  },
  {
    title: 'DP Basics',
    description: 'Break problems into overlapping subproblems.',
    icon: '🧠',
    accentColor: AppColors.purple,
    xpReward: 70,
    badge: 'lesson',
  },
  {
    title: 'Greedy',
    description: 'Choose locally optimal moves for global goals.',
    icon: '⚡',
    accentColor: AppColors.gold,
    xpReward: 70,
    badge: 'lesson',
  },
  {
    title: 'Final Boss!',
    description: 'Conquer the final challenge and claim the crown.',
    icon: '🏆',
    accentColor: AppColors.gold,
    xpReward: 100,
    badge: 'treasure',
  },
];

const generateNodes = (): NodeData[] => {
  return Array.from({ length: TOTAL_NODES }, (_, i) => {
    const blueprint = NODE_BLUEPRINTS[i];
    return {
      id: i + 1,
      title: blueprint.title,
      description: blueprint.description,
      icon: blueprint.icon,
      accentColor: blueprint.accentColor,
      xpReward: blueprint.xpReward,
      lessonRoute: blueprint.lessonRoute,
      badge: blueprint.badge,
      x: CENTER_X + X_OFFSETS[i],
      y: INITIAL_Y + i * VERTICAL_SPACING,
    };
  });
};

const NODES = generateNodes();

interface ParticleProps {
  delay: number;
  x: number;
  y: number;
  color: string;
}

function FlyingParticle({ delay, x, y, color }: ParticleProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withSequence(withTiming(1, { duration: 150 }), withTiming(0, { duration: 400 })),
    );
    scale.value = withDelay(
      delay,
      withSequence(
        withSpring(1.2, { damping: 4, stiffness: 200 }),
        withTiming(0, { duration: 400 }),
      ),
    );
    offsetX.value = withDelay(delay, withTiming((Math.random() - 0.5) * 60, { duration: 550 }));
    offsetY.value = withDelay(delay, withTiming((Math.random() - 0.5) * 60, { duration: 550 }));
  }, [delay, x, y]);

  const animStyle = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: x + offsetX.value - 6,
    top: y + offsetY.value - 6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: color,
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View pointerEvents="none" style={animStyle} />;
}

function SparkleText({ delay, x, y, emoji }: { delay: number; x: number; y: number; emoji: string }) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);
  const rotation = useSharedValue(0);
  const offsetY = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withSequence(withTiming(1, { duration: 200 }), withDelay(200, withTiming(0, { duration: 300 }))),
    );
    scale.value = withDelay(
      delay,
      withSequence(
        withSpring(1.3, { damping: 5, stiffness: 180 }),
        withDelay(150, withTiming(0, { duration: 300 })),
      ),
    );
    rotation.value = withDelay(delay, withTiming(360, { duration: 700 }));
    offsetY.value = withDelay(delay, withTiming(-30, { duration: 700 }));
  }, [delay, x, y]);

  const animStyle = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: x - 12,
    top: y + offsetY.value - 12,
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View pointerEvents="none" style={animStyle}>
      <Text style={{ fontSize: 20 }}>{emoji}</Text>
    </Animated.View>
  );
}

export default function DataStructuresScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    lesson?: string;
    nodeId?: string;
    passed?: string;
    score?: string;
    correct?: string;
    total?: string;
    xp?: string;
    ts?: string;
  }>();

  const [currentBirdNode, setCurrentBirdNode] = useState(0);
  const [failedNodeIds, setFailedNodeIds] = useState<number[]>([]);
  const [isBirdFlying, setIsBirdFlying] = useState(false);
  const [birdMode, setBirdMode] = useState<'idle' | 'flying' | 'heartbroken'>('idle');

  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string; delay: number }[]>([]);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; emoji: string; delay: number }[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [nodeInsight, setNodeInsight] = useState<NodeInsightData | null>(null);
  const [lockedHint, setLockedHint] = useState<{ nodeId: number; x: number; y: number; text: string } | null>(null);

  const particleId = useRef(0);
  const insightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const processedResultTsRef = useRef<string | null>(null);
  const lessonNodeResultsRef = useRef<Record<number, LessonNodeResult>>({});

  const birdX = useSharedValue(NODES[0].x);
  const birdY = useSharedValue(NODES[0].y);
  const birdScale = useSharedValue(1);
  const birdRotation = useSharedValue(0);
  const birdGlow = useSharedValue(0);
  const idleHover = useSharedValue(0);
  const currentPulse = useSharedValue(0);
  const landingScale = useSharedValue(1);

  const modalScale = useSharedValue(0.8);
  const modalOpacity = useSharedValue(0);
  const nodeInsightOpacity = useSharedValue(0);
  const nodeInsightTranslateY = useSharedValue(8);

  const lockedHintOpacity = useSharedValue(0);
  const lockedHintTranslateY = useSharedValue(0);
  const lockedNodeShake = useSharedValue(0);

  useEffect(() => {
    idleHover.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );

    currentPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );

    birdGlow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
  }, []);

  useEffect(() => {
    return () => {
      if (insightTimeoutRef.current) {
        clearTimeout(insightTimeoutRef.current);
      }
    };
  }, []);

  const getInsightStatsForNode = (node: NodeData, nodeIndex: number) => {
    let accentColor = node.accentColor;
    let badgeTextColor = AppColors.gold;
    let cardBg = AppColors.bgCard;
    let icon = node.icon;

    if (node.badge === 'treasure') {
      accentColor = AppColors.gold;
      badgeTextColor = AppColors.orange;
      cardBg = '#252015';
      icon = '🏆';
    } else if (node.badge === 'checkpoint') {
      accentColor = AppColors.blue;
      badgeTextColor = AppColors.blue;
      cardBg = '#172535';
      icon = '🎁';
    } else if (nodeIndex % 3 === 1) {
      accentColor = AppColors.orange;
      badgeTextColor = AppColors.orange;
      cardBg = '#2A2218';
    }

    const result = lessonNodeResultsRef.current[node.id];
    if (result) {
      return {
        score: result.score,
        xp: result.xp,
        accuracy: result.total > 0 ? Math.round((result.correct / result.total) * 100) : result.score,
        streakDays: 1,
        accentColor: result.passed ? AppColors.primary : AppColors.orange,
        badgeTextColor: result.passed ? AppColors.gold : AppColors.orange,
        cardBg: result.passed ? '#16321E' : '#2A2218',
        icon: result.passed ? '✅' : '📝',
      };
    }

    return {
      score: 120 + (nodeIndex + 1) * 35,
      xp: node.xpReward,
      accuracy: 88 + (nodeIndex % 6),
      streakDays: 3 + (nodeIndex % 5),
      accentColor,
      badgeTextColor,
      cardBg,
      icon,
    };
  };

  const showNodeInsight = useCallback((node: NodeData, nodeIndex: number) => {
    const stats = getInsightStatsForNode(node, nodeIndex);

    if (insightTimeoutRef.current) {
      clearTimeout(insightTimeoutRef.current);
    }

    setNodeInsight({ node, ...stats });
    nodeInsightOpacity.value = 0;
    nodeInsightTranslateY.value = 8;

    nodeInsightOpacity.value = withTiming(1, { duration: 220 });
    nodeInsightTranslateY.value = withTiming(0, {
      duration: 220,
      easing: Easing.out(Easing.quad),
    });

    insightTimeoutRef.current = setTimeout(() => {
      nodeInsightOpacity.value = withTiming(0, { duration: 180 });
      nodeInsightTranslateY.value = withTiming(8, { duration: 180 });
      setTimeout(() => setNodeInsight(null), 180);
    }, 2400);
  }, []);

  const spawnParticles = useCallback((fromX: number, fromY: number) => {
    const colors = ['#58CC02', '#89E219', '#FFC800', '#1CB0F6', '#CE82FF'];
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: ++particleId.current,
      x: fromX,
      y: fromY,
      color: colors[i % colors.length],
      delay: i * 40,
    }));
    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 1200);
  }, []);

  const spawnSparkles = useCallback((atX: number, atY: number) => {
    const emojis = ['✨', '⭐', '💫', '🌟', '✨'];
    const newSparkles = emojis.map((emoji, i) => ({
      id: ++particleId.current,
      x: atX + (Math.random() - 0.5) * 50,
      y: atY + (Math.random() - 0.5) * 40,
      emoji,
      delay: i * 80,
    }));

    setSparkles((prev) => [...prev, ...newSparkles]);
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => !newSparkles.find((ns) => ns.id === s.id)));
    }, 1500);
  }, []);

  const onFinishFlight = useCallback((nextIndex: number) => {
    setCurrentBirdNode(nextIndex);
    setIsBirdFlying(false);
    setBirdMode('idle');
  }, []);

  const flyToNextNode = useCallback(() => {
    if (isBirdFlying) return;

    const nextIndex = currentBirdNode + 1;
    if (nextIndex >= NODES.length) return;

    const fromNode = NODES[currentBirdNode];
    const toNode = NODES[nextIndex];

    setIsBirdFlying(true);
    setBirdMode('flying');
    spawnParticles(fromNode.x, fromNode.y);

    const dx = toNode.x - fromNode.x;
    const tiltAngle = dx > 0 ? 18 : dx < 0 ? -18 : 0;

    birdScale.value = withSequence(
      withTiming(1.3, { duration: 200, easing: Easing.out(Easing.quad) }),
      withTiming(1.15, { duration: 400, easing: Easing.inOut(Easing.sin) }),
      withSpring(1, { damping: 8, stiffness: 120 }),
    );

    birdRotation.value = withSequence(
      withTiming(tiltAngle, { duration: 250, easing: Easing.out(Easing.quad) }),
      withTiming(tiltAngle * 0.5, { duration: 300, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: 250, easing: Easing.out(Easing.quad) }),
    );

    const midX = (fromNode.x + toNode.x) / 2;
    const midY = Math.min(fromNode.y, toNode.y) - 40;

    birdX.value = withSequence(
      withTiming(midX, { duration: 400, easing: Easing.inOut(Easing.quad) }),
      withTiming(toNode.x, { duration: 400, easing: Easing.inOut(Easing.quad) }),
    );

    birdY.value = withSequence(
      withTiming(midY, { duration: 350, easing: Easing.out(Easing.quad) }),
      withTiming(toNode.y, { duration: 450, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
    );

    landingScale.value = withDelay(
      750,
      withSequence(withTiming(1.3, { duration: 100 }), withSpring(1, { damping: 6, stiffness: 200 })),
    );

    setTimeout(() => {
      spawnSparkles(toNode.x, toNode.y);
      spawnParticles(toNode.x, toNode.y);
      onFinishFlight(nextIndex);
      showNodeInsight(fromNode, currentBirdNode);
    }, 830);
  }, [currentBirdNode, isBirdFlying, showNodeInsight, spawnParticles, spawnSparkles, onFinishFlight]);

  useEffect(() => {
    if (params.lesson !== 'arrays') return;
    if (typeof params.ts !== 'string' || processedResultTsRef.current === params.ts) return;

    processedResultTsRef.current = params.ts;
    const nodeId = Number(params.nodeId);
    const passed = params.passed === '1';
    const score = Number(params.score);
    const correct = Number(params.correct);
    const total = Number(params.total);
    const xp = Number(params.xp);

    if (!Number.isInteger(nodeId)) {
      router.replace('/(tabs)/data-structures');
      return;
    }

    const nodeIndex = NODES.findIndex((node) => node.id === nodeId);
    if (nodeIndex === -1) {
      router.replace('/(tabs)/data-structures');
      return;
    }

    const lessonResult: LessonNodeResult = {
      score: Number.isFinite(score) ? score : 0,
      correct: Number.isFinite(correct) ? correct : 0,
      total: Number.isFinite(total) ? total : 0,
      xp: Number.isFinite(xp) ? xp : 0,
      passed,
      timestamp: Number(params.ts) || Date.now(),
    };

    lessonNodeResultsRef.current = {
      ...lessonNodeResultsRef.current,
      [nodeId]: lessonResult,
    };
    if (passed) {
      setFailedNodeIds((prev) => prev.filter((id) => id !== nodeId));
      if (nodeIndex === currentBirdNode) {
        flyToNextNode();
      }
    } else if (nodeIndex === currentBirdNode) {
      setFailedNodeIds((prev) => (prev.includes(nodeId) ? prev : [...prev, nodeId]));
      setBirdMode('heartbroken');
    }

    const cleanupDelay = passed ? 950 : 250;
    const timer = setTimeout(() => {
      router.replace('/(tabs)/data-structures');
    }, cleanupDelay);

    return () => clearTimeout(timer);
  }, [params.lesson, params.nodeId, params.passed, params.score, params.correct, params.total, params.xp, params.ts, currentBirdNode, flyToNextNode, router]);

  const getNodeState = (index: number) => {
    const isActive = index === currentBirdNode;
    const isCompleted = index < currentBirdNode;
    const isLocked = index > currentBirdNode;
    const hasRetry = failedNodeIds.includes(index + 1) && isActive;
    return { isActive, isCompleted, isLocked, hasRetry };
  };

  const getNodeStyle = (node: NodeData, index: number) => {
    const { isActive, isCompleted, isLocked, hasRetry } = getNodeState(index);

    let bgColor = AppColors.bgElevated;
    let borderColor = AppColors.border;
    let shadowColor = 'transparent';

    if (isCompleted) {
      bgColor = node.badge === 'treasure' ? AppColors.gold : AppColors.primary;
      borderColor = node.badge === 'treasure' ? AppColors.orange : AppColors.primaryDark;
      shadowColor = node.badge === 'treasure' ? AppColors.gold : AppColors.primary;
    } else if (isActive) {
      bgColor = node.badge === 'treasure' ? AppColors.gold : AppColors.primary;
      borderColor = hasRetry ? AppColors.red : node.badge === 'treasure' ? AppColors.orange : AppColors.primaryLight;
      shadowColor = node.badge === 'treasure' ? AppColors.gold : AppColors.primary;
    }

    if (isLocked) {
      bgColor = AppColors.bgElevated;
      borderColor = AppColors.border;
      shadowColor = 'transparent';
    }

    return { bgColor, borderColor, shadowColor };
  };

  const getEmojiForNode = (node: NodeData, index: number) => {
    const { isCompleted, isLocked } = getNodeState(index);
    if (isLocked) return '🔒';
    if (node.badge === 'treasure') return isCompleted ? '🏆' : '🎁';
    if (isCompleted) return '⭐';
    return node.icon;
  };

  const showLockedFeedback = (node: NodeData) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setLockedHint({
      nodeId: node.id,
      x: node.x,
      y: node.y,
      text: 'Complete the previous lesson first!',
    });

    lockedNodeShake.value = withSequence(
      withTiming(-8, { duration: 40 }),
      withTiming(8, { duration: 40 }),
      withTiming(-6, { duration: 40 }),
      withTiming(6, { duration: 40 }),
      withTiming(-4, { duration: 40 }),
      withTiming(4, { duration: 40 }),
      withTiming(0, { duration: 40 }),
    );

    lockedHintOpacity.value = 0;
    lockedHintTranslateY.value = 0;
    lockedHintOpacity.value = withSequence(
      withTiming(1, { duration: 160 }),
      withDelay(1200, withTiming(0, { duration: 200 })),
    );
    lockedHintTranslateY.value = withTiming(-10, { duration: 700, easing: Easing.out(Easing.quad) });

    setTimeout(() => {
      setLockedHint(null);
    }, 1500);
  };

  const handleNodeClick = (node: NodeData, index: number) => {
    const { isLocked } = getNodeState(index);
    if (isLocked) {
      showLockedFeedback(node);
      return;
    }

    setSelectedNode(node);
    setModalVisible(true);
    modalOpacity.value = withTiming(1, { duration: 200 });
    modalScale.value = withSpring(1, { damping: 12, stiffness: 100 });
  };

  const closeModal = () => {
    modalOpacity.value = withTiming(0, { duration: 150 });
    modalScale.value = withTiming(0.8, { duration: 150 });
    setTimeout(() => {
      setModalVisible(false);
      setSelectedNode(null);
    }, 160);
  };

  const startSelectedLesson = async () => {
    if (!selectedNode) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const route = selectedNode.lessonRoute;

    if (!route) {
      closeModal();
      showLockedFeedback({
        ...selectedNode,
        x: NODES[currentBirdNode].x,
        y: NODES[currentBirdNode].y,
      });
      return;
    }

    closeModal();
    setTimeout(() => {
      router.push(route);
    }, 180);
  };

  const modalAnimStyle = useAnimatedStyle(() => ({
    opacity: modalOpacity.value,
    transform: [{ scale: modalScale.value }],
  }));

  const nodeInsightAnimStyle = useAnimatedStyle(() => ({
    opacity: nodeInsightOpacity.value,
    transform: [{ translateY: nodeInsightTranslateY.value }],
  }));

  const currentPulseStyle = useAnimatedStyle(() => {
    const s = interpolate(currentPulse.value, [0, 1], [1, 1.35]);
    const o = interpolate(currentPulse.value, [0, 1], [0.5, 0]);
    return {
      position: 'absolute' as const,
      width: NODE_SIZE + 16,
      height: NODE_SIZE + 16,
      borderRadius: (NODE_SIZE + 16) / 2,
      borderWidth: 3,
      borderColor: AppColors.primary,
      opacity: o,
      transform: [{ scale: s }],
      left: -8,
      top: -8,
    };
  });

  const birdAnimatedStyle = useAnimatedStyle(() => {
    const hoverOffset = interpolate(idleHover.value, [0, 1], [0, -10]);
    return {
      position: 'absolute' as const,
      left: birdX.value - 42,
      top: birdY.value - 70 + hoverOffset,
      width: 85,
      height: 102,
      zIndex: 100,
      transform: [{ scale: birdScale.value }, { rotate: `${birdRotation.value}deg` }],
    };
  });

  const birdGlowStyle = useAnimatedStyle(() => {
    const glowRadius = interpolate(birdGlow.value, [0, 1], [15, 28]);
    const glowOpacity = interpolate(birdGlow.value, [0, 1], [0.2, 0.5]);
    return {
      position: 'absolute' as const,
      left: birdX.value - 45,
      top: birdY.value - 45,
      width: 90,
      height: 90,
      borderRadius: 45,
      backgroundColor: AppColors.primary,
      opacity: glowOpacity,
      zIndex: 99,
      shadowColor: AppColors.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: glowRadius,
    };
  });

  const landingRingStyle = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: birdX.value - 40,
    top: birdY.value - 40,
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: AppColors.primary,
    opacity: interpolate(landingScale.value, [1, 1.3], [0, 0.6]),
    transform: [{ scale: landingScale.value }],
    zIndex: 98,
  }));

  const lockedHintStyle = useAnimatedStyle(() => ({
    opacity: lockedHintOpacity.value,
    transform: [{ translateY: lockedHintTranslateY.value }],
  }));

  const lockedShakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: lockedNodeShake.value }],
  }));

  const getSvgPath = () => {
    if (NODES.length < 2) return '';
    let d = `M ${NODES[0].x} ${NODES[0].y}`;
    for (let i = 1; i < NODES.length; i++) {
      const prev = NODES[i - 1];
      const curr = NODES[i];
      const cp1x = prev.x;
      const cp1y = prev.y + VERTICAL_SPACING * 0.55;
      const cp2x = curr.x;
      const cp2y = curr.y - VERTICAL_SPACING * 0.55;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }
    return d;
  };

  const getProgressPath = () => {
    const progressNodes = NODES.filter((_, i) => i <= currentBirdNode);
    if (progressNodes.length < 2) return '';
    let d = `M ${progressNodes[0].x} ${progressNodes[0].y}`;
    for (let i = 1; i < progressNodes.length; i++) {
      const prev = progressNodes[i - 1];
      const curr = progressNodes[i];
      const cp1x = prev.x;
      const cp1y = prev.y + VERTICAL_SPACING * 0.55;
      const cp2x = curr.x;
      const cp2y = curr.y - VERTICAL_SPACING * 0.55;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }
    return d;
  };

  const totalHeight = NODES[NODES.length - 1].y + 120;

  return (
    <ImageBackground
      source={require('../../assets/images/_ (1).jpeg')}
      style={styles.screenBackground}
      resizeMode="cover"
    >
      <View style={styles.screenOverlay} />
      <SafeAreaView style={styles.container}>
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>🛡️</Text>
            <Text style={[styles.statNumber, { color: AppColors.primary }]}>60</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={[styles.statNumber, { color: AppColors.orange }]}>7</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>💎</Text>
            <Text style={[styles.statNumber, { color: AppColors.blue }]}>125</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>⚡</Text>
            <Text style={[styles.statNumber, { color: AppColors.purple }]}>3</Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentInner}>
            <View style={styles.mainLessonContainer}>
              <View style={styles.lessonHeaderBg}>
                <Text style={styles.sectionText}>SECTION 1, UNIT 1</Text>
                <Text style={styles.lessonTitle}>Fundamentals: Arrays & Lists</Text>
              </View>
              <TouchableOpacity style={styles.mainLessonCard} activeOpacity={0.9} onPress={() => router.push('/lesson/arrays')}>
                <View style={styles.lessonCardContent}>
                  <View style={styles.lessonIconContainer}>
                    <Text style={styles.bookIconText}>📦</Text>
                  </View>
                  <View style={styles.lessonTextContainer}>
                    <Text style={styles.lessonActionTitle}>Start Arrays Lesson</Text>
                    <Text style={styles.lessonActionSubtitle}>5 questions • pass threshold 60%</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.tapInstruction}>
              <Text style={styles.tapText}>Tap an unlocked node to open the lesson modal</Text>
            </View>

            <TouchableOpacity activeOpacity={1} style={[styles.lessonPath, { height: totalHeight }]}>
              <View style={styles.pathContrastOverlay} />

              <Svg height={totalHeight} width={PATH_WIDTH} style={styles.svgContainer}>
                <Defs>
                  <LinearGradient id="progressGrad" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor={AppColors.primary} />
                    <Stop offset="100%" stopColor={AppColors.primaryLight} />
                  </LinearGradient>
                </Defs>

                <Path
                  d={getSvgPath()}
                  stroke={AppColors.border}
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="8,8"
                  opacity={0.5}
                />

                <Path
                  d={getProgressPath()}
                  stroke="url(#progressGrad)"
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                />

                {NODES.map((node, i) => {
                  const { isCompleted, isActive } = getNodeState(i);
                  return (
                    <Circle
                      key={`dot-${node.id}`}
                      cx={node.x}
                      cy={node.y}
                      r={isActive ? 5 : 3}
                      fill={isCompleted || isActive ? AppColors.primary : AppColors.border}
                      opacity={0.6}
                    />
                  );
                })}
              </Svg>

              {NODES.map((node, index) => {
                const { isActive, isLocked, hasRetry } = getNodeState(index);
                const { bgColor, borderColor, shadowColor } = getNodeStyle(node, index);
                const shouldShake = lockedHint?.nodeId === node.id;

                return (
                  <Animated.View
                    key={node.id}
                    style={[
                      styles.lessonNode,
                      {
                        top: node.y - NODE_RADIUS,
                        left: node.x - NODE_RADIUS,
                      },
                      shouldShake && lockedShakeStyle,
                    ]}
                  >
                    <TouchableOpacity onPress={() => handleNodeClick(node, index)} activeOpacity={0.8}>
                      <View
                        style={[
                          styles.nodeCircle,
                          {
                            backgroundColor: bgColor,
                            borderColor,
                            shadowColor,
                            shadowOpacity: isLocked ? 0 : 0.5,
                            shadowRadius: isLocked ? 0 : 12,
                            opacity: isLocked ? 0.45 : 1,
                          },
                          isActive && styles.activeNodeExtra,
                        ]}
                      >
                        {isActive && <Animated.View style={currentPulseStyle} />}
                        {hasRetry && <View style={styles.retryDot} />}
                        <Text style={styles.emojiText}>{getEmojiForNode(node, index)}</Text>
                      </View>
                    </TouchableOpacity>
                    <Text style={[styles.nodeLabel, isLocked && { opacity: 0.4 }]} numberOfLines={1}>
                      {node.title}
                    </Text>
                  </Animated.View>
                );
              })}

              {lockedHint && (
                <Animated.View
                  pointerEvents="none"
                  style={[
                    styles.lockedHint,
                    {
                      left: Math.max(10, Math.min(PATH_WIDTH - 220, lockedHint.x - 100)),
                      top: Math.max(16, lockedHint.y - 86),
                    },
                    lockedHintStyle,
                  ]}
                >
                  <Text style={styles.lockedHintText}>{lockedHint.text}</Text>
                </Animated.View>
              )}

              {nodeInsight && (
                <Animated.View
                  pointerEvents="none"
                  style={[
                    styles.nodeInsightCard,
                    {
                      left: Math.max(8, Math.min(PATH_WIDTH - 170, nodeInsight.node.x - 75)),
                      top: Math.max(12, Math.min(totalHeight - 96, nodeInsight.node.y - 118)),
                      borderColor: nodeInsight.accentColor,
                      backgroundColor: nodeInsight.cardBg,
                    },
                    nodeInsightAnimStyle,
                  ]}
                >
                  <Text style={styles.nodeInsightTitle}>
                    {nodeInsight.icon} {nodeInsight.node.title}
                  </Text>
                  <View style={styles.nodeInsightBadgeRow}>
                    <Text
                      style={[
                        styles.nodeInsightBadge,
                        {
                          color: nodeInsight.badgeTextColor,
                          borderColor: nodeInsight.accentColor,
                        },
                      ]}
                    >
                      +{nodeInsight.score} Score
                    </Text>
                    <Text
                      style={[
                        styles.nodeInsightBadge,
                        {
                          color: nodeInsight.badgeTextColor,
                          borderColor: nodeInsight.accentColor,
                        },
                      ]}
                    >
                      +{nodeInsight.xp} XP
                    </Text>
                  </View>
                  <Text style={styles.nodeInsightMeta}>
                    Accuracy {nodeInsight.accuracy}% • Streak {nodeInsight.streakDays}d
                  </Text>
                </Animated.View>
              )}

              <Animated.View pointerEvents="none" style={birdGlowStyle} />
              <Animated.View pointerEvents="none" style={landingRingStyle} />

              {particles.map((p) => (
                <FlyingParticle key={p.id} delay={p.delay} x={p.x} y={p.y} color={p.color} />
              ))}

              {sparkles.map((s) => (
                <SparkleText key={s.id} delay={s.delay} x={s.x} y={s.y} emoji={s.emoji} />
              ))}

              <Animated.View pointerEvents="none" style={birdAnimatedStyle}>
                <View pointerEvents="none">
                  <DuoBird
                    size={85}
                    animate
                    animationMode={birdMode}
                    onAnimationModeComplete={() => {
                      setBirdMode('idle');
                    }}
                  />
                </View>
              </Animated.View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Modal transparent visible={modalVisible} onRequestClose={closeModal}>
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.modalContent, modalAnimStyle]}>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>

              <Text style={styles.modalIcon}>{selectedNode?.icon}</Text>
              <Text style={styles.modalTitle}>{selectedNode?.title}</Text>
              <Text style={styles.modalMessage}>{selectedNode?.description}</Text>

              <View style={styles.modalXpRow}>
                <Text style={styles.modalXpLabel}>Reward</Text>
                <Text style={styles.modalXpValue}>+{selectedNode?.xpReward ?? 0} XP</Text>
              </View>

              <TouchableOpacity style={styles.modalButton} activeOpacity={0.9} onPress={startSelectedLesson}>
                <ExpoLinearGradient
                  colors={[
                    selectedNode?.accentColor ?? AppColors.primary,
                    selectedNode?.accentColor ?? AppColors.primary,
                    AppColors.primaryDark,
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.modalButtonGradient}
                >
                  <Text style={styles.modalButtonText}>Start Lesson</Text>
                </ExpoLinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screenBackground: {
    flex: 1,
    backgroundColor: AppColors.bg,
  },
  screenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 14, 25, 0.25)',
  },
  container: { flex: 1, backgroundColor: 'transparent' },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 72 },
  contentInner: {
    width: PATH_WIDTH,
    alignSelf: 'center',
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 14,
    backgroundColor: 'rgba(7, 13, 24, 0.78)',
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statEmoji: { fontSize: 18 },
  statNumber: { fontSize: 16, fontWeight: 'bold' },

  mainLessonContainer: { marginTop: 18, marginBottom: 14 },
  lessonHeaderBg: {
    backgroundColor: AppColors.primaryDark,
    borderRadius: 18,
    padding: 16,
    paddingBottom: 16,
  },
  sectionText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  lessonTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  mainLessonCard: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: AppColors.borderLight,
    borderRadius: 16,
    padding: 18,
    marginTop: 12,
    marginHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  lessonCardContent: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  lessonIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(88, 204, 2, 0.15)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookIconText: { fontSize: 24 },
  lessonTextContainer: { flex: 1 },
  lessonActionTitle: {
    color: AppColors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  lessonActionSubtitle: {
    color: AppColors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },

  tapInstruction: {
    alignItems: 'center',
    marginBottom: 14,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(88, 204, 2, 0.08)',
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  tapText: {
    color: AppColors.primary,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  lessonPath: {
    position: 'relative',
    marginTop: 0,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: AppColors.borderLight,
  },
  pathContrastOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 14, 25, 0.38)',
    zIndex: -2,
  },
  svgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
  },

  lessonNode: {
    position: 'absolute',
    width: NODE_SIZE,
    alignItems: 'center',
    zIndex: 10,
  },
  nodeCircle: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderBottomWidth: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  activeNodeExtra: {
    width: NODE_SIZE + 6,
    height: NODE_SIZE + 6,
    borderRadius: (NODE_SIZE + 6) / 2,
    borderWidth: 4,
  },
  retryDot: {
    position: 'absolute',
    top: 6,
    right: 7,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: AppColors.red,
    borderWidth: 1,
    borderColor: '#fff',
  },
  emojiText: { fontSize: 26 },
  nodeLabel: {
    color: AppColors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
    letterSpacing: 0.2,
  },

  lockedHint: {
    position: 'absolute',
    maxWidth: 220,
    backgroundColor: 'rgba(255, 75, 75, 0.95)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: AppColors.redDark,
    zIndex: 220,
  },
  lockedHintText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: AppColors.bgCard,
    borderRadius: 24,
    width: '100%',
    padding: 24,
    borderWidth: 1,
    borderColor: AppColors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 12,
  },
  closeButton: {
    width: 32,
    height: 32,
    backgroundColor: AppColors.bgInput,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    color: AppColors.textSecondary,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: -2,
  },
  modalIcon: {
    fontSize: 48,
    textAlign: 'center',
    marginTop: 6,
  },
  modalTitle: {
    color: AppColors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  modalMessage: {
    color: AppColors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalXpRow: {
    backgroundColor: AppColors.bgInput,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: AppColors.border,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalXpLabel: {
    color: AppColors.textSecondary,
    fontWeight: '700',
    fontSize: 14,
  },
  modalXpValue: {
    color: AppColors.gold,
    fontWeight: '800',
    fontSize: 14,
  },
  modalButton: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  modalButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },

  nodeInsightCard: {
    position: 'absolute',
    width: 170,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 14,
    elevation: 7,
    zIndex: 120,
  },
  nodeInsightTitle: {
    color: AppColors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  nodeInsightBadgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  nodeInsightBadge: {
    flex: 1,
    backgroundColor: AppColors.bgElevated,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 4,
    textAlign: 'center',
    color: AppColors.gold,
    fontSize: 11,
    fontWeight: '700',
  },
  nodeInsightMeta: {
    color: AppColors.textPrimary,
    fontSize: 11,
    fontWeight: '600',
    opacity: 0.88,
  },
});
