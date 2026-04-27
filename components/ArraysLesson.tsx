import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    Easing,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { AppColors } from '../constants/theme';
import DuoBird from './DuoBird';

type LessonPhase = 'learn' | 'ready' | 'quiz' | 'pass' | 'fail';

type ChoiceQuestion = {
  id: string;
  type: 'multipleChoice' | 'trueFalse';
  title: string;
  prompt: string;
  options: string[];
  correctIndex: number;
};

type VisualQuestion = {
  id: string;
  type: 'visual';
  title: string;
  prompt: string;
  values: number[];
  expectedIndex: number;
};

type FillBlankQuestion = {
  id: string;
  type: 'fillBlank';
  title: string;
  prompt: string;
  answer: string;
  placeholder: string;
};

type Question = ChoiceQuestion | VisualQuestion | FillBlankQuestion;

const QUESTIONS: Question[] = [
  {
    id: 'q1',
    type: 'multipleChoice',
    title: 'What Is An Array?',
    prompt: 'Which statement best describes an array?',
    options: [
      'A collection of key-value pairs with random order',
      'A sequence of elements stored in contiguous memory',
      'A structure that only supports LIFO operations',
      'A graph where each node has two children',
    ],
    correctIndex: 1,
  },
  {
    id: 'q2',
    type: 'trueFalse',
    title: 'Zero Indexing',
    prompt: 'True or False: Arrays are zero-indexed in most programming languages.',
    options: ['True', 'False'],
    correctIndex: 0,
  },
  {
    id: 'q3',
    type: 'visual',
    title: 'Index Explorer',
    prompt: 'Tap index 2 in the array to reveal its value.',
    values: [12, 28, 42, 64],
    expectedIndex: 2,
  },
  {
    id: 'q4',
    type: 'multipleChoice',
    title: 'Access Complexity',
    prompt: 'What is the time complexity of accessing an array element by index?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
    correctIndex: 0,
  },
  {
    id: 'q5',
    type: 'fillBlank',
    title: 'Fill In The Blank',
    prompt: 'An array stores elements of the ___ type.',
    answer: 'same',
    placeholder: 'Type your answer',
  },
];

