import { View } from 'react-native';
import { radius, useTheme } from './theme';
import { Text } from './Text';

export type Tone = 'neutral' | 'accent' | 'success' | 'warn' | 'danger';

export function Badge({ label, tone = 'neutral' }: { label: string; tone?: Tone }) {
  const { isDark, colors } = useTheme();

  const tonesConfig: Record<Tone, { bg: string; fg: string }> = {
    neutral: {
      bg: isDark ? '#202327' : '#EFF3F4',
      fg: isDark ? '#E7E9EA' : '#536471',
    },
    accent: {
      bg: isDark ? '#3A1D12' : '#FCE5DD',
      fg: colors.accent,
    },
    success: {
      bg: isDark ? '#06281E' : '#DEF7EC',
      fg: colors.success,
    },
    warn: {
      bg: isDark ? '#2E230E' : '#FEF3C7',
      fg: colors.warn,
    },
    danger: {
      bg: isDark ? '#331614' : '#FEE2E2',
      fg: colors.danger,
    },
  };

  const { bg, fg } = tonesConfig[tone];

  return (
    <View
      style={{
        backgroundColor: bg,
        borderRadius: radius.pill,
        paddingHorizontal: 10,
        paddingVertical: 4,
        alignSelf: 'flex-start',
      }}
    >
      <Text
        variant="caption"
        style={{
          color: fg,
          fontWeight: '700',
          fontSize: 11,
          lineHeight: 14,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
