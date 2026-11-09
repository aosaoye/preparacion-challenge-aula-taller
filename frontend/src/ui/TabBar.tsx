import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from './Text';
import { useTheme } from './theme';

export type TabKey = 'aula' | 'alumnos' | 'talleres' | 'metricas';

export interface TabItem {
  key: TabKey;
  label: string;
  icon: keyof typeof Feather.glyphMap;
}

export const TABS: TabItem[] = [
  { key: 'aula', label: 'Inicio', icon: 'home' },
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
  const { isDark, colors } = useTheme();

  return (
    <View
      style={[
        s.bar,
        {
          paddingBottom: Math.max(bottom, 10),
          backgroundColor: colors.bg,
          borderTopColor: isDark ? '#2F3336' : '#EFF3F4',
        },
      ]}
    >
      {TABS.map((tab) => {
        const focused = tab.key === activeTab;
        const color = focused ? colors.accent : isDark ? '#71767B' : '#536471';

        return (
          <Pressable
            key={tab.key}
            onPress={() => onTabChange(tab.key)}
            style={s.item}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
          >
            <View style={s.iconBox}>
              <Feather name={tab.icon} size={22} color={color} />
              <Text
                variant="caption"
                style={{
                  color,
                  fontSize: 11,
                  fontWeight: focused ? '700' : '500',
                }}
              >
                {tab.label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
    paddingHorizontal: 8,
    width: '100%',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    gap: 3,
  },
});
