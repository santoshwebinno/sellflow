import React from 'react';
import { StyleSheet } from 'react-native';

import { COLORS } from '../constants/colors';
import { FONT_SIZE } from '../constants/fonts';
import { Text } from '../core-ui';
import { CarouselItem } from '../types/types';

export const carouselData: Array<CarouselItem> = [
  {
    render: () => (
      <Text weight="bold" style={styles.title}>
        {t('')}
      </Text>
    ),
    image:
      'https://cdn.shopify.com/s/files/1/0575/2805/8064/files/HERO-BANNER-DIPY2_1800x.png?v=1651514090',
  },
  {
    image:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?ixlib=rb-1.2.1&auto=format&fit=crop&w=2738&q=80',
  },
  {
    image:
      'https://images.unsplash.com/photo-1513884923967-4b182ef167ab?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80',
  },
];

const styles = StyleSheet.create({
  title: {
    marginBottom: 30,
    color: COLORS.white,
    fontSize: FONT_SIZE.extraLarge,
  },
});
