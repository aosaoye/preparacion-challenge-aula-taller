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
import { colors, radius } from './theme';

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
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secure);

  return (
    <View style={{ gap: 6 }}>
      {label && <Text variant="label">{label}</Text>}
      <View style={[s.box, focused && s.focus, !!error && s.error]}>
        <TextInput
          ref={ref}
          {...rest}
          multiline={multiline}
          secureTextEntry={hidden}
          placeholderTextColor={colors.faint}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          accessibilityLabel={label}
          style={[s.input, multiline && s.multiline, style]}
        />
        {secure && (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            hitSlop={10}
            accessibilityLabel={hidden ? 'Mostrar' : 'Ocultar'}
          >
            <Feather name={hidden ? 'eye' : 'eye-off'} size={18} color={colors.muted} />
          </Pressable>
        )}
      </View>
      {error ? (
        <Text variant="caption" color="danger">
          {error}
        </Text>
      ) : hint ? (
        <Text variant="caption">{hint}</Text>
      ) : null}
    </View>
  );
});

const s = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 16,
  },
  focus: { borderColor: colors.ink },
  error: { borderColor: colors.danger },
  input: {
    flex: 1,
    minHeight: 48,
    fontSize: 15,
    color: colors.ink,
    paddingVertical: 10,
  },
  multiline: {
    minHeight: 110,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
});
