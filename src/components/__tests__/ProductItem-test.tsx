import React from 'react';
import { render } from 'react-native-testing-library';

import { MockedProvider } from '@apollo/react-testing';

import { ProductItem } from '../';
import { MOCKED_SHOP } from '../../__mocks__/mockedData';
import wait from '../../__mocks__/wait';
import { ProductItemData } from '../../fixtures/ProductItemData';
import { setDefaultCountryResolver } from '../../graphql/resolvers/setDefaultCountryResolver';

test('should render normally with discount', async () => {
  let { getByText } = render(
    <MockedProvider
      mocks={MOCKED_SHOP}
      addTypename={false}
      resolvers={{
        Mutation: {
          setDefaultCountry: setDefaultCountryResolver,
        },
      }}
    >
      <ProductItem product={ProductItemData[2]} onPress={() => {}} />
    </MockedProvider>,
  );
  await wait();

  expect(getByText(ProductItemData[2].title)).toBeTruthy();
  expect(getByText(`${ProductItemData[2].discount}% off`)).toBeTruthy();
});

test('should render normally when product is out of stock', async () => {
  let { getByText } = render(
    <MockedProvider
      mocks={MOCKED_SHOP}
      addTypename={false}
      resolvers={{
        Mutation: {
          setDefaultCountry: setDefaultCountryResolver,
        },
      }}
    >
      <ProductItem product={ProductItemData[0]} onPress={() => {}} />
    </MockedProvider>,
  );
  await wait();

  expect(getByText('Out of Stock')).toBeTruthy();
});
