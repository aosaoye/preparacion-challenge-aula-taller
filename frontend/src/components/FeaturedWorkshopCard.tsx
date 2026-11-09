import React from 'react';
import { Feather } from '@expo/vector-icons';
import { Dimensions, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Workshop } from '../types';
import { Avatar, Badge, Button, Cover, gutter, radius, space, Text, useTheme } from '../ui';

type Props = {
  workshops: Workshop[];
  selectedWorkshopId: number;
  workshopEnrollmentCounts: Record<number, number>;
  onSelectWorkshop: (id: number) => void;
};

const SCREEN_W = Dimensions.get('window').width;
const GAP = 14;

function WorkshopHeroItem({
  workshop,
  isSelected,
  enrolledCount,
  onSelect,
  width,
}: {
  workshop: Workshop;
  isSelected: boolean;
  enrolledCount: number;
  onSelect: (id: number) => void;
  width: number;
}) {
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
          width,
          backgroundColor: isDark ? '#16181C' : '#FFFFFF',
          borderColor: isSelected ? colors.accent : isDark ? '#2F3336' : '#EFF3F4',
          borderWidth: isSelected ? 1.5 : 1,
        },
        pressed && { opacity: 0.92 },
      ]}
    >
      {/* Cabecera del taller */}
      <View style={s.header}>
        <View style={s.authorRow}>
          <Avatar name={workshop.name} size={40} />
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text variant="label" numberOfLines={1} style={{ flexShrink: 1, color: colors.ink }}>
                {workshop.name}
              </Text>
              {isSelected && (
                <Feather name="check-circle" size={15} color={colors.accent} accessibilityLabel="Seleccionado" />
              )}
            </View>
            <Text variant="caption" style={{ color: colors.muted }}>
              {workshop.instructor}
            </Text>
          </View>
        </View>

        <Badge
          label={freeSlots === 0 ? 'Cupos agotados' : `${freeSlots} libres`}
          tone={tone}
        />
      </View>

      {/* Portada visual con badges flotantes */}
      <View style={s.coverWrap}>
        <Cover seed={workshop.id} style={s.cover} />
        <View style={s.coverBadges}>
          <Badge
            label={`Ocupación: ${percentage}%`}
            tone={percentage >= 100 ? 'danger' : percentage > 70 ? 'warn' : 'neutral'}
          />
          {isSelected && (
            <Badge label="Taller Activo" tone="accent" />
          )}
        </View>
      </View>

      {/* Barra de progreso de capacidad */}
      <View style={s.progressSection}>
        <View style={[s.track, { backgroundColor: isDark ? '#2F3336' : '#EFF3F4' }]}>
          <View
            style={[
              s.fill,
              {
                width: `${percentage}%`,
                backgroundColor: workshop.color || colors.accent,
              },
            ]}
          />
        </View>

        <View style={s.metaRow}>
          <Text variant="caption" style={{ color: colors.ink, fontWeight: '700' }}>
            {enrolledCount} de {workshop.capacity} alumnos inscritos
          </Text>
          <Text variant="caption" style={{ color: colors.muted }}>
            Capacidad: {workshop.capacity}
          </Text>
        </View>
      </View>

      {/* Botón de acción con forma de píldora estilo Cashbank */}
      <Button
        title={isSelected ? 'Taller Seleccionado' : 'Asignar como Activo'}
        variant={isSelected ? 'primary' : 'secondary'}
        size="sm"
        icon={isSelected ? 'check' : 'arrow-right'}
        onPress={() => onSelect(workshop.id)}
      />
    </Pressable>
  );
}

export function FeaturedWorkshopCard({
  workshops,
  selectedWorkshopId,
  workshopEnrollmentCounts,
  onSelectWorkshop,
}: Props) {
  if (!workshops || workshops.length === 0) return null;

  // Si hay más de 1 taller, deja ver 28px de la siguiente tarjeta a la derecha
  const cardWidth = workshops.length > 1 ? SCREEN_W - gutter * 2 - 28 : SCREEN_W - gutter * 2;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      snapToInterval={cardWidth + GAP}
      snapToAlignment="start"
      contentContainerStyle={s.carouselContent}
    >
      {workshops.map((w) => (
        <WorkshopHeroItem
          key={w.id}
          workshop={w}
          isSelected={w.id === selectedWorkshopId}
          enrolledCount={workshopEnrollmentCounts[w.id] ?? 0}
          onSelect={onSelectWorkshop}
          width={cardWidth}
        />
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  carouselContent: {
    paddingHorizontal: gutter,
    paddingTop: space.sm,
    paddingBottom: space.md,
    gap: GAP,
  },
  card: {
    borderRadius: radius.lg,
    padding: space.lg,
    gap: space.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.sm,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    flex: 1,
  },
  coverWrap: {
    borderRadius: radius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  cover: {
    height: 90,
  },
  coverBadges: {
    position: 'absolute',
    top: space.xs,
    left: space.xs,
    right: space.xs,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressSection: {
    gap: 6,
  },
  track: {
    height: 6,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
