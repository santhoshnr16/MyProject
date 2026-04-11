import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import DuoBird from '../../components/DuoBird';
import { AppColors } from '../../constants/theme';

const { width } = Dimensions.get('window');

// Data definition for the 15 nodes
interface NodeData {
  id: number;
  type: 'completed' | 'current' | 'locked' | 'treasure' | 'owl';
  title: string;
  message: string;
  side: 'left' | 'right';
  yPos: number; // Absolute Y center
}

const VERTICAL_SPACING = 130;
const INITIAL_Y = 60;
const LEFT_X = 55;
const RIGHT_X = width - 95;

const generateNodes = (): NodeData[] => {
  const nodes: NodeData[] = [];
  const sidePattern: ('left'|'right')[] = ['left', 'right', 'right', 'left', 'left', 'right', 'right', 'left', 'left', 'right', 'right', 'left', 'left', 'right', 'right'];
  
  for (let i = 1; i <= 15; i++) {
    let type: NodeData['type'] = 'locked';
    if (i < 9) type = 'completed';
    else if (i === 9) type = 'current';
    
    // Checkpoints / specific nodes
    if (i === 5 || i === 10 || i === 15) type = type === 'locked' ? 'treasure' : type;
    if (i === 8) type = 'owl';
    
    nodes.push({
      id: i,
      type,
      title: i === 9 ? 'Sorting Algorithms' : `Level ${i}`,
      message: i === 9 ? 'Master the fundamentals of sorting data, starting with Bubble Sort!' : `Complete this to master Data Structures.`,
      side: sidePattern[i-1],
      yPos: INITIAL_Y + (i - 1) * VERTICAL_SPACING,
    });
  }
  return nodes;
};

const NODES = generateNodes();

