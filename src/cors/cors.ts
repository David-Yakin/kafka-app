import cors, { CorsOptions } from "cors";

const whiteList = [
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5500",
  "http://localhost:3000",
];

const corsOptions: CorsOptions = {
  origin: (origin) => !!whiteList.find((url) => url === origin),
};

const corsHandler = cors(corsOptions);

export default corsHandler;
