type ProvinceType = "Feature" | "Boundary";

interface Geometry {
  type: "MultiPolygon";
  coordinates: Point[][][];
}
interface Parent {
  adcode: number;
}

interface Properties {
  adcode: number;
  name: string;
  center: Point;
  centroid: Point;
  childrenNum: number;
  level: "province";
  parent: Parent;
  subFeatureIndex: number;
  acroutes: number[];
}

interface Province {
  geometry: Geometry;
  properties: Properties;
  type: ProvinceType;
}
