import { Image, ImageStyle, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useState } from 'react';
import { hash } from './Avatar';
import { radius } from './theme';

const PALETTES: [string, string][] = [
  ['#1E2732', '#2A3F55'],
  ['#2A1D1A', '#4A2A20'],
  ['#142820', '#1F4735'],
  ['#261E33', '#452D63'],
  ['#2E2318', '#543C22'],
  ['#1B2E33', '#2D5561'],
];

export function Cover({
  seed = 'workshop',
  imageUrl,
  style,
}: {
  seed?: string | number;
  imageUrl?: string | null;
  style?: StyleProp<ViewStyle>;
}) {
  const [failed, setFailed] = useState(false);
  const seedStr = String(seed);

  if (imageUrl && !failed) {
    return (
      <Image
        source={{ uri: imageUrl }}
        resizeMode="cover"
        onError={() => setFailed(true)}
        style={[s.cover, style as StyleProp<ImageStyle>]}
      />
    );
  }

  const p = PALETTES[hash(seedStr) % PALETTES.length];

  return (
    <View style={[s.cover, { backgroundColor: p[0], borderColor: p[1] }, style]}>
      <View style={[s.accentStripe, { backgroundColor: p[1] }]} />
    </View>
  );
}

const s = StyleSheet.create({
  cover: {
    height: 110,
    width: '100%',
    borderRadius: radius.md,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
  },
  accentStripe: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '35%',
    opacity: 0.25,
  },
});
