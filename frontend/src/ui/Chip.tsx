import type { StyleProp, ViewStyle } from 'react-native';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { Text } from './Text';
import { colors, gutter, radius, space } from './theme';

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
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!active }}
      style={[s.chip, active && s.active]}
    >
      <Text
        variant="caption"
        style={{
          fontSize: 13,
          lineHeight: 18,
          fontWeight: '600',
          color: active ? colors.onInk : colors.muted,
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
    minHeight: 36,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
});
