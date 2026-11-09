import React from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

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
    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <Text style={styles.title}>{mode === 'student' ? 'Nuevo alumno' : 'Nuevo taller'}</Text>

                    {mode === 'student' ? (
                        <>
                            <TextInput
                                placeholder="Nombre del alumno"
                                value={studentName}
                                onChangeText={onStudentNameChange}
                                style={styles.input}
                            />
                            <TextInput
                                placeholder="Curso / especialidad"
                                value={studentCourse}
                                onChangeText={onStudentCourseChange}
                                style={styles.input}
                            />
                        </>
                    ) : (
                        <>
                            <TextInput
                                placeholder="Nombre del taller"
                                value={workshopName}
                                onChangeText={onWorkshopNameChange}
                                style={styles.input}
                            />
                            <TextInput
                                placeholder="Instructor"
                                value={workshopInstructor}
                                onChangeText={onWorkshopInstructorChange}
                                style={styles.input}
                            />
                        </>
                    )}

                    <View style={styles.actions}>
                        <Pressable style={styles.cancel} onPress={onClose}>
                            <Text style={styles.cancelText}>Cancelar</Text>
                        </Pressable>
                        <Pressable style={styles.save} onPress={onSave}>
                            <Text style={styles.saveText}>Guardar</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(10, 10, 10, 0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modal: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 28,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#171717',
        marginBottom: 16,
    },
    input: {
        backgroundColor: '#f7f5f3',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#efeae5',
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 12,
        color: '#171717',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    cancel: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 14,
        backgroundColor: '#f3f2f0',
        marginRight: 8,
        alignItems: 'center',
    },
    cancelText: {
        color: '#171717',
        fontWeight: '700',
    },
    save: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 14,
        backgroundColor: '#171717',
        marginLeft: 8,
        alignItems: 'center',
    },
    saveText: {
        color: '#fff',
        fontWeight: '700',
    },
});
