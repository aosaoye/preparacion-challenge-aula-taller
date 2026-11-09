import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Badge, gutter, radius, space, Text, useTheme } from '../ui';

type StatsPanelProps = {
  totalStudents: number;
  activeStudents: number;
  lessCrowdedWorkshop: string;
  mostCrowdedWorkshop: string;
};

export function StatsPanel({
  totalStudents,
  activeStudents,
  lessCrowdedWorkshop,
  mostCrowdedWorkshop,
}: StatsPanelProps) {
  const { isDark, colors } = useTheme();

  return (
    <View style={s.container}>
      <View style={s.header}>
        <View>
          <Text variant="kicker" style={{ color: colors.accent }}>
            Métricas del Aula
          </Text>
          <Text variant="display" style={{ color: colors.ink, marginTop: 2 }}>
            Rendimiento
          </Text>
        </View>
        <Badge label="En tiempo real" tone="success" />
      </View>

      {/* Grid de 2x2 tarjetas con alto contraste estilo Cashbank */}
      <View style={s.grid}>
        <View
          style={[
            s.statCard,
            {
              backgroundColor: isDark ? '#16181C' : '#FFFFFF',
              borderColor: isDark ? '#2F3336' : '#EFF3F4',
            },
          ]}
        >
          <Text variant="caption" style={{ color: colors.muted, textTransform: 'uppercase', fontWeight: '700' }}>
            Total Alumnos
          </Text>
          <Text variant="display" style={{ color: colors.ink, marginTop: 4, fontWeight: '800' }}>
            {totalStudents}
          </Text>
          <Text variant="caption" style={{ color: colors.muted, marginTop: 2 }}>
            Matriculados en la institución
          </Text>
        </View>

        <View
          style={[
            s.statCard,
            {
              backgroundColor: isDark ? '#1E1410' : '#FCE5DD',
              borderColor: isDark ? '#3A1D12' : '#F1D6CC',
            },
          ]}
        >
          <Text variant="caption" style={{ color: colors.accent, fontWeight: '800', textTransform: 'uppercase' }}>
            Inscritos Activos
          </Text>
          <Text variant="display" style={{ color: colors.accent, marginTop: 4, fontWeight: '800' }}>
            {activeStudents}
          </Text>
          <Text variant="caption" style={{ color: colors.accent, marginTop: 2 }}>
            Participando en talleres
          </Text>
        </View>
      </View>

      <View style={s.cardsColumn}>
        <View
          style={[
            s.infoCard,
            {
              backgroundColor: isDark ? '#16181C' : '#FFFFFF',
              borderColor: isDark ? '#2F3336' : '#EFF3F4',
            },
          ]}
        >
          <View style={s.infoCardHeader}>
            <Text variant="label" style={{ color: colors.muted }}>
              Taller con Menor Concurrencia
            </Text>
            <Badge label="Oportunidad" tone="neutral" />
          </View>
          <Text variant="heading" numberOfLines={1} style={{ color: colors.ink, marginTop: 4 }}>
            {lessCrowdedWorkshop}
          </Text>
        </View>

        <View
          style={[
            s.infoCard,
            {
              backgroundColor: isDark ? '#16181C' : '#FFFFFF',
              borderColor: isDark ? '#2F3336' : '#EFF3F4',
            },
          ]}
        >
          <View style={s.infoCardHeader}>
            <Text variant="label" style={{ color: colors.muted }}>
              Taller Más Concurrido
            </Text>
            <Badge label="Alta demanda" tone="accent" />
          </View>
          <Text variant="heading" numberOfLines={1} style={{ color: colors.accent, marginTop: 4 }}>
            {mostCrowdedWorkshop}
          </Text>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    paddingHorizontal: gutter,
    paddingTop: space.md,
    gap: space.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  grid: {
    flexDirection: 'row',
    gap: space.md,
  },
  statCard: {
    flex: 1,
    borderRadius: radius.lg,
    padding: space.lg,
    borderWidth: 1,
  },
  cardsColumn: {
    gap: space.md,
  },
  infoCard: {
    borderRadius: radius.lg,
    padding: space.lg,
    borderWidth: 1,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
