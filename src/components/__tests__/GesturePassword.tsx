import React from 'react';
import GesturePassword from '../GesturePassword';

import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(<GesturePassword />).toJSON();
  expect(tree).toMatchSnapshot();
});