import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from './ThemeContext';

interface Props {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function SkeletonBox({ width = '100%', height = 16, borderRadius = 8, style }: Props) {
  const { isDark } = useTheme();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View
      style={[
        { width: width as any, height, borderRadius, backgroundColor: isDark ? '#2C2C2E' : '#E4E4E7' },
        { opacity },
        style,
      ]}
    />
  );
}

export function NewsCardSkeleton() {
  const { card, border } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
      <SkeletonBox height={14} width="60%" style={{ marginBottom: 8 }} />
      <SkeletonBox height={20} width="90%" style={{ marginBottom: 6 }} />
      <SkeletonBox height={14} width="100%" />
      <SkeletonBox height={14} width="80%" style={{ marginTop: 4 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
});
