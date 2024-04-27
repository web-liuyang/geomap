import { Geomap } from "./lib";
import data from "./data.json";
// https://raw.githubusercontent.com/iuvc/magicJs/main/public/worldMap/china.json
// 把 内蒙古 改成了 MultiPolygon
// 增加 Boundary 类型

(window => {
  const oApp = document.getElementById("app")!;
  const geomap = new Geomap(oApp, {
    data: data.features as Province[],
    width: window.innerWidth,
    height: window.innerHeight,
  });

  geomap.ensureInitialized();
  console.log(geomap);
})(window)!;
