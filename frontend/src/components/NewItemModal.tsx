import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Button, Field, radius, space, Text, useTheme } from '../ui';

type NewItemModalProps = {
  visible: boolean;
  mode: 'student' | 'workshop';
  studentName: string;
  studentCourse: string;
  workshopName: string;
  workshopInstructor: string;
  onClose: () => void;
  onStudentNameChange: (value: string) => void;
  onStudentCourseChange: (value: string) => void;
  onWorkshopNameChange: (value: string) => void;
  onWorkshopInstructorChange: (value: string) => void;
  onSave: () => void;
};

export function NewItemModal({
  visible,
  mode,
  studentName,
  studentCourse,
  workshopName,
  workshopInstructor,
  onClose,
  onStudentNameChange,
  onStudentCourseChange,
  onWorkshopNameChange,
  onWorkshopInstructorChange,
  onSave,
}: NewItemModalProps) {
  const { isDark, colors } = useTheme();
  const isStudent = mode === 'student';

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={s.overlay} onPress={onClose}>
        <Pressable
          style={[
            s.modal,
            {
              backgroundColor: isDark ? '#16181C' : '#FFFFFF',
              borderColor: isDark ? '#2F3336' : '#EFF3F4',
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={s.header}>
            <Text variant="kicker" style={{ color: colors.accent }}>
              {isStudent ? 'Registro de Estudiante' : 'Nuevo Taller'}
            </Text>
            <Text variant="title" style={{ color: colors.ink, marginTop: 4 }}>
              {isStudent ? 'Añadir Alumno' : 'Crear Taller'}
            </Text>
          </View>

          <View style={s.form}>
            {isStudent ? (
              <>
                <Field
                  label="Nombre completo del alumno"
                  placeholder="Ej. Sofía Martín"
                  value={studentName}
                  onChangeText={onStudentNameChange}
                  autoFocus
                />
                <Field
                  label="Curso o Especialidad"
                  placeholder="Ej. Robótica y Programación"
                  value={studentCourse}
                  onChangeText={onStudentCourseChange}
                />
              </>
            ) : (
              <>
                <Field
                  label="Nombre del taller"
                  placeholder="Ej. Laboratorio de IA y Robótica"
                  value={workshopName}
                  onChangeText={onWorkshopNameChange}
                  autoFocus
                />
                <Field
                  label="Instructor a cargo"
                  placeholder="Ej. Dra. Laura Pérez"
                  value={workshopInstructor}
                  onChangeText={onWorkshopInstructorChange}
                />
              </>
            )}
          </View>

          <View style={s.actions}>
            <Button
              title="Cancelar"
              variant="secondary"
              onPress={onClose}
              style={{ flex: 1 }}
            />
            <Button
              title="Guardar"
              variant="primary"
              onPress={onSave}
              style={{ flex: 1 }}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: space.lg,
  },
  modal: {
    width: '100%',
    maxWidth: 440,
    borderRadius: radius.xl,
    padding: space.xl,
    borderWidth: 1,
    gap: space.md,
  },
  header: {
    marginBottom: space.xs,
  },
  form: {
    gap: space.md,
  },
  actions: {
    flexDirection: 'row',
    gap: space.md,
    marginTop: space.sm,
  },
});
