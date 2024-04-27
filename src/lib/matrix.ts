import { multiply } from "./utils";

/**
 * Matrix Array Type
 * a, b, c, d, e, f
 */
export type MatrixArray = [number, number, number, number, number, number];

export enum MultiplicativeDirection {
  Right,
  Left,
}

export class Matrix {
  public a: number;

  public b: number;

  public c: number;

  public d: number;

  public tx: number;

  public ty: number;

  get matrixArray(): MatrixArray {
    return [this.a, this.b, this.c, this.d, this.tx, this.ty];
  }

  constructor(matrixArray: MatrixArray = [1, 0, 0, 1, 0, 0]) {
    this.a = matrixArray[0];
    this.b = matrixArray[1];
    this.c = matrixArray[2];
    this.d = matrixArray[3];
    this.tx = matrixArray[4];
    this.ty = matrixArray[5];
  }

  /**
   * Matrix multiplication
   */
  public multiply(other: Matrix, direction: MultiplicativeDirection = MultiplicativeDirection.Right): Matrix {
    switch (direction) {
      case MultiplicativeDirection.Left:
        return multiply(this, other);
      case MultiplicativeDirection.Right:
        return multiply(other, this);
    }
  }

  public translate(tx: number, ty: number): Matrix {
    const translationMatrix = new Matrix([1, 0, 0, 1, tx, ty]);
    const matrix = this.multiply(translationMatrix);
    return matrix;
  }

  public setTranslate(tx: number, ty: number): Matrix {
    const matrix = new Matrix([this.a, this.b, this.c, this.d, tx, ty]);
    return matrix;
  }

  /**
   * Scale
   *
   * At locate [point] scale, if the [point] exist.
   */
  public scale(a: number, d: number, point?: Point): Matrix {
    let matrix: Matrix;
    if (point) {
      const [x, y] = point;
      matrix = this.multiply(new Matrix([1, 0, 0, 1, x, y]), MultiplicativeDirection.Left)
        .multiply(new Matrix([a, 0, 0, d, 0, 0]), MultiplicativeDirection.Left)
        .multiply(new Matrix([1, 0, 0, 1, -x, -y]), MultiplicativeDirection.Left);
    } else {
      matrix = this.multiply(new Matrix([a, 0, 0, d, 0, 0]));
    }

    return matrix;
  }
}
