import React from 'react';
import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { Student } from '../types';
import { Avatar, Badge, Button, Divider, EmptyState, Field, gutter, space, Text, useTheme } from '../ui';

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
  const { isDark, colors } = useTheme();

  return (
    <View style={s.feedContainer}>
      {/* Barra de búsqueda limpia de Twitter/X */}
      <View style={s.searchWrap}>
        <Field
          placeholder="Buscar alumno por nombre o curso..."
          value={search}
          onChangeText={onSearchChange}
        />
      </View>

      {/* Cabecera de estado del taller activo */}
      <View
        style={[
          s.workshopBanner,
          {
            backgroundColor: isDark ? '#16181C' : '#F7F9F9',
            borderColor: isDark ? '#2F3336' : '#EFF3F4',
          },
        ]}
      >
        <View style={s.bannerInfo}>
          <Text variant="caption" style={{ color: colors.muted }}>
            Taller asignado para inscripción:
          </Text>
          <Text variant="label" style={{ color: colors.ink, fontWeight: '700' }} numberOfLines={1}>
            {workshopName}
          </Text>
        </View>

        <Badge
          label={`Taller #${selectedWorkshopId}`}
          tone="accent"
        />
      </View>

      {/* Lista estilo feed de Cashbank con Divider entre cada elemento */}
      <View style={s.listContainer}>
        {filteredStudents.length === 0 ? (
          <EmptyState
            icon="users"
            title="No se encontraron alumnos"
            message="No hay alumnos que coincidan con la búsqueda o el filtro seleccionado."
          />
        ) : (
          filteredStudents.map((student, index) => {
            const enrolled = isEnrolled ? isEnrolled(student.id) : student.active;
            return (
              <React.Fragment key={student.id}>
                {index > 0 && <Divider />}
                <Pressable
                  onPress={() => onToggleEnrollment(student.id)}
                  accessibilityRole="button"
                  style={({ pressed }) => [
                    s.studentRow,
                    {
                      backgroundColor: enrolled
                        ? isDark ? '#1E1410' : '#FDF6F3'
                        : isDark ? '#000000' : '#FFFFFF',
                    },
                    pressed && { opacity: 0.88 },
                  ]}
                >
                  {/* Avatar */}
                  <Avatar name={student.name} size={42} />

                  {/* Datos del alumno */}
                  <View style={s.studentBody}>
                    <View style={s.nameRow}>
                      <Text
                        variant="heading"
                        numberOfLines={1}
                        style={{
                          color: colors.ink,
                          fontWeight: '700',
                          flexShrink: 1,
                        }}
                      >
                        {student.name}
                      </Text>
                      {enrolled && (
                        <Feather name="check-circle" size={15} color={colors.accent} />
                      )}
                    </View>

                    <Text variant="caption" style={{ color: colors.muted }} numberOfLines={1}>
                      {student.course}
                    </Text>

                    <View style={s.tagsRow}>
                      <Badge
                        label={`Nivel: ${student.level}%`}
                        tone={student.level >= 80 ? 'success' : student.level >= 50 ? 'accent' : 'neutral'}
                      />
                    </View>
                  </View>

                  {/* Acciones: Botón píldora estilo Cashbank */}
                  <View style={s.actionsCol}>
                    <Button
                      title={enrolled ? 'Inscrito' : 'Inscribir'}
                      variant={enrolled ? 'primary' : 'secondary'}
                      size="sm"
                      onPress={() => onToggleEnrollment(student.id)}
                    />

                    {onDeleteStudent && (
                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation();
                          onDeleteStudent(student.id);
                        }}
                        hitSlop={8}
                        style={[
                          s.deleteBtn,
                          { backgroundColor: isDark ? '#202327' : '#EFF3F4' },
                        ]}
                        accessibilityLabel={`Eliminar a ${student.name}`}
                      >
                        <Feather name="trash-2" size={14} color={colors.danger} />
                      </Pressable>
                    )}
                  </View>
                </Pressable>
              </React.Fragment>
            );
          })
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  feedContainer: {
    width: '100%',
  },
  searchWrap: {
    paddingHorizontal: gutter,
    paddingTop: space.sm,
    paddingBottom: space.xs,
  },
  workshopBanner: {
    marginHorizontal: gutter,
    marginVertical: space.xs,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.sm,
  },
  bannerInfo: {
    flex: 1,
    gap: 2,
  },
  listContainer: {
    width: '100%',
    marginTop: space.xs,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: gutter,
    paddingVertical: space.md,
  },
  studentBody: {
    flex: 1,
    gap: 3,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  actionsCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
