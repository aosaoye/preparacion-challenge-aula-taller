import type { StyleProp, ViewStyle } from 'react-native';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { Text } from './Text';
import { gutter, radius, space, useTheme } from './theme';

export function Chip({
  label,
  active,
  onPress,
  count,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
  count?: number;
}) {
  const { isDark } = useTheme();

  const bg = active
    ? isDark ? '#FFFFFF' : '#0F1419'
    : isDark ? '#16181C' : '#F7F9F9';

  const fg = active
    ? isDark ? '#000000' : '#FFFFFF'
    : isDark ? '#E7E9EA' : '#536471';

  const border = active
    ? 'transparent'
    : isDark ? '#2F3336' : '#EFF3F4';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!active }}
      style={({ pressed }) => [
        s.chip,
        {
          backgroundColor: bg,
          borderColor: border,
        },
        pressed && { opacity: 0.88 },
      ]}
    >
      <Text
        variant="caption"
        style={{
          fontSize: 13,
          lineHeight: 18,
          fontWeight: active ? '700' : '600',
          color: fg,
        }}
      >
        {label}
        {count !== undefined ? ` (${count})` : ''}
      </Text>
    </Pressable>
  );
}

type Option<K extends string> = { key: K; label: string; count?: number };

export function ChipRow<K extends string>({
  options,
  value,
  onChange,
  style,
  contentContainerStyle,
}: {
  options: Option<K>[];
  value: K;
  onChange: (k: K) => void;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[s.scroll, style]}
      contentContainerStyle={[s.row, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
    >
      {options.map((o) => (
        <Chip
          key={o.key}
          label={o.label}
          active={o.key === value}
          count={o.count}
          onPress={() => onChange(o.key)}
        />
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: {
    flexGrow: 0,
    flexShrink: 0,
    width: '100%',
  },
  row: {
    paddingHorizontal: gutter,
    paddingVertical: space.xs,
    gap: space.sm,
    alignItems: 'center',
  },
  chip: {
    minHeight: 34,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
