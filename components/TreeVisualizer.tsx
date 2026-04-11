import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Svg, { Line, Circle, Text as SvgText } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { AppColors } from '../constants/theme';

type TreeSize = 'small' | 'medium' | 'big';

const SMALL_NODES = [
  { id: 0, val: 'A', cx: 160, cy: 50 },
  { id: 1, val: 'B', cx: 100, cy: 150 },
  { id: 2, val: 'C', cx: 220, cy: 150 },
];
const SMALL_EDGES = [
  { from: 0, to: 1 },
  { from: 0, to: 2 },
];
const SMALL_BFS = [0, 1, 2];
const SMALL_DFS = [0, 1, 2];

const MEDIUM_NODES = [
  { id: 0, val: 'A', cx: 160, cy: 30 },
  { id: 1, val: 'B', cx: 80, cy: 100 },
  { id: 2, val: 'C', cx: 240, cy: 100 },
  { id: 3, val: 'D', cx: 40, cy: 170 },
  { id: 4, val: 'E', cx: 120, cy: 170 },
  { id: 5, val: 'F', cx: 200, cy: 170 },
  { id: 6, val: 'G', cx: 280, cy: 170 },
];
const MEDIUM_EDGES = [
  { from: 0, to: 1 }, { from: 0, to: 2 },
  { from: 1, to: 3 }, { from: 1, to: 4 },
  { from: 2, to: 5 }, { from: 2, to: 6 },
];
const MEDIUM_BFS = [0, 1, 2, 3, 4, 5, 6];
const MEDIUM_DFS = [0, 1, 3, 4, 2, 5, 6];

const BIG_NODES = [
  { id: 0, val: 'A', cx: 160, cy: 20 },
  { id: 1, val: 'B', cx: 80, cy: 80 },
  { id: 2, val: 'C', cx: 240, cy: 80 },
  { id: 3, val: 'D', cx: 40, cy: 140 },
  { id: 4, val: 'E', cx: 120, cy: 140 },
  { id: 5, val: 'F', cx: 200, cy: 140 },
  { id: 6, val: 'G', cx: 280, cy: 140 },
  { id: 7, val: 'H', cx: 20, cy: 200 },
  { id: 8, val: 'I', cx: 60, cy: 200 },
  { id: 9, val: 'J', cx: 100, cy: 200 },
  { id: 10, val: 'K', cx: 140, cy: 200 },
  { id: 11, val: 'L', cx: 180, cy: 200 },
  { id: 12, val: 'M', cx: 220, cy: 200 },
  { id: 13, val: 'N', cx: 260, cy: 200 },
  { id: 14, val: 'O', cx: 300, cy: 200 },
];
const BIG_EDGES = [
  { from: 0, to: 1 }, { from: 0, to: 2 },
  { from: 1, to: 3 }, { from: 1, to: 4 },
  { from: 2, to: 5 }, { from: 2, to: 6 },
  { from: 3, to: 7 }, { from: 3, to: 8 },
  { from: 4, to: 9 }, { from: 4, to: 10 },
  { from: 5, to: 11 }, { from: 5, to: 12 },
  { from: 6, to: 13 }, { from: 6, to: 14 },
];
const BIG_BFS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
const BIG_DFS = [0, 1, 3, 7, 8, 4, 9, 10, 2, 5, 11, 12, 6, 13, 14];

const TREE_MAP = {
  small: { nodes: SMALL_NODES, edges: SMALL_EDGES, bfs: SMALL_BFS, dfs: SMALL_DFS, radius: 20, fontSize: "16", height: 220 },
  medium: { nodes: MEDIUM_NODES, edges: MEDIUM_EDGES, bfs: MEDIUM_BFS, dfs: MEDIUM_DFS, radius: 16, fontSize: "14", height: 220 },
  big: { nodes: BIG_NODES, edges: BIG_EDGES, bfs: BIG_BFS, dfs: BIG_DFS, radius: 12, fontSize: "10", height: 240 },
};

