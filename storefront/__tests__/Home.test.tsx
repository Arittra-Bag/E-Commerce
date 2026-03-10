import { render, screen } from '@testing-library/react';
import Home from '../src/app/[countryCode]/(main)/page';
import { listCollections } from '../src/lib/data/collections';
import { getRegion } from '../src/lib/data/regions';

jest.mock('../src/modules/home/components/hero', () => {
  return function MockHero() {
    return <div data-testid="hero-mock">Hero</div>;
  };
});

jest.mock('../src/modules/home/components/featured-products', () => {
  return function MockFeaturedProducts({ collections, region }: any) {
    return (
      <div data-testid="featured-products-mock">
        Featured Products
        <span data-testid="collections-prop">{JSON.stringify(collections)}</span>
        <span data-testid="region-prop">{JSON.stringify(region)}</span>
      </div>
    );
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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the Hero component', async () => {
    const Component = await Home({ params: Promise.resolve({ countryCode: 'us' }) });
    render(Component);
    expect(screen.getByTestId('hero-mock')).toBeInTheDocument();
  });

  it('renders the Featured Products component with correct data', async () => {
    const Component = await Home({ params: Promise.resolve({ countryCode: 'gb' }) });
    render(Component);

    // Check that data loaders were called correctly based on params
    expect(getRegion).toHaveBeenCalledWith('gb');
    expect(listCollections).toHaveBeenCalledWith({ fields: 'id, handle, title' });

    expect(screen.getByTestId('featured-products-mock')).toBeInTheDocument();
    expect(screen.getByTestId('collections-prop')).toHaveTextContent(JSON.stringify([{ id: '1', handle: 'c1', title: 'C1' }]));
    expect(screen.getByTestId('region-prop')).toHaveTextContent(JSON.stringify({ id: 'r1', name: 'US', currency_code: 'usd' }));
  });
});
