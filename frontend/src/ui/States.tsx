import { Feather } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Button } from './Button';
import { Text } from './Text';
import { colors, space } from './theme';

export function EmptyState({
  icon = 'inbox',
  title,
  message,
  actionLabel,
  onAction,
}: {
  icon?: keyof typeof Feather.glyphMap;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={s.center}>
      <Feather name={icon} size={36} color={colors.faint} />
      <Text variant="heading" style={{ textAlign: 'center' }}>
        {title}
      </Text>
      {message && (
        <Text variant="body" style={{ textAlign: 'center', maxWidth: 280 }}>
          {message}
        </Text>
      )}
      {actionLabel && (
        <Button
          title={actionLabel}
          onPress={onAction}
          size="sm"
          style={{ marginTop: space.sm }}
        />
      )}
    </View>
  );
}

export function ErrorState({
  error,
  onRetry,
}: {
  error?: string | null;
  onRetry?: () => void;
}) {
  return (
    <View style={s.center}>
      <Feather name="alert-circle" size={36} color={colors.danger} />
      <Text variant="heading" style={{ textAlign: 'center' }}>
        Algo salió mal
      </Text>
      <Text variant="body" style={{ textAlign: 'center' }}>
        {error ?? 'No pudimos conectar con el servidor.'}
      </Text>
      {onRetry && (
        <Button
          title="Reintentar"
          onPress={onRetry}
          size="sm"
          variant="secondary"
          style={{ marginTop: space.sm }}
        />
      )}
    </View>
  );
}

export function Banner({
  tone = 'warn',
  title,
  message,
  actionLabel,
  onAction,
}: {
  tone?: 'danger' | 'warn' | 'success';
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const [bg, fg] =
    tone === 'danger'
      ? [colors.dangerSoft, colors.danger]
      : tone === 'warn'
        ? [colors.warnSoft, colors.warn]
        : [colors.successSoft, colors.success];

  return (
    <View style={[s.banner, { backgroundColor: bg }]} accessibilityRole="alert">
      {title && (
        <Text variant="label" style={{ color: fg }}>
          {title}
        </Text>
      )}
      {message && (
        <Text variant="caption" style={{ color: fg }}>
          {message}
        </Text>
      )}
      {actionLabel && (
        <Button
          title={actionLabel}
          onPress={onAction}
          size="sm"
          style={{ alignSelf: 'flex-start', marginTop: space.xs }}
        />
      )}
    </View>
  );
}

export const Spinner = () => (
  <View style={s.center}>
    <ActivityIndicator color={colors.accent} size="large" />
  </View>
);

const s = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    padding: space.xxl,
  },
  banner: {
    borderRadius: 16,
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
    gap: space.xs,
    marginHorizontal: space.lg,
  },
});
