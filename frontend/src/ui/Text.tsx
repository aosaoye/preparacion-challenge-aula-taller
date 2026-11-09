import { Text as RNText, TextProps } from 'react-native';
import { ColorName, defaultColor, type, TypeVariant, useTheme } from './theme';

type Props = TextProps & { variant?: TypeVariant; color?: ColorName };

export function Text({ variant = 'body', color, style, ...rest }: Props) {
  const { colors } = useTheme();
  const textColor = colors[color ?? defaultColor[variant]];

  return (
    <RNText
      {...rest}
      style={[
        type[variant],
        { color: textColor },
        style,
      ]}
    />
  );
}
