import { Chip } from '../ui';

type FilterPillProps = {
  label: string;
  isSelected: boolean;
  onSelect: () => void;
  count?: number;
};

export function FilterPill({ label, isSelected, onSelect, count }: FilterPillProps) {
  return <Chip label={label} active={isSelected} onPress={onSelect} count={count} />;
}
