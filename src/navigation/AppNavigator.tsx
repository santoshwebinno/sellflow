import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import StackNavigator from './StackNavigator';
import DrawerNavigator from './DrawerNavigator'
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  );
}
