import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import * as Haptics from 'expo-haptics';
import { AppColors } from '../constants/theme';

const ARRAY_SIZE = 6;
const BAR_WIDTH = 30;
const SPACING = 10;

export default function SortingVisualizer() {
  const [isSorting, setIsSorting] = useState(false);
  const [array, setArray] = useState<number[]>([120, 40, 90, 30, 80, 60]);
  const [animValues] = useState<Animated.Value[]>(
    Array.from({ length: ARRAY_SIZE }).map((_, i) => new Animated.Value(i * (BAR_WIDTH + SPACING)))
  );
  const [activeIndices, setActiveIndices] = useState<number[]>([]);

  // Function to shuffle/reset the array visual
  const resetArray = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newArr = [120, 40, 90, 30, 80, 60].sort(() => Math.random() - 0.5);
    setArray(newArr);
    setActiveIndices([]);
    // Reset positions instantly
    animValues.forEach((anim, i) => {
      anim.setValue(i * (BAR_WIDTH + SPACING));
    });
  };

  const bubbleSortAnimation = async () => {
    if (isSorting) return;
    setIsSorting(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    let arr = [...array];
    let posArr = animValues.map((_, i) => i); // keep track of physical positions

    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        // Highlight active pair
        setActiveIndices([posArr[j], posArr[j + 1]]);
        
        await new Promise(r => setTimeout(r, 400)); // Pause to view

        if (arr[j] > arr[j + 1]) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

          // Swap logic on physical indices
          let physicalIndexJ = posArr[j];
          let physicalIndexJ1 = posArr[j + 1];

          // Swap physical values in arrays
          let tempVal = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = tempVal;

          // Swap references
          posArr[j] = physicalIndexJ1;
          posArr[j + 1] = physicalIndexJ;

          // Animate the physical views crossing each other
          const swapAnim = Animated.parallel([
            Animated.timing(animValues[physicalIndexJ], {
              toValue: (j + 1) * (BAR_WIDTH + SPACING),
              duration: 300,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(animValues[physicalIndexJ1], {
              toValue: j * (BAR_WIDTH + SPACING),
              duration: 300,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]);

          await new Promise<void>(resolve => {
            swapAnim.start(() => resolve());
          });
        }
      }
    }

    // Done sorting
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setActiveIndices([]);
    setIsSorting(false);
    setArray(arr); // Sync state securely
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Algorithm Visualizer</Text>
        <Text style={styles.subtitle}>Bubble Sort O(N²)</Text>
      </View>

      <View style={styles.visualizerContainer}>
        {array.map((val, physicalIndex) => {
          const isActive = activeIndices.includes(physicalIndex);
          return (
            <Animated.View
              key={`bar-${physicalIndex}`}
              style={[
                styles.bar,
                {
                  height: val,
                  transform: [{ translateX: animValues[physicalIndex] }],
                  backgroundColor: isActive ? AppColors.gold : AppColors.primary,
                  borderColor: isActive ? AppColors.orange : AppColors.primaryDark,
                },
              ]}
            >
              <Text style={styles.barNumber}>{val}</Text>
            </Animated.View>
          );
        })}
      </View>

      <View style={styles.controlsRow}>
        <TouchableOpacity 
           style={[styles.btn, styles.resetBtn, isSorting && styles.disabledBtn]} 
           onPress={resetArray}
           disabled={isSorting}
        >
          <Text style={styles.resetBtnText}>SHUFFLE</Text>
        </TouchableOpacity>

        <TouchableOpacity 
           style={[styles.btn, styles.playBtn, isSorting && styles.disabledBtn]} 
           onPress={bubbleSortAnimation}
           disabled={isSorting}
        >
          <Text style={styles.playBtnText}>{isSorting ? 'SORTING...' : 'RUN SORT'}</Text>
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
    marginBottom: 24,
  },
  title: {
    color: AppColors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: AppColors.orange,
    fontSize: 14,
    fontWeight: '600',
  },
  visualizerContainer: {
    height: 140,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderBottomWidth: 2,
    borderBottomColor: AppColors.border,
    marginBottom: 24,
    position: 'relative',
    width: ARRAY_SIZE * (BAR_WIDTH + SPACING),
    alignSelf: 'center',
  },
  bar: {
    position: 'absolute',
    bottom: 0,
    width: BAR_WIDTH,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderWidth: 2,
    borderBottomWidth: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 4,
  },
  barNumber: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 12,
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
    borderColor: AppColors.border,
  },
  resetBtnText: {
    color: AppColors.textPrimary,
    fontWeight: 'bold',
  },
  playBtn: {
    backgroundColor: AppColors.primary,
    borderBottomColor: AppColors.primaryDark,
  },
  playBtnText: {
    color: '#000',
    fontWeight: 'bold',
  },
});
