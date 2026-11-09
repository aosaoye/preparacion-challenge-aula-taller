import { Feather } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from './Text';
import { colors, gutter, radius, space } from './theme';

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
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [s.row, pressed && { opacity: 0.7 }]}
      accessibilityRole={onPress ? 'button' : undefined}
    >
      {left ? (
        left
      ) : icon ? (
        <View style={s.iconWrap}>
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
          style={destructive && { color: colors.danger }}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text variant="caption" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {right}

      {(chevron ?? !!onPress) && (
        <Feather name="chevron-right" size={20} color={colors.faint} />
      )}
    </Pressable>
  );
}

export const Divider = () => (
  <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.line }} />
);

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
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
