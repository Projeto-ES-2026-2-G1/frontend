import React, { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors as theme, radius, shadow } from '@shared';

const colors = {
  ...theme,
  bg: theme.background,
  card: theme.surface,
  muted: theme.textMuted,
  primarySoft: theme.primarySoft,
  primaryTint: theme.primaryTint,
  track: theme.track,
  danger: theme.danger,
  dangerTint: theme.dangerTint,
  success: theme.success,
};

export interface SideDrawerProps {
  visible: boolean;
  onClose: () => void;
  children?: ReactNode;
  footer?: ReactNode;
}

export function SideDrawer({ visible, onClose, children, footer }: SideDrawerProps) {
  const { width } = useWindowDimensions();
  const w = Math.min(width * 0.78, 320);
  const x = useRef(new Animated.Value(-w)).current;
  const [mounted, setMounted] = useState(visible);

  useEffect(() => {
    if (visible) setMounted(true);
    Animated.timing(x, {
      toValue: visible ? 0 : -w,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      if (!visible) setMounted(false);
    });
  }, [visible, w, x]);

  return (
    <Modal visible={mounted} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.root}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.backdrop,
            { opacity: x.interpolate({ inputRange: [-w, 0], outputRange: [0, 1] }) },
          ]}
        >
          <Pressable style={{ flex: 1 }} onPress={onClose} />
        </Animated.View>

        <Animated.View style={[styles.drawer, { width: w, transform: [{ translateX: x }] }]}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.body}>{children}</View>
            {footer && <View style={styles.footer}>{footer}</View>}
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  backdrop: { backgroundColor: theme.primary },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: theme.primarySoft,
  },
  body: { flex: 1, padding: 24 },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});