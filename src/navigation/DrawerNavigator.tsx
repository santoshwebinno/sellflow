import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import { COLORS } from '../constants/colors';
import { Text } from '../core-ui';
import { LocalizationPicker } from '../components';

import { createDrawerNavigator, DrawerContentComponentProps } from '@react-navigation/drawer';
import StackNavigator from './StackNavigator';
import { DrawerContent } from '../scenes/DrawerContent';
import {
  AddEditAddressScene,
  AddressManagementScene,
  AuthScene,
  CheckoutScene,
  EditProfileScene,
  ForgotPasswordScene,
  OrderDetailsScene,
  OrderHistoryScene,
  OrderPlacedConfirmationScene,
  ProductCollectionScene,
  ProductDetailsScene,
  SearchResultsScene,
  ShoppingCartScene,
  WebViewScene,
} from '../scenes';

import { StackParamList } from '../types/Navigation';
import { getFocusedRouteNameFromRoute, Route } from '@react-navigation/native';

import { useCartFilled } from '../helpers/cartFilled';
import { useAuth } from '../helpers/useAuth';
import { useGetAuthenticatedUser } from '../hooks/api/useAuthenticatedUser';
import TabNavigator from './TabNavigator';

const Drawer = createDrawerNavigator<StackParamList>();
type HeaderIconButtonProps = {
  icon: string;
  onPress: () => void;
};

function HeaderIconButton(props: HeaderIconButtonProps) {
  let { icon, onPress } = props;
  let { isFilled, numOfItems } = useCartFilled();
  if (icon === 'cart' && isFilled) {
    return (
      <View style={styles.flex}>
        <IconButton
          icon={icon}
          onPress={onPress}
          color={COLORS.primaryColor}
          style={styles.headerButton}
        />
        <View style={styles.cartBadge}>
          <Text style={styles.badgeText}>{numOfItems}</Text>
        </View>
      </View>
    );
  }

  return (
    <IconButton
      icon={icon}
      onPress={onPress}
      color={COLORS.primaryColor}
      style={styles.headerButton}
    />
  );
}

export default function DrawerNavigator() {
  let { authToken } = useAuth();
  let { data: userData } = useGetAuthenticatedUser();
  let { isRTL } = useTheme();

  function getTabSceneName(route: Pick<Route<string>, 'key' | 'name'>) {
    const routeName = getFocusedRouteNameFromRoute(route) || 'HomeTab';
    return routeName;
  }

    return (
    //   <Drawer.Navigator 
    // drawerStyle={{ 
    //   width: Dimensions.get('window').width 
    // }}
    //  drawerContent={(props: any) => <DrawerContent {...props} />}
    //  initialRouteName="Home">
    //     <Drawer.Screen name="Home" component={StackNavigator} />
    //   </Drawer.Navigator>
    <Drawer.Navigator 
    drawerStyle={{ 
      width: Dimensions.get('window').width 
    }}
     drawerContent= { (props: DrawerContentComponentProps) => <DrawerContent { ...props } />}
     initialRouteName="Home"
     defaultStatus="open"
     >
        <Drawer.Screen name="Home"
        component={TabNavigator}
        options={({ navigation, route }) => {
          let tabScene = getTabSceneName(route);
          if (tabScene === 'HomeTab') {
            return {
              title:
                authToken && userData?.authenticatedUser.firstName
                  ? `${t('Hello')}, ${userData.authenticatedUser.firstName}`
                  : t('Hello'),
              headerRight: () => (
                <HeaderIconButton
                  icon="cart"
                  onPress={() => navigation.navigate('ShoppingCart')}
                />
              ),
              headerStyle: {
                shadowColor: COLORS.transparent,
                elevation: 0,
              },
            };
          } else if (tabScene === 'WishlistTab') {
            return {
              headerLeft: () => null,
              title: t('Wishlist'),
            };
          } else {
            return authToken
              ? {
                  headerLeft: () => null,
                  title: t('My Profile'),
                }
              : {
                  headerLeft: () =>
                    !authToken && (
                      <HeaderIconButton
                        icon={isRTL ? 'chevron-right' : 'chevron-left'}
                        onPress={() => navigation.navigate('HomeTab')}
                      />
                    ),
                  title: '',
                  headerStyle: {
                    shadowColor: COLORS.transparent,
                    elevation: 0,
                  },
                };
          }
        }}
        />
        <Drawer.Screen
        name="Auth"
        component={AuthScene}
        options={() => ({
          title: t('Welcome'),
          headerStyle: {
            shadowColor: COLORS.transparent,
            elevation: 0,
          },
        })}
      />
      <Drawer.Screen
        name="ForgotPassword"
        component={ForgotPasswordScene}
        options={() => ({
          title: t('Forgot Password'),
          cardStyle: {
            backgroundColor: COLORS.white,
          },
        })}
      />
      <Drawer.Screen
        name="AddressManagement"
        component={AddressManagementScene}
        options={() => ({
          title: t('Manage Addresses'),
        })}
      />
      <Drawer.Screen name="AddEditAddress" component={AddEditAddressScene} />
      <Drawer.Screen
        name="EditProfile"
        component={EditProfileScene}
        options={() => ({
          title: t('Edit Profile'),
        })}
      />
      <Drawer.Screen
        name="OrderHistory"
        component={OrderHistoryScene}
        options={() => ({
          title: t('Order History'),
          cardStyle: {
            backgroundColor: COLORS.darkWhite,
          },
        })}
      />
      <Drawer.Screen
        name="OrderDetails"
        component={OrderDetailsScene}
        options={() => ({
          title: t('Order Details'),
        })}
      />
      <Drawer.Screen
        name="ProductDetails"
        component={ProductDetailsScene}
        options={({ navigation }) => ({
          title: t('Product Details'),
          headerRight: () => (
            <HeaderIconButton
              icon="cart"
              onPress={() => navigation.navigate('ShoppingCart')}
            />
          ),
        })}
      />
      <Drawer.Screen
        name="ShoppingCart"
        component={ShoppingCartScene}
        options={() => ({
          title: t('Shopping Cart'),
        })}
      />
      <Drawer.Screen
        name="ProductCollection"
        component={ProductCollectionScene}
        options={({ navigation, route }) => ({
          title: 'test',
          headerRight: () => (
            <HeaderIconButton
              icon="cart"
              onPress={() => navigation.navigate('ShoppingCart')}
            />
          )
        })}
      />
      <Drawer.Screen
        name="SearchResults"
        component={SearchResultsScene}
        options={() => ({
          title: t('Search Results'),
        })}
      />
      <Drawer.Screen
        name="Checkout"
        component={CheckoutScene}
        options={() => ({
          title: t('Checkout'),
        })}
      />
      <Drawer.Screen name="WebView" component={WebViewScene} />

      <Drawer.Screen
        name="OrderPlacedConfirmation"
        component={OrderPlacedConfirmationScene}
        options={() => ({
          title: t('Order Placed'),
          headerLeft: () => null,
        })}
      />
      </Drawer.Navigator>
    )
}
const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  headerButton: {
    marginRight: 8,
  },
  cartBadge: {
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.red,
    borderRadius: 7,
    position: 'absolute',
    top: 5,
    right: 12,
  },
  badgeText: {
    fontSize: 10,
    color: COLORS.white,
  },
});