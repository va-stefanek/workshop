import { Injectable, resource, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Product } from '../../shared/models';

interface ProductsResource {
  products: Product[];
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ProductResourceService {

  private searchQuery = signal<string>('');
  private categoryFilter = signal<string>('all');
  private priceRange = signal<{ min: number; max: number }>({ min: 0, max: 5000 });
  private sortBy = signal<'name' | 'price' | 'rating'>('name');
  private sortOrder = signal<'asc' | 'desc'>('asc');
  private itemsPerPage = signal<number>(12);
  private currentPage = signal<number>(1);

  // SOLUTION: the resource is reactive because `params` reads every filter
  // signal. Whenever ANY of them changes, Angular aborts the in-flight load
  // (see abortSignal below) and re-runs the loader with the new params.
  //
  // KEY LESSON: signals read inside the async loader are NOT tracked —
  // `params` is the only reactive part of a resource. That's why every
  // signal read lives here and the loader only consumes the params value.
  public readonly productsResource = resource({
    params: () => ({
      search: this.searchQuery(),
      category: this.categoryFilter(),
      priceRange: this.priceRange(),
      sortBy: this.sortBy(),
      sortOrder: this.sortOrder(),
      page: this.currentPage(),
      limit: this.itemsPerPage()
    }),
    loader: async ({ params, abortSignal }): Promise<ProductsResource> => {
      try {
        const response = await firstValueFrom(this.http.get<Product[]>('api/products'));
        let products = response || [];

        // Apply filters — all inputs come from params, never from signals
        if (params.search && params.search.trim()) {
          const searchLower = params.search.toLowerCase();
          products = products.filter(p =>
            p.name.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower) ||
            p.tags?.some(tag => tag.toLowerCase().includes(searchLower))
          );
        }

        if (params.category && params.category !== 'all') {
          products = products.filter(p => p.category === params.category);
        }

        if (params.priceRange.min !== undefined && params.priceRange.max !== undefined) {
          products = products.filter(p =>
            p.price >= params.priceRange.min && p.price <= params.priceRange.max
          );
        }

        // Apply sorting
        products.sort((a, b) => {
          let aValue: string | number, bValue: string | number;

          switch (params.sortBy) {
            case 'price':
              aValue = a.price;
              bValue = b.price;
              break;
            case 'rating':
              aValue = a.rating;
              bValue = b.rating;
              break;
            default:
              aValue = a.name;
              bValue = b.name;
          }

          if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = (bValue as string).toLowerCase();
          }

          const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
          return params.sortOrder === 'desc' ? -comparison : comparison;
        });

        // Apply pagination
        const startIndex = (params.page - 1) * params.limit;
        const endIndex = startIndex + params.limit;
        const paginatedProducts = products.slice(startIndex, endIndex);

        // Simulate network delay — cancellable: when params change mid-load,
        // Angular aborts this signal and the stale load stops here
        await this.delay(500, abortSignal);

        return {
          products: paginatedProducts,
          loading: false,
          error: null
        };
      } catch (error) {
        if (abortSignal.aborted) throw error; // aborted loads should not report errors
        console.error('Error loading products:', error);
        return {
          products: [],
          loading: false,
          error: 'Failed to load products'
        };
      }
    }
  });

  // SOLUTION: selecting a product re-runs the loader because the id is read
  // in params; clearing the selection (null) resolves to null without a call
  private selectedProductId = signal<string | null>(null);

  public readonly selectedProductResource = resource({
    params: () => ({ id: this.selectedProductId() }),
    loader: async ({ params, abortSignal }): Promise<Product | null> => {
      if (!params.id) return null;

      try {
        const response = await firstValueFrom(this.http.get<Product[]>('api/products'));
        const products = response || [];
        const product = products.find(p => p.id === params.id);

        await this.delay(300, abortSignal);

        return product || null;
      } catch (error) {
        if (abortSignal.aborted) throw error;
        console.error('Error loading product:', error);
        return null;
      }
    }
  });

  // SOLUTION: recommendations react to BOTH the selected product and the
  // category filter — two signals, one params object
  public readonly recommendationsResource = resource({
    params: () => ({
      basedOnProductId: this.selectedProductId(),
      category: this.categoryFilter()
    }),
    loader: async ({ params, abortSignal }): Promise<Product[]> => {
      try {
        const response = await firstValueFrom(this.http.get<Product[]>('api/products'));
        let products = response || [];

        // Filter recommendations based on current product or category
        if (params.basedOnProductId) {
          const baseProduct = products.find(p => p.id === params.basedOnProductId);
          if (baseProduct) {
            products = products.filter(p =>
              p.id !== params.basedOnProductId &&
              (p.category === baseProduct.category ||
               p.tags?.some(tag => baseProduct.tags?.includes(tag)))
            );
          }
        } else if (params.category && params.category !== 'all') {
          products = products.filter(p => p.category === params.category);
        }

        // Sort by rating and return top 5
        products.sort((a, b) => b.rating - a.rating);

        await this.delay(400, abortSignal);

        return products.slice(0, 5);
      } catch (error) {
        if (abortSignal.aborted) throw error;
        console.error('Error loading recommendations:', error);
        return [];
      }
    }
  });

  constructor(private http: HttpClient) {}

  // Abortable delay: rejects as soon as the resource aborts the load,
  // so a rapid filter change doesn't wait out the stale timer
  private delay(ms: number, abortSignal: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(resolve, ms);
      abortSignal.addEventListener('abort', () => {
        clearTimeout(timer);
        reject(new DOMException('Load aborted', 'AbortError'));
      }, { once: true });
    });
  }

  // Public methods for updating filters
  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1); // Reset to first page
  }

  setCategoryFilter(category: string): void {
    this.categoryFilter.set(category);
    this.currentPage.set(1);
  }

  setPriceRange(min: number, max: number): void {
    this.priceRange.set({ min, max });
    this.currentPage.set(1);
  }

  setSorting(sortBy: 'name' | 'price' | 'rating', sortOrder: 'asc' | 'desc'): void {
    this.sortBy.set(sortBy);
    this.sortOrder.set(sortOrder);
  }

  setItemsPerPage(count: number): void {
    this.itemsPerPage.set(count);
    this.currentPage.set(1);
  }

  setCurrentPage(page: number): void {
    this.currentPage.set(page);
  }

  selectProduct(productId: string): void {
    this.selectedProductId.set(productId);
  }

  clearProductSelection(): void {
    this.selectedProductId.set(null);
  }

  // Getters for current state
  getCurrentFilters() {
    return {
      search: this.searchQuery(),
      category: this.categoryFilter(),
      priceRange: this.priceRange(),
      sortBy: this.sortBy(),
      sortOrder: this.sortOrder(),
      page: this.currentPage(),
      itemsPerPage: this.itemsPerPage()
    };
  }

  resetFilters(): void {
    this.searchQuery.set('');
    this.categoryFilter.set('all');
    this.priceRange.set({ min: 0, max: 5000 });
    this.sortBy.set('name');
    this.sortOrder.set('asc');
    this.currentPage.set(1);
  }
}
