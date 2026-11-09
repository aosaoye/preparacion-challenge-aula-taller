import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { Workshop } from '../types';
import { Badge, colors, radius, space, Text } from '../ui';

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
  const freeSlots = Math.max(0, workshop.capacity - enrolledCount);
  const tone = freeSlots === 0 ? 'danger' : freeSlots <= 3 ? 'warn' : 'success';

  return (
    <Pressable
      onPress={() => onSelect(workshop.id)}
      style={({ pressed }) => [
        s.card,
        {
          borderColor: isSelected ? colors.accent : colors.line,
          backgroundColor: isSelected ? colors.surfaceAlt : colors.surface,
        },
        pressed && { opacity: 0.8 },
      ]}
    >
      <View style={s.topRow}>
        <View style={s.titleWrap}>
          <View style={[s.dot, { backgroundColor: workshop.color }]} />
          <Text variant="heading" numberOfLines={1} style={{ flex: 1 }}>
            {workshop.name}
          </Text>
        </View>
        <Badge
          label={`${freeSlots} libres`}
          tone={tone}
        />
      </View>

      <Text variant="caption" style={{ color: colors.muted }}>
        {workshop.instructor}
      </Text>

      <View style={s.footer}>
        <View style={s.capacityBarBg}>
          <View
            style={[
              s.capacityBarFill,
              {
                width: `${Math.min(100, (enrolledCount / workshop.capacity) * 100)}%`,
                backgroundColor: workshop.color,
              },
            ]}
          />
        </View>

        <View style={s.bottomMeta}>
          <Text variant="caption" style={{ fontWeight: '600', color: colors.ink }}>
            {enrolledCount}/{workshop.capacity} inscritos
          </Text>
          {onDelete && (
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                onDelete(workshop.id);
              }}
              hitSlop={8}
            >
              <Feather name="trash-2" size={14} color={colors.danger} />
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    width: 220,
    borderRadius: radius.lg,
    padding: space.lg,
    borderWidth: 1.5,
    gap: space.sm,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.xs,
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    flex: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: radius.pill,
  },
  footer: {
    gap: 6,
    marginTop: space.xs,
  },
  capacityBarBg: {
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.line,
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
});
