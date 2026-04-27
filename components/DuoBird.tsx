import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
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
import Svg, {
  Circle,
  Defs,
  Ellipse,
  LinearGradient,
  Path,
  RadialGradient,
  Stop,
} from 'react-native-svg';

interface DuoBirdProps {
  size?: number;
  style?: any;
  animate?: boolean;
  animationMode?: 'idle' | 'flying' | 'heartbroken';
  onAnimationModeComplete?: (mode: 'idle' | 'flying' | 'heartbroken') => void;
}

export default function DuoBird({
  size = 120,
  style,
  animate = true,
  animationMode = 'idle',
  onAnimationModeComplete,
}: DuoBirdProps) {
  // Wing flap animation
  const wingFlap = useSharedValue(0);
  // Wing droop amount for heartbroken mode
  const wingDroop = useSharedValue(0);
  // Body bob animation
  const bodyBob = useSharedValue(0);
  // Body slump amount for heartbroken mode
  const bodySlump = useSharedValue(0);
  // Tail wag
  const tailWag = useSharedValue(0);
  // Eye blink
  const eyeBlink = useSharedValue(0);
  // Breathing (body expand/contract)
  const breathing = useSharedValue(0);
  // Head tilt
  const headTilt = useSharedValue(0);
  // Heartbroken floating heart
  const brokenHeartFloatY = useSharedValue(0);
  const brokenHeartOpacity = useSharedValue(0);
  const brokenHeartScale = useSharedValue(0);

  useEffect(() => {
    if (!animate) return;

    const runIdleMotion = () => {
      wingDroop.value = withTiming(0, { duration: 300 });
      bodySlump.value = withTiming(0, { duration: 300 });
      brokenHeartOpacity.value = withTiming(0, { duration: 120 });

      wingFlap.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 200, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 250, easing: Easing.in(Easing.quad) }),
        ),
        -1,
        false,
      );

      bodyBob.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 600, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 600, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      );

      tailWag.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 350, easing: Easing.inOut(Easing.sin) }),
          withTiming(-1, { duration: 350, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      );

      eyeBlink.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 2500 }),
          withTiming(1, { duration: 80 }),
          withTiming(0, { duration: 120 }),
          withTiming(0, { duration: 800 }),
          withTiming(1, { duration: 80 }),
          withTiming(0, { duration: 120 }),
        ),
        -1,
        false,
      );

      breathing.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      );

      headTilt.value = withRepeat(
        withSequence(
          withDelay(1500, withTiming(1, { duration: 400, easing: Easing.inOut(Easing.quad) })),
          withTiming(-1, { duration: 800, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: 400, easing: Easing.inOut(Easing.quad) }),
          withDelay(2000, withTiming(0, { duration: 100 })),
        ),
        -1,
        false,
      );
    };

    if (animationMode === 'flying') {
      wingDroop.value = withTiming(0, { duration: 250 });
      bodySlump.value = withTiming(0, { duration: 250 });
      brokenHeartOpacity.value = withTiming(0, { duration: 120 });

      wingFlap.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 140, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 160, easing: Easing.in(Easing.quad) }),
        ),
        -1,
        false,
      );

      bodyBob.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 350, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 350, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      );

      tailWag.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 200, easing: Easing.inOut(Easing.sin) }),
          withTiming(-1, { duration: 200, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      );

      breathing.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 700, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 700, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      );

      headTilt.value = withRepeat(
        withSequence(
          withTiming(0.5, { duration: 250, easing: Easing.inOut(Easing.quad) }),
          withTiming(-0.5, { duration: 250, easing: Easing.inOut(Easing.quad) }),
        ),
        -1,
        false,
      );

      eyeBlink.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 1300 }),
          withTiming(1, { duration: 60 }),
          withTiming(0, { duration: 100 }),
        ),
        -1,
        false,
      );

      return;
    }

    if (animationMode === 'heartbroken') {
      wingFlap.value = withTiming(0, { duration: 350 });
      wingDroop.value = withTiming(1, { duration: 450, easing: Easing.out(Easing.cubic) });
      bodySlump.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.quad) });
      tailWag.value = withTiming(0, { duration: 300 });
      bodyBob.value = withTiming(0, { duration: 300 });
      headTilt.value = withTiming(-1, { duration: 500, easing: Easing.out(Easing.quad) });

      breathing.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      );

      eyeBlink.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 2800 }),
          withTiming(1, { duration: 90 }),
          withTiming(0, { duration: 120 }),
        ),
        -1,
        false,
      );

      brokenHeartOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 180, easing: Easing.out(Easing.quad) }),
          withDelay(250, withTiming(0, { duration: 260 })),
        ),
        3,
        false,
      );
      brokenHeartFloatY.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 0 }),
          withTiming(-30, { duration: 700, easing: Easing.out(Easing.quad) }),
        ),
        3,
        false,
      );
      brokenHeartScale.value = withRepeat(
        withSequence(
          withSpring(1.1, { damping: 8, stiffness: 180 }),
          withTiming(0.9, { duration: 280 }),
        ),
        3,
        false,
      );

      const completionTimer = setTimeout(() => {
        onAnimationModeComplete?.('heartbroken');
      }, 3000);

      return () => clearTimeout(completionTimer);
    }

    runIdleMotion();
  }, [animate, animationMode, onAnimationModeComplete]);

  const bodyStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(bodyBob.value, [0, 1], [0, -5]) + interpolate(bodySlump.value, [0, 1], [0, 8]) },
      { rotate: `${interpolate(bodySlump.value, [0, 1], [0, 4])}deg` },
      { scaleX: interpolate(breathing.value, [0, 1], [1, 1.02]) },
      { scaleY: interpolate(breathing.value, [0, 1], [1, 0.98]) },
    ],
  }));

  const leftWingStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(wingFlap.value, [0, 1], [8, -50]) + interpolate(wingDroop.value, [0, 1], [0, -48])}deg`,
      },
    ],
  }));

  const rightWingStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(wingFlap.value, [0, 1], [-8, 50]) + interpolate(wingDroop.value, [0, 1], [0, 48])}deg`,
      },
    ],
  }));

  const tailStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(tailWag.value, [-1, 1], [-10, 10])}deg` },
    ],
  }));

  const headStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(headTilt.value, [-1, 1], [6, -4])}deg` },
    ],
  }));

  const eyeBlinkStyle = useAnimatedStyle(() => ({
    transform: [
      { scaleY: interpolate(eyeBlink.value, [0, 1], [1, 0.05]) },
    ],
  }));

  const brokenHeartStyle = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: w * 0.44,
    top: h * 0.02 + brokenHeartFloatY.value,
    opacity: brokenHeartOpacity.value,
    transform: [{ scale: interpolate(brokenHeartScale.value, [0, 1], [0.5, 1]) }],
    zIndex: 30,
  }));

  const w = size;
  const h = size * 1.2;

  return (
    <View style={[{ width: w, height: h }, style]}>
      {/* Body with bob + breathing animation */}
      <Animated.View style={[{ width: w, height: h }, bodyStyle]}>

        {/* Heartbroken indicator */}
        <Animated.View pointerEvents="none" style={brokenHeartStyle}>
          <Text style={{ fontSize: size * 0.24 }}>💔</Text>
        </Animated.View>

        {/* Left Wing - animated flapping */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              left: -size * 0.16,
              top: size * 0.22,
              width: size * 0.5,
              height: size * 0.55,
              transformOrigin: 'right center',
            },
            leftWingStyle,
          ]}>
          <Svg width="100%" height="100%" viewBox="0 0 100 120">
            <Defs>
              <LinearGradient id="lwGrad" x1="0%" y1="0%" x2="100%" y2="80%">
                <Stop offset="0%" stopColor="#5ED400" />
                <Stop offset="50%" stopColor="#4DB800" />
                <Stop offset="100%" stopColor="#3D9400" />
              </LinearGradient>
            </Defs>
            {/* Main wing shape with more detailed form */}
            <Path
              d="M 90 60 Q 78 22, 48 8 Q 28 0, 12 12 Q 0 28, 6 48 Q 10 62, 28 74 Q 48 86, 82 82 Z"
              fill="url(#lwGrad)"
            />
            {/* Feather details */}
            <Path d="M 82 66 Q 58 32, 28 16" stroke="#6ADE10" strokeWidth="2.5" fill="none" opacity="0.5" />
            <Path d="M 76 74 Q 52 46, 20 32" stroke="#6ADE10" strokeWidth="2" fill="none" opacity="0.35" />
            <Path d="M 70 80 Q 46 56, 16 44" stroke="#6ADE10" strokeWidth="1.5" fill="none" opacity="0.25" />
            {/* Wing tip feathers — more detailed */}
            <Path d="M 12 12 Q 3 6, 6 0 Q 10 5, 16 10" fill="#3D9400" opacity="0.7" />
            <Path d="M 22 6 Q 16 -2, 22 -4 Q 23 3, 26 8" fill="#3D9400" opacity="0.5" />
            <Path d="M 34 4 Q 30 -3, 36 -3 Q 36 2, 37 7" fill="#46A302" opacity="0.4" />
          </Svg>
        </Animated.View>

        {/* Right Wing - animated flapping */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              right: -size * 0.16,
              top: size * 0.22,
              width: size * 0.5,
              height: size * 0.55,
              transformOrigin: 'left center',
            },
            rightWingStyle,
          ]}>
          <Svg width="100%" height="100%" viewBox="0 0 100 120">
            <Defs>
              <LinearGradient id="rwGrad" x1="100%" y1="0%" x2="0%" y2="80%">
                <Stop offset="0%" stopColor="#5ED400" />
                <Stop offset="50%" stopColor="#4DB800" />
                <Stop offset="100%" stopColor="#3D9400" />
              </LinearGradient>
            </Defs>
            <Path
              d="M 10 60 Q 22 22, 52 8 Q 72 0, 88 12 Q 100 28, 94 48 Q 90 62, 72 74 Q 52 86, 18 82 Z"
              fill="url(#rwGrad)"
            />
            <Path d="M 18 66 Q 42 32, 72 16" stroke="#6ADE10" strokeWidth="2.5" fill="none" opacity="0.5" />
            <Path d="M 24 74 Q 48 46, 80 32" stroke="#6ADE10" strokeWidth="2" fill="none" opacity="0.35" />
            <Path d="M 30 80 Q 54 56, 84 44" stroke="#6ADE10" strokeWidth="1.5" fill="none" opacity="0.25" />
            <Path d="M 88 12 Q 97 6, 94 0 Q 90 5, 84 10" fill="#3D9400" opacity="0.7" />
            <Path d="M 78 6 Q 84 -2, 78 -4 Q 77 3, 74 8" fill="#3D9400" opacity="0.5" />
            <Path d="M 66 4 Q 70 -3, 64 -3 Q 64 2, 63 7" fill="#46A302" opacity="0.4" />
          </Svg>
        </Animated.View>

        {/* Tail feathers - animated wag */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              left: size * 0.28,
              bottom: size * 0.0,
              width: size * 0.44,
              height: size * 0.28,
              transformOrigin: 'center top',
            },
            tailStyle,
          ]}>
          <Svg width="100%" height="100%" viewBox="0 0 90 55">
            <Path d="M 25 0 Q 10 22, 0 50 Q 15 42, 22 18 Z" fill="#3D9400" />
            <Path d="M 35 0 Q 28 28, 22 50 Q 32 38, 38 14 Z" fill="#46A302" />
            <Path d="M 45 0 Q 45 30, 45 50 Q 50 32, 48 10 Z" fill="#4DB800" />
            <Path d="M 55 0 Q 62 28, 68 50 Q 58 38, 52 14 Z" fill="#46A302" />
            <Path d="M 65 0 Q 80 22, 90 50 Q 75 42, 68 18 Z" fill="#3D9400" />
          </Svg>
        </Animated.View>

        {/* Main Bird Body SVG */}
        <Animated.View style={headStyle}>
          <Svg width={w} height={h} viewBox="0 0 280 336">
          <Defs>
            <RadialGradient id="bodyGrad" cx="50%" cy="38%" r="55%">
              <Stop offset="0%" stopColor="#80E812" />
              <Stop offset="40%" stopColor="#5ED400" />
              <Stop offset="70%" stopColor="#58CC02" />
              <Stop offset="100%" stopColor="#46A302" />
            </RadialGradient>
            <RadialGradient id="bellyGrad" cx="50%" cy="28%" r="58%">
              <Stop offset="0%" stopColor="#C0F570" />
              <Stop offset="40%" stopColor="#A8ED35" />
              <Stop offset="100%" stopColor="#89E219" />
            </RadialGradient>
            <RadialGradient id="headGrad" cx="48%" cy="42%" r="55%">
              <Stop offset="0%" stopColor="#82E815" />
              <Stop offset="50%" stopColor="#5ED400" />
              <Stop offset="100%" stopColor="#58CC02" />
            </RadialGradient>
            <LinearGradient id="beakTopGrad" x1="50%" y1="0%" x2="50%" y2="100%">
              <Stop offset="0%" stopColor="#FFCC40" />
              <Stop offset="100%" stopColor="#FF9500" />
            </LinearGradient>
            <LinearGradient id="beakBotGrad" x1="50%" y1="0%" x2="50%" y2="100%">
              <Stop offset="0%" stopColor="#FF8C00" />
              <Stop offset="100%" stopColor="#D86A00" />
            </LinearGradient>
            <LinearGradient id="legGrad" x1="50%" y1="0%" x2="50%" y2="100%">
              <Stop offset="0%" stopColor="#FFAA00" />
              <Stop offset="100%" stopColor="#D87A00" />
            </LinearGradient>
            <RadialGradient id="eyeWhiteGrad" cx="42%" cy="40%" r="55%">
              <Stop offset="0%" stopColor="#FFFFFF" />
              <Stop offset="100%" stopColor="#F0F0F0" />
            </RadialGradient>
            <RadialGradient id="cheekGrad" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#FFB0C0" />
              <Stop offset="100%" stopColor="#FF9EAA" />
            </RadialGradient>
          </Defs>

          {/* Shadow */}
          <Ellipse cx="140" cy="322" rx="60" ry="8" fill="#000" opacity="0.1" />

          {/* Legs */}
          <Path d="M 115 260 L 108 288" stroke="url(#legGrad)" strokeWidth="7" strokeLinecap="round" fill="none" />
          <Path d="M 108 288 Q 94 292, 86 296" stroke="url(#legGrad)" strokeWidth="5.5" strokeLinecap="round" fill="none" />
          <Path d="M 108 288 Q 102 296, 96 303" stroke="url(#legGrad)" strokeWidth="5.5" strokeLinecap="round" fill="none" />
          <Path d="M 108 288 Q 114 296, 118 302" stroke="url(#legGrad)" strokeWidth="5.5" strokeLinecap="round" fill="none" />

          <Path d="M 165 260 L 172 288" stroke="url(#legGrad)" strokeWidth="7" strokeLinecap="round" fill="none" />
          <Path d="M 172 288 Q 186 292, 194 296" stroke="url(#legGrad)" strokeWidth="5.5" strokeLinecap="round" fill="none" />
          <Path d="M 172 288 Q 178 296, 184 303" stroke="url(#legGrad)" strokeWidth="5.5" strokeLinecap="round" fill="none" />
          <Path d="M 172 288 Q 166 296, 162 302" stroke="url(#legGrad)" strokeWidth="5.5" strokeLinecap="round" fill="none" />

          {/* Body */}
          <Ellipse cx="140" cy="195" rx="78" ry="82" fill="url(#bodyGrad)" />
          {/* Body sheen */}
          <Path d="M 78 162 Q 100 135, 138 132" stroke="#9AF030" strokeWidth="3.5" fill="none" opacity="0.3" strokeLinecap="round" />
          <Path d="M 82 172 Q 98 152, 128 148" stroke="#9AF030" strokeWidth="2" fill="none" opacity="0.2" strokeLinecap="round" />

          {/* Belly */}
          <Ellipse cx="140" cy="218" rx="52" ry="52" fill="url(#bellyGrad)" />
          <Ellipse cx="134" cy="202" rx="30" ry="24" fill="#D0F890" opacity="0.25" />

          {/* Head with tilt */}
          <Circle cx="140" cy="105" r="68" fill="url(#headGrad)" />
          <Path d="M 88 78 Q 112 50, 150 48" stroke="#9AF030" strokeWidth="3" fill="none" opacity="0.25" strokeLinecap="round" />

          {/* Head Crest — more feathers */}
          <Path d="M 120 48 Q 112 18, 108 2 Q 116 16, 124 42" fill="#4DB800" />
          <Path d="M 132 44 Q 128 10, 126 -4 Q 134 12, 136 40" fill="#58CC02" />
          <Path d="M 140 42 Q 140 6, 140 -6 Q 146 10, 144 38" fill="#5ED400" />
          <Path d="M 148 44 Q 152 10, 154 -4 Q 146 12, 144 40" fill="#58CC02" />
          <Path d="M 160 48 Q 168 18, 172 2 Q 164 16, 156 42" fill="#4DB800" />
          {/* Small accent tufts */}
          <Path d="M 126 46 Q 120 30, 116 20 Q 122 28, 128 43" fill="#50C000" opacity="0.5" />
          <Path d="M 154 46 Q 160 30, 164 20 Q 158 28, 152 43" fill="#50C000" opacity="0.5" />

          {/* Eyes */}
          <Ellipse cx="112" cy="106" rx="26" ry="28" fill="url(#eyeWhiteGrad)" />
          <Ellipse cx="168" cy="106" rx="26" ry="28" fill="url(#eyeWhiteGrad)" />
          <Ellipse cx="112" cy="106" rx="26" ry="28" fill="none" stroke="#46A302" strokeWidth="1.5" opacity="0.25" />
          <Ellipse cx="168" cy="106" rx="26" ry="28" fill="none" stroke="#46A302" strokeWidth="1.5" opacity="0.25" />

          {/* Irises */}
          <Circle cx="117" cy="109" r="15" fill="#2D1B00" />
          <Circle cx="173" cy="109" r="15" fill="#2D1B00" />
          <Circle cx="117" cy="110" r="11" fill="#1A0F00" />
          <Circle cx="173" cy="110" r="11" fill="#1A0F00" />
          {/* Iris color ring */}
          <Circle cx="117" cy="109" r="13" fill="none" stroke="#4A2800" strokeWidth="1.5" opacity="0.3" />
          <Circle cx="173" cy="109" r="13" fill="none" stroke="#4A2800" strokeWidth="1.5" opacity="0.3" />

          {/* Eye shine — larger and brighter */}
          <Circle cx="109" cy="100" r="7" fill="#FFFFFF" opacity="0.95" />
          <Circle cx="165" cy="100" r="7" fill="#FFFFFF" opacity="0.95" />
          <Circle cx="122" cy="116" r="3.5" fill="#FFFFFF" opacity="0.5" />
          <Circle cx="178" cy="116" r="3.5" fill="#FFFFFF" opacity="0.5" />

          {/* Eyebrows — thicker, more expressive */}
          <Path d="M 80 80 Q 94 64, 120 76" stroke="#3D9400" strokeWidth="5" fill="none" strokeLinecap="round" />
          <Path d="M 200 80 Q 186 64, 160 76" stroke="#3D9400" strokeWidth="5" fill="none" strokeLinecap="round" />

          {/* Beak — upper */}
          <Path
            d="M 116 132 Q 124 120, 140 118 Q 156 120, 164 132 Q 156 138, 140 139 Q 124 138, 116 132 Z"
            fill="url(#beakTopGrad)"
          />
          <Path d="M 124 125 Q 132 120, 140 119" stroke="#FFE080" strokeWidth="2.5" fill="none" opacity="0.5" strokeLinecap="round" />
          {/* Beak — lower */}
          <Path
            d="M 120 134 Q 128 148, 140 151 Q 152 148, 160 134 Q 152 139, 140 140 Q 128 139, 120 134 Z"
            fill="url(#beakBotGrad)"
          />
          {/* Beak nostrils */}
          <Circle cx="132" cy="128" r="1.8" fill="#C06000" opacity="0.4" />
          <Circle cx="148" cy="128" r="1.8" fill="#C06000" opacity="0.4" />

          {/* Cheeks — rosy glow */}
          <Ellipse cx="76" cy="126" rx="14" ry="9" fill="url(#cheekGrad)" opacity="0.18" />
          <Ellipse cx="204" cy="126" rx="14" ry="9" fill="url(#cheekGrad)" opacity="0.18" />

          {/* Chest feather texture */}
          <Path d="M 112 188 Q 118 182, 124 188" stroke="#A8ED35" strokeWidth="1.5" fill="none" opacity="0.3" />
          <Path d="M 130 180 Q 136 174, 142 180" stroke="#A8ED35" strokeWidth="1.5" fill="none" opacity="0.3" />
          <Path d="M 150 188 Q 156 182, 162 188" stroke="#A8ED35" strokeWidth="1.5" fill="none" opacity="0.3" />
          <Path d="M 120 204 Q 126 198, 132 204" stroke="#C6F580" strokeWidth="1" fill="none" opacity="0.2" />
          <Path d="M 140 198 Q 146 192, 152 198" stroke="#C6F580" strokeWidth="1" fill="none" opacity="0.2" />
          <Path d="M 148 210 Q 154 204, 160 210" stroke="#C6F580" strokeWidth="1" fill="none" opacity="0.2" />

          {/* Belly button / center detail */}
          <Ellipse cx="140" cy="230" rx="6" ry="4" fill="#7AE510" opacity="0.2" />
          </Svg>
        </Animated.View>
      </Animated.View>
    </View>
  );
}
