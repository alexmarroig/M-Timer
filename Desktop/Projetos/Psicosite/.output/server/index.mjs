globalThis.__nitro_main__ = import.meta.url;
import { N as NodeResponse, s as serve } from "./_libs/srvx.mjs";
import { H as HTTPError, d as defineHandler, t as toEventHandler, a as defineLazyEventHandler, b as H3Core } from "./_libs/h3.mjs";
import { d as decodePath, w as withLeadingSlash, a as withoutTrailingSlash, j as joinURL } from "./_libs/ufo.mjs";
import { promises } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import "node:http";
import "node:stream";
import "node:stream/promises";
import "node:https";
import "node:http2";
import "./_libs/rou3.mjs";
function lazyService(loader) {
  let promise, mod;
  return {
    fetch(req) {
      if (mod) {
        return mod.fetch(req);
      }
      if (!promise) {
        promise = loader().then((_mod) => mod = _mod.default || _mod);
      }
      return promise.then((mod2) => mod2.fetch(req));
    }
  };
}
const services = {
  ["ssr"]: lazyService(() => import("./_ssr/index.mjs"))
};
globalThis.__nitro_vite_envs__ = services;
const errorHandler$1 = (error, event) => {
  const res = defaultHandler(error, event);
  return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
  const unhandled = error.unhandled ?? !HTTPError.isError(error);
  const { status = 500, statusText = "" } = unhandled ? {} : error;
  if (status === 404) {
    const url = event.url || new URL(event.req.url);
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      return {
        status: 302,
        headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
      };
    }
  }
  const headers2 = new Headers(unhandled ? {} : error.headers);
  headers2.set("content-type", "application/json; charset=utf-8");
  const jsonBody = unhandled ? {
    status,
    unhandled: true
  } : typeof error.toJSON === "function" ? error.toJSON() : {
    status,
    statusText,
    message: error.message
  };
  return {
    status,
    statusText,
    headers: headers2,
    body: {
      error: true,
      ...jsonBody
    }
  };
}
const errorHandlers = [errorHandler$1];
async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      const response = await handler(error, event, { defaultHandler });
      if (response) {
        return response;
      }
    } catch (error2) {
      console.error(error2);
    }
  }
}
const headers = ((m) => function headersRouteRule(event) {
  for (const [key2, value] of Object.entries(m.options || {})) {
    event.res.headers.set(key2, value);
  }
});
const assets = {
  "/favicon.svg": {
    "type": "image/svg+xml",
    "etag": '"108-aoZVlV4sn9Yze1363Z4jjJcXwsI"',
    "mtime": "2026-05-09T16:40:55.034Z",
    "size": 264,
    "path": "../public/favicon.svg"
  },
  "/robots.txt": {
    "type": "text/plain; charset=utf-8",
    "etag": '"4c-HAuajsIvIgYR99f230L4YulMaXE"',
    "mtime": "2026-05-12T22:40:40.278Z",
    "size": 76,
    "path": "../public/robots.txt"
  },
  "/sitemap.xml": {
    "type": "application/xml",
    "etag": '"1b4e-pttIfTAMTQsxVqAYPhiHq5eXKOE"',
    "mtime": "2026-05-13T15:29:49.867Z",
    "size": 6990,
    "path": "../public/sitemap.xml"
  },
  "/assets/ansiedade-BwTrDHCw.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a6c-cEzXTkkpD94mg7ilnK9RfttYWnw"',
    "mtime": "2026-05-14T18:15:48.960Z",
    "size": 2668,
    "path": "../public/assets/ansiedade-BwTrDHCw.js"
  },
  "/assets/acessibilidade-Ba3gJzvd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"6c3-BMA13Gm7PX6xBXD7yFle6ZUx4kA"',
    "mtime": "2026-05-14T18:15:48.960Z",
    "size": 1731,
    "path": "../public/assets/acessibilidade-Ba3gJzvd.js"
  },
  "/assets/autoconhecimento-DgFb4qAv.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a51-T+FMBHRJWF+FKhxDcwBNhCDRd+E"',
    "mtime": "2026-05-14T18:15:48.959Z",
    "size": 2641,
    "path": "../public/assets/autoconhecimento-DgFb4qAv.js"
  },
  "/assets/blog.index--Ml1TDha.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"996-LJOXAv2ADa7Xd/XlX/0HMj0d+z4"',
    "mtime": "2026-05-14T18:15:48.960Z",
    "size": 2454,
    "path": "../public/assets/blog.index--Ml1TDha.js"
  },
  "/assets/blog._slug-CoyPoDib.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1b4f-9zwdH0XvNwyvbU+XdHy2ey/QY+M"',
    "mtime": "2026-05-14T18:15:48.961Z",
    "size": 6991,
    "path": "../public/assets/blog._slug-CoyPoDib.js"
  },
  "/assets/camila-sitting-cutout-CmsuyWXL.webp": {
    "type": "image/webp",
    "etag": '"8782-EFfaf1vzd9fphsZjtA94JGN8jNc"',
    "mtime": "2026-05-14T18:15:48.957Z",
    "size": 34690,
    "path": "../public/assets/camila-sitting-cutout-CmsuyWXL.webp"
  },
  "/assets/como-funciona-Nr2p2a6e.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1053-mkRuEl3DONT1ey5HKuFmAO+14n8"',
    "mtime": "2026-05-14T18:15:48.959Z",
    "size": 4179,
    "path": "../public/assets/como-funciona-Nr2p2a6e.js"
  },
  "/assets/camila-sitting-full-C282ptsc.webp": {
    "type": "image/webp",
    "etag": '"8afe-9xHG6/3FcT0HWx74u27xF+Ov7UA"',
    "mtime": "2026-05-14T18:15:48.956Z",
    "size": 35582,
    "path": "../public/assets/camila-sitting-full-C282ptsc.webp"
  },
  "/assets/dependencia-quimica-DE2wUFdR.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"934-jGOEm6Uw6n2zpo5a62iaf5ASAxk"',
    "mtime": "2026-05-14T18:15:48.958Z",
    "size": 2356,
    "path": "../public/assets/dependencia-quimica-DE2wUFdR.js"
  },
  "/assets/contato-C5tX0eqm.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"283d-5j+1Q7Z6/OTFGQqP5hVgwrIQyy0"',
    "mtime": "2026-05-14T18:15:48.958Z",
    "size": 10301,
    "path": "../public/assets/contato-C5tX0eqm.js"
  },
  "/assets/dependencia-tecnologica-CMPBS5wf.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"942-CCEabgD1x1DDZChzexNfjQppywA"',
    "mtime": "2026-05-14T18:15:48.958Z",
    "size": 2370,
    "path": "../public/assets/dependencia-tecnologica-CMPBS5wf.js"
  },
  "/assets/depressao-b8p6pCqY.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"69f-l//v51ygNL/wwXRr/fn1/3Cmg0I"',
    "mtime": "2026-05-14T18:15:48.958Z",
    "size": 1695,
    "path": "../public/assets/depressao-b8p6pCqY.js"
  },
  "/assets/faq-eeuCTsE8.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"4be-E9Y9S6vRngYbgnDRrllm4c1FZyQ"',
    "mtime": "2026-05-14T18:15:48.958Z",
    "size": 1214,
    "path": "../public/assets/faq-eeuCTsE8.js"
  },
  "/assets/fonts-D8ChmydE.css": {
    "type": "text/css; charset=utf-8",
    "etag": '"3b8-qxL9Al0BJHV/D6OkeHlwAbkIqes"',
    "mtime": "2026-05-14T18:15:48.957Z",
    "size": 952,
    "path": "../public/assets/fonts-D8ChmydE.css"
  },
  "/assets/camila-freitas-logo-horizontal-BoMXHjV6.png": {
    "type": "image/png",
    "etag": '"210c9-HvlQ8EZ/DuA4+xTFfMWiIdSb8M8"',
    "mtime": "2026-05-14T18:15:48.955Z",
    "size": 135369,
    "path": "../public/assets/camila-freitas-logo-horizontal-BoMXHjV6.png"
  },
  "/assets/consultorio-9XNVm5VV.webp": {
    "type": "image/webp",
    "etag": '"1af70-48LHST1sLyv4xWn13JgFR6FIimc"',
    "mtime": "2026-05-14T18:15:48.955Z",
    "size": 110448,
    "path": "../public/assets/consultorio-9XNVm5VV.webp"
  },
  "/assets/index-DllSDNKH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"5359-ixkWEO03YhzHZN13APsKTLZBHyY"',
    "mtime": "2026-05-14T18:15:48.960Z",
    "size": 21337,
    "path": "../public/assets/index-DllSDNKH.js"
  },
  "/assets/lifestyle-1-B0vapugc.jpg": {
    "type": "image/jpeg",
    "etag": '"1148f-Jh+jick2q7oneIFwWds+lXF8uow"',
    "mtime": "2026-05-14T18:15:48.955Z",
    "size": 70799,
    "path": "../public/assets/lifestyle-1-B0vapugc.jpg"
  },
  "/assets/lifestyle-2-BHpzbdm3.webp": {
    "type": "image/webp",
    "etag": '"12320-7slFRUfoJsi9iQDMhyYbMhZ4zRM"',
    "mtime": "2026-05-14T18:15:48.956Z",
    "size": 74528,
    "path": "../public/assets/lifestyle-2-BHpzbdm3.webp"
  },
  "/assets/Layout-BHzdfZyY.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"36657-CDwmwN+Em6XCsfAzypcKTEw3+wY"',
    "mtime": "2026-05-14T18:15:48.962Z",
    "size": 222807,
    "path": "../public/assets/Layout-BHzdfZyY.js"
  },
  "/assets/lifestyle-3-DCKxnra8.jpg": {
    "type": "image/jpeg",
    "etag": '"146a1-YfINavsQBX6FLT9J4MeranK5UD4"',
    "mtime": "2026-05-14T18:15:48.956Z",
    "size": 83617,
    "path": "../public/assets/lifestyle-3-DCKxnra8.jpg"
  },
  "/assets/index-Bb6-AWpx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"851e2-/Z+JGvdaIwP17JKY/MeHcgGwWtk"',
    "mtime": "2026-05-14T18:15:48.962Z",
    "size": 545250,
    "path": "../public/assets/index-Bb6-AWpx.js"
  },
  "/assets/lifestyle-4-DKRwYJ50.jpg": {
    "type": "image/jpeg",
    "etag": '"e890-95V1Pm96Uyq8/nosj7XGWMBZ7JQ"',
    "mtime": "2026-05-14T18:15:48.955Z",
    "size": 59536,
    "path": "../public/assets/lifestyle-4-DKRwYJ50.jpg"
  },
  "/assets/lifestyle-planning-CHMbVQTb.jpg": {
    "type": "image/jpeg",
    "etag": '"2d13a-WVmih6yiX2RZk8No82YTGVi8ibI"',
    "mtime": "2026-05-14T18:15:48.957Z",
    "size": 184634,
    "path": "../public/assets/lifestyle-planning-CHMbVQTb.jpg"
  },
  "/assets/lifestyle-online-oVCT8rUV.jpg": {
    "type": "image/jpeg",
    "etag": '"391e6-Voq+y/5Bd1hlKUzibfqynJcCT1M"',
    "mtime": "2026-05-14T18:15:48.957Z",
    "size": 233958,
    "path": "../public/assets/lifestyle-online-oVCT8rUV.jpg"
  },
  "/assets/lifestyle-burnout-By8gOb-P.jpg": {
    "type": "image/jpeg",
    "etag": '"490e9-rUgiA7aZsNPL2dJYqmV4VjGF6xI"',
    "mtime": "2026-05-14T18:15:48.957Z",
    "size": 299241,
    "path": "../public/assets/lifestyle-burnout-By8gOb-P.jpg"
  },
  "/assets/luto-DutRSBLf.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"89d-F7E1/wx9dt/wnCiHlvXBfaJKT3k"',
    "mtime": "2026-05-14T18:15:48.958Z",
    "size": 2205,
    "path": "../public/assets/luto-DutRSBLf.js"
  },
  "/assets/logo-vertical-rRXOxX1-.webp": {
    "type": "image/webp",
    "etag": '"304e-c28wMMjGVnzyPcgz8HFZhiIPa0s"',
    "mtime": "2026-05-14T18:15:48.954Z",
    "size": 12366,
    "path": "../public/assets/logo-vertical-rRXOxX1-.webp"
  },
  "/assets/plus-BqEczO8k.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"9b-5fOt/xY9A8NhZmD1g+1N5p0c8EY"',
    "mtime": "2026-05-14T18:15:48.960Z",
    "size": 155,
    "path": "../public/assets/plus-BqEczO8k.js"
  },
  "/assets/privacidade-SvswZRSv.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"c4d-NPipxFfgMHZxDlR03jbyF0aqo4w"',
    "mtime": "2026-05-14T18:15:48.958Z",
    "size": 3149,
    "path": "../public/assets/privacidade-SvswZRSv.js"
  },
  "/assets/portrait-DErQkAPY.webp": {
    "type": "image/webp",
    "etag": '"6790-NtEPI8QrCWCguwa12X9Se5Yjnb4"',
    "mtime": "2026-05-14T18:15:48.941Z",
    "size": 26512,
    "path": "../public/assets/portrait-DErQkAPY.webp"
  },
  "/assets/psicoterapia-online-LUFKW7lY.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a6f-W7bzG1SR7JEOvQBtVDec3wqjpaM"',
    "mtime": "2026-05-14T18:15:48.958Z",
    "size": 2671,
    "path": "../public/assets/psicoterapia-online-LUFKW7lY.js"
  },
  "/assets/sobre-DErDztD8.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"fc6-XqSRPrk8L8iv+AWooUSw8X2g/is"',
    "mtime": "2026-05-14T18:15:48.957Z",
    "size": 4038,
    "path": "../public/assets/sobre-DErDztD8.js"
  },
  "/assets/ServicePage-C8u5Qiwd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1349-SfsgsweN7SBZeic5ayR1chK+V38"',
    "mtime": "2026-05-14T18:15:48.960Z",
    "size": 4937,
    "path": "../public/assets/ServicePage-C8u5Qiwd.js"
  },
  "/assets/relacionamentos-CPeWo6Pv.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a31-R9NGGua83lygF7tzX8xX/L2/UXY"',
    "mtime": "2026-05-14T18:15:48.957Z",
    "size": 2609,
    "path": "../public/assets/relacionamentos-CPeWo6Pv.js"
  },
  "/assets/tslib.es6-K2TGv2MF.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"471-wkkvueNv8diYyLQK4XqooafNZNk"',
    "mtime": "2026-05-14T18:15:48.962Z",
    "size": 1137,
    "path": "../public/assets/tslib.es6-K2TGv2MF.js"
  },
  "/assets/lifestyle-reading-BDYUMoYU.jpg": {
    "type": "image/jpeg",
    "etag": '"40e5c-fLdHCjLb+I7d5MHeG82g5VqtKao"',
    "mtime": "2026-05-14T18:15:48.956Z",
    "size": 265820,
    "path": "../public/assets/lifestyle-reading-BDYUMoYU.jpg"
  },
  "/fonts/cormorant-italic-latin.woff2": {
    "type": "font/woff2",
    "etag": '"995c-Uuo4p9jWthXj57m9VeYrdsmIorA"',
    "mtime": "2026-05-13T15:44:21.737Z",
    "size": 39260,
    "path": "../public/fonts/cormorant-italic-latin.woff2"
  },
  "/assets/lifestyle-time-D5RZa1GV.jpg": {
    "type": "image/jpeg",
    "etag": '"31945-rswxsNK18dUcz/GHjMP+jBSeghQ"',
    "mtime": "2026-05-14T18:15:48.957Z",
    "size": 203077,
    "path": "../public/assets/lifestyle-time-D5RZa1GV.jpg"
  },
  "/fonts/manrope-400.woff2": {
    "type": "font/woff2",
    "etag": '"6104-tClRAUxeyhJ0nYekcGyvItxP4IE"',
    "mtime": "2026-05-13T15:43:45.800Z",
    "size": 24836,
    "path": "../public/fonts/manrope-400.woff2"
  },
  "/fonts/cormorant-latin.woff2": {
    "type": "font/woff2",
    "etag": '"9308-dNsFj+Btp5tdv1sz0SBB3dRd5RA"',
    "mtime": "2026-05-13T15:44:21.579Z",
    "size": 37640,
    "path": "../public/fonts/cormorant-latin.woff2"
  },
  "/assets/styles-CklQ9l6j.css": {
    "type": "text/css; charset=utf-8",
    "etag": '"1d60a-H7Fq+5BVdIy2+RK6Pr05eNIjgaQ"',
    "mtime": "2026-05-14T18:15:48.957Z",
    "size": 120330,
    "path": "../public/assets/styles-CklQ9l6j.css"
  },
  "/fonts/manrope-latin.woff2": {
    "type": "font/woff2",
    "etag": '"6104-tClRAUxeyhJ0nYekcGyvItxP4IE"',
    "mtime": "2026-05-13T15:44:21.411Z",
    "size": 24836,
    "path": "../public/fonts/manrope-latin.woff2"
  },
  "/images/blog/ansiedade-ajuda.jpg": {
    "type": "image/jpeg",
    "etag": '"1148f-Jh+jick2q7oneIFwWds+lXF8uow"',
    "mtime": "2026-05-08T18:32:33.368Z",
    "size": 70799,
    "path": "../public/images/blog/ansiedade-ajuda.jpg"
  },
  "/images/camila-og.png": {
    "type": "image/png",
    "etag": '"17876-wQsF6kj5cZf/JdELykfW28izW1c"',
    "mtime": "2026-03-16T00:38:56.378Z",
    "size": 96374,
    "path": "../public/images/camila-og.png"
  },
  "/images/blog/ansiedade-ajuda.webp": {
    "type": "image/webp",
    "etag": '"4eb6-d/PmKD+F2E9Ob79otuFSIkFqnDI"',
    "mtime": "2026-05-13T19:45:11.209Z",
    "size": 20150,
    "path": "../public/images/blog/ansiedade-ajuda.webp"
  },
  "/images/blog/ansiedade.webp": {
    "type": "image/webp",
    "etag": '"c074-u1h3zje2I1PZEKWWde1cqPh7R/Q"',
    "mtime": "2026-05-13T19:45:04.265Z",
    "size": 49268,
    "path": "../public/images/blog/ansiedade.webp"
  },
  "/images/blog/burnout.jpg": {
    "type": "image/jpeg",
    "etag": '"490e9-rUgiA7aZsNPL2dJYqmV4VjGF6xI"',
    "mtime": "2026-05-13T16:02:35.039Z",
    "size": 299241,
    "path": "../public/images/blog/burnout.jpg"
  },
  "/images/blog/autoconhecimento.webp": {
    "type": "image/webp",
    "etag": '"25ec6-ZhwAXCEGBRkk2P76hVV5XdhAOio"',
    "mtime": "2026-05-13T19:45:04.892Z",
    "size": 155334,
    "path": "../public/images/blog/autoconhecimento.webp"
  },
  "/images/blog/burnout.webp": {
    "type": "image/webp",
    "etag": '"60e6-3jxN+IcbGd9eRf46aYqQKUKQqbo"',
    "mtime": "2026-05-13T19:45:11.793Z",
    "size": 24806,
    "path": "../public/images/blog/burnout.webp"
  },
  "/images/blog/couple-therapy.webp": {
    "type": "image/webp",
    "etag": '"929a-e7HBRV000Q4CxXpODZE5+xdPBm0"',
    "mtime": "2026-05-13T19:45:05.525Z",
    "size": 37530,
    "path": "../public/images/blog/couple-therapy.webp"
  },
  "/images/blog/hora-terapia.jpg": {
    "type": "image/jpeg",
    "etag": '"146a1-YfINavsQBX6FLT9J4MeranK5UD4"',
    "mtime": "2026-05-08T18:36:17.655Z",
    "size": 83617,
    "path": "../public/images/blog/hora-terapia.jpg"
  },
  "/images/blog/elderly-therapy.webp": {
    "type": "image/webp",
    "etag": '"de8a-3/5zH0ByaZC0iIDzjYGSI7G4pAQ"',
    "mtime": "2026-05-13T19:45:06.153Z",
    "size": 56970,
    "path": "../public/images/blog/elderly-therapy.webp"
  },
  "/images/blog/hora-terapia.webp": {
    "type": "image/webp",
    "etag": '"6f5a-hR8G825ysHkoG2ddsKXkoL8Z5ZM"',
    "mtime": "2026-05-13T19:45:12.354Z",
    "size": 28506,
    "path": "../public/images/blog/hora-terapia.webp"
  },
  "/images/blog/inicio-terapia.webp": {
    "type": "image/webp",
    "etag": '"12320-7slFRUfoJsi9iQDMhyYbMhZ4zRM"',
    "mtime": "2026-05-13T19:45:12.936Z",
    "size": 74528,
    "path": "../public/images/blog/inicio-terapia.webp"
  },
  "/images/blog/inicio-terapia.jpg": {
    "type": "image/jpeg",
    "etag": '"2ff42-dK9yEbbertQ6mKOTWHG+A1MSnxw"',
    "mtime": "2026-05-08T18:32:38.057Z",
    "size": 196418,
    "path": "../public/images/blog/inicio-terapia.jpg"
  },
  "/images/blog/jung-therapy.webp": {
    "type": "image/webp",
    "etag": '"d6a6-XKzgHKtj3ux8SaQYYTdDaNtIlZI"',
    "mtime": "2026-05-13T19:45:06.787Z",
    "size": 54950,
    "path": "../public/images/blog/jung-therapy.webp"
  },
  "/images/blog/jung.webp": {
    "type": "image/webp",
    "etag": '"c20e-cuFe9xvSXqCQBuAwT8fCINhJcYU"',
    "mtime": "2026-05-13T19:45:07.554Z",
    "size": 49678,
    "path": "../public/images/blog/jung.webp"
  },
  "/images/blog/luto.webp": {
    "type": "image/webp",
    "etag": '"5c60-iYLTdUmtHdxjDP+xevFu3btNH9c"',
    "mtime": "2026-05-13T19:45:08.353Z",
    "size": 23648,
    "path": "../public/images/blog/luto.webp"
  },
  "/images/blog/online.webp": {
    "type": "image/webp",
    "etag": '"4868-i21UqesTN3T86ZTcgcsQMlXpmik"',
    "mtime": "2026-05-13T19:45:13.545Z",
    "size": 18536,
    "path": "../public/images/blog/online.webp"
  },
  "/images/blog/online.jpg": {
    "type": "image/jpeg",
    "etag": '"391e6-Voq+y/5Bd1hlKUzibfqynJcCT1M"',
    "mtime": "2026-05-13T16:02:35.023Z",
    "size": 233958,
    "path": "../public/images/blog/online.jpg"
  },
  "/images/blog/planning.jpg": {
    "type": "image/jpeg",
    "etag": '"2d13a-WVmih6yiX2RZk8No82YTGVi8ibI"',
    "mtime": "2026-05-13T16:02:35.036Z",
    "size": 184634,
    "path": "../public/images/blog/planning.jpg"
  },
  "/images/blog/ansiedade.png": {
    "type": "image/png",
    "etag": '"b8bd2-PLSiIF1bQchS6r/hYKtBnsX8Ynk"',
    "mtime": "2026-05-13T03:58:12.682Z",
    "size": 756690,
    "path": "../public/images/blog/ansiedade.png"
  },
  "/images/blog/couple-therapy.png": {
    "type": "image/png",
    "etag": '"ad612-ipJgNKYw7bVq2bPLTHDkFItid6M"',
    "mtime": "2026-05-10T22:11:56.336Z",
    "size": 710162,
    "path": "../public/images/blog/couple-therapy.png"
  },
  "/images/blog/planning.webp": {
    "type": "image/webp",
    "etag": '"2bb6-6fPcIhzSCNrFoZymBc28UD3FWRA"',
    "mtime": "2026-05-13T19:45:14.168Z",
    "size": 11190,
    "path": "../public/images/blog/planning.webp"
  },
  "/images/blog/elderly-therapy.png": {
    "type": "image/png",
    "etag": '"c59b9-GsFcHqjVemzfBNjNcWK1+mvfnSw"',
    "mtime": "2026-05-10T22:12:09.362Z",
    "size": 809401,
    "path": "../public/images/blog/elderly-therapy.png"
  },
  "/images/blog/jung-therapy.png": {
    "type": "image/png",
    "etag": '"be574-B+xnPhTRdAYtRwR0lgPJq5YrJqg"',
    "mtime": "2026-05-10T22:11:42.623Z",
    "size": 779636,
    "path": "../public/images/blog/jung-therapy.png"
  },
  "/images/blog/luto.png": {
    "type": "image/png",
    "etag": '"a2cd3-wpeWL8sYycUnVqczQlmwUkB+fMY"',
    "mtime": "2026-05-13T03:58:38.087Z",
    "size": 666835,
    "path": "../public/images/blog/luto.png"
  },
  "/images/blog/jung.png": {
    "type": "image/png",
    "etag": '"b8d01-4Bb+FuWB+ndr7OV8dvcSx1dp/34"',
    "mtime": "2026-05-13T03:59:23.563Z",
    "size": 756993,
    "path": "../public/images/blog/jung.png"
  },
  "/assets/_-aT0-Tf7V.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"2a01da-0Kq3P3oodV9VPLQUP7yanbW+Lhg"',
    "mtime": "2026-05-14T18:15:48.965Z",
    "size": 2752986,
    "path": "../public/assets/_-aT0-Tf7V.js"
  },
  "/images/blog/autoconhecimento.png": {
    "type": "image/png",
    "etag": '"11e1b6-Honx5fVltCSJsMEfvFII1csra9E"',
    "mtime": "2026-05-13T03:59:47.261Z",
    "size": 1171894,
    "path": "../public/images/blog/autoconhecimento.png"
  },
  "/images/blog/relacionamentos.jpg": {
    "type": "image/jpeg",
    "etag": '"e890-95V1Pm96Uyq8/nosj7XGWMBZ7JQ"',
    "mtime": "2026-05-08T18:36:21.124Z",
    "size": 59536,
    "path": "../public/images/blog/relacionamentos.jpg"
  },
  "/images/blog/reading.webp": {
    "type": "image/webp",
    "etag": '"583e-3N7PT4WzLuO7uBpnwm0PjPPCIjo"',
    "mtime": "2026-05-13T19:45:14.763Z",
    "size": 22590,
    "path": "../public/images/blog/reading.webp"
  },
  "/images/blog/relacionamentos.webp": {
    "type": "image/webp",
    "etag": '"2eb4-yFrc4o1Ei/tmU4/WejGvt3SuK8A"',
    "mtime": "2026-05-13T19:45:15.328Z",
    "size": 11956,
    "path": "../public/images/blog/relacionamentos.webp"
  },
  "/images/blog/reading.jpg": {
    "type": "image/jpeg",
    "etag": '"40e5c-fLdHCjLb+I7d5MHeG82g5VqtKao"',
    "mtime": "2026-05-13T16:02:35.020Z",
    "size": 265820,
    "path": "../public/images/blog/reading.jpg"
  },
  "/images/blog/terapia-online.jpg": {
    "type": "image/jpeg",
    "etag": '"1148f-Jh+jick2q7oneIFwWds+lXF8uow"',
    "mtime": "2026-05-08T18:32:33.368Z",
    "size": 70799,
    "path": "../public/images/blog/terapia-online.jpg"
  },
  "/images/blog/social-media-anxiety.webp": {
    "type": "image/webp",
    "etag": '"bbea-97m+0I8ouwR4dwM3C9s3xpYFlLM"',
    "mtime": "2026-05-13T19:45:09.887Z",
    "size": 48106,
    "path": "../public/images/blog/social-media-anxiety.webp"
  },
  "/images/blog/terapia-online.webp": {
    "type": "image/webp",
    "etag": '"4eb6-d/PmKD+F2E9Ob79otuFSIkFqnDI"',
    "mtime": "2026-05-13T19:45:15.887Z",
    "size": 20150,
    "path": "../public/images/blog/terapia-online.webp"
  },
  "/images/blog/time-stress.webp": {
    "type": "image/webp",
    "etag": '"3560-9foDfNDRoDDbq5djBcJgbQ37/qQ"',
    "mtime": "2026-05-13T19:45:16.459Z",
    "size": 13664,
    "path": "../public/images/blog/time-stress.webp"
  },
  "/images/blog/time-stress.jpg": {
    "type": "image/jpeg",
    "etag": '"31945-rswxsNK18dUcz/GHjMP+jBSeghQ"',
    "mtime": "2026-05-13T16:02:35.026Z",
    "size": 203077,
    "path": "../public/images/blog/time-stress.jpg"
  },
  "/images/instagram/ansiedade.jpg": {
    "type": "image/jpeg",
    "etag": '"1148f-Jh+jick2q7oneIFwWds+lXF8uow"',
    "mtime": "2026-05-08T18:32:33.368Z",
    "size": 70799,
    "path": "../public/images/instagram/ansiedade.jpg"
  },
  "/images/instagram/ansiedade.webp": {
    "type": "image/webp",
    "etag": '"36ca-1iGiLaos0v7qJ5mcljSQXyconFY"',
    "mtime": "2026-05-13T19:44:37.913Z",
    "size": 14026,
    "path": "../public/images/instagram/ansiedade.webp"
  },
  "/images/instagram/autoconhecimento.webp": {
    "type": "image/webp",
    "etag": '"1ea4-O9MBPXbeueixLtRJ0lxQr2rf9iY"',
    "mtime": "2026-05-13T19:44:38.445Z",
    "size": 7844,
    "path": "../public/images/instagram/autoconhecimento.webp"
  },
  "/images/instagram/autoconhecimento.jpg": {
    "type": "image/jpeg",
    "etag": '"e890-95V1Pm96Uyq8/nosj7XGWMBZ7JQ"',
    "mtime": "2026-05-08T18:36:21.124Z",
    "size": 59536,
    "path": "../public/images/instagram/autoconhecimento.jpg"
  },
  "/images/instagram/escuta.jpg": {
    "type": "image/jpeg",
    "etag": '"2ff42-dK9yEbbertQ6mKOTWHG+A1MSnxw"',
    "mtime": "2026-05-08T18:32:38.057Z",
    "size": 196418,
    "path": "../public/images/instagram/escuta.jpg"
  },
  "/images/instagram/escuta.webp": {
    "type": "image/webp",
    "etag": '"88ec-kztSDCD2AYHoiBMtzTK/42KcgNw"',
    "mtime": "2026-05-13T19:44:38.987Z",
    "size": 35052,
    "path": "../public/images/instagram/escuta.webp"
  },
  "/images/instagram/vinculos.jpg": {
    "type": "image/jpeg",
    "etag": '"146a1-YfINavsQBX6FLT9J4MeranK5UD4"',
    "mtime": "2026-05-08T18:36:17.655Z",
    "size": 83617,
    "path": "../public/images/instagram/vinculos.jpg"
  },
  "/images/instagram/vinculos.webp": {
    "type": "image/webp",
    "etag": '"3cd6-se7stQI2mr8d0+/EMsER7DbX3FM"',
    "mtime": "2026-05-13T19:44:39.513Z",
    "size": 15574,
    "path": "../public/images/instagram/vinculos.webp"
  },
  "/images/services/ansiedade.webp": {
    "type": "image/webp",
    "etag": '"4eb6-d/PmKD+F2E9Ob79otuFSIkFqnDI"',
    "mtime": "2026-05-13T19:43:03.209Z",
    "size": 20150,
    "path": "../public/images/services/ansiedade.webp"
  },
  "/images/blog/relacionamentos.png": {
    "type": "image/png",
    "etag": '"981c1-MVaMhJd2FrHX7ByzHIpLTUu/bkM"',
    "mtime": "2026-05-13T03:58:59.783Z",
    "size": 623041,
    "path": "../public/images/blog/relacionamentos.png"
  },
  "/images/services/ansiedade.jpg": {
    "type": "image/jpeg",
    "etag": '"1148f-Jh+jick2q7oneIFwWds+lXF8uow"',
    "mtime": "2026-05-08T18:32:33.368Z",
    "size": 70799,
    "path": "../public/images/services/ansiedade.jpg"
  },
  "/images/blog/social-media-anxiety.png": {
    "type": "image/png",
    "etag": '"b1acf-d1ouW0wiOJWovBAUOammOhUmxMs"',
    "mtime": "2026-05-10T22:12:23.278Z",
    "size": 727759,
    "path": "../public/images/blog/social-media-anxiety.png"
  },
  "/images/services/autoconhecimento.jpg": {
    "type": "image/jpeg",
    "etag": '"2ff42-dK9yEbbertQ6mKOTWHG+A1MSnxw"',
    "mtime": "2026-05-08T18:32:38.057Z",
    "size": 196418,
    "path": "../public/images/services/autoconhecimento.jpg"
  },
  "/images/services/autoconhecimento.webp": {
    "type": "image/webp",
    "etag": '"12320-7slFRUfoJsi9iQDMhyYbMhZ4zRM"',
    "mtime": "2026-05-13T19:43:03.790Z",
    "size": 74528,
    "path": "../public/images/services/autoconhecimento.webp"
  },
  "/images/services/dependencia-quimica.jpg": {
    "type": "image/jpeg",
    "etag": '"490e9-rUgiA7aZsNPL2dJYqmV4VjGF6xI"',
    "mtime": "2026-05-13T16:02:35.039Z",
    "size": 299241,
    "path": "../public/images/services/dependencia-quimica.jpg"
  },
  "/images/services/dependencia-quimica.webp": {
    "type": "image/webp",
    "etag": '"60e6-3jxN+IcbGd9eRf46aYqQKUKQqbo"',
    "mtime": "2026-05-13T19:43:04.374Z",
    "size": 24806,
    "path": "../public/images/services/dependencia-quimica.webp"
  },
  "/images/services/dependencia-tecnologica.webp": {
    "type": "image/webp",
    "etag": '"4868-i21UqesTN3T86ZTcgcsQMlXpmik"',
    "mtime": "2026-05-13T19:43:04.931Z",
    "size": 18536,
    "path": "../public/images/services/dependencia-tecnologica.webp"
  },
  "/images/services/luto.webp": {
    "type": "image/webp",
    "etag": '"3560-9foDfNDRoDDbq5djBcJgbQ37/qQ"',
    "mtime": "2026-05-13T19:43:05.508Z",
    "size": 13664,
    "path": "../public/images/services/luto.webp"
  },
  "/images/services/online.webp": {
    "type": "image/webp",
    "etag": '"2eb4-yFrc4o1Ei/tmU4/WejGvt3SuK8A"',
    "mtime": "2026-05-13T19:43:06.075Z",
    "size": 11956,
    "path": "../public/images/services/online.webp"
  },
  "/images/services/online.jpg": {
    "type": "image/jpeg",
    "etag": '"e890-95V1Pm96Uyq8/nosj7XGWMBZ7JQ"',
    "mtime": "2026-05-08T18:36:21.124Z",
    "size": 59536,
    "path": "../public/images/services/online.jpg"
  },
  "/images/services/relacionamentos.jpg": {
    "type": "image/jpeg",
    "etag": '"146a1-YfINavsQBX6FLT9J4MeranK5UD4"',
    "mtime": "2026-05-08T18:36:17.655Z",
    "size": 83617,
    "path": "../public/images/services/relacionamentos.jpg"
  },
  "/images/services/luto.jpg": {
    "type": "image/jpeg",
    "etag": '"31945-rswxsNK18dUcz/GHjMP+jBSeghQ"',
    "mtime": "2026-05-13T16:02:35.026Z",
    "size": 203077,
    "path": "../public/images/services/luto.jpg"
  },
  "/images/services/dependencia-tecnologica.jpg": {
    "type": "image/jpeg",
    "etag": '"391e6-Voq+y/5Bd1hlKUzibfqynJcCT1M"',
    "mtime": "2026-05-13T16:02:35.023Z",
    "size": 233958,
    "path": "../public/images/services/dependencia-tecnologica.jpg"
  },
  "/images/services/relacionamentos.webp": {
    "type": "image/webp",
    "etag": '"6f5a-hR8G825ysHkoG2ddsKXkoL8Z5ZM"',
    "mtime": "2026-05-13T19:43:06.640Z",
    "size": 28506,
    "path": "../public/images/services/relacionamentos.webp"
  },
  "/images/blog/expectativas-inicio-terapia/coverImage.webp": {
    "type": "image/webp",
    "etag": '"11b0c-17zdGURfyJVdAijuV99TaGKgXLc"',
    "mtime": "2026-05-13T19:45:10.579Z",
    "size": 72460,
    "path": "../public/images/blog/expectativas-inicio-terapia/coverImage.webp"
  },
  "/images/blog/expectativas-inicio-terapia/cover.webp": {
    "type": "image/webp",
    "etag": '"21caa-7KgMPHlv/aNj3Q2RLs9/swt0IYI"',
    "mtime": "2026-05-13T19:43:36.651Z",
    "size": 138410,
    "path": "../public/images/blog/expectativas-inicio-terapia/cover.webp"
  },
  "/images/blog/expectativas-inicio-terapia/coverImage.png": {
    "type": "image/png",
    "etag": '"29fa65-fEb9FH4Q1M7apwnGTX3CBG7bKkI"',
    "mtime": "2026-05-10T19:51:26.125Z",
    "size": 2751077,
    "path": "../public/images/blog/expectativas-inicio-terapia/coverImage.png"
  }
};
function readAsset(id) {
  const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
  return promises.readFile(resolve(serverDir, assets[id].path));
}
const publicAssetBases = {};
function isPublicAssetURL(id = "") {
  if (assets[id]) {
    return true;
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) {
      return true;
    }
  }
  return false;
}
function getAsset(id) {
  return assets[id];
}
const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = {
  gzip: ".gz",
  br: ".br",
  zstd: ".zst"
};
const _E2s2mD = defineHandler((event) => {
  if (event.req.method && !METHODS.has(event.req.method)) {
    return;
  }
  let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
  let asset;
  const encodingHeader = event.req.headers.get("accept-encoding") || "";
  const encodings = [...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      event.res.headers.delete("Cache-Control");
      throw new HTTPError({ status: 404 });
    }
    return;
  }
  if (encodings.length > 1) {
    event.res.headers.append("Vary", "Accept-Encoding");
  }
  const ifNotMatch = event.req.headers.get("if-none-match") === asset.etag;
  if (ifNotMatch) {
    event.res.status = 304;
    event.res.statusText = "Not Modified";
    return "";
  }
  const ifModifiedSinceH = event.req.headers.get("if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    event.res.status = 304;
    event.res.statusText = "Not Modified";
    return "";
  }
  if (asset.type) {
    event.res.headers.set("Content-Type", asset.type);
  }
  if (asset.etag && !event.res.headers.has("ETag")) {
    event.res.headers.set("ETag", asset.etag);
  }
  if (asset.mtime && !event.res.headers.has("Last-Modified")) {
    event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !event.res.headers.has("Content-Encoding")) {
    event.res.headers.set("Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !event.res.headers.has("Content-Length")) {
    event.res.headers.set("Content-Length", asset.size.toString());
  }
  return readAsset(id);
});
const findRouteRules = /* @__PURE__ */ (() => {
  const $0 = [{ name: "headers", route: "/assets/**", handler: headers, options: { "cache-control": "public, max-age=31536000, immutable" } }];
  return (m, p) => {
    let r = [];
    if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
    let s = p.split("/"), l = s.length;
    if (l > 1) {
      if (s[1] === "assets") {
        r.unshift({ data: $0, params: { "_": s.slice(2).join("/") } });
      }
    }
    return r;
  };
})();
const _lazy_ay8E43 = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
const findRoute = /* @__PURE__ */ (() => {
  const data = { route: "/**", handler: _lazy_ay8E43 };
  return ((_m, p) => {
    return { data, params: { "_": p.slice(1) } };
  });
})();
const globalMiddleware = [
  toEventHandler(_E2s2mD)
].filter(Boolean);
const APP_ID = "default";
function useNitroApp() {
  let instance = useNitroApp._instance;
  if (instance) {
    return instance;
  }
  instance = useNitroApp._instance = createNitroApp();
  globalThis.__nitro__ = globalThis.__nitro__ || {};
  globalThis.__nitro__[APP_ID] = instance;
  return instance;
}
function createNitroApp() {
  const hooks = void 0;
  const captureError = (error, errorCtx) => {
    if (errorCtx?.event) {
      const errors = errorCtx.event.req.context?.nitro?.errors;
      if (errors) {
        errors.push({
          error,
          context: errorCtx
        });
      }
    }
  };
  const h3App = createH3App({ onError(error, event) {
    return errorHandler(error, event);
  } });
  let appHandler = (req) => {
    req.context ||= {};
    req.context.nitro = req.context.nitro || { errors: [] };
    return h3App.fetch(req);
  };
  const app = {
    fetch: appHandler,
    h3: h3App,
    hooks,
    captureError
  };
  return app;
}
function createH3App(config) {
  const h3App = new H3Core(config);
  h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
  h3App["~middleware"].push(...globalMiddleware);
  {
    h3App["~getMiddleware"] = (event, route) => {
      const pathname = event.url.pathname;
      const method = event.req.method;
      const middleware = [];
      {
        const routeRules = getRouteRules(method, pathname);
        event.context.routeRules = routeRules?.routeRules;
        if (routeRules?.routeRuleMiddleware.length) {
          middleware.push(...routeRules.routeRuleMiddleware);
        }
      }
      middleware.push(...h3App["~middleware"]);
      if (route?.data?.middleware?.length) {
        middleware.push(...route.data.middleware);
      }
      return middleware;
    };
  }
  return h3App;
}
function getRouteRules(method, pathname) {
  const m = findRouteRules(method, pathname);
  if (!m?.length) {
    return { routeRuleMiddleware: [] };
  }
  const routeRules = {};
  for (const layer of m) {
    for (const rule of layer.data) {
      const currentRule = routeRules[rule.name];
      if (currentRule) {
        if (rule.options === false) {
          delete routeRules[rule.name];
          continue;
        }
        if (typeof currentRule.options === "object" && typeof rule.options === "object") {
          currentRule.options = {
            ...currentRule.options,
            ...rule.options
          };
        } else {
          currentRule.options = rule.options;
        }
        currentRule.route = rule.route;
        currentRule.params = {
          ...currentRule.params,
          ...layer.params
        };
      } else if (rule.options !== false) {
        routeRules[rule.name] = {
          ...rule,
          params: layer.params
        };
      }
    }
  }
  const middleware = [];
  const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
  for (const rule of orderedRules) {
    if (rule.options === false || !rule.handler) {
      continue;
    }
    middleware.push(rule.handler(rule));
  }
  return {
    routeRules,
    routeRuleMiddleware: middleware
  };
}
function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
  process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
  process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
const tracingSrvxPlugins = [];
const _parsedPort = Number.parseInt(process.env.NITRO_PORT ?? process.env.PORT ?? "");
const port = Number.isNaN(_parsedPort) ? 3e3 : _parsedPort;
const host = process.env.NITRO_HOST || process.env.HOST;
const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const nitroApp = useNitroApp();
serve({
  port,
  hostname: host,
  tls: cert && key ? {
    cert,
    key
  } : void 0,
  fetch: nitroApp.fetch,
  plugins: [...tracingSrvxPlugins]
});
trapUnhandledErrors();
const nodeServer = {};
export {
  nodeServer as default
};
