import type { DrawPolygonStyle, DrawTextStyle } from "./draw";
import { Canvas } from "./canvas";
import { Draw, DrawMode } from "./draw";
import { Matrix } from "./matrix";
import { isPointInPolygon } from "./utils";

export interface GeomapOptions {
  width: number;
  height: number;
  data: Province[];
}

export class Geomap {
  private container: HTMLElement;

  private options: GeomapOptions;

  private canvas!: Canvas;

  private draw!: Draw;

  private hoverProvince?: Province;

  constructor(container: HTMLElement, options: GeomapOptions) {
    this.container = container;
    this.options = options;
  }

  public ensureInitialized(): void {
    this.initCanvas();
    this.initDraw();
    this.bindEvent();
    this.canvas.setTransform(new Matrix([11.5, 0, 0, 11.5, -800, 700]));
    this.render();
  }

  private initCanvas(): void {
    const { width, height } = this.options;
    this.canvas = new Canvas({ width, height });
    this.canvas.ensureInitialized();
    this.container.appendChild(this.canvas.node);
  }

  private initDraw() {
    this.draw = new Draw({ ctx: this.canvas.ctx });
  }

  private bindEvent(): void {
    const canvas = this.canvas;

    canvas.addMatrixListener(() => {
      this.render();
    });

    canvas.addMousemoveListener(e => {
      const { data } = this.options;
      const [x, y] = canvas.toGlobal([e.clientX, e.clientY]);
      const hoverProvince = this.province([x, -y], data);
      if (hoverProvince != this.hoverProvince) {
        this.hoverProvince = hoverProvince;
        this.render();
      }
    });
  }

  public render(): void {
    this.canvas.clean();

    const provinces = this.options.data;
    const hoverProvince = this.hoverProvince;

    for (const province of provinces) {
      this.drawCoordinates(province.geometry.coordinates, { mode: DrawMode.stroke });
      if (province.type === "Feature") this.drawProvinceName(province);
    }

    if (hoverProvince) {
      this.drawCoordinates(hoverProvince.geometry.coordinates, { mode: DrawMode.fill, color: "red" });
      this.drawProvinceName(hoverProvince, { color: "yellow" });
    }
  }

  private province(point: Point, provinces: Province[]): Province | undefined {
    for (const province of provinces) {
      if (province.type === "Boundary") break;

      for (const areas of province.geometry.coordinates) {
        for (const areaPoint of areas) {
          const inArea = isPointInPolygon(point, areaPoint);
          if (inArea) return province;
        }
      }
    }
  }

  private drawCoordinates(coordinates: Geometry["coordinates"], style?: Partial<DrawPolygonStyle>): void {
    for (const areas of coordinates) {
      for (const points of areas) {
        this.draw.drawPolygon(points, style);
      }
    }
  }

  private drawProvinceName(province: Province, style?: Partial<DrawTextStyle>): void {
    const [x, y] = province.properties.center;
    this.draw.drawText(province.properties.name, [x, -y], style);
  }
}
