export const PriceFilter = [
  {
    minPrice: 0,
    maxPrice: 50000,
    isTitle: true,
    preTitle: 'upto',
    postTitleSign: true,
    postTitle: '50k',
  },
  {
    minPrice: 50000,
    maxPrice: 100000,
    isTitle: true,
    preTitle: '50k -',
    postTitle: '1 Lac',
  },
  {
    minPrice: 100000,
    maxPrice: 300000,
    isTitle: true,
    preTitle: '1 Lac -',
    postTitle: '3 Lac',
  },
  {
    minPrice: 300000,
    maxPrice: 500000,
    isTitle: true,
    preTitle: '3 Lac -',
    postTitle: '5 Lac',
  },
  {
    minPrice: 500000,
    maxPrice: 1000000,
    isTitle: true,
    preTitle: '5 Lac -',
    postTitle: '10 Lac',
  },
  {
    minPrice: 1000000,
    maxPrice: 2000000,
    preTitle: '10 Lac',
    postTitle: 'plus',
    isTitle: true,
  },
];

export const SizeFilter = [
  {
    minSize: 0,
    maxSize: 1000,
    isTitle: true,
    preTitle: 'upto',
    postTitle: '1000',
  },
  {
    minSize: 1000,
    maxSize: 3000,
    isTitle: false,
  },
  {
    minSize: 3000,
    maxSize: 5000,
    isTitle: false,
  },
  {
    minSize: 5000,
    maxSize: 10000,
    isTitle: false,
  },
  {
    minSize: 10000,
    maxSize: 100000,
    isTitle: true,
    preTitle: '',
    postTitle: '10000 +',
  },
];

export const TypeFilter = [
  { label: 'Raw Office', value: 'raw' },
  { label: 'Furnished Office', value: 'fully-furnished' },
  { label: 'All Options', value: 'all' },
];
