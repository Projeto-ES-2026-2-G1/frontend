import React from 'react';
import { Image, StyleSheet, ImageStyle } from 'react-native';

export type LogoProps = {
  size?: number;
  style?: ImageStyle;
};

export function Logo({ size = 90, style }: LogoProps) {
  return (
    <Image
      source={require('../../../assets/images/logo-simplimei.png')}
      style={[
        styles.logoImage,
        { width: size, height: size, borderRadius: size / 2 },
        style,
      ]}
      resizeMode="cover"
    />
  );
}

export default Logo;

const styles = StyleSheet.create({
  logoImage: {},
});
