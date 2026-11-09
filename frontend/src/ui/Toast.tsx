import { Feather } from '@expo/vector-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from './Text';
import { colors, isDark, space } from './theme';

export type ToastTone = 'default' | 'success' | 'error' | 'warn' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  description?: string;
  tone?: ToastTone;
  duration?: number;
}

type ToastSubscriber = (toasts: ToastItem[]) => void;

let activeToasts: ToastItem[] = [];
const subscribers = new Set<ToastSubscriber>();

function notify() {
  const copy = [...activeToasts];
  subscribers.forEach((sub) => sub(copy));
}

let nextId = 1;

export function toast(message: string, options?: Omit<ToastItem, 'id' | 'message'>): string {
  const id = `toast-${Date.now()}-${nextId++}`;
  const item: ToastItem = {
    id,
    message,
    tone: options?.tone ?? 'default',
    description: options?.description,
    duration: options?.duration ?? 3200,
  };
  activeToasts = [item];
  notify();
  return id;
}

toast.success = (message: string, options?: Omit<ToastItem, 'id' | 'message' | 'tone'>) =>
  toast(message, { ...options, tone: 'success' });

toast.error = (message: string, options?: Omit<ToastItem, 'id' | 'message' | 'tone'>) =>
  toast(message, { ...options, tone: 'error' });

toast.warn = (message: string, options?: Omit<ToastItem, 'id' | 'message' | 'tone'>) =>
  toast(message, { ...options, tone: 'warn' });

toast.info = (message: string, options?: Omit<ToastItem, 'id' | 'message' | 'tone'>) =>
  toast(message, { ...options, tone: 'info' });

toast.dismiss = (id?: string) => {
  if (id) {
    activeToasts = activeToasts.filter((t) => t.id !== id);
  } else {
    activeToasts = [];
  }
  notify();
};

function ToastRow({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 70,
      friction: 10,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(anim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start(() => onDismiss(item.id));
    }, item.duration ?? 3200);

    return () => clearTimeout(timer);
  }, [anim, item.duration, item.id, onDismiss]);

  const tone = item.tone ?? 'default';
  const iconConfig: Record<ToastTone, { name: keyof typeof Feather.glyphMap; color: string }> = {
    default: { name: 'info', color: colors.ink },
    success: { name: 'check-circle', color: colors.success },
    error: { name: 'alert-circle', color: colors.danger },
    warn: { name: 'alert-triangle', color: colors.warn },
    info: { name: 'info', color: colors.accent },
  };

  const { name: iconName, color: iconColor } = iconConfig[tone];

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 0],
  });

  return (
    <Animated.View
      style={[
        s.toast,
        {
          opacity: anim,
          transform: [{ translateY }],
          backgroundColor: isDark ? '#16181C' : '#FFFFFF',
          borderColor: isDark ? '#2F3336' : colors.line,
        },
      ]}
      accessibilityRole="alert"
    >
      <Feather name={iconName} size={18} color={iconColor} style={s.icon} />
      <View style={s.body}>
        <Text variant="label" style={{ fontSize: 14, color: colors.ink }}>
          {item.message}
        </Text>
        {item.description ? (
          <Text variant="caption" style={{ color: colors.muted, marginTop: 2 }}>
            {item.description}
          </Text>
        ) : null}
      </View>
      <Pressable
        onPress={() => onDismiss(item.id)}
        style={s.closeButton}
        hitSlop={8}
        accessibilityLabel="Cerrar"
      >
        <Feather name="x" size={14} color={colors.muted} />
      </Pressable>
    </Animated.View>
  );
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>(activeToasts);
  const { bottom } = useSafeAreaInsets();

  useEffect(() => {
    subscribers.add(setToasts);
    return () => {
      subscribers.delete(setToasts);
    };
  }, []);

  const handleDismiss = useCallback((id: string) => {
    toast.dismiss(id);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <View
      pointerEvents="box-none"
      style={[
        s.container,
        {
          bottom: Math.max(bottom, 16) + 12,
        },
      ]}
    >
      {toasts.map((item) => (
        <ToastRow key={item.id} item={item} onDismiss={handleDismiss} />
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    position: 'absolute',
    left: space.lg,
    right: space.lg,
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 9999,
  },
  toast: {
    borderRadius: 100,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 10,
    maxWidth: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.14,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
      default: {},
    }),
  },
  icon: {
    marginRight: 2,
  },
  body: {
    flexShrink: 1,
    justifyContent: 'center',
  },
  closeButton: {
    padding: 4,
    marginLeft: 4,
  },
});
