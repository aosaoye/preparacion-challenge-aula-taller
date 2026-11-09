import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Workshop } from '../types';

type WorkshopCardProps = {
    workshop: Workshop;
    isSelected: boolean;
    enrolledCount: number;
    onSelect: (id: number) => void;
};

export function WorkshopCard({ workshop, isSelected, enrolledCount, onSelect }: WorkshopCardProps) {
    return (
        <Pressable
            onPress={() => onSelect(workshop.id)}
            style={[styles.card, isSelected && styles.cardSelected, { backgroundColor: workshop.accent }]}
        >
            <View style={styles.headerRow}>
                <Text style={styles.title}>{workshop.name}</Text>
                <Text style={[styles.tag, isSelected && styles.tagSelected]}>{workshop.capacity - enrolledCount} libres</Text>
            </View>

            <Text style={styles.instructor}>{workshop.instructor}</Text>

            <View style={styles.footerRow}>
                <View style={[styles.dot, { backgroundColor: workshop.color }]} />
                <Text style={styles.count}>{enrolledCount}/{workshop.capacity}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 210,
        borderRadius: 24,
        padding: 16,
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#f0ece8',
        shadowColor: '#d7c7bb',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.09,
        shadowRadius: 16,
        elevation: 2,
    },
    cardSelected: {
        borderColor: '#171717',
        shadowOpacity: 0.14,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
        color: '#171717',
    },
    tag: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 999,
        fontSize: 10,
        fontWeight: '700',
        color: '#171717',
    },
    tagSelected: {
        backgroundColor: '#171717',
        color: '#fff',
    },
    instructor: {
        color: '#4b5563',
        fontSize: 12,
        marginBottom: 16,
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 999,
    },
    count: {
        fontWeight: '700',
        color: '#171717',
        fontSize: 12,
    },
});