export default function TreeVisualizer() {
  const [size, setSize] = useState<TreeSize>('medium');
  const [isRunning, setIsRunning] = useState(false);
  const [visited, setVisited] = useState<number[]>([]);
  const [pathStr, setPathStr] = useState<string>('');
  
  const currentTree = TREE_MAP[size];

  const changeSize = (newSize: TreeSize) => {
    if (isRunning) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSize(newSize);
    setVisited([]);
    setPathStr('');
  };

  const resetTree = () => {
    if (isRunning) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setVisited([]);
    setPathStr('');
  };

  const animateNodes = async (order: number[]) => {
    setIsRunning(true);
    setVisited([]);
    setPathStr('');

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    let currentPath = '';

    for (let i = 0; i < order.length; i++) {
        const nodeId = order[i];
        
        await new Promise(r => setTimeout(r, size === 'big' ? 300 : 600)); // Faster for big tree
        
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        
        const nodeVal = currentTree.nodes.find(n => n.id === nodeId)?.val;
        currentPath += (i === 0 ? nodeVal : ` → ${nodeVal}`);
        
        setPathStr(currentPath);
        setVisited(prev => [...prev, nodeId]);
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsRunning(false);
  };

  const runBFS = () => animateNodes(currentTree.bfs);
  const runDFS = () => animateNodes(currentTree.dfs);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Tree Traversal Visualizer</Text>
        <Text style={styles.subtitle}>Watch the algorithm path trace below!</Text>
      </View>

      {/* Size Tabs */}
      <View style={styles.tabContainer}>
        {(['small', 'medium', 'big'] as TreeSize[]).map((t) => (
          <TouchableOpacity 
            key={t}
            style={[styles.tab, size === t && styles.activeTab]}
            onPress={() => changeSize(t)}
            activeOpacity={0.8}
            disabled={isRunning}
          >
             <Text style={[styles.tabText, size === t && styles.activeTabText]}>
                {t.toUpperCase()}
             </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* SVG Canvas */}
      <View style={[styles.visualizerContainer, { height: currentTree.height }]}>
        <Svg height={currentTree.height.toString()} width="320">
            {/* Draw Edges */}
            {currentTree.edges.map((edge, i) => {
                const fromNode = currentTree.nodes.find(n => n.id === edge.from)!;
                const toNode = currentTree.nodes.find(n => n.id === edge.to)!;
                
                // An edge is traversed if both its connected nodes are in the visited array.
                // In exact DFS/BFS traces, this highlights the explored graph perfectly.
                const isTraversed = visited.includes(edge.from) && visited.includes(edge.to);
                
                return (
                    <Line 
                       key={`edge-${size}-${i}`}
                       x1={fromNode.cx} 
                       y1={fromNode.cy} 
                       x2={toNode.cx} 
                       y2={toNode.cy} 
                       stroke={isTraversed ? AppColors.gold : AppColors.border} 
                       strokeWidth={size === 'big' ? "3" : "4"} 
                    />
                );
            })}
            
            {/* Draw Nodes */}
            {currentTree.nodes.map((node) => {
                const hasVisited = visited.includes(node.id);
                // When visited, we bump the radius slightly for a pop effect
                const currentRadius = hasVisited ? currentTree.radius + 4 : currentTree.radius;
                const fill = hasVisited ? AppColors.gold : AppColors.bgElevated;
                const stroke = hasVisited ? AppColors.orange : AppColors.borderLight;
                const textColor = hasVisited ? "#000" : AppColors.textPrimary;
                const textYOffset = size === 'big' ? 3 : (size === 'medium' ? 5 : 6);

                return (
                    <React.Fragment key={`node-${size}-${node.id}`}>
                        <Circle 
                            cx={node.cx} 
                            cy={node.cy} 
                            r={currentRadius} 
                            fill={fill} 
                            stroke={stroke} 
                            strokeWidth={size === 'big' ? "2" : "3"} 
                        />
                        <SvgText 
                            x={node.cx} 
                            y={node.cy + textYOffset} 
                            fontSize={currentTree.fontSize} 
                            fontWeight="bold" 
                            fill={textColor} 
                            textAnchor="middle"
                        >
                            {node.val}
                        </SvgText>
                    </React.Fragment>
                );
            })}
        </Svg>
      </View>

      {/* Traversal Path Output Box */}
      <View style={styles.pathBox}>
        <Text style={styles.pathLabel}>PATH TRACKER</Text>
        <Text style={styles.pathString}>
            {pathStr === '' ? "Awaiting traversal..." : pathStr}
        </Text>
      </View>

      {/* Algorithm Controls */}
      <View style={styles.controlsRow}>
        <TouchableOpacity 
           style={[styles.btn, styles.resetBtn, isRunning && styles.disabledBtn]} 
           onPress={resetTree}
           disabled={isRunning}
        >
          <Text style={styles.resetBtnText}>RESET</Text>
        </TouchableOpacity>

        <TouchableOpacity 
           style={[styles.btn, styles.bfsBtn, isRunning && styles.disabledBtn]} 
           onPress={runBFS}
           disabled={isRunning}
        >
          <Text style={styles.playBtnText}>BFS</Text>
        </TouchableOpacity>

        <TouchableOpacity 
           style={[styles.btn, styles.dfsBtn, isRunning && styles.disabledBtn]} 
           onPress={runDFS}
           disabled={isRunning}
        >
          <Text style={styles.playBtnText}>DFS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.borderLight,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    color: AppColors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: AppColors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: AppColors.bgElevated,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: AppColors.primary,
  },
  tabText: {
    color: AppColors.textSecondary,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  activeTabText: {
    color: '#000',
  },
  visualizerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  pathBox: {
    backgroundColor: AppColors.bgElevated,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: AppColors.border,
    minHeight: 74,
    justifyContent: 'center',
  },
  pathLabel: {
    color: AppColors.primary,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 6,
  },
  pathString: {
    color: AppColors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderBottomWidth: 4,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  resetBtn: {
    backgroundColor: AppColors.bgElevated,
    borderBottomColor: AppColors.border,
    borderWidth: 2,
    borderColor: AppColors.borderLight,
  },
  resetBtnText: {
    color: AppColors.textPrimary,
    fontWeight: 'bold',
  },
  bfsBtn: {
    backgroundColor: AppColors.blue,
    borderBottomColor: AppColors.blueDark,
  },
  dfsBtn: {
    backgroundColor: AppColors.purple,
    borderBottomColor: AppColors.purpleDark,
  },
  playBtnText: {
    color: '#000',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
