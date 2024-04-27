import type { ChangeCallback, ValueCallback } from "./notifier";
import { Matrix } from "./matrix";
import { ChangeNotifier, ValueNotifier } from "./notifier";

export interface CanvasOptions {
  width: number;
  height: number;
  matrix?: Matrix;
}

export class Canvas {
  private oCanvas!: HTMLCanvasElement;

  private matrixNotifier: ChangeNotifier = new ChangeNotifier();

  private mousemoveNotifier: ValueNotifier<MouseEvent> = new ValueNotifier();

  private options: CanvasOptions;

  private matrix!: Matrix;

  private _viewbox: Viewbox = [0, 0, 0, 0];

  public get viewbox() {
    return [...this._viewbox];
  }

  public get node(): HTMLCanvasElement {
    return this.oCanvas;
  }

  public get ctx(): CanvasRenderingContext2D {
    return this.oCanvas.getContext("2d")!;
  }

  constructor(options: CanvasOptions) {
    this.options = options;
  }

  public ensureInitialized(): void {
    this.initDOM();
    this.bindEvent();
    // this.setTransform(this.options.matrix ?? new Matrix([1, 0, 0, 1, 0, 0]));
  }

  private initDOM() {
    this.oCanvas = this.createCanvas();
  }

  private createCanvas(): HTMLCanvasElement {
    const node = document.createElement("canvas");
    const { width, height } = this.options;
    node.width = width;
    node.height = height;
    node.style.width = `${width}`;
    node.style.height = `${height}`;
    return node;
  }

  private bindEvent(): void {
    const onmousemoveForDown = (e: MouseEvent): void => {
      const [x, y] = [e.movementX, e.movementY];
      const matrix = this.matrix.translate(x, y);
      this.setTransform(matrix);
    };

    const onmouseupForDown = (e: MouseEvent): void => {
      window.removeEventListener("mousemove", onmousemoveForDown, false);
      window.removeEventListener("mouseup", onmouseupForDown, false);
    };

    const onmousedown = (e: MouseEvent): void => {
      window.addEventListener("mousemove", onmousemoveForDown, false);
      window.addEventListener("mouseup", onmouseupForDown, false);
    };

    const onwheel = (e: WheelEvent): void => {
      e.preventDefault();
      e.stopPropagation();

      const sign = Math.sign(e.deltaY);
      const position = this.toGlobal([e.clientX, e.clientY]);
      const scale = sign > 0 ? 0.9 : 1.1;
      const matrix = this.matrix.scale(scale, scale, position);
      this.setTransform(matrix);
    };

    const onmousemove = (e: MouseEvent): void => {
      this.mousemoveNotifier.notifyListeners(e);
    };

    this.oCanvas.addEventListener("mousedown", onmousedown, false);
    this.oCanvas.addEventListener("wheel", onwheel, false);
    this.oCanvas.addEventListener("mousemove", onmousemove, false);
  }

  public setTransform(matrix: Matrix): void {
    const ctx = this.ctx;
    ctx.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
    this.matrix = matrix;
    this.setLineWidth(matrix);
    this.setViewbox(matrix);
    this.matrixNotifier.notifyListeners();
  }

  private setLineWidth(matrix: Matrix): void {
    const ctx = this.ctx;
    ctx!.lineWidth = 1 / ((matrix.a + matrix.d) / 2);
  }

  private setViewbox(matrix: Matrix): void {
    const { width, height } = this.options;
    this._viewbox = [-matrix.tx / matrix.a, -matrix.ty / matrix.d, width / matrix.a, height / matrix.d];
  }

  public toGlobal(point: Point): Point {
    const [startX, startY] = this._viewbox;
    const { a, d } = this.matrix;
    const [x, y] = point;

    return [startX + x / a, startY + y / d];
  }

  public clean(): void {
    const ctx = this.ctx;
    ctx.clearRect(...this._viewbox);
  }

  public addMatrixListener(cb: ChangeCallback): void {
    this.matrixNotifier.addListener(cb);
  }

  public addMousemoveListener(cb: ValueCallback<MouseEvent>): void {
    this.mousemoveNotifier.addListener(cb);
  }
}
