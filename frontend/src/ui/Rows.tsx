import { Feather } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from './Text';
import { gutter, radius, space, useTheme } from './theme';

type RowProps = {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Feather.glyphMap;
  left?: ReactNode;
  right?: ReactNode;
  onPress?: () => void;
  chevron?: boolean;
  destructive?: boolean;
};

export function ListRow({
  title,
  subtitle,
  icon,
  left,
  right,
  onPress,
  chevron,
  destructive,
}: RowProps) {
  const { isDark, colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [s.row, pressed && { opacity: 0.85 }]}
      accessibilityRole={onPress ? 'button' : undefined}
    >
      {left ? (
        left
      ) : icon ? (
        <View style={[s.iconWrap, { backgroundColor: isDark ? '#202327' : '#EFF3F4' }]}>
          <Feather
            name={icon}
            size={18}
            color={destructive ? colors.danger : colors.ink}
          />
        </View>
      ) : null}

      <View style={{ flex: 1, gap: 2 }}>
        <Text
          variant="heading"
          style={destructive ? { color: colors.danger } : { color: colors.ink }}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text variant="caption" style={{ color: colors.muted }} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {right}

      {(chevron ?? !!onPress) && (
        <Feather
          name="chevron-right"
          size={18}
          color={isDark ? '#71767B' : '#8B98A5'}
        />
      )}
    </Pressable>
  );
}

export function Divider() {
  const { isDark } = useTheme();
  return (
    <View
      style={{
        height: StyleSheet.hairlineWidth,
        backgroundColor: isDark ? '#2F3336' : '#EFF3F4',
      }}
    />
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingVertical: space.md,
    paddingHorizontal: gutter,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
