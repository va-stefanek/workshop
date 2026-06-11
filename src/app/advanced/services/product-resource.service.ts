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

  // TODO: Make this resource REACTIVE — right now it loads ONCE and ignores
  // every filter change!
  //
  // THE BUG: signals read inside an async loader are NOT tracked. Typing in
  // the search box updates searchQuery(), but the resource never re-runs.
  //
  // YOUR WORK (the loader logic below is provided — reactivity is the lesson):
  // 1. Add a `params` function that reads ALL the filter signals:
  //    params: () => ({ search: this.searchQuery(), category: ..., ... })
  //    `params` is the ONLY reactive part of a resource — any signal read
  //    there re-triggers the loader when it changes.
  // 2. Change the loader signature to `async ({ params }) =>` and replace
  //    the `this.someSignal()` reads below with `params.someValue`.
  // 3. BONUS: also destructure `abortSignal` and make the delay below
  //    cancellable, so rapid filter changes abort the stale load.
  //
  // LEARNING: resource() = reactive params + async loader + value/isLoading/
  // error signals. The template already consumes them (see the component).
  public readonly productsResource = resource({
    loader: async () => {
      try {
        // These reads are NOT tracked here — move them into params (TODO #1)
        const search = this.searchQuery();
        const category = this.categoryFilter();
        const priceRange = this.priceRange();
        const sortBy = this.sortBy();
        const sortOrder = this.sortOrder();
        const page = this.currentPage();
        const limit = this.itemsPerPage();

        const response = await firstValueFrom(this.http.get<Product[]>('api/products'));
        let products = response || [];

        // Apply filters
        if (search && search.trim()) {
          const searchLower = search.toLowerCase();
          products = products.filter(p => 
            p.name.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower) ||
            p.tags?.some(tag => tag.toLowerCase().includes(searchLower))
          );
        }

        if (category && category !== 'all') {
          products = products.filter(p => p.category === category);
        }

        if (priceRange.min !== undefined && priceRange.max !== undefined) {
          products = products.filter(p => 
            p.price >= priceRange.min && p.price <= priceRange.max
          );
        }

        // Apply sorting
        products.sort((a, b) => {
          let aValue: string | number, bValue: string | number;
          
          switch (sortBy) {
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
          return sortOrder === 'desc' ? -comparison : comparison;
        });

        // Apply pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProducts = products.slice(startIndex, endIndex);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        return {
          products: paginatedProducts,
          loading: false,
          error: null
        };
      } catch (error) {
        console.error('Error loading products:', error);
        return {
          products: [],
          loading: false,
          error: 'Failed to load products'
        };
      }
    }
  });

  // TODO: Same exercise — selecting a product should load its details.
  // Add `params: () => ({ id: this.selectedProductId() })` and read the id
  // from `params` in the loader instead of calling the signal here.
  private selectedProductId = signal<string | null>(null);

  public readonly selectedProductResource = resource({
    loader: async () => {
      const id = this.selectedProductId();
      if (!id) return null;
      
      try {
        const response = await firstValueFrom(this.http.get<Product[]>('api/products'));
        const products = response || [];
        const product = products.find(p => p.id === id);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        return product || null;
      } catch (error) {
        console.error('Error loading product:', error);
        return null;
      }
    }
  });

  // TODO: Same exercise — recommendations depend on the selected product AND
  // the category filter. Move both signal reads into a `params` function.
  public readonly recommendationsResource = resource({
    loader: async () => {
      try {
        const response = await firstValueFrom(this.http.get<Product[]>('api/products'));
        let products = response || [];
        
        const basedOnProductId = this.selectedProductId();
        const category = this.categoryFilter();

        // Filter recommendations based on current product or category
        if (basedOnProductId) {
          const baseProduct = products.find(p => p.id === basedOnProductId);
          if (baseProduct) {
            products = products.filter(p => 
              p.id !== basedOnProductId && 
              (p.category === baseProduct.category || 
               p.tags?.some(tag => baseProduct.tags?.includes(tag)))
            );
          }
        } else if (category && category !== 'all') {
          products = products.filter(p => p.category === category);
        }

        // Sort by rating and return top 5
        products.sort((a, b) => b.rating - a.rating);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 400));
        
        return products.slice(0, 5);
      } catch (error) {
        console.error('Error loading recommendations:', error);
        return [];
      }
    }
  });

  constructor(private http: HttpClient) {}

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