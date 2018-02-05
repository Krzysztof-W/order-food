import {Component, Input} from '@angular/core';

export interface TableColumn {
  name: string;
  data: string;
}

export interface TableAction {
  name: string;
  confirmation?: string;
  condition: (item) => void;
  action: (item) => void;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html'
})
export class TableComponent {
  @Input() columnData: TableColumn[];
  private _items: any[];
  @Input() actions: TableAction[];
  cells: string[][];
  @Input() emptyText: string = 'No records to display';

  @Input() set items(value: any[]) {
    this._items = value;
    this.updateCells();
  }

  get items(): any[] {
    return this._items;
  }

  private updateCells(): void {
    this.cells = [];
    this._items.forEach(item => {
      const row: string[] = [];
      this.columnData.forEach((column, i) => {
        const keys = column.data.split('.');
        let key: string, object = item;
        while (key = keys.shift()) {
          if (!object[key]) {
            break;
          }
          object = object [key];
        }
        row.push(object);
      });
      this.cells.push(row);
    });
  }
}
