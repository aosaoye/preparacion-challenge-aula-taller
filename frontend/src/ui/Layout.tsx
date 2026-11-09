import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { IconButton } from './Button';
import { Text } from './Text';
import { colors, gutter, radius, space } from './theme';

export function Screen({
  children,
  edges = ['top'],
  style,
}: {
  children: ReactNode;
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
}) {
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
        <Text variant="display" style={{ marginTop: space.xs }}>
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
  return (
    <View style={s.nav}>
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
  return <View style={[s.sheet, style]}>{children}</View>;
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
  const bg =
    tone === 'solid'
      ? colors.ink
      : tone === 'accent'
        ? colors.surfaceAlt
        : colors.surface;

  return (
    <View
      style={[
        s.card,
        {
          backgroundColor: bg,
          borderColor: colors.line,
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
    paddingBottom: space.md,
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
    borderBottomColor: colors.line,
  },
  sheet: {
    backgroundColor: colors.surface,
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
