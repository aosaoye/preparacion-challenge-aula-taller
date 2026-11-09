import React from 'react';
import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { Workshop } from '../types';
import { Avatar, Badge, Button, Cover, radius, space, Text, useTheme } from '../ui';

type WorkshopCardProps = {
  workshop: Workshop;
  isSelected: boolean;
  enrolledCount: number;
  onSelect: (id: number) => void;
  onDelete?: (id: number) => void;
};

export function WorkshopCard({
  workshop,
  isSelected,
  enrolledCount,
  onSelect,
  onDelete,
}: WorkshopCardProps) {
  const { isDark, colors } = useTheme();
  const freeSlots = Math.max(0, workshop.capacity - enrolledCount);
  const percentage = Math.min(100, Math.round((enrolledCount / workshop.capacity) * 100));
  const tone = freeSlots === 0 ? 'danger' : freeSlots <= 3 ? 'warn' : 'success';

  return (
    <Pressable
      onPress={() => onSelect(workshop.id)}
      accessibilityRole="button"
      style={({ pressed }) => [
        s.card,
        {
          backgroundColor: isDark ? '#16181C' : '#FFFFFF',
          borderColor: isSelected ? colors.accent : isDark ? '#2F3336' : '#EFF3F4',
          borderWidth: isSelected ? 1.5 : 1,
        },
        pressed && { opacity: 0.9 },
      ]}
    >
      {/* Cabecera con Avatar de taller, Nombre e Instructor */}
      <View style={s.topRow}>
        <View style={s.titleWrap}>
          <Avatar name={workshop.name} size={40} />
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text
                variant="heading"
                numberOfLines={1}
                style={{
                  color: colors.ink,
                  fontWeight: '700',
                  flexShrink: 1,
                }}
              >
                {workshop.name}
              </Text>
              {isSelected && (
                <Feather name="check-circle" size={15} color={colors.accent} />
              )}
            </View>
            <Text variant="caption" style={{ color: colors.muted }}>
              {workshop.instructor}
            </Text>
          </View>
        </View>

        <Badge
          label={freeSlots === 0 ? 'Lleno' : `${freeSlots} libres`}
          tone={tone}
        />
      </View>

      {/* Portada del taller */}
      <Cover seed={workshop.id} style={{ height: 85 }} />

      {/* Barra de progreso de capacidad */}
      <View style={s.progressSection}>
        <View style={[s.capacityBarBg, { backgroundColor: isDark ? '#2F3336' : '#EFF3F4' }]}>
          <View
            style={[
              s.capacityBarFill,
              {
                width: `${percentage}%`,
                backgroundColor: workshop.color || colors.accent,
              },
            ]}
          />
        </View>

        <View style={s.bottomMeta}>
          <Text variant="caption" style={{ fontWeight: '700', color: colors.ink }}>
            {enrolledCount} / {workshop.capacity} alumnos ({percentage}%)
          </Text>
          <Badge
            label={percentage >= 100 ? 'Completo' : 'Inscripciones abiertas'}
            tone={percentage >= 100 ? 'danger' : 'neutral'}
          />
        </View>
      </View>

      {/* Botones de acción inferiores */}
      <View style={s.footerActions}>
        <Button
          title={isSelected ? 'Taller Seleccionado' : 'Seleccionar'}
          variant={isSelected ? 'primary' : 'secondary'}
          size="sm"
          onPress={() => onSelect(workshop.id)}
          style={{ flex: 1 }}
        />

        {onDelete && (
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onDelete(workshop.id);
            }}
            hitSlop={8}
            style={[
              s.deleteBtn,
              { backgroundColor: isDark ? '#202327' : '#EFF3F4' },
            ]}
            accessibilityLabel={`Eliminar ${workshop.name}`}
          >
            <Feather name="trash-2" size={16} color={colors.danger} />
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: space.lg,
    gap: space.md,
    marginBottom: space.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.sm,
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    flex: 1,
  },
  progressSection: {
    gap: 6,
  },
  capacityBarBg: {
    height: 6,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  capacityBarFill: {
    height: '100%',
    borderRadius: radius.pill,
  },
  bottomMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  deleteBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