export default function ArraysLesson() {
  const router = useRouter();

  const [phase, setPhase] = useState<LessonPhase>('learn');
  const [learnSlideIndex, setLearnSlideIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [visualSelection, setVisualSelection] = useState<number | null>(null);
  const [blankAnswer, setBlankAnswer] = useState('');
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const question = QUESTIONS[currentIndex];
  const totalQuestions = QUESTIONS.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  const optionShakeX = useSharedValue(0);
  const sparkleOpacity = useSharedValue(0);
  const sparkleScale = useSharedValue(0);
  const sparkleY = useSharedValue(0);
  const xpScale = useSharedValue(1);
  const star1Scale = useSharedValue(0);
  const star2Scale = useSharedValue(0);
  const star3Scale = useSharedValue(0);

  const learnSlideOpacity = useSharedValue(1);
  const learnSlideX = useSharedValue(0);
  const box0Scale = useSharedValue(0);
  const box1Scale = useSharedValue(0);
  const box2Scale = useSharedValue(0);
  const box3Scale = useSharedValue(0);
  const box4Scale = useSharedValue(0);
  const slide2Pulse = useSharedValue(1);
  const card1Opacity = useSharedValue(0);
  const card2Opacity = useSharedValue(0);
  const card3Opacity = useSharedValue(0);
  const card1Y = useSharedValue(15);
  const card2Y = useSharedValue(15);
  const card3Y = useSharedValue(15);

  const learnValues = [10, 20, 30, 40, 50];

  const resetQuizProgress = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setVisualSelection(null);
    setBlankAnswer('');
    setIsEvaluated(false);
    setIsCorrect(false);
    setCorrectCount(0);
  };

  const starCount = useMemo(() => {
    const score = Math.round((correctCount / totalQuestions) * 100);
    if (score >= 90) return 3;
    if (score >= 80) return 2;
    if (score >= 60) return 1;
    return 0;
  }, [correctCount, totalQuestions]);

  const scorePercent = Math.round((correctCount / totalQuestions) * 100);
  const xpEarned = correctCount * 25;

  useEffect(() => {
    if (phase !== 'pass') return;

    const starValues = [star1Scale, star2Scale, star3Scale];
    starValues.forEach((v) => {
      v.value = 0;
    });

    for (let i = 0; i < starCount; i++) {
      starValues[i].value = withDelay(
        i * 150,
        withSequence(
          withTiming(1.2, { duration: 180, easing: Easing.out(Easing.quad) }),
          withSpring(1, { damping: 8, stiffness: 180 }),
        ),
      );
    }

    xpScale.value = withSequence(
      withTiming(1.15, { duration: 220 }),
      withSpring(1, { damping: 8, stiffness: 170 }),
    );
  }, [phase, starCount]);

  useEffect(() => {
    if (phase !== 'learn') return;

    learnSlideOpacity.value = 1;
    learnSlideX.value = 0;

    if (learnSlideIndex === 0) {
      box0Scale.value = 0;
      box1Scale.value = 0;
      box2Scale.value = 0;
      box3Scale.value = 0;
      box4Scale.value = 0;

      box0Scale.value = withDelay(0, withSpring(1, { damping: 8, stiffness: 180 }));
      box1Scale.value = withDelay(100, withSpring(1, { damping: 8, stiffness: 180 }));
      box2Scale.value = withDelay(200, withSpring(1, { damping: 8, stiffness: 180 }));
      box3Scale.value = withDelay(300, withSpring(1, { damping: 8, stiffness: 180 }));
      box4Scale.value = withDelay(400, withSpring(1, { damping: 8, stiffness: 180 }));
    }

    if (learnSlideIndex === 2) {
      card1Opacity.value = 0;
      card2Opacity.value = 0;
      card3Opacity.value = 0;
      card1Y.value = 15;
      card2Y.value = 15;
      card3Y.value = 15;

      card1Opacity.value = withDelay(0, withTiming(1, { duration: 250 }));
      card2Opacity.value = withDelay(150, withTiming(1, { duration: 250 }));
      card3Opacity.value = withDelay(300, withTiming(1, { duration: 250 }));
      card1Y.value = withDelay(0, withTiming(0, { duration: 250, easing: Easing.out(Easing.quad) }));
      card2Y.value = withDelay(150, withTiming(0, { duration: 250, easing: Easing.out(Easing.quad) }));
      card3Y.value = withDelay(300, withTiming(0, { duration: 250, easing: Easing.out(Easing.quad) }));
    }
  }, [phase, learnSlideIndex]);

  useEffect(() => {
    if (!(phase === 'learn' && learnSlideIndex === 1)) {
      slide2Pulse.value = 1;
      return;
    }

    slide2Pulse.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 500, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 500, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
  }, [phase, learnSlideIndex]);

  const sparkleStyle = useAnimatedStyle(() => ({
    opacity: sparkleOpacity.value,
    transform: [
      { scale: sparkleScale.value },
      { translateY: sparkleY.value },
    ],
  }));

  const optionShakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: optionShakeX.value }],
  }));

  const xpScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: xpScale.value }],
  }));

  const star1Style = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(star1Scale.value, [0, 1.2], [0, 1.2]) }],
    opacity: interpolate(star1Scale.value, [0, 0.2], [0, 1]),
  }));
  const star2Style = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(star2Scale.value, [0, 1.2], [0, 1.2]) }],
    opacity: interpolate(star2Scale.value, [0, 0.2], [0, 1]),
  }));
  const star3Style = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(star3Scale.value, [0, 1.2], [0, 1.2]) }],
    opacity: interpolate(star3Scale.value, [0, 0.2], [0, 1]),
  }));

  const learnSlideStyle = useAnimatedStyle(() => ({
    opacity: learnSlideOpacity.value,
    transform: [{ translateX: learnSlideX.value }],
  }));

  const box0Style = useAnimatedStyle(() => ({ transform: [{ scale: box0Scale.value }] }));
  const box1Style = useAnimatedStyle(() => ({ transform: [{ scale: box1Scale.value }] }));
  const box2Style = useAnimatedStyle(() => ({ transform: [{ scale: box2Scale.value }] }));
  const box3Style = useAnimatedStyle(() => ({ transform: [{ scale: box3Scale.value }] }));
  const box4Style = useAnimatedStyle(() => ({ transform: [{ scale: box4Scale.value }] }));

  const slide2HighlightStyle = useAnimatedStyle(() => ({
    opacity: slide2Pulse.value,
  }));

  const card1Style = useAnimatedStyle(() => ({
    opacity: card1Opacity.value,
    transform: [{ translateY: card1Y.value }],
  }));
  const card2Style = useAnimatedStyle(() => ({
    opacity: card2Opacity.value,
    transform: [{ translateY: card2Y.value }],
  }));
  const card3Style = useAnimatedStyle(() => ({
    opacity: card3Opacity.value,
    transform: [{ translateY: card3Y.value }],
  }));

  const canSubmit = (() => {
    if (question.type === 'multipleChoice' || question.type === 'trueFalse') {
      return selectedOption !== null;
    }
    if (question.type === 'visual') {
      return visualSelection !== null;
    }
    return blankAnswer.trim().length > 0;
  })();

  const triggerSuccessSparkle = () => {
    sparkleOpacity.value = 0;
    sparkleScale.value = 0;
    sparkleY.value = 0;

    sparkleOpacity.value = withSequence(
      withTiming(1, { duration: 140 }),
      withDelay(300, withTiming(0, { duration: 220 })),
    );
    sparkleScale.value = withSequence(
      withSpring(1.2, { damping: 7, stiffness: 180 }),
      withTiming(1, { duration: 120 }),
    );
    sparkleY.value = withTiming(-16, { duration: 520, easing: Easing.out(Easing.quad) });
  };

  const triggerShake = () => {
    optionShakeX.value = withSequence(
      withTiming(-8, { duration: 40 }),
      withTiming(8, { duration: 40 }),
      withTiming(-6, { duration: 40 }),
      withTiming(6, { duration: 40 }),
      withTiming(-4, { duration: 40 }),
      withTiming(4, { duration: 40 }),
      withTiming(0, { duration: 40 }),
    );
  };

  const evaluateAnswer = () => {
    let answerIsCorrect = false;

    if (question.type === 'multipleChoice' || question.type === 'trueFalse') {
      answerIsCorrect = selectedOption === question.correctIndex;
    } else if (question.type === 'visual') {
      answerIsCorrect = visualSelection === question.expectedIndex;
    } else {
      const fillBlankQuestion = question as FillBlankQuestion;
      answerIsCorrect = blankAnswer.trim().toLowerCase() === fillBlankQuestion.answer;
    }

    setIsEvaluated(true);
    setIsCorrect(answerIsCorrect);

    if (answerIsCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      triggerSuccessSparkle();
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      triggerShake();
    }
  };

  const goToNext = () => {
    const nextCorrectCount = correctCount + (isCorrect ? 1 : 0);

    if (isLastQuestion) {
      const finalScore = Math.round((nextCorrectCount / totalQuestions) * 100);
      setCorrectCount(nextCorrectCount);
      setPhase(finalScore >= 60 ? 'pass' : 'fail');
      return;
    }

    setCorrectCount(nextCorrectCount);
    setCurrentIndex((prev) => prev + 1);
    setSelectedOption(null);
    setVisualSelection(null);
    setBlankAnswer('');
    setIsEvaluated(false);
    setIsCorrect(false);
  };

  const onPrimaryPress = () => {
    if (!isEvaluated) {
      evaluateAnswer();
      return;
    }
    goToNext();
  };

  const persistLessonResultAndExit = (passed: boolean) => {
    const score = Math.round((correctCount / totalQuestions) * 100);
    const xp = correctCount * 25;
    router.replace(
      `/(tabs)/data-structures?lesson=arrays&nodeId=1&passed=${passed ? 1 : 0}&score=${score}&correct=${correctCount}&total=${totalQuestions}&xp=${xp}&ts=${Date.now()}`,
    );
  };

  const showNextLearnSlide = (nextIndex: number) => {
    setLearnSlideIndex(nextIndex);
    learnSlideX.value = 30;
    learnSlideOpacity.value = 0;
    learnSlideOpacity.value = withTiming(1, { duration: 250 });
    learnSlideX.value = withTiming(0, { duration: 250, easing: Easing.out(Easing.quad) });
  };

  const goToNextLearnSlide = () => {
    if (learnSlideIndex >= 2) {
      setPhase('ready');
      return;
    }

    const nextIndex = learnSlideIndex + 1;
    learnSlideOpacity.value = withTiming(0, { duration: 250 });
    learnSlideX.value = withTiming(-30, { duration: 250, easing: Easing.in(Easing.quad) }, (finished) => {
      if (!finished) return;
      runOnJS(showNextLearnSlide)(nextIndex);
    });
  };

  const startQuizFromReady = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    resetQuizProgress();
    setPhase('quiz');
  };

  const restartLesson = () => {
    setPhase('quiz');
    resetQuizProgress();
  };

  const renderChoiceQuestion = (q: ChoiceQuestion) => {
    return (
      <View style={styles.optionsWrap}>
        {q.options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          const showCorrect = isEvaluated && idx === q.correctIndex;
          const showWrong = isEvaluated && isSelected && idx !== q.correctIndex;

          return (
            <Animated.View
              key={`${q.id}-opt-${idx}`}
              style={showWrong ? optionShakeStyle : undefined}
            >
              <TouchableOpacity
                activeOpacity={0.85}
                disabled={isEvaluated}
                onPress={() => setSelectedOption(idx)}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                  showCorrect && styles.optionCardCorrect,
                  showWrong && styles.optionCardWrong,
                ]}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    );
  };

  const renderVisualQuestion = (q: VisualQuestion) => {
    return (
      <View style={styles.visualWrap}>
        <Text style={styles.visualHint}>Tap an index card below</Text>
        <View style={styles.visualArrayRow}>
          {q.values.map((value, idx) => {
            const isSelected = visualSelection === idx;
            const isCorrectIdx = idx === q.expectedIndex;
            const showCorrect = isEvaluated && isCorrectIdx;
            const showWrong = isEvaluated && isSelected && !isCorrectIdx;

            return (
              <TouchableOpacity
                key={`vis-${idx}`}
                activeOpacity={0.85}
                disabled={isEvaluated}
                onPress={() => setVisualSelection(idx)}
                style={[
                  styles.visualCard,
                  isSelected && styles.visualCardSelected,
                  showCorrect && styles.optionCardCorrect,
                  showWrong && styles.optionCardWrong,
                ]}
              >
                <Text style={styles.visualIndex}>index {idx}</Text>
                <Text style={styles.visualValue}>{value}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {visualSelection !== null && (
          <View style={styles.visualRevealBox}>
            <Text style={styles.visualRevealText}>
              Selected index {visualSelection} has value {q.values[visualSelection]}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderFillBlankQuestion = (q: FillBlankQuestion) => {
    const isCorrectFill = isEvaluated && blankAnswer.trim().toLowerCase() === q.answer;
    const isWrongFill = isEvaluated && !isCorrectFill;

    return (
      <View>
        <TextInput
          value={blankAnswer}
          onChangeText={setBlankAnswer}
          editable={!isEvaluated}
          placeholder={q.placeholder}
          placeholderTextColor={AppColors.textMuted}
          style={[
            styles.blankInput,
            isCorrectFill && styles.optionCardCorrect,
            isWrongFill && styles.optionCardWrong,
          ]}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {isWrongFill && (
          <Text style={styles.answerHint}>Correct answer: same</Text>
        )}
      </View>
    );
  };

  if (phase === 'pass') {
    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.resultCenter}>
          <View style={styles.starsRow}>
            <Animated.Text style={[styles.starIcon, star1Style]}>{starCount >= 1 ? '⭐' : '☆'}</Animated.Text>
            <Animated.Text style={[styles.starIcon, star2Style]}>{starCount >= 2 ? '⭐' : '☆'}</Animated.Text>
            <Animated.Text style={[styles.starIcon, star3Style]}>{starCount >= 3 ? '⭐' : '☆'}</Animated.Text>
          </View>

          <Text style={styles.resultTitle}>Lesson Complete!</Text>
          <Text style={styles.resultSubtitle}>{correctCount}/{totalQuestions} correct • {scorePercent}%</Text>

          <Animated.View style={[styles.xpCard, xpScaleStyle]}>
            <Text style={styles.xpTitle}>XP Earned</Text>
            <Text style={styles.xpValue}>+{xpEarned}</Text>
          </Animated.View>

          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.primaryAction}
            onPress={() => persistLessonResultAndExit(true)}
          >
            <LinearGradient
              colors={[AppColors.primaryLight, AppColors.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryGradient}
            >
              <Text style={styles.primaryActionText}>Continue</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (phase === 'fail') {
    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.resultCenter}>
          <DuoBird size={120} animate animationMode="heartbroken" />
          <Text style={styles.resultTitle}>Almost there!</Text>
          <Text style={styles.resultSubtitle}>{correctCount}/{totalQuestions} correct • {scorePercent}%</Text>

          <TouchableOpacity style={styles.primaryAction} activeOpacity={0.9} onPress={restartLesson}>
            <LinearGradient
              colors={[AppColors.orange, AppColors.orangeDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryGradient}
            >
              <Text style={styles.primaryActionText}>Try Again</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryAction}
            activeOpacity={0.85}
            onPress={() => persistLessonResultAndExit(false)}
          >
            <Text style={styles.secondaryActionText}>Practice more</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (phase === 'learn') {
    const boxStyles = [box0Style, box1Style, box2Style, box3Style, box4Style];

    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.learnCounterText}>{learnSlideIndex + 1} of 3</Text>
        </View>

        <Animated.View style={[styles.learnSlideWrap, learnSlideStyle]}>
          {learnSlideIndex === 0 && (
            <>
              <View style={styles.learnVisualWrap}>
                <View style={styles.learnArrayRow}>
                  {learnValues.map((value, idx) => (
                    <View key={`learn-arr-${idx}`} style={styles.learnArrayColumn}>
                      <Animated.View style={[styles.learnArrayBox, boxStyles[idx]]}>
                        <Text style={styles.learnArrayValue}>{value}</Text>
                      </Animated.View>
                      <Text style={styles.learnArrayIndex}>{idx}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <Text style={styles.learnHeading}>What is an array?</Text>
              <Text style={styles.learnExplanation}>
                An array is a collection of items stored in order.
              </Text>
              <Text style={styles.learnExplanation}>
                Each item has a position called an index, starting from 0.
              </Text>
            </>
          )}

          {learnSlideIndex === 1 && (
            <>
              <View style={styles.learnVisualWrap}>
                <View style={styles.learnArrayRow}>
                  {learnValues.map((value, idx) => (
                    <View key={`learn-access-${idx}`} style={styles.learnArrayColumn}>
                      {idx === 2 ? (
                        <View style={styles.learnPointerWrap}>
                          <Text style={styles.learnPointerLabel}>array[2] = 30</Text>
                          <Text style={styles.learnPointerArrow}>▼</Text>
                        </View>
                      ) : (
                        <View style={styles.learnPointerSpacer} />
                      )}

                      <Animated.View
                        style={[
                          styles.learnArrayBox,
                          idx === 2 && styles.learnArrayBoxHighlight,
                          idx === 2 && slide2HighlightStyle,
                        ]}
                      >
                        <Text style={styles.learnArrayValue}>{value}</Text>
                      </Animated.View>
                      <Text style={styles.learnArrayIndex}>{idx}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <Text style={styles.learnHeading}>Accessing by index</Text>
              <Text style={styles.learnExplanation}>
                You can instantly access any element using its index.
              </Text>
              <Text style={styles.learnExplanation}>
                This is called O(1) access - it&apos;s extremely fast,
              </Text>
              <Text style={styles.learnExplanation}>no matter how large the array is.</Text>
            </>
          )}

          {learnSlideIndex === 2 && (
            <>
              <View style={styles.learnVisualWrap}>
                <View style={styles.learnCardsRow}>
                  <Animated.View style={[styles.learnRealCard, card1Style]}>
                    <Text style={styles.learnCardEmoji}>🎵</Text>
                    <Text style={styles.learnCardLabel}>Playlist</Text>
                  </Animated.View>
                  <Animated.View style={[styles.learnRealCard, card2Style]}>
                    <Text style={styles.learnCardEmoji}>📸</Text>
                    <Text style={styles.learnCardLabel}>Photos</Text>
                  </Animated.View>
                  <Animated.View style={[styles.learnRealCard, card3Style]}>
                    <Text style={styles.learnCardEmoji}>🏆</Text>
                    <Text style={styles.learnCardLabel}>Scores</Text>
                  </Animated.View>
                </View>
              </View>
              <Text style={styles.learnHeading}>Arrays are everywhere</Text>
              <Text style={styles.learnExplanation}>
                Music playlists, photo galleries, leaderboards -
              </Text>
              <Text style={styles.learnExplanation}>all use arrays under the hood. Order matters,</Text>
              <Text style={styles.learnExplanation}>and fast access makes them perfect for lists.</Text>
            </>
          )}
        </Animated.View>

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.primaryAction}
          onPress={goToNextLearnSlide}
        >
          <LinearGradient
            colors={[AppColors.blue, AppColors.blueDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.primaryGradient}
          >
            <Text style={styles.primaryActionText}>
              {learnSlideIndex === 2 ? "Got it! Let's practice ->" : 'Next'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  if (phase === 'ready') {
    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.readyCenter}>
          <Text style={styles.readyEmoji}>🎯</Text>
          <Text style={styles.readyTitle}>Ready to practice?</Text>
          <Text style={styles.readySubtitle}>
            You&apos;ve learned the basics. Now let&apos;s test your knowledge!
          </Text>
          <Text style={styles.readySummary}>3 concepts covered</Text>

          <TouchableOpacity activeOpacity={0.9} style={styles.primaryAction} onPress={startQuizFromReady}>
            <LinearGradient
              colors={[AppColors.primaryLight, AppColors.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryGradient}
            >
              <Text style={styles.primaryActionText}>Start Quiz</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <View style={styles.progressWrap}>
          <View style={[styles.progressFill, { width: `${((currentIndex + 1) / totalQuestions) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>{currentIndex + 1}/{totalQuestions}</Text>
      </View>

      <Text style={styles.questionTitle}>{question.title}</Text>
      <Text style={styles.questionPrompt}>{question.prompt}</Text>

      <Animated.View pointerEvents="none" style={[styles.sparkleWrap, sparkleStyle]}>
        <Text style={styles.sparkleText}>✨ Great!</Text>
      </Animated.View>

      <View style={styles.questionBody}>
        {(question.type === 'multipleChoice' || question.type === 'trueFalse') && renderChoiceQuestion(question)}
        {question.type === 'visual' && renderVisualQuestion(question)}
        {question.type === 'fillBlank' && renderFillBlankQuestion(question)}
      </View>

      {isEvaluated && (
        <Text style={[styles.feedbackText, isCorrect ? styles.feedbackCorrect : styles.feedbackWrong]}>
          {isCorrect ? 'Correct! Nice work.' : 'Not quite. Check the correct answer and continue.'}
        </Text>
      )}

      <TouchableOpacity
        activeOpacity={0.9}
        disabled={!isEvaluated && !canSubmit}
        style={[
          styles.primaryAction,
          (!isEvaluated && !canSubmit) && styles.disabledAction,
        ]}
        onPress={onPrimaryPress}
      >
        <LinearGradient
          colors={[AppColors.blue, AppColors.blueDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.primaryGradient}
        >
          <Text style={styles.primaryActionText}>{isEvaluated ? (isLastQuestion ? 'Finish' : 'Continue') : 'Next'}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.bg,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: AppColors.bgElevated,
    borderWidth: 1,
    borderColor: AppColors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnText: {
    color: AppColors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginTop: -1,
  },
  progressWrap: {
    flex: 1,
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: AppColors.bgElevated,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  progressFill: {
    height: '100%',
    backgroundColor: AppColors.primary,
  },
  progressText: {
    color: AppColors.textSecondary,
    fontWeight: '700',
    fontSize: 13,
  },
  learnCounterText: {
    color: AppColors.textSecondary,
    fontWeight: '700',
    fontSize: 14,
  },
  learnSlideWrap: {
    flex: 1,
  },
  learnVisualWrap: {
    minHeight: 220,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  learnArrayRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 8,
  },
  learnArrayColumn: {
    alignItems: 'center',
    width: 52,
  },
  learnArrayBox: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: AppColors.bgCard,
    borderWidth: 1,
    borderColor: AppColors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  learnArrayBoxHighlight: {
    borderColor: AppColors.primary,
    backgroundColor: '#17361A',
  },
  learnArrayValue: {
    color: AppColors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  learnArrayIndex: {
    marginTop: 8,
    color: AppColors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  learnPointerWrap: {
    height: 38,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 6,
  },
  learnPointerSpacer: {
    height: 38,
    marginBottom: 6,
  },
  learnPointerLabel: {
    color: AppColors.primary,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: -2,
  },
  learnPointerArrow: {
    color: AppColors.primary,
    fontSize: 18,
    lineHeight: 20,
  },
  learnCardsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
  },
  learnRealCard: {
    width: 80,
    height: 90,
    borderRadius: 14,
    backgroundColor: AppColors.bgCard,
    borderWidth: 1,
    borderColor: AppColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  learnCardEmoji: {
    fontSize: 26,
    marginBottom: 6,
  },
  learnCardLabel: {
    color: AppColors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  learnHeading: {
    color: AppColors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 10,
  },
  learnExplanation: {
    color: AppColors.textMuted,
    fontSize: 16,
    lineHeight: 24,
  },
  readyCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  readyEmoji: {
    fontSize: 64,
    marginBottom: 6,
  },
  readyTitle: {
    color: AppColors.textPrimary,
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
  },
  readySubtitle: {
    color: AppColors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
    marginBottom: 4,
  },
  readySummary: {
    color: AppColors.primaryLight,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10,
  },
  questionTitle: {
    color: AppColors.textPrimary,
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 10,
  },
  questionPrompt: {
    color: AppColors.textSecondary,
    fontSize: 17,
    lineHeight: 26,
    marginBottom: 18,
  },
  sparkleWrap: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  sparkleText: {
    color: AppColors.gold,
    fontWeight: '800',
    fontSize: 18,
  },
  questionBody: {
    flex: 1,
  },
  optionsWrap: {
    gap: 10,
  },
  optionCard: {
    backgroundColor: AppColors.bgCard,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 14,
  },
  optionCardSelected: {
    borderColor: AppColors.blue,
    backgroundColor: '#13263A',
  },
  optionCardCorrect: {
    borderColor: AppColors.success,
    backgroundColor: '#17361A',
  },
  optionCardWrong: {
    borderColor: AppColors.error,
    backgroundColor: '#3A1717',
  },
  optionText: {
    color: AppColors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  visualWrap: {
    gap: 12,
  },
  visualHint: {
    color: AppColors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  visualArrayRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  visualCard: {
    backgroundColor: AppColors.bgCard,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    minWidth: '47%',
  },
  visualCardSelected: {
    borderColor: AppColors.blue,
    backgroundColor: '#11263A',
  },
  visualIndex: {
    color: AppColors.textSecondary,
    fontSize: 12,
    marginBottom: 4,
    fontWeight: '700',
  },
  visualValue: {
    color: AppColors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  visualRevealBox: {
    backgroundColor: AppColors.bgElevated,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 12,
    padding: 10,
  },
  visualRevealText: {
    color: AppColors.primaryLight,
    fontWeight: '700',
    fontSize: 13,
  },
  blankInput: {
    backgroundColor: AppColors.bgCard,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: AppColors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  answerHint: {
    marginTop: 10,
    color: AppColors.success,
    fontSize: 13,
    fontWeight: '700',
  },
  feedbackText: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  feedbackCorrect: {
    color: AppColors.success,
  },
  feedbackWrong: {
    color: AppColors.error,
  },
  primaryAction: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  disabledAction: {
    opacity: 0.45,
  },
  primaryGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryActionText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  resultCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  starIcon: {
    fontSize: 48,
  },
  resultTitle: {
    color: AppColors.textPrimary,
    fontSize: 34,
    fontWeight: '800',
    textAlign: 'center',
  },
  resultSubtitle: {
    color: AppColors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  xpCard: {
    backgroundColor: AppColors.bgCard,
    borderWidth: 1,
    borderColor: AppColors.borderLight,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginVertical: 8,
  },
  xpTitle: {
    color: AppColors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  xpValue: {
    color: AppColors.gold,
    fontSize: 28,
    fontWeight: '800',
  },
  secondaryAction: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  secondaryActionText: {
    color: AppColors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
