import { StyleSheet, View } from 'react-native';
import { Card, colors, radius, space, Text } from '../ui';

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
  return (
    <Card tone="soft" style={s.panel}>
      <Text variant="kicker">Métricas Generales</Text>
      <Text variant="title" style={{ marginTop: 2, marginBottom: space.sm }}>
        Rendimiento del Aula
      </Text>

      <View style={s.grid}>
        <View style={s.statCard}>
          <Text variant="caption" style={{ color: colors.muted, textTransform: 'uppercase' }}>
            Total Alumnos
          </Text>
          <Text variant="display" style={{ marginTop: 4 }}>
            {totalStudents}
          </Text>
        </View>

        <View style={[s.statCard, { backgroundColor: colors.surfaceAlt }]}>
          <Text variant="caption" style={{ color: colors.accent, fontWeight: '700', textTransform: 'uppercase' }}>
            Inscritos Activos
          </Text>
          <Text variant="display" style={{ marginTop: 4, color: colors.accent }}>
            {activeStudents}
          </Text>
        </View>
      </View>

      <View style={s.infoRow}>
        <View style={s.infoCard}>
          <Text variant="caption" style={{ color: colors.muted }}>
            Menos concurrido
          </Text>
          <Text variant="heading" numberOfLines={1} style={{ marginTop: 4 }}>
            {lessCrowdedWorkshop}
          </Text>
        </View>

        <View style={s.infoCard}>
          <Text variant="caption" style={{ color: colors.muted }}>
            Más concurrido
          </Text>
          <Text variant="heading" numberOfLines={1} style={{ marginTop: 4, color: colors.accent }}>
            {mostCrowdedWorkshop}
          </Text>
        </View>
      </View>
    </Card>
  );
}

const s = StyleSheet.create({
  panel: {
    gap: space.sm,
  },
  grid: {
    flexDirection: 'row',
    gap: space.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: space.md,
    borderWidth: 1,
    borderColor: colors.line,
  },
  infoRow: {
    flexDirection: 'row',
    gap: space.md,
  },
  infoCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: space.md,
    borderWidth: 1,
    borderColor: colors.line,
  },
});
