import { Feather } from '@expo/vector-icons';
import { forwardRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { Text } from './Text';
import { radius, useTheme } from './theme';

type Props = TextInputProps & {
  label?: string;
  error?: string;
  hint?: string;
  secure?: boolean;
};

export const Field = forwardRef<any, Props>(function Field(
  { label, error, hint, secure, multiline, style, ...rest },
  ref,
) {
  const { isDark, colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secure);

  return (
    <View style={{ gap: 6 }}>
      {label && <Text variant="label">{label}</Text>}
      <View
        style={[
          s.box,
          {
            backgroundColor: isDark ? '#16181C' : '#FFFFFF',
            borderColor: error ? colors.danger : focused ? colors.accent : isDark ? '#2F3336' : '#EFF3F4',
          },
        ]}
      >
        <TextInput
          ref={ref}
          {...rest}
          multiline={multiline}
          secureTextEntry={hidden}
          placeholderTextColor={isDark ? '#71767B' : '#8B98A5'}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          accessibilityLabel={label}
          style={[
            s.input,
            { color: isDark ? '#FFFFFF' : '#0F1419' },
            multiline && s.multiline,
            style,
          ]}
        />
        {secure && (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            hitSlop={10}
            accessibilityLabel={hidden ? 'Mostrar' : 'Ocultar'}
          >
            <Feather
              name={hidden ? 'eye' : 'eye-off'}
              size={18}
              color={isDark ? '#71767B' : '#8B98A5'}
            />
          </Pressable>
        )}
      </View>
      {error ? (
        <Text variant="caption" color="danger">
          {error}
        </Text>
      ) : hint ? (
        <Text variant="caption" style={{ color: colors.muted }}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
});

const s = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    minHeight: 46,
    fontSize: 15,
    paddingVertical: 10,
  },
  multiline: {
    minHeight: 90,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
});
