import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

type FilterPillProps = {
    label: string;
    selected: boolean;
    onPress: () => void;
};

export function FilterPill({ label, selected, onPress }: FilterPillProps) {
    return (
        <Pressable
            onPress={onPress}
            style={[styles.pill, selected && styles.pillSelected]}
        >
            <Text style={[styles.text, selected && styles.textSelected]}>{label}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    pill: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: '#f4f1ee',
        borderWidth: 1,
        borderColor: '#e9e2dc',
        marginRight: 8,
    },
    pillSelected: {
        backgroundColor: '#171717',
        borderColor: '#171717',
    },
    text: {
        color: '#4b5563',
        fontSize: 12,
        fontWeight: '700',
    },
    textSelected: {
        color: '#ffffff',
    },
});
