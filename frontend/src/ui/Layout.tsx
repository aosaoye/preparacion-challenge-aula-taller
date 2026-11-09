import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { IconButton } from './Button';
import { Text } from './Text';
import { gutter, radius, space, useTheme } from './theme';

export function Screen({
  children,
  edges = ['top'],
  style,
}: {
  children: ReactNode;
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();

  return (
    <SafeAreaView edges={edges} style={[{ flex: 1, backgroundColor: colors.bg }, style]}>
      {children}
    </SafeAreaView>
  );
}

/** Cabecera grande de las pantallas principales: kicker naranja + título display */
export function ScreenHeader({
  kicker,
  title,
  right,
  flush,
}: {
  kicker: string;
  title: string;
  right?: ReactNode;
  flush?: boolean;
}) {
  return (
    <View style={[s.header, flush && { paddingHorizontal: 0, paddingTop: 0 }]}>
      <View style={{ flex: 1 }}>
        <Text variant="kicker">{kicker}</Text>
        <Text variant="display" style={{ marginTop: 2 }}>
          {title}
        </Text>
      </View>
      {right}
    </View>
  );
}

/** Cabecera alineada horizontalmente con el back button */
export function NavHeader({
  title,
  right,
  onBack,
}: {
  title: string;
  right?: ReactNode;
  onBack?: () => void;
}) {
  const { colors } = useTheme();

  return (
    <View style={[s.nav, { borderBottomColor: colors.line }]}>
      {onBack && (
        <IconButton
          name="chevron-left"
          label="Volver"
          tone="plain"
          onPress={onBack}
        />
      )}
      <Text
        variant="heading"
        numberOfLines={1}
        ellipsizeMode="tail"
        style={{
          flex: 1,
          marginRight: space.xs,
          color: colors.ink,
        }}
      >
        {title}
      </Text>
      {right}
    </View>
  );
}

export function Sheet({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();

  return (
    <View style={[s.sheet, { backgroundColor: colors.surface }, style]}>
      {children}
    </View>
  );
}

export function Card({
  children,
  tone = 'soft',
  style,
}: {
  children: ReactNode;
  tone?: 'soft' | 'solid' | 'accent';
  style?: StyleProp<ViewStyle>;
}) {
  const { isDark, colors } = useTheme();

  const bg =
    tone === 'solid'
      ? isDark ? '#16181C' : '#0F1419'
      : tone === 'accent'
        ? isDark ? '#1E1410' : '#FCE5DD'
        : isDark ? '#16181C' : '#FFFFFF';

  const border =
    tone === 'accent'
      ? isDark ? '#3A1D12' : '#F1D6CC'
      : isDark ? '#2F3336' : '#EFF3F4';

  return (
    <View
      style={[
        s.card,
        {
          backgroundColor: bg,
          borderColor: border,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function Section({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <View style={{ gap: space.sm }}>
      <View style={s.sectionHeader}>
        <Text variant="heading" style={{ flex: 1 }}>
          {title}
        </Text>
        {action ? <View style={{ flexShrink: 0 }}>{action}</View> : null}
      </View>
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    paddingHorizontal: gutter,
    paddingTop: space.md,
    paddingBottom: space.sm,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingHorizontal: gutter,
    height: 52,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: gutter,
  },
  card: {
    borderRadius: radius.lg,
    padding: space.lg,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
    paddingHorizontal: gutter,
  },
});
