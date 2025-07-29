import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("admin", "routes/admin.tsx"),
  route("kiosk", "routes/kiosk.tsx"),
  route("kiosk/building/:buildingId", "routes/kiosk.building.$buildingId.tsx"),
  route("kiosk/floor/:floorId", "routes/kiosk.floor.$floorId.tsx"),
] satisfies RouteConfig;
