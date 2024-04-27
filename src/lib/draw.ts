export enum Direction {
  center,
}

export enum DrawMode {
  fill,
  stroke,
}

export interface DrawPolygonStyle {
  mode: DrawMode;
  color: string;
}

export interface DrawTextStyle {
  direction: Direction;
  color: string;
  fontSize: number;
}

export interface DrawOptinos {
  ctx: CanvasRenderingContext2D;
}

export class Draw {
  private ctx: CanvasRenderingContext2D;

  constructor(options: DrawOptinos) {
    this.ctx = options.ctx;
  }

  private textLocateAt(text: string, point: Point, direction: Direction): Point {
    const ctx = this.ctx;

    let [x, y] = point;
    switch (direction) {
      case Direction.center: {
        x = x - ctx.measureText(text).width / 2;
      }
    }

    return [x, y];
  }

  public drawText(text: string, point: Point, style?: Partial<DrawTextStyle>) {
    const ctx = this.ctx;
    const matrix = ctx.getTransform();
    const autoFontSize = 20 / ((matrix.a + matrix.d) / 2);
    const fontSize = style?.fontSize ?? (autoFontSize > 1 ? 1 : autoFontSize);
    const direction = style?.direction ?? Direction.center;
    const color = style?.color ?? "black";
    const [x, y] = this.textLocateAt(text, point, direction);

    ctx.beginPath();
    ctx.font = `${fontSize}px sans-serif`;
    ctx.fillStyle = color;

    ctx.fillText(text, x, y);
    ctx.closePath();
  }

  public drawPolygon(polygon: Point[], style?: Partial<DrawPolygonStyle>) {
    const ctx = this.ctx;
    const mode = style?.mode ?? DrawMode.stroke;
    const color = style?.color ?? "black";
    ctx.beginPath();

    for (const point of polygon) {
      const [x, y] = point;
      ctx.lineTo(x, -y);
    }

    switch (mode) {
      case DrawMode.stroke: {
        ctx.strokeStyle = color;
        ctx.stroke();
        break;
      }
      case DrawMode.fill:
        ctx.fillStyle = color;
        ctx.fill();
    }

    ctx.closePath();
  }
}
