import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Student } from '../types';

type StudentOverviewCardProps = {
    search: string;
    onSearchChange: (value: string) => void;
    filteredStudents: Student[];
    selectedWorkshopId: number;
    workshopName: string;
    onToggleEnrollment: (studentId: number) => void;
};

export function StudentOverviewCard({
    search,
    onSearchChange,
    filteredStudents,
    selectedWorkshopId,
    workshopName,
    onToggleEnrollment,
}: StudentOverviewCardProps) {
    return (
        <View style={styles.card}>
            <View style={styles.topRow}>
                <Text style={styles.title}>Alumnos</Text>
                <Text style={styles.badge}>{selectedWorkshopId}</Text>
            </View>

            <TextInput
                value={search}
                onChangeText={onSearchChange}
                placeholder="Buscar alumno..."
                placeholderTextColor="#8b8b8b"
                style={styles.searchInput}
            />

            <Text style={styles.helperText}>Taller activo: {workshopName}</Text>

            <View style={styles.listWrap}>
                {filteredStudents.length === 0 ? (
                    <Text style={styles.empty}>No hay alumnos con esos filtros.</Text>
                ) : (
                    filteredStudents.map((student) => (
                        <Pressable
                            key={student.id}
                            onPress={() => onToggleEnrollment(student.id)}
                            style={styles.studentRow}
                        >
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>{student.avatar}</Text>
                            </View>

                            <View style={styles.studentBody}>
                                <Text style={styles.studentName}>{student.name}</Text>
                                <Text style={styles.studentCourse}>{student.course}</Text>
                            </View>

                            <View style={styles.scoreWrap}>
                                <Text style={styles.score}>{student.level}%</Text>
                                <Text style={styles.status}>{student.active ? 'Activo' : 'Libre'}</Text>
                            </View>
                        </Pressable>
                    ))
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 28,
        padding: 18,
        shadowColor: '#d0c7bf',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.12,
        shadowRadius: 18,
        elevation: 4,
        marginBottom: 18,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#171717',
        letterSpacing: -0.7,
    },
    badge: {
        minWidth: 34,
        height: 34,
        borderRadius: 12,
        backgroundColor: '#f3f4f6',
        color: '#171717',
        textAlign: 'center',
        textAlignVertical: 'center',
        fontWeight: '700',
    },
    searchInput: {
        backgroundColor: '#f7f5f3',
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 12,
        color: '#171717',
        borderWidth: 1,
        borderColor: '#eeeae5',
        marginBottom: 10,
    },
    helperText: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 12,
    },
    listWrap: {
        gap: 10,
    },
    studentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f7f5f3',
        borderRadius: 18,
        padding: 10,
        borderWidth: 1,
        borderColor: '#efebe7',
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: '#171717',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 12,
    },
    studentBody: {
        flex: 1,
    },
    studentName: {
        color: '#171717',
        fontSize: 15,
        fontWeight: '700',
    },
    studentCourse: {
        color: '#7c7a78',
        fontSize: 12,
        marginTop: 2,
    },
    scoreWrap: {
        alignItems: 'flex-end',
    },
    score: {
        color: '#171717',
        fontWeight: '800',
        fontSize: 13,
    },
    status: {
        marginTop: 2,
        color: '#8b5cf6',
        fontSize: 11,
        fontWeight: '700',
    },
    empty: {
        color: '#6b7280',
        textAlign: 'center',
        paddingVertical: 18,
    },
});
