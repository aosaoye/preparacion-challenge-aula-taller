import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { Student } from '../types';
import { Avatar, Badge, colors, EmptyState, Field, radius, space, Text } from '../ui';

type StudentOverviewCardProps = {
  search: string;
  onSearchChange: (value: string) => void;
  filteredStudents: Student[];
  selectedWorkshopId: number;
  workshopName: string;
  onToggleEnrollment: (studentId: number) => void;
  onDeleteStudent?: (studentId: number) => void;
  isEnrolled?: (studentId: number) => boolean;
};

export function StudentOverviewCard({
  search,
  onSearchChange,
  filteredStudents,
  selectedWorkshopId,
  workshopName,
  onToggleEnrollment,
  onDeleteStudent,
  isEnrolled,
}: StudentOverviewCardProps) {
  return (
    <View style={s.card}>
      <View style={s.topRow}>
        <View>
          <Text variant="kicker">Directorio de Alumnos</Text>
          <Text variant="title">Estudiantes</Text>
        </View>
        <Badge
          label={`Taller #${selectedWorkshopId}`}
          tone="accent"
        />
      </View>

      <Field
        placeholder="Buscar por nombre o curso..."
        value={search}
        onChangeText={onSearchChange}
      />

      <View style={s.helperRow}>
        <Text variant="caption" style={{ color: colors.muted }}>
          Taller asignado: <Text variant="caption" style={{ fontWeight: '700', color: colors.ink }}>{workshopName}</Text>
        </Text>
        <Text variant="caption" style={{ color: colors.accent, fontWeight: '600' }}>
          Toca un alumno para (des)inscribir
        </Text>
      </View>

      <View style={s.listWrap}>
        {filteredStudents.length === 0 ? (
          <EmptyState
            icon="users"
            title="Sin alumnos"
            message="No encontramos alumnos que coincidan con los filtros."
          />
        ) : (
          filteredStudents.map((student) => {
            const enrolled = isEnrolled ? isEnrolled(student.id) : student.active;
            return (
              <Pressable
                key={student.id}
                onPress={() => onToggleEnrollment(student.id)}
                style={({ pressed }) => [
                  s.studentRow,
                  enrolled && s.studentRowEnrolled,
                  pressed && { opacity: 0.75 },
                ]}
              >
                <Avatar name={student.name} size={42} />

                <View style={s.studentBody}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text variant="heading" numberOfLines={1}>
                      {student.name}
                    </Text>
                    {enrolled && (
                      <Feather name="check-circle" size={14} color={colors.accent} />
                    )}
                  </View>
                  <Text variant="caption" style={{ color: colors.muted }}>
                    {student.course}
                  </Text>
                </View>

                <View style={s.scoreWrap}>
                  <Badge
                    label={enrolled ? 'Inscrito' : 'Libre'}
                    tone={enrolled ? 'accent' : 'neutral'}
                  />
                  <Text variant="caption" style={{ fontWeight: '700', marginTop: 2 }}>
                    {student.level}%
                  </Text>
                </View>

                {onDeleteStudent && (
                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation();
                      onDeleteStudent(student.id);
                    }}
                    hitSlop={8}
                    style={s.deleteBtn}
                  >
                    <Feather name="trash-2" size={14} color={colors.danger} />
                  </Pressable>
                )}
              </Pressable>
            );
          })
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: space.lg,
    borderWidth: 1,
    borderColor: colors.line,
    gap: space.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  helperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: space.xs,
  },
  listWrap: {
    gap: space.sm,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: space.md,
    borderWidth: 1,
    borderColor: colors.line,
    gap: space.md,
  },
  studentRowEnrolled: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.accent,
  },
  studentBody: {
    flex: 1,
    gap: 2,
  },
  scoreWrap: {
    alignItems: 'flex-end',
    gap: 2,
  },
  deleteBtn: {
    padding: 6,
  },
});
