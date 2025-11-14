import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { CheckCircle, AlertCircle } from 'lucide-react-native';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: 'success' | 'error';
  duration?: number;
  onHide?: () => void;
}

export function Toast({
  visible,
  message,
  type = 'success',
  duration = 3000,
  onHide,
}: ToastProps) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onHide?.();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, fadeAnim, duration, onHide]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View
        style={[
          styles.toast,
          type === 'success' ? styles.successToast : styles.errorToast,
        ]}
      >
        {type === 'success' ? (
          <CheckCircle size={20} color="#ffffff" />
        ) : (
          <AlertCircle size={20} color="#ffffff" />
        )}
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  successToast: {
    backgroundColor: '#10b981',
  },
  errorToast: {
    backgroundColor: '#ef4444',
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});
