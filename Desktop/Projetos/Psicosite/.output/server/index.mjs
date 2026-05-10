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
  "/sitemap.xml": {
    "type": "application/xml",
    "etag": '"bc1-PhGAdz66JJN1MFdPksD6ttN5QS8"',
    "mtime": "2026-05-10T02:21:36.147Z",
    "size": 3009,
    "path": "../public/sitemap.xml"
  },
  "/assets/ansiedade-CfA5q0dB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"7e4-7tfCBMdyu7hWxYu6zDYat/cD7Qk"',
    "mtime": "2026-05-10T03:50:20.551Z",
    "size": 2020,
    "path": "../public/assets/ansiedade-CfA5q0dB.js"
  },
  "/assets/autoconhecimento-BzuLOiHC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"80d-BjXblfQ8e62TjAkuor6p5z2McIs"',
    "mtime": "2026-05-10T03:50:20.551Z",
    "size": 2061,
    "path": "../public/assets/autoconhecimento-BzuLOiHC.js"
  },
  "/assets/blog.index-CKBKRHat.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"632-HsepXZDmEtWdsfytYsJGFyPs+X0"',
    "mtime": "2026-05-10T03:50:20.551Z",
    "size": 1586,
    "path": "../public/assets/blog.index-CKBKRHat.js"
  },
  "/images/camila-og.png": {
    "type": "image/png",
    "etag": '"17876-wQsF6kj5cZf/JdELykfW28izW1c"',
    "mtime": "2026-03-16T00:38:56.378Z",
    "size": 96374,
    "path": "../public/images/camila-og.png"
  },
  "/assets/blog._slug-Bxjsiuhm.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"26ae-CAtYwg50G2bUTPdfKqP4K4GAe2s"',
    "mtime": "2026-05-10T03:50:20.552Z",
    "size": 9902,
    "path": "../public/assets/blog._slug-Bxjsiuhm.js"
  },
  "/robots.txt": {
    "type": "text/plain; charset=utf-8",
    "etag": '"4d-hw4dAK8vFch3lB+2gsL60ilXsYU"',
    "mtime": "2026-05-09T16:26:34.087Z",
    "size": 77,
    "path": "../public/robots.txt"
  },
  "/assets/camila-freitas-portrait-B4Jm-5zo.png": {
    "type": "image/png",
    "etag": '"17876-wQsF6kj5cZf/JdELykfW28izW1c"',
    "mtime": "2026-05-10T03:50:20.550Z",
    "size": 96374,
    "path": "../public/assets/camila-freitas-portrait-B4Jm-5zo.png"
  },
  "/assets/camila-freitas-logo-horizontal-BoMXHjV6.png": {
    "type": "image/png",
    "etag": '"210c9-HvlQ8EZ/DuA4+xTFfMWiIdSb8M8"',
    "mtime": "2026-05-10T03:50:20.550Z",
    "size": 135369,
    "path": "../public/assets/camila-freitas-logo-horizontal-BoMXHjV6.png"
  },
  "/assets/como-funciona-Dh52aJoW.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"724-uJ61eYFv8Ny2KcgEFyagYoe6qGs"',
    "mtime": "2026-05-10T03:50:20.551Z",
    "size": 1828,
    "path": "../public/assets/como-funciona-Dh52aJoW.js"
  },
  "/assets/contato-Ck3SaCUu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"26d8-6SzTJp6hBYcDXrL87OROdmXyEdA"',
    "mtime": "2026-05-10T03:50:20.551Z",
    "size": 9944,
    "path": "../public/assets/contato-Ck3SaCUu.js"
  },
  "/assets/camila-freitas-logo-vertical-WqIDfVRZ.png": {
    "type": "image/png",
    "etag": '"48523-e2LR0vKRNrL2INJOBqvjuizbAhg"',
    "mtime": "2026-05-10T03:50:20.550Z",
    "size": 296227,
    "path": "../public/assets/camila-freitas-logo-vertical-WqIDfVRZ.png"
  },
  "/assets/depressao-B0-r7kl-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"67f-XEbxB32PtgykQSg4pnxBeL9sJjU"',
    "mtime": "2026-05-10T03:50:20.551Z",
    "size": 1663,
    "path": "../public/assets/depressao-B0-r7kl-.js"
  },
  "/assets/faq-BB1MrPo1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"49e-g269DOYNhtrXGb0ogQ02Rq66iTk"',
    "mtime": "2026-05-10T03:50:20.551Z",
    "size": 1182,
    "path": "../public/assets/faq-BB1MrPo1.js"
  },
  "/assets/index-kwSjzdkp.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"510e-/BsTAGT0a3Nqs0laTe3FEfu4AoQ"',
    "mtime": "2026-05-10T03:50:20.551Z",
    "size": 20750,
    "path": "../public/assets/index-kwSjzdkp.js"
  },
  "/assets/lifestyle-1-B0vapugc.jpg": {
    "type": "image/jpeg",
    "etag": '"1148f-Jh+jick2q7oneIFwWds+lXF8uow"',
    "mtime": "2026-05-10T03:50:20.550Z",
    "size": 70799,
    "path": "../public/assets/lifestyle-1-B0vapugc.jpg"
  },
  "/assets/Layout-De2vwKRS.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"2d0ab-BFucQ+rJyDi0RwvQAsHcX+LchAA"',
    "mtime": "2026-05-10T03:50:20.552Z",
    "size": 184491,
    "path": "../public/assets/Layout-De2vwKRS.js"
  },
  "/assets/consultorio-CbxWSBKn.jpg": {
    "type": "image/jpeg",
    "etag": '"40def-vpJbo0e97mWba84g5aRW694FwPk"',
    "mtime": "2026-05-10T03:50:20.550Z",
    "size": 265711,
    "path": "../public/assets/consultorio-CbxWSBKn.jpg"
  },
  "/assets/lifestyle-3-DCKxnra8.jpg": {
    "type": "image/jpeg",
    "etag": '"146a1-YfINavsQBX6FLT9J4MeranK5UD4"',
    "mtime": "2026-05-10T03:50:20.551Z",
    "size": 83617,
    "path": "../public/assets/lifestyle-3-DCKxnra8.jpg"
  },
  "/assets/plus-BAZiDPNM.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"9b-XrxtPFur6WTq648d+PDCrJvMQtg"',
    "mtime": "2026-05-10T03:50:20.551Z",
    "size": 155,
    "path": "../public/assets/plus-BAZiDPNM.js"
  },
  "/assets/lifestyle-4-DKRwYJ50.jpg": {
    "type": "image/jpeg",
    "etag": '"e890-95V1Pm96Uyq8/nosj7XGWMBZ7JQ"',
    "mtime": "2026-05-10T03:50:20.551Z",
    "size": 59536,
    "path": "../public/assets/lifestyle-4-DKRwYJ50.jpg"
  },
  "/assets/privacidade-qVbXLBI3.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"c2d-IhOyzlS8xn1gTFZFi3jAFN+M17A"',
    "mtime": "2026-05-10T03:50:20.551Z",
    "size": 3117,
    "path": "../public/assets/privacidade-qVbXLBI3.js"
  },
  "/assets/lifestyle-2-vU5GcJUb.jpg": {
    "type": "image/jpeg",
    "etag": '"2ff42-dK9yEbbertQ6mKOTWHG+A1MSnxw"',
    "mtime": "2026-05-10T03:50:20.551Z",
    "size": 196418,
    "path": "../public/assets/lifestyle-2-vU5GcJUb.jpg"
  },
  "/assets/index-CwK4zxhe.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"5c826-Dsbvj88hDzy61GANqWlRYIENlUI"',
    "mtime": "2026-05-10T03:50:20.551Z",
    "size": 378918,
    "path": "../public/assets/index-CwK4zxhe.js"
  },
  "/assets/psicoterapia-online-xgyC7oM3.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"804-Fe7KdztlTnJe6H2u0NKwwDr7U9U"',
    "mtime": "2026-05-10T03:50:20.551Z",
    "size": 2052,
    "path": "../public/assets/psicoterapia-online-xgyC7oM3.js"
  },
  "/assets/relacionamentos-BnuF0H-z.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"7cd-puWzneGGeAtls9EWmZz1St8Yfkw"',
    "mtime": "2026-05-10T03:50:20.551Z",
    "size": 1997,
    "path": "../public/assets/relacionamentos-BnuF0H-z.js"
  },
  "/assets/ServicePage-DjuwYpBc.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"f30-KErAD73buxPjQkiw6jEm2Dr4tkU"',
    "mtime": "2026-05-10T03:50:20.551Z",
    "size": 3888,
    "path": "../public/assets/ServicePage-DjuwYpBc.js"
  },
  "/assets/sobre-DiWDZ89V.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"fa6-0vCIyZu8bh8bvD3iIodGchRM68g"',
    "mtime": "2026-05-10T03:50:20.551Z",
    "size": 4006,
    "path": "../public/assets/sobre-DiWDZ89V.js"
  },
  "/assets/styles-BG060FYE.css": {
    "type": "text/css; charset=utf-8",
    "etag": '"1b198-rqpzT0quMfNr5oVjzGVpsCIzaCk"',
    "mtime": "2026-05-10T03:50:20.551Z",
    "size": 111e3,
    "path": "../public/assets/styles-BG060FYE.css"
  },
  "/images/blog/ansiedade-ajuda.jpg": {
    "type": "image/jpeg",
    "etag": '"1148f-Jh+jick2q7oneIFwWds+lXF8uow"',
    "mtime": "2026-05-08T18:32:33.368Z",
    "size": 70799,
    "path": "../public/images/blog/ansiedade-ajuda.jpg"
  },
  "/images/blog/hora-terapia.jpg": {
    "type": "image/jpeg",
    "etag": '"146a1-YfINavsQBX6FLT9J4MeranK5UD4"',
    "mtime": "2026-05-08T18:36:17.655Z",
    "size": 83617,
    "path": "../public/images/blog/hora-terapia.jpg"
  },
  "/images/blog/relacionamentos.jpg": {
    "type": "image/jpeg",
    "etag": '"e890-95V1Pm96Uyq8/nosj7XGWMBZ7JQ"',
    "mtime": "2026-05-08T18:36:21.124Z",
    "size": 59536,
    "path": "../public/images/blog/relacionamentos.jpg"
  },
  "/images/instagram/autoconhecimento.jpg": {
    "type": "image/jpeg",
    "etag": '"e890-95V1Pm96Uyq8/nosj7XGWMBZ7JQ"',
    "mtime": "2026-05-08T18:36:21.124Z",
    "size": 59536,
    "path": "../public/images/instagram/autoconhecimento.jpg"
  },
  "/images/blog/terapia-online.jpg": {
    "type": "image/jpeg",
    "etag": '"1148f-Jh+jick2q7oneIFwWds+lXF8uow"',
    "mtime": "2026-05-08T18:32:33.368Z",
    "size": 70799,
    "path": "../public/images/blog/terapia-online.jpg"
  },
  "/images/blog/inicio-terapia.jpg": {
    "type": "image/jpeg",
    "etag": '"2ff42-dK9yEbbertQ6mKOTWHG+A1MSnxw"',
    "mtime": "2026-05-08T18:32:38.057Z",
    "size": 196418,
    "path": "../public/images/blog/inicio-terapia.jpg"
  },
  "/images/instagram/ansiedade.jpg": {
    "type": "image/jpeg",
    "etag": '"1148f-Jh+jick2q7oneIFwWds+lXF8uow"',
    "mtime": "2026-05-08T18:32:33.368Z",
    "size": 70799,
    "path": "../public/images/instagram/ansiedade.jpg"
  },
  "/images/services/ansiedade.jpg": {
    "type": "image/jpeg",
    "etag": '"1148f-Jh+jick2q7oneIFwWds+lXF8uow"',
    "mtime": "2026-05-08T18:32:33.368Z",
    "size": 70799,
    "path": "../public/images/services/ansiedade.jpg"
  },
  "/images/instagram/vinculos.jpg": {
    "type": "image/jpeg",
    "etag": '"146a1-YfINavsQBX6FLT9J4MeranK5UD4"',
    "mtime": "2026-05-08T18:36:17.655Z",
    "size": 83617,
    "path": "../public/images/instagram/vinculos.jpg"
  },
  "/images/instagram/escuta.jpg": {
    "type": "image/jpeg",
    "etag": '"2ff42-dK9yEbbertQ6mKOTWHG+A1MSnxw"',
    "mtime": "2026-05-08T18:32:38.057Z",
    "size": 196418,
    "path": "../public/images/instagram/escuta.jpg"
  },
  "/images/services/online.jpg": {
    "type": "image/jpeg",
    "etag": '"e890-95V1Pm96Uyq8/nosj7XGWMBZ7JQ"',
    "mtime": "2026-05-08T18:36:21.124Z",
    "size": 59536,
    "path": "../public/images/services/online.jpg"
  },
  "/images/services/autoconhecimento.jpg": {
    "type": "image/jpeg",
    "etag": '"2ff42-dK9yEbbertQ6mKOTWHG+A1MSnxw"',
    "mtime": "2026-05-08T18:32:38.057Z",
    "size": 196418,
    "path": "../public/images/services/autoconhecimento.jpg"
  },
  "/images/services/relacionamentos.jpg": {
    "type": "image/jpeg",
    "etag": '"146a1-YfINavsQBX6FLT9J4MeranK5UD4"',
    "mtime": "2026-05-08T18:36:17.655Z",
    "size": 83617,
    "path": "../public/images/services/relacionamentos.jpg"
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
