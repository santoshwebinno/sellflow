import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  ImageStyle,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { COLORS } from '../constants/colors';
import { FONT_SIZE } from '../constants/fonts';
import { Button, DiscountBadge, KeyboardAvoidingView, Text, Toast, } from '../core-ui';
import { priceAfterDiscount } from '../helpers/priceAfterDiscount';
import useCurrencyFormatter from '../hooks/api/useCurrencyFormatter';
import { Product } from '../types/types';
import { defaultButton, defaultButtonLabel } from '../constants/theme';
/* */
import useDefaultCountry from '../hooks/api/useDefaultCountry';
import {
  useAddToCart,
  useGetCart,
  useSetShoppingCartID,
} from '../hooks/api/useShoppingCart';
import {
  useCheckoutCreate,
  useCheckoutCustomerAssociate,
  useCheckoutReplaceItem,
} from '../hooks/api/useShopifyCart';

type Props = {
  product: Product;
  onPress: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
};

export default function ProductItem(props: Props) {
  let [isToastVisible, setIsToastVisible] = useState(false);
  let [quantity, setQuantity] = useState(1);
  let {
    shoppingCartReplaceItems,
    loading: shoppingCartLoading,
  } = useCheckoutReplaceItem();
  let {
    data: { countryCode },
  } = useDefaultCountry();

  let {
    product: { title, images, price, discount, availableForSale },
    onPress,
    containerStyle,
    imageStyle,
  } = props;
  let afterDiscount = priceAfterDiscount(price, discount || 0);
  let formatCurrency = useCurrencyFormatter();

  let renderImage = () => {
    return availableForSale ? (
      <View style={styles.imageContainer}>
        <Image style={[styles.image, imageStyle]} source={{ uri: images[0] }} />
      </View>
    ) : (
      <View style={styles.imageContainer}>
        <ImageBackground
          style={[styles.image, imageStyle]}
          source={{ uri: images[0] }}
        >
          <View style={styles.oosBackground}>
            <Text style={styles.oosText} weight="medium">
              {t('Out of Stock')}
            </Text>
          </View>
        </ImageBackground>
      </View>
    );
  };
  /**/ 
  
  let onAddToCart = async () => {
     addToCart({ variables: { variantId: props.product.variant_id, quantity } });
  };
  let { addToCart, loading: addToCartLoading } = useAddToCart({
    onCompleted: async ({ addToShoppingCart }) => {
      let shoppingCartItems = addToShoppingCart.items.map(
        ({ variantId, quantity }) => {
          return { variantId, quantity };
        },
      );
      await shoppingCartReplaceItems({
        variables: {
          checkoutID: addToShoppingCart.id,
          lineItems: shoppingCartItems,
          country: countryCode,
        },
      });
      showToast(11000);
    },
  });
  let isLoading = addToCartLoading || shoppingCartLoading;
  let showToast = (duration: number) => {
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, duration);
  };
  let buttonLabel = () => {
    if (isLoading) {
      return null;
    }
    if (!props.product.id) {
      return t('Unavailable');
    }
    if (props.product.availableForSale) {
      return t('Add to Cart');
    }
    return t('Out of Stock');
  };
  let hideToast = () => {
    setIsToastVisible(false);
  };
  return (
    <>
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPress}
    >
      {renderImage()}
      {discount && discount > 0 ? (
        <DiscountBadge value={discount} containerStyle={styles.discountBox} />
      ) : null}
      <Text numberOfLines={1} style={styles.nameText}>
        {title}
      </Text>
      <View style={styles.priceContainer}>
        <Text style={styles.priceText} weight="bold">
          {discount && discount > 0
            ? formatCurrency(afterDiscount)
            : formatCurrency(price)}
        </Text>
        {discount && discount > 0 ? (
          <Text style={styles.discountedPrice}>{formatCurrency(price)}</Text>
        ) : null}
      </View>
      <View>
      <Button
        style={[
          defaultButton,
          styles.flex,
          !props.product.availableForSale && styles.disabledButton,
        ]}
        labelStyle={[
          defaultButtonLabel,
          !props.product.availableForSale && styles.disabledLabel,
        ]}
        disabled={!props.product.availableForSale}
        loading={isLoading}
        onPress={onAddToCart}
      >
        {buttonLabel()}
      </Button>
      </View>
    </TouchableOpacity>
      <Toast
        data={{
          message: t('Item successfully added'),
          isVisible: isToastVisible,
          hideToast,
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  image: {
    width: '100%',
    aspectRatio: 0.85,
  },
  imageContainer: {
    marginBottom: 12,
  },
  discountBox: {
    position: 'absolute',
    top: 14,
    right: 12,
  },
  nameText: {
    fontSize: FONT_SIZE.small,
    marginBottom: 6,
  },
  priceText: {
    marginRight: 8,
    fontSize: FONT_SIZE.medium,
    color: COLORS.primaryColor,
  },
  discountedPrice: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.priceGrey,
    textDecorationLine: 'line-through',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  oosText: {
    color: COLORS.white,
  },
  oosBackground: {
    backgroundColor: COLORS.black,
    opacity: 0.6,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
  },
  bottomIconContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
  disabledButton: {
    backgroundColor: COLORS.black,
    opacity: 0.2,
  },
  disabledLabel: {
    color: COLORS.white,
  },
});
