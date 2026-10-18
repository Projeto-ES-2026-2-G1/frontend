import React from 'react';
import { Image, StyleSheet, ImageStyle } from 'react-native';

type LogoProps = {
  size?: number;
  style?: ImageStyle;
};

export default function Logo({ size = 90, style }: LogoProps) {
  return (
      <Image
        source={require('../../../../assets/images/logo-simplimei.jpg')}
        style={[
          styles.logoImage,
          { width: size, height: size, borderRadius: size / 2 },
          style,
        ]}
        resizeMode="cover"
      />
  );
}

const styles = StyleSheet.create({
  logoImage: {},
});