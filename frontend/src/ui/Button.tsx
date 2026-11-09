import { Feather } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { radius, useTheme } from './theme';
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
  const { isDark, colors } = useTheme();

  // Color de texto y fondo según cashbank
  let bg = colors.ink;
  let fg = colors.onInk;

  if (variant === 'primary') {
    bg = isDark ? '#FFFFFF' : '#0F1419';
    fg = isDark ? '#000000' : '#FFFFFF';
  } else if (variant === 'secondary') {
    bg = isDark ? '#000000' : '#FFFFFF';
    fg = isDark ? '#FFFFFF' : '#0F1419';
  } else if (variant === 'ghost') {
    bg = 'transparent';
    fg = colors.accent;
  } else if (variant === 'danger') {
    bg = colors.danger;
    fg = '#FFFFFF';
  } else if (variant === 'light') {
    bg = colors.surfaceAlt;
    fg = colors.ink;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled || !!loading, busy: !!loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        s.base,
        size === 'sm' ? s.sm : s.md,
        {
          backgroundColor: bg,
          borderColor: variant === 'secondary' ? colors.line : 'transparent',
          borderWidth: variant === 'secondary' ? 1 : 0,
        },
        pressed && { opacity: 0.88 },
        disabled && { opacity: 0.6 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} size="small" />
      ) : (
        <View style={s.content}>
          {icon && <Feather name={icon} size={size === 'sm' ? 16 : 18} color={fg} />}
          <Text
            variant="label"
            style={{
              color: fg,
              fontSize: size === 'sm' ? 13 : 15,
              fontWeight: '700',
            }}
          >
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

export function IconButton({
  name,
  onPress,
  label,
  tone = 'plain',
  active,
  size = 20,
}: IconProps) {
  const { colors } = useTheme();
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
        pressed && { opacity: 0.85 },
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
  md: { height: 48, paddingHorizontal: 22 },
  sm: { height: 34, paddingHorizontal: 16 },
  content: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  icon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
});
