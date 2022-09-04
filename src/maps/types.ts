export interface MapFileInfo {
  readonly file: string;
  readonly display: string;
}

export interface MapFile extends MapFileInfo {
  readonly items: Item[];
}

export interface Point {
  readonly x: number;
  readonly y: number;
  readonly elevation: number;
}

export interface Color {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

export interface LineItem {
  readonly type: 'line';
  readonly from: Point;
  readonly to: Point;
  readonly color: Color;
}

export interface PointItem {
  readonly type: 'point';
  readonly point: Point;
  readonly color: Color;
  readonly entityType: string;
  readonly label: string;
}

export type Item = LineItem | PointItem;
