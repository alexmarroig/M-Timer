import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FaceExpression, EyeStyle } from '../../types/companion';

interface Props {
  expression: FaceExpression;
  size: number;
}

function Eye({ style, size }: { style: EyeStyle; size: number }) {
  const eyeSize = size * 0.07;

  switch (style.type) {
    case 'dot':
      return (
        <View
          style={[
            styles.eyeDot,
            {
              width: eyeSize,
              height: eyeSize,
              borderRadius: eyeSize / 2,
            },
          ]}
        />
      );
    case 'closed':
      return (
        <View
          style={[
            styles.eyeClosed,
            {
              width: eyeSize * 1.4,
              height: 2,
              borderRadius: 1,
            },
          ]}
        />
      );
    case 'half':
      return (
        <View
          style={[
            styles.eyeHalf,
            {
              width: eyeSize * 1.2,
              height: eyeSize * 0.5,
              borderRadius: eyeSize * 0.25,
            },
          ]}
        />
      );
    case 'star':
      return (
        <Text style={[styles.eyeText, { fontSize: eyeSize * 1.8 }]}>✦</Text>
      );
    case 'side':
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={[
              styles.eyeDot,
              {
                width: eyeSize * 0.6,
                height: eyeSize,
                borderRadius: eyeSize / 2,
              },
            ]}
          />
        </View>
      );
  }
}

export function CompanionFace({ expression, size }: Props) {
  const { leftEye, rightEye, mouth, cheekOpacity } = expression;
  const cheekSize = size * 0.16;
  const eyeSpacing = size * 0.12;
  const faceOffsetY = size * 0.05; // Slightly below center

  return (
    <View style={[styles.face, { top: faceOffsetY }]}>
      {/* Cheeks */}
      <View
        style={[
          styles.cheek,
          styles.leftCheek,
          {
            width: cheekSize,
            height: cheekSize * 0.7,
            borderRadius: cheekSize / 2,
            opacity: cheekOpacity,
            left: size * 0.12,
            top: size * 0.08,
          },
        ]}
      />
      <View
        style={[
          styles.cheek,
          styles.rightCheek,
          {
            width: cheekSize,
            height: cheekSize * 0.7,
            borderRadius: cheekSize / 2,
            opacity: cheekOpacity,
            right: size * 0.12,
            top: size * 0.08,
          },
        ]}
      />

      {/* Eyes */}
      <View style={[styles.eyes, { gap: eyeSpacing }]}>
        <Eye style={leftEye} size={size} />
        <Eye style={rightEye} size={size} />
      </View>

      {/* Mouth */}
      <Text
        style={[
          styles.mouth,
          {
            fontSize: mouth.fontSize,
            marginTop: size * 0.01,
          },
        ]}
      >
        {mouth.character}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  face: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeDot: {
    backgroundColor: '#2A2A2A',
  },
  eyeClosed: {
    backgroundColor: '#2A2A2A',
  },
  eyeHalf: {
    backgroundColor: '#2A2A2A',
  },
  eyeText: {
    color: '#C9A84C',
  },
  mouth: {
    color: '#2A2A2A',
    fontWeight: '600',
  },
  cheek: {
    position: 'absolute',
    backgroundColor: '#FFB5B5',
  },
  leftCheek: {},
  rightCheek: {},
});
