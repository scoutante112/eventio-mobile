import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export default function OfflineBanner() {
  const [offline, setOffline] = useState(false);
  const translateY = React.useRef(new Animated.Value(-40)).current;

  useEffect(() => {
    const unsub = NetInfo.addEventListener((state) => {
      setOffline(!state.isConnected);
    });
    return unsub;
  }, []);

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: offline ? 0 : -40,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [offline]);

  return (
    <Animated.View style={[styles.banner, { transform: [{ translateY }] }]}>
      <Text style={styles.text}>Ingen nätverksanslutning</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    backgroundColor: '#EF4444',
    paddingVertical: 8,
    alignItems: 'center',
  },
  text: { color: '#FFF', fontSize: 13, fontWeight: '600' },
});
