import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Animated, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Line } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export default function DataStructuresScreen() {
  const router = useRouter();
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const navOpacity = useRef(new Animated.Value(1)).current;
  const navTranslateY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const isScrollingDown = useRef(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNode, setSelectedNode] = useState<{title: string, message: string, type: string} | null>(null);
  const modalScale = useRef(new Animated.Value(0.8)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Smooth bounce animation for owl
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    // Gentle rotation animation
    const rotateAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: -1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );

    bounceAnimation.start();
    rotateAnimation.start();

    return () => {
      bounceAnimation.stop();
      rotateAnimation.stop();
    };
  }, [bounceAnim, rotateAnim]);

  // Handle scroll direction for navigation bar
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false, listener: (event: any) => {
      const currentScrollY = event.nativeEvent.contentOffset.y;
      const scrollDirection = currentScrollY > lastScrollY.current ? 'down' : 'up';
      
      // Only hide/show if scrolling more than 20px
      if (Math.abs(currentScrollY - lastScrollY.current) > 20) {
        if (scrollDirection === 'down' && !isScrollingDown.current) {
          // Hide navigation bar
          Animated.parallel([
            Animated.timing(navOpacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(navTranslateY, {
              toValue: 70,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start();
          isScrollingDown.current = true;
        } else if (scrollDirection === 'up' && isScrollingDown.current) {
          // Show navigation bar
          Animated.parallel([
            Animated.timing(navOpacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(navTranslateY, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start();
          isScrollingDown.current = false;
        }
        lastScrollY.current = currentScrollY;
      }
    }});

  const bounceInterpolate = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-3deg', '3deg'],
  });

  // Node click handler with specific messages
  const handleNodeClick = (nodeType: string, nodeNumber: number) => {
    const nodeMessages: {[key: string]: {[key: number]: {title: string, message: string, type: string}}} = {
      star: {
        1: { title: "Arrays", message: "Learn about arrays - the fundamental data structure for storing collections of elements.", type: "completed" },
        2: { title: "Linked Lists", message: "Master linked lists and understand how they differ from arrays.", type: "completed" },
        4: { title: "Stacks", message: "Explore stacks - LIFO data structures used in many algorithms.", type: "completed" },
        5: { title: "Queues", message: "Learn about queues - FIFO data structures for managing order.", type: "completed" },
      },
      treasure: {
        3: { title: "Practice Quiz 1", message: "Test your knowledge with our first practice quiz!", type: "treasure" },
        10: { title: "Practice Quiz 2", message: "Challenge yourself with advanced practice problems.", type: "treasure" },
        14: { title: "Final Project", message: "Complete your final project to master data structures!", type: "treasure" },
      },
      owl: {
        6: { title: "Midterm Review", message: "Review all concepts learned so far with our owl mascot!", type: "owl" },
      },
      current: {
        7: { title: "Trees", message: "You're currently learning about trees - hierarchical data structures.", type: "current" },
      },
      locked: {
        8: { title: "Binary Trees", message: "Coming soon: Learn about binary trees and their applications.", type: "locked" },
        9: { title: "Tree Traversal", message: "Coming soon: Master tree traversal algorithms.", type: "locked" },
      }
    };

    const nodeInfo = nodeMessages[nodeType]?.[nodeNumber];
    if (nodeInfo) {
      setSelectedNode(nodeInfo);
      setModalVisible(true);
      
      // Smooth modal entrance animation
      Animated.parallel([
        Animated.timing(modalOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(modalScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  // Smooth modal close animation
  const closeModal = () => {
    Animated.parallel([
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(modalScale, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      setSelectedNode(null);
    });
  };

  // Parallax effect for smooth scrolling
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Status Bar - Fixed at top */}
      <View style={styles.statusBar}>
        <View style={styles.statusLeft}>
          <Text style={styles.timeText}>9:34</Text>
        </View>
        <View style={styles.statusRight}>
          <View style={styles.signalIndicator}>
            <Text style={styles.signalText}>5G</Text>
          </View>
          <View style={styles.wifiIndicator}>
            <Text style={styles.wifiText}>WiFi</Text>
          </View>
          <View style={styles.batteryIndicator}>
            <Text style={styles.batteryText}>79</Text>
          </View>
        </View>
      </View>

      {/* Scrollable Content */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}>
        {/* Blue Notification Banner */}
        <Animated.View style={[styles.notificationBanner, { opacity: headerOpacity }]}>
          <View style={styles.owlIconSmall}>
            <Text style={styles.owlIconText}>Owl</Text>
          </View>
          <View style={styles.notificationTextContainer}>
            <Text style={styles.notificationText}>You're missing out on reminders from Duo!</Text>
          </View>
          <TouchableOpacity style={styles.allowButton}>
            <Text style={styles.allowButtonText}>ALLOW</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Stats Bar */}
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <View style={styles.flagIcon}>
              <Text style={styles.flagText}>US</Text>
            </View>
            <Text style={styles.statNumber}>60</Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.flameIcon}>
              <Text style={styles.flameText}>🔥</Text>
            </View>
            <Text style={styles.statNumber}>0</Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.gemIcon}>
              <Text style={styles.gemText}>💎</Text>
            </View>
            <Text style={styles.statNumberBlue}>630</Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.lightningIcon}>
              <Text style={styles.lightningText}>⚡</Text>
            </View>
            <Text style={styles.statNumberPink}>25</Text>
          </View>
        </View>

        {/* Main Lesson Card */}
        <TouchableOpacity style={styles.mainLessonCard} activeOpacity={0.9}>
          <View style={styles.lessonCardContent}>
            <View style={styles.lessonTextContainer}>
              <Text style={styles.sectionText}>SECTION 1, UNIT 1</Text>
              <Text style={styles.lessonTitle}>Solo trip: Compare travel experiences</Text>
            </View>
            <View style={styles.lessonIconContainer}>
              <View style={styles.bookIcon}>
                <Text style={styles.bookIconText}>📖</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Lesson Path - Zig Zag with SVG Components */}
        <View style={styles.lessonPath}>
          {/* SVG Connection Lines and Decorations */}
          <Svg height="2000" width={width - 40} style={styles.svgContainer}>
            {/* Main path from 1->2->3->4->5->6 */}
            <Path
              d={`M 55 35 Q ${(width-40)/2} 75, ${width-95} 115 Q ${(width-40)/2} 195, 55 275 Q ${(width-40)/2} 355, ${width-95} 435 Q ${(width-40)/2} 515, 55 595 Q ${(width-40)/2} 675, ${width-95} 755`}
              stroke="#4A5A65"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              opacity="0.8"
            />
            {/* Path from 6->7->8->9->10 */}
            <Path
              d={`M ${width-95} 755 Q ${(width-40)/2} 795, 55 835 Q ${(width-40)/2} 915, ${width-95} 995 Q ${(width-40)/2} 1075, 55 1155 Q ${(width-40)/2} 1235, ${width-95} 1315`}
              stroke="#4A5A65"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              opacity="0.8"
            />
                        
            {/* Decorative circles at connection points - aligned with 10-node positions */}
            <Circle cx="55" cy="35" r="2" fill="#58CC02" opacity="0.6"/>
            <Circle cx={width-95} cy="115" r="2" fill="#58CC02" opacity="0.6"/>
            <Circle cx="55" cy="275" r="2" fill="#58CC02" opacity="0.6"/>
            <Circle cx={width-95} cy="435" r="2" fill="#58CC02" opacity="0.6"/>
            <Circle cx="55" cy="595" r="2" fill="#58CC02" opacity="0.6"/>
            <Circle cx={width-95} cy="755" r="3" fill="#E8912E" opacity="0.8"/>
            <Circle cx="55" cy="835" r="2" fill="#58CC02" opacity="0.6"/>
            <Circle cx={width-95} cy="995" r="2" fill="#4A5A65" opacity="0.4"/>
            <Circle cx="55" cy="1155" r="2" fill="#4A5A65" opacity="0.4"/>
            <Circle cx={width-95} cy="1315" r="3" fill="#E8912E" opacity="0.8"/>
            
            {/* Progress indicators - aligned with 10-node positions */}
            <Line x1="55" y1="35" x2={width-95} y2="115" stroke="#58CC02" strokeWidth="2" opacity="0.3"/>
            <Line x1={width-95} y1="115" x2="55" y2="275" stroke="#58CC02" strokeWidth="2" opacity="0.3"/>
            <Line x1="55" y1="275" x2={width-95} y2="435" stroke="#58CC02" strokeWidth="2" opacity="0.3"/>
            <Line x1={width-95} y1="435" x2="55" y2="595" stroke="#58CC02" strokeWidth="2" opacity="0.3"/>
            <Line x1="55" y1="595" x2={width-95} y2="755" stroke="#58CC02" strokeWidth="2" opacity="0.3"/>
            <Line x1={width-95} y1="755" x2="55" y2="835" stroke="#58CC02" strokeWidth="2" opacity="0.3"/>
            <Line x1="55" y1="835" x2={width-95} y2="995" stroke="#58CC02" strokeWidth="2" opacity="0.3"/>
            <Line x1={width-95} y1="995" x2="55" y2="1155" stroke="#58CC02" strokeWidth="2" opacity="0.3"/>
            <Line x1="55" y1="1155" x2={width-95} y2="1315" stroke="#58CC02" strokeWidth="2" opacity="0.3"/>
          </Svg>

          {/* Level 3: Treasure - Left */}
          <TouchableOpacity 
            style={[styles.lessonNode, styles.treasureNode, styles.zigZagLeft, { marginTop: 80 }]}
            onPress={() => handleNodeClick('treasure', 3)}
            activeOpacity={0.8}>
            <View style={styles.treasureChestIcon}>
              <Text style={styles.chestIconText}>🎁</Text>
            </View>
          </TouchableOpacity>

          {/* Level 4: Star - Right */}
          <TouchableOpacity 
            style={[styles.lessonNode, styles.completedNode, styles.zigZagRight, { marginTop: 80 }]}
            onPress={() => handleNodeClick('star', 4)}
            activeOpacity={0.8}>
            <View style={styles.starIcon}>
              <Text style={styles.starIconText}>★</Text>
            </View>
          </TouchableOpacity>

          {/* Level 5: Star - Left */}
          <TouchableOpacity 
            style={[styles.lessonNode, styles.completedNode, styles.zigZagLeft, { marginTop: 80 }]}
            onPress={() => handleNodeClick('star', 5)}
            activeOpacity={0.8}>
            <View style={styles.starIcon}>
              <Text style={styles.starIconText}>★</Text>
            </View>
          </TouchableOpacity>

          {/* Level 6: Owl Checkpoint - Right */}
          <TouchableOpacity 
            style={[styles.lessonNode, styles.owlNode, styles.zigZagRight, { marginTop: 240 }]}
            onPress={() => handleNodeClick('owl', 6)}
            activeOpacity={0.8}>
            <Animated.View
              style={[
                styles.owlCharacter,
                {
                  transform: [
                    { translateY: bounceInterpolate },
                    { rotate: rotateInterpolate },
                  ],
                },
              ]}>
              <View style={styles.owlBodySmall}>
                <View style={styles.owlBellySmall} />
                <View style={styles.eyesContainerSmall}>
                  <View style={styles.eyeSmall}>
                    <View style={styles.pupilSmall} />
                  </View>
                  <View style={styles.eyeSmall}>
                    <View style={styles.pupilSmall} />
                  </View>
                </View>
                <View style={styles.beakSmall} />
              </View>
              <View style={styles.starsBelowOwl}>
                <Text style={styles.smallStar}>★</Text>
                <Text style={styles.smallStar}>★</Text>
                <Text style={styles.smallStar}>★</Text>
              </View>
            </Animated.View>
          </TouchableOpacity>

          {/* Level 7: Headphones (Current) - Left */}
          <TouchableOpacity 
            style={[styles.lessonNode, styles.activeNode, styles.zigZagLeft, { marginTop: 80 }]}
            onPress={() => handleNodeClick('current', 7)}
            activeOpacity={0.8}>
            <View style={styles.headphoneIcon}>
              <Text style={styles.headphoneIconText}>🎧</Text>
            </View>
          </TouchableOpacity>

          {/* Level 8: Locked - Right */}
          <TouchableOpacity 
            style={[styles.lessonNode, styles.lockedNode, styles.zigZagRight, { marginTop: 80 }]}
            onPress={() => handleNodeClick('locked', 8)}
            activeOpacity={0.8}>
            <View style={styles.lockedIcon}>
              <Text style={styles.lockedIconText}>🔒</Text>
            </View>
          </TouchableOpacity>

          {/* Level 9: Locked - Left */}
          <TouchableOpacity 
            style={[styles.lessonNode, styles.lockedNode, styles.zigZagLeft, { marginTop: 80 }]}
            onPress={() => handleNodeClick('locked', 9)}
            activeOpacity={0.8}>
            <View style={styles.lockedIcon}>
              <Text style={styles.lockedIconText}>🏋️</Text>
            </View>
          </TouchableOpacity>

          {/* Level 10: Treasure - Right */}
          <TouchableOpacity 
            style={[styles.lessonNode, styles.treasureNode, styles.zigZagRight, { marginTop: 80 }]}
            onPress={() => handleNodeClick('treasure', 10)}
            activeOpacity={0.8}>
            <View style={styles.treasureChestIcon}>
              <Text style={styles.chestIconText}>💰</Text>
            </View>
          </TouchableOpacity>

        </View>
      </Animated.ScrollView>

      {/* Animated Bottom Navigation */}
      <Animated.View 
        style={[
          styles.bottomNav,
          {
            opacity: navOpacity,
            transform: [{ translateY: navTranslateY }],
          }
        ]}>
        <TouchableOpacity style={styles.navItem}>
          <View style={[styles.navIcon, styles.activeNavIcon]}>
            <Text style={styles.activeNavIconText} numberOfLines={1}>Home</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/quest')}>
          <View style={styles.navIcon}>
            <Text style={styles.navIconText} numberOfLines={1}>Quest</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/add-friends')}>
          <View style={styles.navIcon}>
            <Text style={styles.navIconText} numberOfLines={1}>Friends</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIcon}>
            <Text style={styles.navIconText} numberOfLines={1}>Shop</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIcon}>
            <Text style={styles.navIconText} numberOfLines={1}>Hearts</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/profile')}>
          <View style={styles.navIcon}>
            <Text style={styles.navIconText} numberOfLines={1}>Profile</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Node Message Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalContent,
              {
                opacity: modalOpacity,
                transform: [{ scale: modalScale }],
              }
            ]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedNode?.title}</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={closeModal}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.modalMessage}>{selectedNode?.message}</Text>
              <View style={styles.modalTypeContainer}>
                <Text style={[
                  styles.modalType,
                  selectedNode?.type === 'completed' && styles.typeCompleted,
                  selectedNode?.type === 'treasure' && styles.typeTreasure,
                  selectedNode?.type === 'owl' && styles.typeOwl,
                  selectedNode?.type === 'current' && styles.typeCurrent,
                  selectedNode?.type === 'locked' && styles.typeLocked
                ]}>
                  {selectedNode?.type === 'completed' && 'Completed'}
                  {selectedNode?.type === 'treasure' && 'Treasure'}
                  {selectedNode?.type === 'owl' && 'Checkpoint'}
                  {selectedNode?.type === 'current' && 'Current Lesson'}
                  {selectedNode?.type === 'locked' && 'Locked'}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={closeModal}>
              <Text style={styles.modalButtonText}>Got it!</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131F24',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  // Status Bar
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#131F24',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  statusRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  signalIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signalText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  wifiIndicator: {
    marginLeft: 4,
  },
  wifiText: {
    color: '#fff',
    fontSize: 12,
  },
  batteryIndicator: {
    marginLeft: 4,
  },
  batteryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  // Notification Banner
  notificationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1CB0F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 15,
  },
  owlIconSmall: {
    width: 36,
    height: 36,
    backgroundColor: '#58CC02',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  owlIconText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  notificationTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  notificationText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
  },
  allowButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  allowButtonText: {
    color: '#1CB0F6',
    fontSize: 13,
    fontWeight: 'bold',
  },
  // Stats Bar
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#131F24',
    paddingVertical: 10,
    marginBottom: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flagIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#1C3D5A',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  flameIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flameText: {
    fontSize: 18,
  },
  gemIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gemText: {
    fontSize: 18,
  },
  lightningIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightningText: {
    fontSize: 18,
  },
  statNumber: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statNumberBlue: {
    color: '#1CB0F6',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statNumberPink: {
    color: '#FF4B4B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Main Lesson Card
  mainLessonCard: {
    backgroundColor: '#58CC02',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  lessonCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonTextContainer: {
    flex: 1,
  },
  lessonIconContainer: {
    marginLeft: 10,
  },
  bookIcon: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookIconText: {
    fontSize: 22,
  },
  sectionText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  lessonTitle: {
    color: '#fff',
    fontSize: 19,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  // Lesson Path - Zig Zag
  lessonPath: {
    alignItems: 'center',
    position: 'relative',
    paddingVertical: 20,
    paddingHorizontal: 20,
    width: '100%',
  },
  svgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
  },
  pathLine: {
    position: 'absolute',
    width: 6,
    height: '100%',
    backgroundColor: '#2D3A42',
    left: '50%',
    marginLeft: -3,
    top: 0,
    borderRadius: 3,
    shadowColor: '#58CC02',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  pathLineInner: {
    position: 'absolute',
    width: 2,
    height: '100%',
    backgroundColor: '#4A5A65',
    left: '50%',
    marginLeft: -1,
    top: 0,
    borderRadius: 1,
  },
  zigZagLeft: {
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  zigZagRight: {
    alignSelf: 'flex-end',
    marginRight: 20,
  },
  lessonNode: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  completedNode: {
    backgroundColor: '#58CC02',
    borderWidth: 4,
    borderColor: '#89E219',
    shadowColor: '#58CC02',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  treasureNode: {
    backgroundColor: '#E8912E',
    borderWidth: 4,
    borderColor: '#FFA94D',
    shadowColor: '#E8912E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  owlNode: {
    backgroundColor: 'transparent',
    width: 100,
    height: 120,
  },
  activeNode: {
    backgroundColor: '#58CC02',
    borderWidth: 5,
    borderColor: '#fff',
    shadowColor: '#58CC02',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 12,
  },
  lockedNode: {
    backgroundColor: '#2D3E47',
    borderWidth: 3,
    borderColor: '#3A4D57',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  starIcon: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  starIconText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    textShadowColor: 'rgba(255,255,255,0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  treasureChestIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chestIconText: {
    fontSize: 32,
  },
  // Owl Character
  owlCharacter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  owlBodySmall: {
    width: 85,
    height: 85,
    backgroundColor: '#58CC02',
    borderRadius: 42.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#58A700',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  owlBellySmall: {
    position: 'absolute',
    bottom: 12,
    width: 55,
    height: 42,
    backgroundColor: '#89E219',
    borderRadius: 27,
  },
  eyesContainerSmall: {
    position: 'absolute',
    top: 20,
    flexDirection: 'row',
    gap: 14,
  },
  eyeSmall: {
    width: 22,
    height: 22,
    backgroundColor: '#fff',
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#58A700',
  },
  pupilSmall: {
    width: 10,
    height: 10,
    backgroundColor: '#000',
    borderRadius: 5,
  },
  beakSmall: {
    position: 'absolute',
    top: 42,
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FF9600',
  },
  starsBelowOwl: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  smallStar: {
    fontSize: 18,
    color: '#fff',
    textShadowColor: 'rgba(255,255,255,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  // Icons
  headphoneIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headphoneIconText: {
    fontSize: 28,
  },
  lockedIcon: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.6,
  },
  lockedIconText: {
    fontSize: 24,
    color: '#52636D',
  },
  // Bottom Navigation - Enhanced
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#0F1920',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#2A3F4F',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2A3F4F',
    borderWidth: 2,
    borderColor: '#3A4F5F',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  navIconText: {
    fontSize: 14,
    color: '#8B9BA3',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 14,
  },
  activeNavIcon: {
    backgroundColor: '#1CB0F6',
    borderColor: '#1A90E6',
    borderWidth: 2,
    shadowColor: '#1CB0F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  activeNavIconText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 14,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1F2930',
    borderRadius: 20,
    padding: 25,
    width: '85%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#37464F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#8B9BA3',
    fontWeight: '600',
  },
  modalBody: {
    marginBottom: 20,
  },
  modalMessage: {
    fontSize: 16,
    color: '#D1D5DB',
    lineHeight: 24,
    marginBottom: 15,
  },
  modalTypeContainer: {
    alignSelf: 'flex-start',
  },
  modalType: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  typeCompleted: {
    backgroundColor: '#58CC02',
    color: '#fff',
  },
  typeTreasure: {
    backgroundColor: '#E8912E',
    color: '#fff',
  },
  typeOwl: {
    backgroundColor: '#1CB0F6',
    color: '#fff',
  },
  typeCurrent: {
    backgroundColor: '#1CB0F6',
    color: '#fff',
  },
  typeLocked: {
    backgroundColor: '#4A5A65',
    color: '#8B9BA3',
  },
  modalButton: {
    backgroundColor: '#58CC02',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
