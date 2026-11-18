import { orderBy } from 'lodash-es';
import { products } from './mock-data';
import type { Filters, Product, SortKey } from './types';

type SortConfig = [Array<keyof Product | ((p: Product) => unknown)>, Array<'asc' | 'desc'>];

const SORTS: Record<Exclude<SortKey, 'default'>, SortConfig> = {
  'price-asc': [['price'], ['asc']],
  'price-desc': [['price'], ['desc']],
  'title-asc': [[(p) => p.title.toLowerCase()], ['asc']],
  'rating-desc': [['rating'], ['desc']],
};

export function readFilters(form: HTMLFormElement): Filters {
  const data = new FormData(form);
  const toNumber = (value: FormDataEntryValue | null): number | null =>
    value === null || value === '' ? null : Number(value);

  return {
    search: String(data.get('search') ?? '').trim().toLowerCase(),
    category: (data.get('category') ?? 'all') as Filters['category'],
    minPrice: toNumber(data.get('minPrice')),
    maxPrice: toNumber(data.get('maxPrice')),
    sort: (data.get('sort') ?? 'default') as SortKey,
  };
}

export function filterProducts({ search, category, minPrice, maxPrice, sort }: Filters): Product[] {
  const filtered = products.filter(
    (p) =>
      (!search || p.title.toLowerCase().includes(search)) &&
      (category === 'all' || p.category === category) &&
      (minPrice === null || p.price >= minPrice) &&
      (maxPrice === null || p.price <= maxPrice),
  );

  return sort === 'default' ? filtered : orderBy(filtered, ...SORTS[sort]);
}

const priceFormatter = new Intl.NumberFormat('uk-UA', {
  style: 'currency',
  currency: 'UAH',
  maximumFractionDigits: 0,
});

export function formatPrice(value: number): string {
  return priceFormatter.format(value);
}
