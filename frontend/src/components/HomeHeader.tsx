import React from 'react';
import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar, space, TabKey, Text, useTheme } from '../ui';

interface HomeHeaderProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  onOpenNew?: () => void;
  title?: string;
  avatarName?: string;
}

const TABS: { key: TabKey; label: string }[] = [
  { key: 'aula', label: 'Aula' },
  { key: 'alumnos', label: 'Alumnos' },
  { key: 'talleres', label: 'Talleres' },
  { key: 'metricas', label: 'Métricas' },
];

export function HomeHeader({
  activeTab,
  onSelectTab,
  onOpenNew,
  avatarName = 'Admin',
}: HomeHeaderProps) {
  const { top } = useSafeAreaInsets();
  const { isDark, colors, toggleTheme } = useTheme();

  const activeColor = isDark ? '#FFFFFF' : '#0F1419';
  const inactiveColor = isDark ? '#71767B' : '#536471';
  const indicatorColor = colors.accent || '#E4531D';

  return (
    <View
      style={[
        s.container,
        {
          paddingTop: Math.max(top, space.sm),
          backgroundColor: colors.bg,
          borderBottomColor: isDark ? '#2F3336' : '#EFF3F4',
        },
      ]}
    >
      {/* Barra superior estilo Cashbank / X: Avatar izquierda, centro limpio, acciones a la derecha */}
      <View style={s.topBar}>
        <View style={s.avatarBtn}>
          <Avatar name={avatarName} size={34} />
        </View>

        <View style={s.centerSpacer}>
          <Text
            variant="kicker"
            style={{
              color: colors.accent,
              letterSpacing: 1.2,
              fontSize: 13,
            }}
          >
            AULA & TALLER
          </Text>
        </View>

        <View style={s.topBarActions}>
          {/* Botón toggle Modo Dark / Light con feedback instantáneo */}
          <Pressable
            onPress={toggleTheme}
            accessibilityRole="button"
            accessibilityLabel={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}
            hitSlop={8}
            style={[
              s.topBarBtn,
              { backgroundColor: isDark ? '#16181C' : '#F7F9F9' },
            ]}
          >
            <Feather
              name={isDark ? 'sun' : 'moon'}
              size={18}
              color={isDark ? '#F59E0B' : '#536471'}
            />
          </Pressable>

          {/* Botón rápido "+ Nuevo" */}
          {onOpenNew && (
            <Pressable
              onPress={onOpenNew}
              accessibilityRole="button"
              accessibilityLabel="Crear nuevo registro"
              hitSlop={8}
              style={[
                s.topBarBtn,
                { backgroundColor: colors.accent },
              ]}
            >
              <Feather name="plus" size={18} color="#FFFFFF" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Fila de pestañas al 100% del ancho con indicador subrayado */}
      <View style={s.fullWidthTabsRow}>
        {TABS.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <Pressable
              key={tab.key}
              onPress={() => onSelectTab(tab.key)}
              style={s.tabExpandedItem}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
            >
              <Text
                variant="heading"
                style={[
                  s.tabText,
                  isActive && s.tabTextActive,
                  { color: isActive ? activeColor : inactiveColor },
                ]}
              >
                {tab.label}
              </Text>
              {isActive && (
                <View style={[s.indicator, { backgroundColor: indicatorColor }]} />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: '100%',
  },
  topBar: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.lg,
  },
  avatarBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerSpacer: {
    flex: 1,
    paddingHorizontal: space.sm,
    alignItems: 'center',
  },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  topBarBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidthTabsRow: {
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: space.sm,
  },
  tabExpandedItem: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: 4,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
  },
  tabTextActive: {
    fontWeight: '700',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: 8,
    right: 8,
    height: 3,
    borderRadius: 1.5,
  },
});
