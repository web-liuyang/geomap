import type { MatrixArray } from "./matrix";
import { Matrix } from "./matrix";

/**
 * Return true, if Point in the Polygon.
 */
export function isPointInPolygon(point: Point, polygon: Point[]) {
  const [px, py] = point;
  let isInside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0];
    const yi = polygon[i][1];
    const xj = polygon[j][0];
    const yj = polygon[j][1];
    const intersect = yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi;
    if (intersect) isInside = !isInside;
  }

  return isInside;
}

/**
 * Matrix multiplication
 * a * b
 *
 * A * B : 左乘的效果是先用 A对B 进行变换，然后再将A应用于变换后的结果。
 *
 * B * A : 右乘的效果是先用 B对A 进行变换，然后再将B应用于变换后的结果。
 *
 *
 * 例如 A * B
 *
 * 先把A的abcd应用给B的tx,ty，然后A与B的abcd相乘，txty相加
 */
export function multiply(mA: Matrix, mB: Matrix): Matrix {
  const a = mA.a * mB.a + mA.c * mB.b + mA.tx * 0;
  const b = mA.b * mB.a + mA.d * mB.b + mA.ty * 0;
  const c = mA.a * mB.c + mA.c * mB.d + mA.tx * 0;
  const d = mA.b * mB.c + mA.d * mB.d + mA.ty * 0;
  const tx = mA.a * mB.tx + mA.c * mB.ty + mA.tx * 1;
  const ty = mA.b * mB.tx + mA.d * mB.ty + mA.ty * 1;

  const matrixArray: MatrixArray = [a, b, c, d, tx, ty];

  return new Matrix(matrixArray);
}
