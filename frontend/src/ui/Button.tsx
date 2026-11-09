import { Feather } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius } from './theme';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'light' | 'danger';
type Props = {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  size?: 'md' | 'sm';
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Feather.glyphMap;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  icon,
  style,
}: Props) {
  const fg =
    variant === 'primary'
      ? colors.onInk
      : variant === 'ghost'
        ? colors.accent
        : variant === 'danger'
          ? '#fff'
          : colors.ink;

  const bgStyle =
    variant === 'primary'
      ? s.primary
      : variant === 'secondary'
        ? s.secondary
        : variant === 'danger'
          ? s.danger
          : variant === 'light'
            ? { backgroundColor: colors.surfaceAlt }
            : null;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled || !!loading, busy: !!loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        s.base,
        size === 'sm' ? s.sm : s.md,
        bgStyle,
        (pressed || disabled) && { opacity: disabled ? 0.45 : 0.75 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} size="small" />
      ) : (
        <View style={s.content}>
          {icon && <Feather name={icon} size={size === 'sm' ? 16 : 18} color={fg} />}
          <Text variant="label" style={{ color: fg, fontSize: size === 'sm' ? 13 : 15 }}>
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

type IconProps = {
  name: keyof typeof Feather.glyphMap;
  onPress?: () => void;
  label: string;
  tone?: 'plain' | 'filled' | 'accent';
  active?: boolean;
  size?: number;
};

export function IconButton({ name, onPress, label, tone = 'plain', active, size = 20 }: IconProps) {
  const fg = active || tone === 'accent' ? colors.accent : colors.ink;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        s.icon,
        tone === 'filled' && {
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.line,
          backgroundColor: colors.surface,
        },
        tone === 'accent' && {
          backgroundColor: colors.accentSoft,
        },
        pressed && { opacity: 0.6 },
      ]}
    >
      <Feather name={name} size={size} color={fg} />
    </Pressable>
  );
}

const s = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    margin: 0,
  },
  md: { height: 50, paddingHorizontal: 22 },
  sm: { height: 36, paddingHorizontal: 16 },
  primary: { backgroundColor: colors.ink },
  secondary: { borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface },
  danger: { backgroundColor: colors.danger },
  content: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});
