import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type StatsPanelProps = {
    totalStudents: number;
    activeStudents: number;
    lessCrowdedWorkshop: string;
    mostCrowdedWorkshop: string;
};

export function StatsPanel({ totalStudents, activeStudents, lessCrowdedWorkshop, mostCrowdedWorkshop }: StatsPanelProps) {
    return (
        <View style={styles.panel}>
            <Text style={styles.title}>Estadísticas</Text>

            <View style={styles.grid}>
                <View style={styles.statCard}>
                    <Text style={styles.label}>Total</Text>
                    <Text style={styles.value}>{totalStudents}</Text>
                </View>

                <View style={styles.statCardAccent}>
                    <Text style={styles.label}>Activos</Text>
                    <Text style={styles.value}>{activeStudents}</Text>
                </View>
            </View>

            <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>Menos concurrido</Text>
                <Text style={styles.infoValue}>{lessCrowdedWorkshop}</Text>
            </View>

            <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>Más concurrido</Text>
                <Text style={styles.infoValue}>{mostCrowdedWorkshop}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    panel: {
        backgroundColor: '#171717',
        borderRadius: 28,
        padding: 18,
        shadowColor: '#171717',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.18,
        shadowRadius: 18,
        elevation: 5,
        marginBottom: 18,
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '800',
        letterSpacing: -0.6,
        marginBottom: 18,
    },
    grid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 16,
    },
    statCardAccent: {
        flex: 1,
        backgroundColor: '#f59e0b',
        borderRadius: 20,
        padding: 16,
    },
    label: {
        color: '#6b7280',
        fontSize: 12,
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
    },
    value: {
        color: '#171717',
        fontSize: 30,
        fontWeight: '800',
        letterSpacing: -1,
    },
    infoCard: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 18,
        padding: 14,
        marginTop: 10,
    },
    infoLabel: {
        color: '#c2beb9',
        fontSize: 12,
        marginBottom: 6,
    },
    infoValue: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
});
