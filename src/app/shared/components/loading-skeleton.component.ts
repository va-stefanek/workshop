import { Component, Input, ChangeDetectionStrategy } from '@angular/core';


@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  imports: [],
  template: `
    <div class="skeleton-container">
      @switch (type) {
        <!-- Product Card Skeleton -->
        @case ('product-card') {
          <div class="skeleton product-card-skeleton">
            <div class="skeleton-image"></div>
            <div class="skeleton-content">
              <div class="skeleton-line skeleton-title"></div>
              <div class="skeleton-line skeleton-subtitle"></div>
              <div class="skeleton-line skeleton-text"></div>
              <div class="skeleton-line skeleton-text short"></div>
              <div class="skeleton-footer">
                <div class="skeleton-line skeleton-price"></div>
                <div class="skeleton-button"></div>
              </div>
            </div>
          </div>
        }
        <!-- Cart Item Skeleton -->
        @case ('cart-item') {
          <div class="skeleton cart-item-skeleton">
            <div class="skeleton-image small"></div>
            <div class="skeleton-item-content">
              <div class="skeleton-line skeleton-title"></div>
              <div class="skeleton-line skeleton-subtitle"></div>
              <div class="skeleton-line skeleton-price"></div>
            </div>
            <div class="skeleton-controls">
              <div class="skeleton-button small"></div>
              <div class="skeleton-button small"></div>
            </div>
          </div>
        }
        <!-- Text Lines Skeleton -->
        @case ('text') {
          <div class="skeleton text-skeleton">
            @for (line of getLines(); track line) {
              <div
                class="skeleton-line"
                [style.width.%]="line.width"
              ></div>
            }
          </div>
        }
        <!-- Grid Skeleton -->
        @case ('grid') {
          <div class="skeleton-grid">
            @for (item of getGridItems(); track item) {
              <div
                class="skeleton grid-item-skeleton"
                >
                <div class="skeleton-image"></div>
                <div class="skeleton-line skeleton-title"></div>
                <div class="skeleton-line skeleton-subtitle"></div>
              </div>
            }
          </div>
        }
        <!-- List Skeleton -->
        @case ('list') {
          <div class="skeleton-list">
            @for (item of getListItems(); track item) {
              <div
                class="skeleton list-item-skeleton"
                >
                <div class="skeleton-avatar"></div>
                <div class="skeleton-list-content">
                  <div class="skeleton-line skeleton-title"></div>
                  <div class="skeleton-line skeleton-text"></div>
                </div>
              </div>
            }
          </div>
        }
        <!-- Table Skeleton -->
        @case ('table') {
          <div class="skeleton-table">
            <div class="skeleton-table-header">
              @for (col of getTableColumns(); track col) {
                <div
                  class="skeleton-line skeleton-header"
                ></div>
              }
            </div>
            @for (row of getTableRows(); track row) {
              <div
                class="skeleton-table-row"
                >
                @for (col of getTableColumns(); track col) {
                  <div
                    class="skeleton-line skeleton-cell"
                  ></div>
                }
              </div>
            }
          </div>
        }
        <!-- Default Skeleton -->
        @default {
          <div class="skeleton default-skeleton">
            <div class="skeleton-line"></div>
            <div class="skeleton-line short"></div>
            <div class="skeleton-line medium"></div>
          </div>
        }
      }
    </div>
    `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./loading-skeleton.component.css']
})
export class LoadingSkeletonComponent {
  @Input() type: 'product-card' | 'cart-item' | 'text' | 'grid' | 'list' | 'table' | 'default' = 'default';
  @Input() lines = 3;
  @Input() gridItems = 6;
  @Input() listItems = 5;
  @Input() tableRows = 5;
  @Input() tableColumns = 4;
  @Input() animated = true;

  getLines(): { width: number }[] {
    const lines = [];
    for (let i = 0; i < this.lines; i++) {
      // Vary line widths to look more natural
      const width = i === this.lines - 1 ? 60 + Math.random() * 30 : 80 + Math.random() * 20;
      lines.push({ width });
    }
    return lines;
  }

  getGridItems(): number[] {
    return Array(this.gridItems).fill(0);
  }

  getListItems(): number[] {
    return Array(this.listItems).fill(0);
  }

  getTableRows(): number[] {
    return Array(this.tableRows).fill(0);
  }

  getTableColumns(): number[] {
    return Array(this.tableColumns).fill(0);
  }
}