export default function DataStructuresScreen() {
  const router = useRouter();
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNode, setSelectedNode] = useState<{ title: string, message: string, type: string } | null>(null);
  const modalScale = useRef(new Animated.Value(0.8)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Smooth bounce and rotation
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    );
    const rotateAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, { toValue: 1, duration: 3000, useNativeDriver: true }),
        Animated.timing(rotateAnim, { toValue: -1, duration: 3000, useNativeDriver: true }),
      ])
    );
    bounceAnimation.start();
    rotateAnimation.start();

    return () => {
      bounceAnimation.stop();
      rotateAnimation.stop();
    };
  }, [bounceAnim, rotateAnim]);

  const bounceInterpolate = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-3deg', '3deg'],
  });

  const handleNodeClick = (node: NodeData) => {
    setSelectedNode({
      title: node.title,
      message: node.message,
      type: node.type,
    });
    setModalVisible(true);
    Animated.parallel([
      Animated.timing(modalOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.spring(modalScale, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
    ]).start();
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(modalOpacity, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(modalScale, { toValue: 0.8, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      setModalVisible(false);
      setSelectedNode(null);
    });
  };

  const getSvgPath = () => {
    if (NODES.length === 0) return '';
    let d = `M ${NODES[0].side === 'left' ? LEFT_X : RIGHT_X} ${NODES[0].yPos}`;
    for (let i = 1; i < NODES.length; i++) {
        const prev = NODES[i - 1];
        const curr = NODES[i];
        const prevX = prev.side === 'left' ? LEFT_X : RIGHT_X;
        const currX = curr.side === 'left' ? LEFT_X : RIGHT_X;
        const midY = (prev.yPos + curr.yPos) / 2;
        d += ` Q ${(width - 40) / 2} ${midY}, ${currX} ${curr.yPos}`;
    }
    return d;
  };

  const getProgressSvgPath = () => {
    const completedOrCurrent = NODES.filter(n => n.type === 'completed' || n.type === 'current');
    if (completedOrCurrent.length === 0) return '';
    let d = `M ${completedOrCurrent[0].side === 'left' ? LEFT_X : RIGHT_X} ${completedOrCurrent[0].yPos}`;
    for (let i = 1; i < completedOrCurrent.length; i++) {
        const prev = completedOrCurrent[i - 1];
        const curr = completedOrCurrent[i];
        const prevX = prev.side === 'left' ? LEFT_X : RIGHT_X;
        const currX = curr.side === 'left' ? LEFT_X : RIGHT_X;
        const midY = (prev.yPos + curr.yPos) / 2;
        d += ` Q ${(width - 40) / 2} ${midY}, ${currX} ${curr.yPos}`;
    }
    return d;
  };

  const getEmojiForType = (type: string) => {
    switch(type) {
        case 'completed': return '⭐';
        case 'treasure': return '🎁';
        case 'current': return '🎧';
        case 'locked': return '🔒';
        default: return '🔒';
    }
  };

  return (
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
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
      >
        <View style={styles.mainLessonContainer}>
          <View style={styles.lessonHeaderBg}>
            <Text style={styles.sectionText}>SECTION 1, UNIT 1</Text>
            <Text style={styles.lessonTitle}>Fundamentals: Arrays & Lists</Text>
          </View>
          <TouchableOpacity style={styles.mainLessonCard} activeOpacity={0.9}>
            <View style={styles.lessonCardContent}>
              <View style={styles.lessonIconContainer}>
                <Text style={styles.bookIconText}>📖</Text>
              </View>
              <View style={styles.lessonTextContainer}>
                <Text style={styles.lessonActionTitle}>Continue Lesson</Text>
                <Text style={styles.lessonActionSubtitle}>Linked Lists part 2</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.lessonPath, { height: NODES[NODES.length-1].yPos + 100 }]}>
          <Svg height={NODES[NODES.length-1].yPos + 50} width={width - 40} style={styles.svgContainer}>
            <Path d={getSvgPath()} stroke={AppColors.borderLight} strokeWidth="4" fill="none" strokeLinecap="round" />
            <Path d={getProgressSvgPath()} stroke={AppColors.primary} strokeWidth="4" fill="none" strokeLinecap="round" />
            
            {NODES.map(node => {
               const cx = node.side === 'left' ? LEFT_X : RIGHT_X;
               let fill = AppColors.border;
               if (node.type === 'completed' || node.type === 'current') fill = AppColors.primary;
               if (node.type === 'treasure') fill = node.id < 7 ? AppColors.gold : AppColors.border;
               if (node.type === 'owl') fill = 'transparent';
               return node.type !== 'owl' ? <Circle key={`circ-${node.id}`} cx={cx} cy={node.yPos} r="4" fill={fill} /> : null;
            })}
          </Svg>

          {NODES.map(node => {
            const isLeft = node.side === 'left';
            const nodeStyles = [styles.lessonNode, { top: node.yPos - 35, left: isLeft ? LEFT_X - 35 : RIGHT_X - 35 }];
            
            if (node.type === 'owl') {
                return (
                    <TouchableOpacity key={node.id} style={nodeStyles} onPress={() => handleNodeClick(node)} activeOpacity={0.8}>
                        <Animated.View style={[styles.owlCharacter, { transform: [{ translateY: bounceInterpolate }, { rotate: rotateInterpolate }] }]}>
                          <DuoBird size={85} />
                          <View style={styles.starsBelowOwl}>
                            <Text style={styles.smallStar}>★</Text>
                            <Text style={styles.smallStar}>★</Text>
                            <Text style={styles.smallStar}>★</Text>
                          </View>
                        </Animated.View>
                    </TouchableOpacity>
                )
            }

            // Wrapper view with solid background to block SVG line underneath
            return (
              <TouchableOpacity key={node.id} style={nodeStyles} onPress={() => handleNodeClick(node)} activeOpacity={0.8}>
                <View style={[
                    styles.nodeStyle, 
                    node.type === 'completed' && styles.completedNode,
                    node.type === 'treasure' && styles.treasureNode,
                    node.type === 'current' && styles.activeNode,
                    node.type === 'locked' && styles.lockedNode
                ]}>
                    <Text style={styles.emojiText}>{getEmojiForType(node.type)}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Node Message Modal */}
      <Modal transparent={true} visible={modalVisible} onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, { opacity: modalOpacity, transform: [{ scale: modalScale }] }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedNode?.title}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.modalMessage}>{selectedNode?.message}</Text>
              <View style={styles.modalTypeContainer}>
                <Text style={[styles.modalType, { color: AppColors.primary }]}>
                  {selectedNode?.type?.toUpperCase()}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
               style={styles.modalButton} 
               onPress={() => {
                 closeModal();
                 if (selectedNode?.title === 'Sorting Algorithms') {
                   setTimeout(() => router.push('/lesson/sorting'), 200);
                 }
               }}
            >
              <Text style={styles.modalButtonText}>
                {selectedNode?.title === 'Sorting Algorithms' ? 'START LESSON' : 'Got it!'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.bg },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  statsBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: AppColors.bg, borderBottomWidth: 1, borderBottomColor: AppColors.border },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statEmoji: { fontSize: 18 },
  statNumber: { fontSize: 16, fontWeight: 'bold' },
  mainLessonContainer: { marginVertical: 20 },
  lessonHeaderBg: { backgroundColor: AppColors.primaryDark, borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16, paddingBottom: 30 },
  sectionText: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 'bold', letterSpacing: 1, marginBottom: 4 },
  lessonTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  mainLessonCard: { backgroundColor: AppColors.bgCard, borderWidth: 1, borderColor: AppColors.borderLight, borderRadius: 16, padding: 20, marginTop: -16, marginHorizontal: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  lessonCardContent: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  lessonIconContainer: { width: 48, height: 48, backgroundColor: 'rgba(88, 204, 2, 0.15)', borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  bookIconText: { fontSize: 24 },
  lessonTextContainer: { flex: 1 },
  lessonActionTitle: { color: AppColors.primary, fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  lessonActionSubtitle: { color: AppColors.textPrimary, fontSize: 14, fontWeight: '500' },
  lessonPath: { position: 'relative', marginTop: 10 },
  svgContainer: { position: 'absolute', top: 0, left: 0, zIndex: 0 },
  lessonNode: { position: 'absolute', width: 70, height: 70, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  nodeStyle: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center' },
  completedNode: { backgroundColor: AppColors.primary, borderBottomWidth: 6, borderBottomColor: AppColors.primaryDark },
  activeNode: { backgroundColor: AppColors.primary, borderWidth: 4, borderColor: AppColors.primaryLight, borderBottomWidth: 8, width: 80, height: 80, borderRadius: 40 },
  lockedNode: { backgroundColor: AppColors.bgElevated, borderBottomWidth: 6, borderBottomColor: AppColors.border },
  treasureNode: { backgroundColor: AppColors.gold, borderBottomWidth: 6, borderBottomColor: AppColors.orange },
  owlCharacter: { alignItems: 'center', justifyContent: 'center' },
  starsBelowOwl: { flexDirection: 'row', gap: 6, marginTop: -8 },
  smallStar: { color: AppColors.gold, fontSize: 16, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
  emojiText: { fontSize: 28 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: { backgroundColor: AppColors.bgCard, borderRadius: 24, width: '100%', padding: 24, borderWidth: 1, borderColor: AppColors.borderLight },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { color: AppColors.textPrimary, fontSize: 20, fontWeight: 'bold' },
  closeButton: { width: 32, height: 32, backgroundColor: AppColors.bgInput, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  closeButtonText: { color: AppColors.textSecondary, fontSize: 20, fontWeight: 'bold', marginTop: -2 },
  modalBody: { marginBottom: 24 },
  modalMessage: { color: AppColors.textSecondary, fontSize: 16, lineHeight: 24, marginBottom: 16 },
  modalTypeContainer: { alignSelf: 'flex-start', backgroundColor: AppColors.bgInput, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  modalType: { fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  modalButton: { backgroundColor: AppColors.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center', borderBottomWidth: 4, borderBottomColor: AppColors.primaryDark },
  modalButtonText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
});
