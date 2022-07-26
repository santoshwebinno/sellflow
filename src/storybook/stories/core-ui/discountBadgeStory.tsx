import React from 'react';
import { StyleSheet, View } from 'react-native';

import { storiesOf } from '@storybook/react-native';

import { DiscountBadge } from '../../../core-ui';

export default function discountBadgeStory() {
  return storiesOf('Discount Badge', module).add('Default', () => (
    <View style={style.container}>
      <DiscountBadge value={50} />
    </View>
  ));
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
