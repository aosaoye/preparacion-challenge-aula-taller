import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Button, colors, Field, radius, space, Text } from '../ui';

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
  const isStudent = mode === 'student';

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={s.overlay} onPress={onClose}>
        <Pressable style={s.modal} onPress={(e) => e.stopPropagation()}>
          <View style={s.header}>
            <Text variant="kicker">{isStudent ? 'Registro escolar' : 'Nuevo módulo'}</Text>
            <Text variant="title" style={{ marginTop: 4 }}>
              {isStudent ? 'Nuevo alumno' : 'Nuevo taller'}
            </Text>
          </View>

          <View style={s.form}>
            {isStudent ? (
              <>
                <Field
                  label="Nombre del alumno"
                  placeholder="Ej. Sofía Martín"
                  value={studentName}
                  onChangeText={onStudentNameChange}
                />
                <Field
                  label="Curso / Especialidad"
                  placeholder="Ej. Matemáticas Avanzadas"
                  value={studentCourse}
                  onChangeText={onStudentCourseChange}
                />
              </>
            ) : (
              <>
                <Field
                  label="Nombre del taller"
                  placeholder="Ej. Robótica e Inteligencia Artificial"
                  value={workshopName}
                  onChangeText={onWorkshopNameChange}
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
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: space.lg,
  },
  modal: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: space.xl,
    borderWidth: 1,
    borderColor: colors.line,
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
