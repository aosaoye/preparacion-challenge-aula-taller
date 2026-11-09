import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from './Text';
import { colors, space } from './theme';

export type TabKey = 'aula' | 'alumnos' | 'talleres' | 'metricas';

export interface TabItem {
  key: TabKey;
  label: string;
  icon: keyof typeof Feather.glyphMap;
}

export const TABS: TabItem[] = [
  { key: 'aula', label: 'Aula', icon: 'grid' },
  { key: 'alumnos', label: 'Alumnos', icon: 'users' },
  { key: 'talleres', label: 'Talleres', icon: 'book-open' },
  { key: 'metricas', label: 'Métricas', icon: 'bar-chart-2' },
];

export function TabBar({
  activeTab,
  onTabChange,
}: {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}) {
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      style={[
        s.container,
        {
          paddingBottom: Math.max(bottom, space.sm),
          backgroundColor: colors.surface,
          borderTopColor: colors.line,
        },
      ]}
    >
      {TABS.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onTabChange(tab.key)}
            style={({ pressed }) => [s.tab, pressed && { opacity: 0.7 }]}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <View style={[s.pill, isActive && { backgroundColor: colors.accentSoft }]}>
              <Feather
                name={tab.icon}
                size={20}
                color={isActive ? colors.accent : colors.muted}
              />
            </View>
            <Text
              variant="caption"
              style={[
                s.label,
                {
                  color: isActive ? colors.accent : colors.muted,
                  fontWeight: isActive ? '700' : '500',
                },
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: space.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
  },
});
