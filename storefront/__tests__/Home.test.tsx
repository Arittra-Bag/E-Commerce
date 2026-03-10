import { render, screen } from '@testing-library/react';
import Home from '../src/app/[countryCode]/(main)/page';

jest.mock('../src/modules/home/components/hero', () => {
  return function MockHero() {
    return <div data-testid="hero-mock">Hero</div>;
  };
});
jest.mock('../src/modules/home/components/featured-products', () => {
  return function MockFeaturedProducts() {
    return <div data-testid="featured-products-mock">Featured Products</div>;
  };
});
jest.mock('../src/lib/data/collections', () => ({
  listCollections: jest.fn().mockResolvedValue({
    collections: [{ id: '1', handle: 'c1', title: 'C1' }],
  }),
}));
jest.mock('../src/lib/data/regions', () => ({
  getRegion: jest.fn().mockResolvedValue({ id: 'r1', name: 'US', currency_code: 'usd' }),
}));

describe('Home', () => {
  it('renders the Hero component', async () => {
    const Component = await Home({ params: Promise.resolve({ countryCode: 'us' }) });
    render(Component);
    expect(screen.getByTestId('hero-mock')).toBeInTheDocument();
  });

  it('renders the Featured Products component', async () => {
    const Component = await Home({ params: Promise.resolve({ countryCode: 'us' }) });
    render(Component);
    expect(screen.getByTestId('featured-products-mock')).toBeInTheDocument();
  });
});
