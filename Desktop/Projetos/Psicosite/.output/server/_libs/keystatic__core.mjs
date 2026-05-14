import { d as distExports } from "./cookie.mjs";
import { r as refine, s as string, c as create, o as object$1, a as array$1, t as type, l as literal, n as number$1, b as coerce, i as instance } from "./superstruct.mjs";
import path$1 from "node:path";
import fs$1 from "node:fs/promises";
import fs from "fs/promises";
import path from "path";
import { j as jsxRuntimeExports } from "./react.mjs";
import { e as emery_cjsExports, a as emeryAssertions_cjsExports } from "./emery.mjs";
import { d as distExports$1 } from "./braintree__sanitize-url.mjs";
import { i as ignore } from "./ignore.mjs";
import { webcrypto } from "node:crypto";
import { p as parse3, s as schema_exports } from "./markdoc__markdoc.mjs";
import { createHash } from "crypto";
class FieldDataError extends Error {
  constructor(message) {
    super(message);
    this.name = "FieldDataError";
  }
}
function assertRequired(value, validation, label) {
  if (value === null && validation !== null && validation !== void 0 && validation.isRequired) {
    throw new FieldDataError(`${label} is required`);
  }
}
function basicFormFieldWithSimpleReaderParse(config2) {
  return {
    kind: "form",
    Input: config2.Input,
    defaultValue: config2.defaultValue,
    parse: config2.parse,
    serialize: config2.serialize,
    validate: config2.validate,
    reader: {
      parse(value) {
        return config2.validate(config2.parse(value));
      }
    },
    label: config2.label
  };
}
function empty$1() {
  throw new Error("unexpected call to function that shouldn't be called in React server component environment");
}
let SlugFieldInput = empty$1, TextFieldInput = empty$1, UrlFieldInput = empty$1, SelectFieldInput = empty$1, RelationshipInput = empty$1, PathReferenceInput = empty$1, MultiselectFieldInput = empty$1, MultiRelationshipInput = empty$1, IntegerFieldInput = empty$1, NumberFieldInput = empty$1, ImageFieldInput = empty$1, FileFieldInput = empty$1, DatetimeFieldInput = empty$1, DateFieldInput = empty$1, CloudImageFieldInput = empty$1, BlocksFieldInput = empty$1, DocumentFieldInput = empty$1, CheckboxFieldInput = empty$1, createEditorSchema = empty$1, getDefaultValue = empty$1, parseToEditorState = empty$1, serializeFromEditorState = empty$1, parseToEditorStateMDX = empty$1, serializeFromEditorStateMDX = empty$1, createEditorStateFromYJS = empty$1, prosemirrorToYXmlFragment = empty$1, normalizeDocumentFieldChildren = empty$1, slugify = empty$1, serializeMarkdoc = empty$1;
function validateText(val, min, max, fieldLabel, slugInfo, pattern) {
  if (val.length < min) {
    if (min === 1) {
      return `${fieldLabel} must not be empty`;
    } else {
      return `${fieldLabel} must be at least ${min} characters long`;
    }
  }
  if (val.length > max) {
    return `${fieldLabel} must be no longer than ${max} characters`;
  }
  if (pattern && !pattern.regex.test(val)) {
    return pattern.message || `${fieldLabel} must match the pattern ${pattern.regex}`;
  }
  if (slugInfo) {
    if (val === "") {
      return `${fieldLabel} must not be empty`;
    }
    if (val === "..") {
      return `${fieldLabel} must not be ..`;
    }
    if (val === ".") {
      return `${fieldLabel} must not be .`;
    }
    if (slugInfo.glob === "**") {
      const split = val.split("/");
      if (split.some((s) => s === "..")) {
        return `${fieldLabel} must not contain ..`;
      }
      if (split.some((s) => s === ".")) {
        return `${fieldLabel} must not be .`;
      }
    }
    if ((slugInfo.glob === "*" ? /[\\/]/ : /[\\]/).test(val)) {
      return `${fieldLabel} must not contain slashes`;
    }
    if (/^\s|\s$/.test(val)) {
      return `${fieldLabel} must not start or end with spaces`;
    }
    if (slugInfo.slugs.has(val)) {
      return `${fieldLabel} must be unique`;
    }
  }
}
function parseAsNormalField(value) {
  if (value === void 0) {
    return "";
  }
  if (typeof value !== "string") {
    throw new FieldDataError("Must be a string");
  }
  return value;
}
const emptySet = /* @__PURE__ */ new Set();
function text({
  label,
  defaultValue = "",
  validation: {
    length: {
      max = Infinity,
      min = 0
    } = {},
    pattern,
    isRequired
  } = {},
  description,
  multiline = false
}) {
  min = Math.max(isRequired ? 1 : 0, min);
  function validate(value, slugField) {
    const message = validateText(value, min, max, label, slugField, pattern);
    if (message !== void 0) {
      throw new FieldDataError(message);
    }
    return value;
  }
  return {
    kind: "form",
    formKind: "slug",
    label,
    Input(props) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(TextFieldInput, {
        label,
        description,
        min,
        max,
        multiline,
        pattern,
        ...props
      });
    },
    defaultValue() {
      return typeof defaultValue === "string" ? defaultValue : defaultValue();
    },
    parse(value, args) {
      if ((args === null || args === void 0 ? void 0 : args.slug) !== void 0) {
        return args.slug;
      }
      return parseAsNormalField(value);
    },
    serialize(value) {
      return {
        value: value === "" ? void 0 : value
      };
    },
    serializeWithSlug(value) {
      return {
        slug: value,
        value: void 0
      };
    },
    reader: {
      parse(value) {
        const parsed = parseAsNormalField(value);
        return validate(parsed, void 0);
      },
      parseWithSlug(_value, args) {
        validate(parseAsNormalField(args.slug), {
          glob: args.glob,
          slugs: emptySet
        });
        return null;
      }
    },
    validate(value, args) {
      return validate(value, args === null || args === void 0 ? void 0 : args.slugField);
    }
  };
}
function object(fields, opts) {
  return {
    ...opts,
    kind: "object",
    fields
  };
}
function getValueAtPropPath(value, inputPath) {
  const path2 = [...inputPath];
  while (path2.length) {
    const key = path2.shift();
    value = value[key];
  }
  return value;
}
function transformProps(schema, value, visitors, path2 = []) {
  if (schema.kind === "form" || schema.kind === "child") {
    if (visitors[schema.kind]) {
      return visitors[schema.kind](schema, value, path2);
    }
    return value;
  }
  if (schema.kind === "object") {
    const val = Object.fromEntries(Object.entries(schema.fields).map(([key, val2]) => {
      return [key, transformProps(val2, value[key], visitors, [...path2, key])];
    }));
    if (visitors.object) {
      return visitors[schema.kind](schema, val, path2);
    }
    return val;
  }
  if (schema.kind === "array") {
    const val = value.map((val2, idx) => transformProps(schema.element, val2, visitors, path2.concat(idx)));
    if (visitors.array) {
      return visitors[schema.kind](schema, val, path2);
    }
    return val;
  }
  if (schema.kind === "conditional") {
    const discriminant = transformProps(schema.discriminant, value.discriminant, visitors, path2.concat("discriminant"));
    const conditionalVal = transformProps(schema.values[discriminant.toString()], value.value, visitors, path2.concat("value"));
    const val = {
      discriminant,
      value: conditionalVal
    };
    if (visitors.conditional) {
      return visitors[schema.kind](schema, val, path2);
    }
    return val;
  }
  emeryAssertions_cjsExports.assertNever(schema);
}
const currentlyActiveMarks = /* @__PURE__ */ new Set();
const currentlyDisabledMarks = /* @__PURE__ */ new Set();
let currentLink = null;
function addMarkToChildren(mark, cb) {
  const wasPreviouslyActive = currentlyActiveMarks.has(mark);
  currentlyActiveMarks.add(mark);
  try {
    return cb();
  } finally {
    if (!wasPreviouslyActive) {
      currentlyActiveMarks.delete(mark);
    }
  }
}
function setLinkForChildren(href, cb) {
  if (currentLink !== null) {
    return cb();
  }
  currentLink = href;
  try {
    return cb();
  } finally {
    currentLink = null;
  }
}
function getInlineNodes(text2) {
  const node = {
    text: text2
  };
  for (const mark of currentlyActiveMarks) {
    if (!currentlyDisabledMarks.has(mark)) {
      node[mark] = true;
    }
  }
  if (currentLink !== null) {
    return [{
      text: ""
    }, {
      type: "link",
      href: currentLink,
      children: [node]
    }, {
      text: ""
    }];
  }
  return [node];
}
class VariableChildFields extends Error {
  constructor() {
    super("There are a variable number of child fields");
  }
}
function findSingleChildField(schema) {
  try {
    const result = _findConstantChildFields(schema, [], /* @__PURE__ */ new Set());
    if (result.length === 1) {
      return result[0];
    }
    return;
  } catch (err) {
    if (err instanceof VariableChildFields) {
      return;
    }
    throw err;
  }
}
function _findConstantChildFields(schema, path2, seenSchemas) {
  if (seenSchemas.has(schema)) {
    return [];
  }
  seenSchemas.add(schema);
  switch (schema.kind) {
    case "form":
      return [];
    case "child":
      return [{
        relativePath: path2,
        options: schema.options,
        kind: "child"
      }];
    case "conditional": {
      if (couldContainChildField(schema)) {
        throw new VariableChildFields();
      }
      return [];
    }
    case "array": {
      if (schema.asChildTag) {
        const child2 = _findConstantChildFields(schema.element, [], seenSchemas);
        if (child2.length > 1) {
          return [];
        }
        return [{
          kind: "array",
          asChildTag: schema.asChildTag,
          field: schema,
          relativePath: path2,
          child: child2[0]
        }];
      }
      if (couldContainChildField(schema)) {
        throw new VariableChildFields();
      }
      return [];
    }
    case "object": {
      const paths = [];
      for (const [key, value] of Object.entries(schema.fields)) {
        paths.push(..._findConstantChildFields(value, path2.concat(key), seenSchemas));
      }
      return paths;
    }
  }
}
function couldContainChildField(schema, seen = /* @__PURE__ */ new Set()) {
  if (seen.has(schema)) {
    return false;
  }
  seen.add(schema);
  switch (schema.kind) {
    case "form":
      return false;
    case "child":
      return true;
    case "conditional":
      return Object.values(schema.values).some((value) => couldContainChildField(value, seen));
    case "object":
      return Object.keys(schema.fields).some((key) => couldContainChildField(schema.fields[key], seen));
    case "array":
      return couldContainChildField(schema.element, seen);
  }
}
function inlineNodeFromMarkdoc(node) {
  if (node.type === "inline") {
    return inlineChildrenFromMarkdoc(node.children);
  }
  if (node.type === "link") {
    return setLinkForChildren(node.attributes.href, () => inlineChildrenFromMarkdoc(node.children));
  }
  if (node.type === "text") {
    return getInlineNodes(node.attributes.content);
  }
  if (node.type === "strong") {
    return addMarkToChildren("bold", () => inlineChildrenFromMarkdoc(node.children));
  }
  if (node.type === "code") {
    return addMarkToChildren("code", () => getInlineNodes(node.attributes.content));
  }
  if (node.type === "em") {
    return addMarkToChildren("italic", () => inlineChildrenFromMarkdoc(node.children));
  }
  if (node.type === "s") {
    return addMarkToChildren("strikethrough", () => inlineChildrenFromMarkdoc(node.children));
  }
  if (node.type === "tag") {
    if (node.tag === "u") {
      return addMarkToChildren("underline", () => inlineChildrenFromMarkdoc(node.children));
    }
    if (node.tag === "kbd") {
      return addMarkToChildren("keyboard", () => inlineChildrenFromMarkdoc(node.children));
    }
    if (node.tag === "sub") {
      return addMarkToChildren("subscript", () => inlineChildrenFromMarkdoc(node.children));
    }
    if (node.tag === "sup") {
      return addMarkToChildren("superscript", () => inlineChildrenFromMarkdoc(node.children));
    }
  }
  if (node.type === "softbreak") {
    return getInlineNodes(" ");
  }
  if (node.type === "hardbreak") {
    return getInlineNodes("\n");
  }
  if (node.tag === "component-inline-prop" && Array.isArray(node.attributes.propPath) && node.attributes.propPath.every((x) => typeof x === "string" || typeof x === "number")) {
    return {
      type: "component-inline-prop",
      children: inlineFromMarkdoc(node.children),
      propPath: node.attributes.propPath
    };
  }
  throw new Error(`Unknown inline node type: ${node.type}`);
}
function inlineChildrenFromMarkdoc(nodes) {
  return nodes.flatMap(inlineNodeFromMarkdoc);
}
function inlineFromMarkdoc(nodes) {
  const transformedNodes = nodes.flatMap(inlineNodeFromMarkdoc);
  const nextNodes = [];
  let lastNode;
  for (const [idx, node] of transformedNodes.entries()) {
    var _lastNode;
    if (node.type === void 0 && node.text === "" && ((_lastNode = lastNode) === null || _lastNode === void 0 ? void 0 : _lastNode.type) === void 0 && idx !== transformedNodes.length - 1) {
      continue;
    }
    nextNodes.push(node);
    lastNode = node;
  }
  if (!nextNodes.length) {
    nextNodes.push({
      text: ""
    });
  }
  return nextNodes;
}
function fromMarkdoc(node, componentBlocks) {
  const nodes = node.children.flatMap((x) => fromMarkdocNode(x, componentBlocks));
  if (nodes.length === 0) {
    return [{
      type: "paragraph",
      children: [{
        text: ""
      }]
    }];
  }
  if (nodes[nodes.length - 1].type !== "paragraph") {
    nodes.push({
      type: "paragraph",
      children: [{
        text: ""
      }]
    });
  }
  return nodes;
}
function fromMarkdocNode(node, componentBlocks) {
  if (node.type === "blockquote") {
    return {
      type: "blockquote",
      children: node.children.flatMap((x) => fromMarkdocNode(x, componentBlocks))
    };
  }
  if (node.type === "fence") {
    const {
      language,
      content,
      ...rest
    } = node.attributes;
    return {
      type: "code",
      children: [{
        text: content.replace(/\n$/, "")
      }],
      ...typeof language === "string" ? {
        language
      } : {},
      ...rest
    };
  }
  if (node.type === "heading") {
    return {
      ...node.attributes,
      level: node.attributes.level,
      type: "heading",
      children: inlineFromMarkdoc(node.children)
    };
  }
  if (node.type === "list") {
    return {
      type: node.attributes.ordered ? "ordered-list" : "unordered-list",
      children: node.children.flatMap((x) => fromMarkdocNode(x, componentBlocks))
    };
  }
  if (node.type === "item") {
    var _node$children$;
    const children = [{
      type: "list-item-content",
      children: node.children.length ? inlineFromMarkdoc([node.children[0]]) : [{
        text: ""
      }]
    }];
    if (((_node$children$ = node.children[1]) === null || _node$children$ === void 0 ? void 0 : _node$children$.type) === "list") {
      const list = node.children[1];
      children.push({
        type: list.attributes.ordered ? "ordered-list" : "unordered-list",
        children: list.children.flatMap((x) => fromMarkdocNode(x, componentBlocks))
      });
    }
    return {
      type: "list-item",
      children
    };
  }
  if (node.type === "paragraph") {
    if (node.children.length === 1 && node.children[0].type === "inline" && node.children[0].children.length === 1 && node.children[0].children[0].type === "image") {
      var _image$attributes$tit;
      const image2 = node.children[0].children[0];
      return {
        type: "image",
        src: decodeURI(image2.attributes.src),
        alt: image2.attributes.alt,
        title: (_image$attributes$tit = image2.attributes.title) !== null && _image$attributes$tit !== void 0 ? _image$attributes$tit : "",
        children: [{
          text: ""
        }]
      };
    }
    const children = inlineFromMarkdoc(node.children);
    if (children.length === 1 && children[0].type === "component-inline-prop") {
      return children[0];
    }
    return {
      type: "paragraph",
      children,
      textAlign: node.attributes.textAlign
    };
  }
  if (node.type === "hr") {
    return {
      type: "divider",
      children: [{
        text: ""
      }]
    };
  }
  if (node.type === "table") {
    return {
      type: "table",
      children: node.children.flatMap((x) => fromMarkdocNode(x, componentBlocks))
    };
  }
  if (node.type === "tbody") {
    return {
      type: "table-body",
      children: node.children.flatMap((x) => fromMarkdocNode(x, componentBlocks))
    };
  }
  if (node.type === "thead") {
    if (!node.children.length) return [];
    return {
      type: "table-head",
      children: node.children.flatMap((x) => fromMarkdocNode(x, componentBlocks))
    };
  }
  if (node.type === "tr") {
    return {
      type: "table-row",
      children: node.children.flatMap((x) => fromMarkdocNode(x, componentBlocks))
    };
  }
  if (node.type === "td") {
    return {
      type: "table-cell",
      children: node.children.flatMap((x) => fromMarkdocNode(x, componentBlocks))
    };
  }
  if (node.type === "th") {
    return {
      type: "table-cell",
      header: true,
      children: node.children.flatMap((x) => fromMarkdocNode(x, componentBlocks))
    };
  }
  if (node.type === "tag") {
    if (node.tag === "table") {
      return fromMarkdocNode(node.children[0], componentBlocks);
    }
    if (node.tag === "layout") {
      return {
        type: "layout",
        layout: node.attributes.layout,
        children: node.children.flatMap((x) => fromMarkdocNode(x, componentBlocks))
      };
    }
    if (node.tag === "layout-area") {
      return {
        type: "layout-area",
        children: node.children.flatMap((x) => fromMarkdocNode(x, componentBlocks))
      };
    }
    if (node.tag === "component-block") {
      return {
        type: "component-block",
        component: node.attributes.component,
        props: node.attributes.props,
        children: node.children.length === 0 ? [{
          type: "component-inline-prop",
          children: [{
            text: ""
          }]
        }] : node.children.flatMap((x) => fromMarkdocNode(x, componentBlocks))
      };
    }
    if (node.tag === "component-block-prop" && Array.isArray(node.attributes.propPath) && node.attributes.propPath.every((x) => typeof x === "string" || typeof x === "number")) {
      return {
        type: "component-block-prop",
        children: node.children.flatMap((x) => fromMarkdocNode(x, componentBlocks)),
        propPath: node.attributes.propPath
      };
    }
    if (node.tag) {
      const componentBlock = componentBlocks[node.tag];
      if (componentBlock) {
        const singleChildField = findSingleChildField({
          kind: "object",
          fields: componentBlock.schema
        });
        if (singleChildField) {
          const newAttributes = JSON.parse(JSON.stringify(node.attributes));
          const children = [];
          toChildrenAndProps(node.children, children, newAttributes, singleChildField, [], componentBlocks);
          return {
            type: "component-block",
            component: node.tag,
            props: newAttributes,
            children
          };
        }
        return {
          type: "component-block",
          component: node.tag,
          props: node.attributes,
          children: node.children.length === 0 ? [{
            type: "component-inline-prop",
            children: [{
              text: ""
            }]
          }] : node.children.flatMap((x) => fromMarkdocNode(x, componentBlocks))
        };
      }
    }
    throw new Error(`Unknown tag: ${node.tag}`);
  }
  return inlineNodeFromMarkdoc(node);
}
function toChildrenAndProps(fromMarkdoc2, resultingChildren, value, singleChildField, parentPropPath, componentBlocks) {
  if (singleChildField.kind === "child") {
    const children = fromMarkdoc2.flatMap((x) => fromMarkdocNode(x, componentBlocks));
    resultingChildren.push({
      type: `component-${singleChildField.options.kind}-prop`,
      propPath: [...parentPropPath, ...singleChildField.relativePath],
      children
    });
  }
  if (singleChildField.kind === "array") {
    const arr = [];
    for (let [idx, child2] of fromMarkdoc2.entries()) {
      if (child2.type === "paragraph") {
        child2 = child2.children[0].children[0];
      }
      if (child2.type !== "tag") {
        throw new Error(`expected tag ${singleChildField.asChildTag}, found type: ${child2.type}`);
      }
      if (child2.tag !== singleChildField.asChildTag) {
        throw new Error(`expected tag ${singleChildField.asChildTag}, found tag: ${child2.tag}`);
      }
      const attributes = JSON.parse(JSON.stringify(child2.attributes));
      if (singleChildField.child) {
        toChildrenAndProps(child2.children, resultingChildren, attributes, singleChildField.child, [...parentPropPath, ...singleChildField.relativePath, idx], componentBlocks);
      }
      arr.push(attributes);
    }
    const key = singleChildField.relativePath[singleChildField.relativePath.length - 1];
    const parent = getValueAtPropPath(value, singleChildField.relativePath.slice(0, -1));
    parent[key] = arr;
  }
}
const emptyCacheNode = /* @__PURE__ */ Symbol("emptyCacheNode");
function memoize(func) {
  const cacheNode = {
    value: emptyCacheNode,
    strong: void 0,
    weak: void 0
  };
  return (...args) => {
    let currentCacheNode = cacheNode;
    for (const arg of args) {
      if (typeof arg === "string" || typeof arg === "number") {
        if (currentCacheNode.strong === void 0) {
          currentCacheNode.strong = /* @__PURE__ */ new Map();
        }
        if (!currentCacheNode.strong.has(arg)) {
          currentCacheNode.strong.set(arg, {
            value: emptyCacheNode,
            strong: void 0,
            weak: void 0
          });
        }
        currentCacheNode = currentCacheNode.strong.get(arg);
        continue;
      }
      if (typeof arg === "object") {
        if (currentCacheNode.weak === void 0) {
          currentCacheNode.weak = /* @__PURE__ */ new WeakMap();
        }
        if (!currentCacheNode.weak.has(arg)) {
          currentCacheNode.weak.set(arg, {
            value: emptyCacheNode,
            strong: void 0,
            weak: void 0
          });
        }
        currentCacheNode = currentCacheNode.weak.get(arg);
        continue;
      }
    }
    if (currentCacheNode.value !== emptyCacheNode) {
      return currentCacheNode.value;
    }
    const result = func(...args);
    currentCacheNode.value = result;
    return result;
  };
}
function fixPath(path2) {
  return path2.replace(/^\.?\/+/, "").replace(/\/*$/, "");
}
const collectionPath = /\/\*\*?(?:$|\/)/;
function getConfiguredCollectionPath(config2, collection2) {
  var _collectionConfig$pat;
  const collectionConfig = config2.collections[collection2];
  const path2 = (_collectionConfig$pat = collectionConfig.path) !== null && _collectionConfig$pat !== void 0 ? _collectionConfig$pat : `${collection2}/*/`;
  if (!collectionPath.test(path2)) {
    throw new Error(`Collection path must end with /* or /** or include /*/ or /**/ but ${collection2} has ${path2}`);
  }
  return path2;
}
function getCollectionPath(config2, collection2) {
  const configuredPath = getConfiguredCollectionPath(config2, collection2);
  const path2 = fixPath(configuredPath.replace(/\*\*?.*$/, ""));
  return path2;
}
function getSingletonFormat(config2, singleton2) {
  return getFormatInfo(config2, "singletons", singleton2);
}
function getSingletonPath(config2, singleton2) {
  var _singleton$path, _singleton$path2;
  if ((_singleton$path = config2.singletons[singleton2].path) !== null && _singleton$path !== void 0 && _singleton$path.includes("*")) {
    throw new Error(`Singleton paths cannot include * but ${singleton2} has ${config2.singletons[singleton2].path}`);
  }
  return fixPath((_singleton$path2 = config2.singletons[singleton2].path) !== null && _singleton$path2 !== void 0 ? _singleton$path2 : singleton2);
}
function getDataFileExtension(formatInfo) {
  return formatInfo.contentField ? formatInfo.contentField.contentExtension : "." + formatInfo.data;
}
const getFormatInfo = memoize(_getFormatInfo);
function _getFormatInfo(config2, type2, key) {
  var _collectionOrSingleto, _format$data;
  const collectionOrSingleton = type2 === "collections" ? config2.collections[key] : config2.singletons[key];
  const path2 = type2 === "collections" ? getConfiguredCollectionPath(config2, key) : (_collectionOrSingleto = collectionOrSingleton.path) !== null && _collectionOrSingleto !== void 0 ? _collectionOrSingleto : `${key}/`;
  const dataLocation = path2.endsWith("/") ? "index" : "outer";
  const {
    schema,
    format = "yaml"
  } = collectionOrSingleton;
  if (typeof format === "string") {
    return {
      dataLocation,
      contentField: void 0,
      data: format
    };
  }
  let contentField;
  if (format.contentField) {
    let field = {
      kind: "object",
      fields: schema
    };
    let path3 = Array.isArray(format.contentField) ? format.contentField : [format.contentField];
    let contentExtension;
    try {
      contentExtension = getContentExtension(path3, field, () => JSON.stringify(format.contentField));
    } catch (err) {
      if (err instanceof ContentFieldLocationError) {
        throw new Error(`${err.message} (${type2}.${key})`);
      }
      throw err;
    }
    contentField = {
      path: path3,
      contentExtension
    };
  }
  return {
    data: (_format$data = format.data) !== null && _format$data !== void 0 ? _format$data : "yaml",
    contentField,
    dataLocation
  };
}
class ContentFieldLocationError extends Error {
  constructor(message) {
    super(message);
  }
}
function getContentExtension(path2, schema, debugName) {
  if (path2.length === 0) {
    if (schema.kind !== "form" || schema.formKind !== "content") {
      throw new ContentFieldLocationError(`Content field for ${debugName()} is not a content field`);
    }
    return schema.contentExtension;
  }
  if (schema.kind === "object") {
    const field = schema.fields[path2[0]];
    if (!field) {
      throw new ContentFieldLocationError(`Field ${debugName()} specified in contentField does not exist`);
    }
    return getContentExtension(path2.slice(1), field, debugName);
  }
  if (schema.kind === "conditional") {
    if (path2[0] !== "value") {
      throw new ContentFieldLocationError(`Conditional fields referenced in a contentField path must only reference the value field (${debugName()})`);
    }
    let contentExtension;
    const innerPath = path2.slice(1);
    for (const value of Object.values(schema.values)) {
      const foundContentExtension = getContentExtension(innerPath, value, debugName);
      if (!contentExtension) {
        contentExtension = foundContentExtension;
        continue;
      }
      if (contentExtension !== foundContentExtension) {
        throw new ContentFieldLocationError(`contentField ${debugName()} has conflicting content extensions`);
      }
    }
    if (!contentExtension) {
      throw new ContentFieldLocationError(`contentField ${debugName()} does not point to a content field`);
    }
    return contentExtension;
  }
  throw new ContentFieldLocationError(`Path specified in contentField ${debugName()} does not point to a content field`);
}
function getSrcPrefix(publicPath, slug2) {
  return typeof publicPath === "string" ? `${publicPath.replace(/\/*$/, "")}/${slug2 === void 0 ? "" : slug2 + "/"}` : "";
}
function deserializeFiles(nodes, componentBlocks, files, otherFiles, mode, documentFeatures, slug2) {
  return nodes.map((node) => {
    if (node.type === "component-block") {
      const componentBlock = componentBlocks[node.component];
      if (!componentBlock) return node;
      const schema = object(componentBlock.schema);
      return {
        ...node,
        props: deserializeProps(schema, node.props, files, otherFiles, mode, slug2)
      };
    }
    if (node.type === "image" && typeof node.src === "string" && mode === "edit") {
      var _ref;
      const prefix = getSrcPrefixForImageBlock(documentFeatures, slug2);
      const filename = node.src.slice(prefix.length);
      const content = (_ref = typeof documentFeatures.images === "object" && typeof documentFeatures.images.directory === "string" ? otherFiles.get(fixPath(documentFeatures.images.directory)) : files) === null || _ref === void 0 ? void 0 : _ref.get(filename);
      if (!content) {
        return {
          type: "paragraph",
          children: [{
            text: `Missing image ${filename}`
          }]
        };
      }
      return {
        type: "image",
        src: {
          filename,
          content
        },
        alt: node.alt,
        title: node.title,
        children: [{
          text: ""
        }]
      };
    }
    if (typeof node.type === "string") {
      const children = deserializeFiles(node.children, componentBlocks, files, otherFiles, mode, documentFeatures, slug2);
      return {
        ...node,
        children
      };
    }
    return node;
  });
}
function deserializeProps(schema, value, files, otherFiles, mode, slug2) {
  return transformProps(schema, value, {
    form: (schema2, value2) => {
      if (schema2.formKind === "asset") {
        var _otherFiles$get;
        if (mode === "read") {
          return schema2.reader.parse(value2);
        }
        const filename = schema2.filename(value2, {
          slug: slug2,
          suggestedFilenamePrefix: void 0
        });
        return schema2.parse(value2, {
          asset: filename ? schema2.directory ? (_otherFiles$get = otherFiles.get(schema2.directory)) === null || _otherFiles$get === void 0 ? void 0 : _otherFiles$get.get(filename) : files.get(filename) : void 0,
          slug: slug2
        });
      }
      if (schema2.formKind === "content" || schema2.formKind === "assets") {
        throw new Error("Not implemented");
      }
      if (mode === "read") {
        return schema2.reader.parse(value2);
      }
      return schema2.parse(value2, void 0);
    }
  });
}
function getSrcPrefixForImageBlock(documentFeatures, slug2) {
  return getSrcPrefix(typeof documentFeatures.images === "object" ? documentFeatures.images.publicPath : void 0, slug2);
}
async function sha1(content) {
  return createHash("sha1").update(content).digest("hex");
}
const textEncoder$1 = new TextEncoder();
const blobShaCache = /* @__PURE__ */ new WeakMap();
async function blobSha(contents) {
  const cached = blobShaCache.get(contents);
  if (cached !== void 0) return cached;
  const blobPrefix = textEncoder$1.encode("blob " + contents.length + "\0");
  const array2 = new Uint8Array(blobPrefix.byteLength + contents.byteLength);
  array2.set(blobPrefix, 0);
  array2.set(contents, blobPrefix.byteLength);
  const digestPromise = sha1(array2);
  blobShaCache.set(contents, digestPromise);
  digestPromise.then((digest) => blobShaCache.set(contents, digest));
  return digestPromise;
}
function getNodeAtPath(tree2, path2) {
  if (path2 === "") return tree2;
  let node = tree2;
  for (const part of path2.split("/")) {
    if (!node.has(part)) {
      node.set(part, /* @__PURE__ */ new Map());
    }
    const innerNode = node.get(part);
    emery_cjsExports.assert(innerNode instanceof Map, "expected tree");
    node = innerNode;
  }
  return node;
}
function getFilename(path2) {
  return path2.replace(/.*\//, "");
}
function getDirname(path2) {
  if (!path2.includes("/")) return "";
  return path2.replace(/\/[^/]+$/, "");
}
function toTreeChanges(changes) {
  const changesRoot = /* @__PURE__ */ new Map();
  for (const deletion of changes.deletions) {
    const parentTree = getNodeAtPath(changesRoot, getDirname(deletion));
    parentTree.set(getFilename(deletion), "delete");
  }
  for (const addition of changes.additions) {
    const parentTree = getNodeAtPath(changesRoot, getDirname(addition.path));
    parentTree.set(getFilename(addition.path), addition.contents);
  }
  return changesRoot;
}
const SPACE_CHAR_CODE = 32;
const space = new Uint8Array([SPACE_CHAR_CODE]);
const nullchar = new Uint8Array([0]);
const tree$1 = textEncoder$1.encode("tree ");
function treeSha(children) {
  const entries = [...children].map(([name, node]) => ({
    name,
    sha: node.entry.sha,
    mode: node.entry.mode
  }));
  entries.sort((a, b) => {
    const aName = a.mode === "040000" ? a.name + "/" : a.name;
    const bName = b.mode === "040000" ? b.name + "/" : b.name;
    return aName === bName ? 0 : aName < bName ? -1 : 1;
  });
  const treeObject = entries.flatMap((entry) => {
    const mode = textEncoder$1.encode(entry.mode.replace(/^0/, ""));
    const name = textEncoder$1.encode(entry.name);
    const sha = hexToBytes(entry.sha);
    return [mode, space, name, nullchar, sha];
  });
  return sha1(concatBytes([tree$1, textEncoder$1.encode(treeObject.reduce((sum, val) => sum + val.byteLength, 0).toString()), nullchar, ...treeObject]));
}
function concatBytes(byteArrays) {
  const totalLength = byteArrays.reduce((sum, arr) => sum + arr.byteLength, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of byteArrays) {
    result.set(arr, offset);
    offset += arr.byteLength;
  }
  return result;
}
function hexToBytes(str) {
  const bytes = new Uint8Array(str.length / 2);
  for (var i = 0; i < bytes.byteLength; i += 1) {
    const start = i * 2;
    bytes[i] = parseInt(str.slice(start, start + 2), 16);
  }
  return bytes;
}
async function createTreeNodeEntry(path2, children) {
  const sha = await treeSha(children);
  return {
    path: path2,
    mode: "040000",
    type: "tree",
    sha
  };
}
async function createBlobNodeEntry(path2, contents) {
  const sha = "sha" in contents ? contents.sha : await blobSha(contents);
  return {
    path: path2,
    mode: "100644",
    type: "blob",
    sha
  };
}
async function updateTreeWithChanges(tree2, changes) {
  var _await$updateTree;
  const newTree = (_await$updateTree = await updateTree(tree2, toTreeChanges(changes), [])) !== null && _await$updateTree !== void 0 ? _await$updateTree : /* @__PURE__ */ new Map();
  return {
    entries: treeToEntries(newTree),
    sha: await treeSha(newTree !== null && newTree !== void 0 ? newTree : /* @__PURE__ */ new Map())
  };
}
function treeToEntries(tree2) {
  return [...tree2.values()].flatMap((x) => x.children ? [x.entry, ...treeToEntries(x.children)] : [x.entry]);
}
async function updateTree(tree2, changedTree, path2) {
  const newTree = new Map(tree2);
  for (const [key, value] of changedTree) {
    if (value === "delete") {
      newTree.delete(key);
    }
    if (value instanceof Map) {
      var _newTree$get$children, _newTree$get;
      const existingChildren = (_newTree$get$children = (_newTree$get = newTree.get(key)) === null || _newTree$get === void 0 ? void 0 : _newTree$get.children) !== null && _newTree$get$children !== void 0 ? _newTree$get$children : /* @__PURE__ */ new Map();
      const children = await updateTree(existingChildren, value, path2.concat(key));
      if (children === void 0) {
        newTree.delete(key);
        continue;
      }
      const entry = await createTreeNodeEntry(path2.concat(key).join("/"), children);
      newTree.set(key, {
        entry,
        children
      });
    }
    if (value instanceof Uint8Array || typeof value === "object" && "sha" in value) {
      const entry = await createBlobNodeEntry(path2.concat(key).join("/"), value);
      newTree.set(key, {
        entry
      });
    }
  }
  if (newTree.size === 0) {
    return void 0;
  }
  return newTree;
}
function collectDirectoriesUsedInSchemaInner(schema, directories, seenSchemas) {
  if (seenSchemas.has(schema)) {
    return;
  }
  seenSchemas.add(schema);
  if (schema.kind === "array") {
    return collectDirectoriesUsedInSchemaInner(schema.element, directories, seenSchemas);
  }
  if (schema.kind === "child") {
    return;
  }
  if (schema.kind === "form") {
    if (schema.formKind === "asset" && schema.directory !== void 0) {
      directories.add(fixPath(schema.directory));
    }
    if ((schema.formKind === "content" || schema.formKind === "assets") && schema.directories !== void 0) {
      for (const directory of schema.directories) {
        directories.add(fixPath(directory));
      }
    }
    return;
  }
  if (schema.kind === "object") {
    for (const field of Object.values(schema.fields)) {
      collectDirectoriesUsedInSchemaInner(field, directories, seenSchemas);
    }
    return;
  }
  if (schema.kind === "conditional") {
    for (const innerSchema of Object.values(schema.values)) {
      collectDirectoriesUsedInSchemaInner(innerSchema, directories, seenSchemas);
    }
    return;
  }
  emery_cjsExports.assertNever(schema);
}
function collectDirectoriesUsedInSchema(schema) {
  const directories = /* @__PURE__ */ new Set();
  collectDirectoriesUsedInSchemaInner(schema, directories, /* @__PURE__ */ new Set());
  return directories;
}
function getDirectoriesForTreeKey(schema, directory, slug2, format) {
  const directories = [fixPath(directory)];
  if (format.dataLocation === "outer") {
    directories.push(fixPath(directory) + getDataFileExtension(format));
  }
  const toAdd = "";
  for (const directory2 of collectDirectoriesUsedInSchema(schema)) {
    directories.push(directory2 + toAdd);
  }
  return directories;
}
const textDecoder$1 = new TextDecoder();
const defaultAltField$1 = text({
  label: "Alt text",
  description: "This text will be used by screen readers and search engines."
});
const emptyTitleField$1 = basicFormFieldWithSimpleReaderParse({
  Input() {
    return null;
  },
  defaultValue() {
    return "";
  },
  parse(value) {
    if (value === void 0) return "";
    if (typeof value !== "string") {
      throw new FieldDataError("Must be string");
    }
    return value;
  },
  validate(value) {
    return value;
  },
  serialize(value) {
    return {
      value
    };
  },
  label: "Title"
});
function normaliseDocumentFeatures(config2) {
  var _config$formatting, _formatting$alignment, _formatting$alignment2, _formatting$blockType, _formatting$inlineMar, _formatting$inlineMar2, _formatting$inlineMar3, _formatting$inlineMar4, _formatting$inlineMar5, _formatting$inlineMar6, _formatting$inlineMar7, _formatting$inlineMar8, _formatting$listTypes, _formatting$listTypes2, _imagesConfig$schema$, _imagesConfig$schema, _imagesConfig$schema$2, _imagesConfig$schema2;
  const formatting = config2.formatting === true ? {
    // alignment: true, // not supported natively in markdown
    blockTypes: true,
    headingLevels: true,
    inlineMarks: true,
    listTypes: true,
    softBreaks: true
  } : (_config$formatting = config2.formatting) !== null && _config$formatting !== void 0 ? _config$formatting : {};
  const imagesConfig = config2.images === true ? {} : config2.images;
  return {
    formatting: {
      alignment: formatting.alignment === true ? {
        center: true,
        end: true
      } : {
        center: !!((_formatting$alignment = formatting.alignment) !== null && _formatting$alignment !== void 0 && _formatting$alignment.center),
        end: !!((_formatting$alignment2 = formatting.alignment) !== null && _formatting$alignment2 !== void 0 && _formatting$alignment2.end)
      },
      blockTypes: (formatting === null || formatting === void 0 ? void 0 : formatting.blockTypes) === true ? {
        blockquote: true,
        code: {
          schema: object({})
        }
      } : {
        blockquote: !!((_formatting$blockType = formatting.blockTypes) !== null && _formatting$blockType !== void 0 && _formatting$blockType.blockquote),
        code: ((_formatting$blockType2) => {
          if (((_formatting$blockType2 = formatting.blockTypes) === null || _formatting$blockType2 === void 0 ? void 0 : _formatting$blockType2.code) === void 0) {
            return false;
          }
          if (formatting.blockTypes.code === true || !formatting.blockTypes.code.schema) {
            return {
              schema: object({})
            };
          }
          for (const key of ["type", "children", "language"]) {
            if (key in formatting.blockTypes.code.schema) {
              throw new Error(`"${key}" cannot be a key in the schema for code blocks`);
            }
          }
          return {
            schema: object(formatting.blockTypes.code.schema)
          };
        })()
      },
      headings: ((_obj$schema) => {
        const opt = formatting === null || formatting === void 0 ? void 0 : formatting.headingLevels;
        const obj = typeof opt === "object" && "levels" in opt ? opt : {
          levels: opt,
          schema: void 0
        };
        if (obj.schema) {
          for (const key of ["type", "children", "level", "textAlign"]) {
            if (key in obj.schema) {
              throw new Error(`"${key}" cannot be a key in the schema for headings`);
            }
          }
        }
        return {
          levels: [...new Set(obj.levels === true ? [1, 2, 3, 4, 5, 6] : obj.levels)],
          schema: object((_obj$schema = obj.schema) !== null && _obj$schema !== void 0 ? _obj$schema : {})
        };
      })(),
      inlineMarks: formatting.inlineMarks === true ? {
        bold: true,
        code: true,
        italic: true,
        keyboard: false,
        // not supported natively in markdown
        strikethrough: true,
        subscript: false,
        // not supported natively in markdown
        superscript: false,
        // not supported natively in markdown
        underline: false
        // not supported natively in markdown
      } : {
        bold: !!((_formatting$inlineMar = formatting.inlineMarks) !== null && _formatting$inlineMar !== void 0 && _formatting$inlineMar.bold),
        code: !!((_formatting$inlineMar2 = formatting.inlineMarks) !== null && _formatting$inlineMar2 !== void 0 && _formatting$inlineMar2.code),
        italic: !!((_formatting$inlineMar3 = formatting.inlineMarks) !== null && _formatting$inlineMar3 !== void 0 && _formatting$inlineMar3.italic),
        strikethrough: !!((_formatting$inlineMar4 = formatting.inlineMarks) !== null && _formatting$inlineMar4 !== void 0 && _formatting$inlineMar4.strikethrough),
        underline: !!((_formatting$inlineMar5 = formatting.inlineMarks) !== null && _formatting$inlineMar5 !== void 0 && _formatting$inlineMar5.underline),
        keyboard: !!((_formatting$inlineMar6 = formatting.inlineMarks) !== null && _formatting$inlineMar6 !== void 0 && _formatting$inlineMar6.keyboard),
        subscript: !!((_formatting$inlineMar7 = formatting.inlineMarks) !== null && _formatting$inlineMar7 !== void 0 && _formatting$inlineMar7.subscript),
        superscript: !!((_formatting$inlineMar8 = formatting.inlineMarks) !== null && _formatting$inlineMar8 !== void 0 && _formatting$inlineMar8.superscript)
      },
      listTypes: formatting.listTypes === true ? {
        ordered: true,
        unordered: true
      } : {
        ordered: !!((_formatting$listTypes = formatting.listTypes) !== null && _formatting$listTypes !== void 0 && _formatting$listTypes.ordered),
        unordered: !!((_formatting$listTypes2 = formatting.listTypes) !== null && _formatting$listTypes2 !== void 0 && _formatting$listTypes2.unordered)
      },
      softBreaks: !!formatting.softBreaks
    },
    links: !!config2.links,
    layouts: [...new Set((config2.layouts || []).map((x) => JSON.stringify(x)))].map((x) => JSON.parse(x)),
    dividers: !!config2.dividers,
    images: imagesConfig === void 0 ? false : {
      ...imagesConfig,
      schema: {
        alt: (_imagesConfig$schema$ = (_imagesConfig$schema = imagesConfig.schema) === null || _imagesConfig$schema === void 0 ? void 0 : _imagesConfig$schema.alt) !== null && _imagesConfig$schema$ !== void 0 ? _imagesConfig$schema$ : defaultAltField$1,
        title: (_imagesConfig$schema$2 = (_imagesConfig$schema2 = imagesConfig.schema) === null || _imagesConfig$schema2 === void 0 ? void 0 : _imagesConfig$schema2.title) !== null && _imagesConfig$schema$2 !== void 0 ? _imagesConfig$schema$2 : emptyTitleField$1
      }
    },
    tables: !!config2.tables
  };
}
function document({
  label,
  componentBlocks = {},
  description,
  ...documentFeaturesConfig
}) {
  const documentFeatures = normaliseDocumentFeatures(documentFeaturesConfig);
  return {
    kind: "form",
    formKind: "content",
    defaultValue() {
      return [{
        type: "paragraph",
        children: [{
          text: ""
        }]
      }];
    },
    Input(props) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(DocumentFieldInput, {
        componentBlocks,
        description,
        label,
        documentFeatures,
        ...props
      });
    },
    parse(_, data) {
      const markdoc2 = textDecoder$1.decode(data.content);
      fromMarkdoc(parse3(markdoc2), componentBlocks);
      return deserializeFiles(normalizeDocumentFieldChildren(), componentBlocks, data.other, data.external, "edit", documentFeatures, data.slug);
    },
    contentExtension: ".mdoc",
    validate(value) {
      return value;
    },
    directories: [...collectDirectoriesUsedInSchema(object(Object.fromEntries(Object.entries(componentBlocks).map(([name, block]) => [name, object(block.schema)])))), ...typeof documentFeatures.images === "object" && typeof documentFeatures.images.directory === "string" ? [fixPath(documentFeatures.images.directory)] : []],
    serialize(value, opts) {
      return serializeMarkdoc();
    },
    reader: {
      parse(value, data) {
        const markdoc2 = textDecoder$1.decode(data.content);
        const document2 = fromMarkdoc(parse3(markdoc2), componentBlocks);
        return deserializeFiles(document2, componentBlocks, /* @__PURE__ */ new Map(), /* @__PURE__ */ new Map(), "read", documentFeatures, void 0);
      }
    }
  };
}
const defaultAltField = text({
  label: "Alt text",
  description: "This text will be used by screen readers and search engines."
});
const emptyTitleField = basicFormFieldWithSimpleReaderParse({
  Input() {
    return null;
  },
  defaultValue() {
    return "";
  },
  parse(value) {
    if (value === void 0) return "";
    if (typeof value !== "string") {
      throw new FieldDataError("Must be string");
    }
    return value;
  },
  validate(value) {
    return value;
  },
  serialize(value) {
    return {
      value
    };
  },
  label: "Title"
});
function editorOptionsToConfig(options) {
  var _options$bold, _options$italic, _options$strikethroug, _options$code, _options$blockquote, _options$orderedList, _options$unorderedLis, _options$table, _options$link, _options$divider;
  return {
    bold: (_options$bold = options.bold) !== null && _options$bold !== void 0 ? _options$bold : true,
    italic: (_options$italic = options.italic) !== null && _options$italic !== void 0 ? _options$italic : true,
    strikethrough: (_options$strikethroug = options.strikethrough) !== null && _options$strikethroug !== void 0 ? _options$strikethroug : true,
    code: (_options$code = options.code) !== null && _options$code !== void 0 ? _options$code : true,
    heading: (() => {
      let levels = [];
      let levelsOpt = typeof options.heading === "object" && !Array.isArray(options.heading) ? options.heading.levels : options.heading;
      if (levelsOpt === true || levelsOpt === void 0) {
        levels = [1, 2, 3, 4, 5, 6];
      }
      if (Array.isArray(levelsOpt)) {
        levels = levelsOpt;
      }
      return {
        levels,
        schema: options.heading && typeof options.heading === "object" && "schema" in options.heading ? options.heading.schema : {}
      };
    })(),
    blockquote: (_options$blockquote = options.blockquote) !== null && _options$blockquote !== void 0 ? _options$blockquote : true,
    orderedList: (_options$orderedList = options.orderedList) !== null && _options$orderedList !== void 0 ? _options$orderedList : true,
    unorderedList: (_options$unorderedLis = options.unorderedList) !== null && _options$unorderedLis !== void 0 ? _options$unorderedLis : true,
    table: (_options$table = options.table) !== null && _options$table !== void 0 ? _options$table : true,
    link: (_options$link = options.link) !== null && _options$link !== void 0 ? _options$link : true,
    image: options.image !== false ? ((_opts$transformFilena, _opts$schema$alt, _opts$schema, _opts$schema$title, _opts$schema2) => {
      const opts = options.image === true ? void 0 : options.image;
      return {
        directory: opts === null || opts === void 0 ? void 0 : opts.directory,
        publicPath: opts === null || opts === void 0 ? void 0 : opts.publicPath,
        transformFilename: (_opts$transformFilena = opts === null || opts === void 0 ? void 0 : opts.transformFilename) !== null && _opts$transformFilena !== void 0 ? _opts$transformFilena : (x) => x,
        schema: {
          alt: (_opts$schema$alt = opts === null || opts === void 0 || (_opts$schema = opts.schema) === null || _opts$schema === void 0 ? void 0 : _opts$schema.alt) !== null && _opts$schema$alt !== void 0 ? _opts$schema$alt : defaultAltField,
          title: (_opts$schema$title = opts === null || opts === void 0 || (_opts$schema2 = opts.schema) === null || _opts$schema2 === void 0 ? void 0 : _opts$schema2.title) !== null && _opts$schema$title !== void 0 ? _opts$schema$title : emptyTitleField
        }
      };
    })() : void 0,
    divider: (_options$divider = options.divider) !== null && _options$divider !== void 0 ? _options$divider : true,
    codeBlock: options.codeBlock === false ? void 0 : {
      schema: typeof options.codeBlock === "object" ? options.codeBlock.schema : {}
    }
  };
}
function getTypeForField(field) {
  if (field.kind === "object" || field.kind === "conditional") {
    return {
      type: Object,
      required: true
    };
  }
  if (field.kind === "array") {
    return {
      type: Array,
      required: true
    };
  }
  if (field.kind === "child") {
    return {};
  }
  if (field.formKind === void 0) {
    if (typeof field.defaultValue === "string" && "options" in field && Array.isArray(field.options) && field.options.every((val) => typeof val === "object" && val !== null && "value" in val && typeof val.value === "string")) {
      return {
        type: String,
        matches: field.options.map((x) => x.value),
        required: true
      };
    }
    if (typeof field.defaultValue === "string") {
      let required = false;
      try {
        field.parse("");
      } catch {
        required = true;
      }
      return {
        type: String,
        required
      };
    }
    try {
      field.parse(1);
      return {
        type: Number
      };
    } catch {
    }
    if (typeof field.defaultValue === "boolean") {
      return {
        type: Boolean,
        required: true
      };
    }
    return {};
  }
  if (field.formKind === "slug") {
    let required = false;
    try {
      field.parse("", void 0);
    } catch {
      required = true;
    }
    return {
      type: String,
      required
    };
  }
  if (field.formKind === "asset") {
    let required = false;
    try {
      field.validate(null);
    } catch {
      required = true;
    }
    return {
      type: String,
      required
    };
  }
  return {};
}
function fieldsToMarkdocAttributes(fields) {
  return Object.fromEntries(Object.entries(fields).map(([name, field]) => {
    const schema = getTypeForField(field);
    return [name, schema];
  }));
}
function createMarkdocConfig(opts) {
  const editorConfig = editorOptionsToConfig(opts.options || {});
  const config2 = {
    nodes: {
      ...schema_exports
    },
    tags: {}
  };
  if (editorConfig.heading.levels.length) {
    config2.nodes.heading = {
      ...schema_exports.heading,
      attributes: {
        ...schema_exports.heading.attributes,
        ...fieldsToMarkdocAttributes(editorConfig.heading.schema)
      }
    };
  } else {
    config2.nodes.heading = void 0;
  }
  if (!editorConfig.blockquote) {
    config2.nodes.blockquote = void 0;
  }
  if (editorConfig.codeBlock) {
    config2.nodes.fence = {
      ...schema_exports.fence,
      attributes: {
        ...schema_exports.fence.attributes,
        ...fieldsToMarkdocAttributes(editorConfig.codeBlock.schema)
      }
    };
  } else {
    config2.nodes.fence = void 0;
  }
  if (!editorConfig.orderedList && !editorConfig.unorderedList) {
    config2.nodes.list = void 0;
  }
  if (!editorConfig.bold) {
    config2.nodes.strong = void 0;
  }
  if (!editorConfig.italic) {
    config2.nodes.em = void 0;
  }
  if (!editorConfig.strikethrough) {
    config2.nodes.s = void 0;
  }
  if (!editorConfig.link) {
    config2.nodes.link = void 0;
  }
  if (!editorConfig.image) {
    config2.nodes.image = void 0;
  }
  if (!editorConfig.divider) {
    config2.nodes.hr = void 0;
  }
  if (!editorConfig.table) {
    config2.nodes.table = void 0;
  }
  for (const [name, component] of Object.entries(opts.components || {})) {
    var _opts$render;
    const isEmpty = component.kind === "block" || component.kind === "inline";
    config2.tags[name] = {
      render: (_opts$render = opts.render) === null || _opts$render === void 0 || (_opts$render = _opts$render.tags) === null || _opts$render === void 0 ? void 0 : _opts$render[name],
      children: isEmpty ? [] : void 0,
      selfClosing: isEmpty,
      attributes: fieldsToMarkdocAttributes(component.schema),
      description: "description" in component ? component.description : void 0,
      inline: component.kind === "inline" || component.kind === "mark"
    };
  }
  for (const [name, render] of Object.entries(((_opts$render2 = opts.render) === null || _opts$render2 === void 0 ? void 0 : _opts$render2.nodes) || {})) {
    var _opts$render2;
    const nodeSchema = config2.nodes[name];
    if (nodeSchema) {
      nodeSchema.render = render;
    }
  }
  return config2;
}
const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();
function getDirectoriesForEditorField(components, config2) {
  return [...collectDirectoriesUsedInSchema(object(Object.fromEntries(Object.entries(components).map(([name, component]) => [name, object(component.schema)])))), ...typeof config2.image === "object" && typeof config2.image.directory === "string" ? [fixPath(config2.image.directory)] : []];
}
function markdoc({
  label,
  description,
  options = {},
  components = {},
  extension = "mdoc"
}) {
  let schema;
  const config2 = editorOptionsToConfig(options);
  let getSchema = () => {
    if (!schema) {
      schema = createEditorSchema();
    }
    return schema;
  };
  return {
    kind: "form",
    formKind: "content",
    defaultValue() {
      return getDefaultValue(getSchema());
    },
    Input(props) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(DocumentFieldInput, {
        description,
        label,
        ...props
      });
    },
    parse: (_, {
      content,
      other,
      external,
      slug: slug2
    }) => {
      const text2 = textDecoder.decode(content);
      return parseToEditorState(text2, getSchema());
    },
    contentExtension: `.${extension}`,
    validate(value) {
      return value;
    },
    directories: getDirectoriesForEditorField(components, config2),
    serialize(value, {
      slug: slug2
    }) {
      const out = serializeFromEditorState();
      return {
        content: textEncoder.encode(out.content),
        external: out.external,
        other: out.other,
        value: void 0
      };
    },
    reader: {
      parse: (_, {
        content
      }) => {
        const text2 = textDecoder.decode(content);
        return {
          node: parse3(text2)
        };
      }
    },
    collaboration: {
      toYjs(value) {
        return prosemirrorToYXmlFragment(value.doc);
      },
      fromYjs(yjsValue, awareness) {
        return createEditorStateFromYJS(getSchema());
      }
    }
  };
}
markdoc.createMarkdocConfig = createMarkdocConfig;
markdoc.inline = function inlineMarkdoc({
  label,
  description,
  options = {},
  components = {}
}) {
  let schema;
  const config2 = editorOptionsToConfig(options);
  let getSchema = () => {
    if (!schema) {
      schema = createEditorSchema();
    }
    return schema;
  };
  return {
    kind: "form",
    formKind: "assets",
    defaultValue() {
      return getDefaultValue(getSchema());
    },
    Input(props) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(DocumentFieldInput, {
        description,
        label,
        ...props
      });
    },
    parse: (value, {
      other,
      external,
      slug: slug2
    }) => {
      if (value === void 0) {
        value = "";
      }
      if (typeof value !== "string") {
        throw new FieldDataError("Must be a string");
      }
      return parseToEditorState(value, getSchema());
    },
    validate(value) {
      return value;
    },
    directories: getDirectoriesForEditorField(components, config2),
    serialize(value, {
      slug: slug2
    }) {
      const out = serializeFromEditorState();
      return {
        external: out.external,
        other: out.other,
        value: out.content
      };
    },
    reader: {
      parse: (value) => {
        if (value === void 0) {
          value = "";
        }
        if (typeof value !== "string") {
          throw new FieldDataError("Must be a string");
        }
        return {
          node: parse3(value)
        };
      }
    },
    collaboration: {
      toYjs(value) {
        return prosemirrorToYXmlFragment(value.doc);
      },
      fromYjs(yjsValue, awareness) {
        return createEditorStateFromYJS(getSchema());
      }
    }
  };
};
function mdx({
  label,
  description,
  options = {},
  components = {},
  extension = "mdx"
}) {
  let schema;
  const config2 = editorOptionsToConfig(options);
  let getSchema = () => {
    if (!schema) {
      schema = createEditorSchema();
    }
    return schema;
  };
  return {
    kind: "form",
    formKind: "content",
    defaultValue() {
      return getDefaultValue(getSchema());
    },
    Input(props) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(DocumentFieldInput, {
        description,
        label,
        ...props
      });
    },
    parse: (_, {
      content,
      other,
      external,
      slug: slug2
    }) => {
      const text2 = textDecoder.decode(content);
      return parseToEditorStateMDX(text2, getSchema());
    },
    contentExtension: `.${extension}`,
    validate(value) {
      return value;
    },
    directories: getDirectoriesForEditorField(components, config2),
    serialize(value, {
      slug: slug2
    }) {
      const out = serializeFromEditorStateMDX();
      return {
        content: textEncoder.encode(out.content),
        external: out.external,
        other: out.other,
        value: void 0
      };
    },
    reader: {
      parse: (_, {
        content
      }) => {
        const text2 = textDecoder.decode(content);
        return text2;
      }
    },
    collaboration: {
      toYjs(value) {
        return prosemirrorToYXmlFragment(value.doc);
      },
      fromYjs(yjsValue, awareness) {
        return createEditorStateFromYJS(getSchema());
      }
    }
  };
}
mdx.inline = function mdx2({
  label,
  description,
  options = {},
  components = {}
}) {
  let schema;
  const config2 = editorOptionsToConfig(options);
  let getSchema = () => {
    if (!schema) {
      schema = createEditorSchema();
    }
    return schema;
  };
  return {
    kind: "form",
    formKind: "assets",
    defaultValue() {
      return getDefaultValue(getSchema());
    },
    Input(props) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(DocumentFieldInput, {
        description,
        label,
        ...props
      });
    },
    parse: (value, {
      other,
      external,
      slug: slug2
    }) => {
      if (value === void 0) {
        value = "";
      }
      if (typeof value !== "string") {
        throw new FieldDataError("Must be a string");
      }
      return parseToEditorStateMDX(value, getSchema());
    },
    validate(value) {
      return value;
    },
    directories: getDirectoriesForEditorField(components, config2),
    serialize(value, {
      slug: slug2
    }) {
      const out = serializeFromEditorStateMDX();
      return {
        external: out.external,
        other: out.other,
        value: out.content
      };
    },
    reader: {
      parse: (value) => {
        if (value === void 0) {
          value = "";
        }
        if (typeof value !== "string") {
          throw new FieldDataError("Must be a string");
        }
        return value;
      }
    },
    collaboration: {
      toYjs(value) {
        return prosemirrorToYXmlFragment(value.doc);
      },
      fromYjs(yjsValue, awareness) {
        return createEditorStateFromYJS(getSchema());
      }
    }
  };
};
async function readDirEntries(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, {
      withFileTypes: true
    });
  } catch (err) {
    if (err.code === "ENOENT") {
      return [];
    }
    throw err;
  }
  return entries;
}
async function collectEntriesInDir(baseDir, ancestors) {
  const currentRelativeDir = ancestors.map((p) => p.segment).join("/");
  const entries = await readDirEntries(path.join(baseDir, currentRelativeDir));
  const gitignore = entries.find((entry) => entry.isFile() && entry.name === ".gitignore");
  const gitignoreFilterForDescendents = gitignore ? ignore().add(await fs.readFile(path.join(baseDir, currentRelativeDir, gitignore.name), "utf8")).createFilter() : () => true;
  const pathSegments = ancestors.map((x) => x.segment);
  return (await Promise.all(entries.filter((entry) => {
    if (!entry.isDirectory() && !entry.isFile() || entry.name === ".git" || entry.name === "node_modules" || entry.name === ".next") {
      return false;
    }
    const innerPath = `${pathSegments.concat(entry.name).join("/")}${entry.isDirectory() ? "/" : ""}`;
    if (!gitignoreFilterForDescendents(innerPath)) {
      return false;
    }
    let currentPath = entry.name;
    for (let i = ancestors.length - 1; i >= 0; i--) {
      const ancestor = ancestors[i];
      currentPath = `${ancestor.segment}/${currentPath}`;
      if (!ancestor.gitignoreFilterForDescendents(currentPath)) {
        return false;
      }
    }
    return true;
  }).map(async (entry) => {
    if (entry.isDirectory()) {
      return collectEntriesInDir(baseDir, [...ancestors, {
        gitignoreFilterForDescendents,
        segment: entry.name
      }]);
    } else {
      const innerPath = pathSegments.concat(entry.name).join("/");
      const contents = await fs.readFile(path.join(baseDir, innerPath));
      return {
        path: innerPath,
        contents: {
          byteLength: contents.byteLength,
          sha: await blobSha(contents)
        }
      };
    }
  }))).flat();
}
async function readToDirEntries(baseDir) {
  const additions = await collectEntriesInDir(baseDir, []);
  const {
    entries
  } = await updateTreeWithChanges(/* @__PURE__ */ new Map(), {
    additions,
    deletions: []
  });
  return entries;
}
function getAllowedDirectories(config2) {
  const allowedDirectories = [];
  for (const [collection2, collectionConfig] of Object.entries((_config$collections = config2.collections) !== null && _config$collections !== void 0 ? _config$collections : {})) {
    var _config$collections;
    allowedDirectories.push(...getDirectoriesForTreeKey(object(collectionConfig.schema), getCollectionPath(config2, collection2), void 0, {
      data: "yaml",
      contentField: void 0,
      dataLocation: "index"
    }));
    if (collectionConfig.template) {
      allowedDirectories.push(collectionConfig.template);
    }
  }
  for (const [singleton2, singletonConfig] of Object.entries((_config$singletons = config2.singletons) !== null && _config$singletons !== void 0 ? _config$singletons : {})) {
    var _config$singletons;
    allowedDirectories.push(...getDirectoriesForTreeKey(object(singletonConfig.schema), getSingletonPath(config2, singleton2), void 0, getSingletonFormat(config2, singleton2)));
  }
  return [...new Set(allowedDirectories)];
}
function redirect(to, initialHeaders) {
  return {
    body: null,
    status: 307,
    headers: [...initialHeaders !== null && initialHeaders !== void 0 ? initialHeaders : [], ["Location", to]]
  };
}
function base64UrlDecode(base64) {
  const binString = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(binString, (m) => m.codePointAt(0));
}
function base64UrlEncode(bytes) {
  return base64Encode(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
function base64Encode(bytes) {
  const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join("");
  return btoa(binString);
}
type({
  slug: string(),
  client_id: string(),
  client_secret: string()
});
function localModeApiHandler(config2, localBaseDirectory) {
  const baseDirectory = path$1.resolve(localBaseDirectory !== null && localBaseDirectory !== void 0 ? localBaseDirectory : process.cwd());
  return async (req, params) => {
    const joined = params.join("/");
    if (req.method === "GET" && joined === "tree") {
      return tree(req, config2, baseDirectory);
    }
    if (req.method === "GET" && params[0] === "blob") {
      return blob(req, config2, params, baseDirectory);
    }
    if (req.method === "POST" && joined === "update") {
      return update(req, config2, baseDirectory);
    }
    return {
      status: 404,
      body: "Not Found"
    };
  };
}
async function tree(req, config2, baseDirectory) {
  if (req.headers.get("no-cors") !== "1") {
    return {
      status: 400,
      body: "Bad Request"
    };
  }
  return {
    status: 200,
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(await readToDirEntries(baseDirectory))
  };
}
function getIsPathValid(config2) {
  const allowedDirectories = getAllowedDirectories(config2);
  return (filepath) => !filepath.includes("\\") && filepath.split("/").every((x) => x !== "." && x !== "..") && allowedDirectories.some((x) => filepath.startsWith(x));
}
async function blob(req, config2, params, baseDirectory) {
  if (req.headers.get("no-cors") !== "1") {
    return {
      status: 400,
      body: "Bad Request"
    };
  }
  const expectedSha = params[1];
  const filepath = params.slice(2).join("/");
  const isFilepathValid = getIsPathValid(config2);
  if (!isFilepathValid(filepath)) {
    return {
      status: 400,
      body: "Bad Request"
    };
  }
  let contents;
  try {
    contents = await fs$1.readFile(path$1.join(baseDirectory, filepath));
  } catch (err) {
    if (err.code === "ENOENT") {
      return {
        status: 404,
        body: "Not Found"
      };
    }
    throw err;
  }
  const sha = await blobSha(contents);
  if (sha !== expectedSha) {
    return {
      status: 404,
      body: "Not Found"
    };
  }
  return {
    status: 200,
    body: contents
  };
}
const base64Schema = coerce(instance(Uint8Array), string(), (val) => base64UrlDecode(val));
async function update(req, config2, baseDirectory) {
  if (req.headers.get("no-cors") !== "1" || req.headers.get("content-type") !== "application/json") {
    return {
      status: 400,
      body: "Bad Request"
    };
  }
  const isFilepathValid = getIsPathValid(config2);
  const filepath = refine(string(), "filepath", isFilepathValid);
  let updates;
  try {
    updates = create(await req.json(), object$1({
      additions: array$1(object$1({
        path: filepath,
        contents: base64Schema
      })),
      deletions: array$1(object$1({
        path: filepath
      }))
    }));
  } catch {
    return {
      status: 400,
      body: "Bad data"
    };
  }
  for (const addition of updates.additions) {
    await fs$1.mkdir(path$1.dirname(path$1.join(baseDirectory, addition.path)), {
      recursive: true
    });
    await fs$1.writeFile(path$1.join(baseDirectory, addition.path), addition.contents);
  }
  for (const deletion of updates.deletions) {
    await fs$1.rm(path$1.join(baseDirectory, deletion.path), {
      force: true
    });
  }
  return {
    status: 200,
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(await readToDirEntries(baseDirectory))
  };
}
function bytesToHex(bytes) {
  let str = "";
  for (const byte of bytes) {
    str += byte.toString(16).padStart(2, "0");
  }
  return str;
}
const encoder = new TextEncoder();
const decoder = new TextDecoder();
async function deriveKey(secret, salt) {
  if (secret.length < 32) {
    throw new Error("KEYSTATIC_SECRET must be at least 32 characters long");
  }
  const encoded = encoder.encode(secret);
  const key = await webcrypto.subtle.importKey("raw", encoded, "HKDF", false, ["deriveKey"]);
  return webcrypto.subtle.deriveKey({
    name: "HKDF",
    salt,
    hash: "SHA-256",
    info: new Uint8Array(0)
  }, key, {
    name: "AES-GCM",
    length: 256
  }, false, ["encrypt", "decrypt"]);
}
const SALT_LENGTH = 16;
const IV_LENGTH = 12;
async function encryptValue(value, secret) {
  const salt = webcrypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = webcrypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await deriveKey(secret, salt);
  const encoded = encoder.encode(value);
  const encrypted = await webcrypto.subtle.encrypt({
    name: "AES-GCM",
    iv
  }, key, encoded);
  const full = new Uint8Array(SALT_LENGTH + IV_LENGTH + encrypted.byteLength);
  full.set(salt);
  full.set(iv, SALT_LENGTH);
  full.set(new Uint8Array(encrypted), SALT_LENGTH + IV_LENGTH);
  return base64UrlEncode(full);
}
async function decryptValue(encrypted, secret) {
  const decoded = base64UrlDecode(encrypted);
  const salt = decoded.slice(0, SALT_LENGTH);
  const key = await deriveKey(secret, salt);
  const iv = decoded.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const value = decoded.slice(SALT_LENGTH + IV_LENGTH);
  const decrypted = await webcrypto.subtle.decrypt({
    name: "AES-GCM",
    iv
  }, key, value);
  return decoder.decode(decrypted);
}
const keystaticRouteRegex = /^branch\/[^]+(\/collection\/[^/]+(|\/(create|item\/[^/]+))|\/singleton\/[^/]+)?$/;
const keyToEnvVar = {
  clientId: "KEYSTATIC_GITHUB_CLIENT_ID",
  clientSecret: "KEYSTATIC_GITHUB_CLIENT_SECRET",
  secret: "KEYSTATIC_SECRET"
};
function tryOrUndefined(fn) {
  try {
    return fn();
  } catch {
    return void 0;
  }
}
function makeGenericAPIRouteHandler(_config, options) {
  var _config$clientId, _config$clientSecret, _config$secret;
  const _config2 = {
    clientId: (_config$clientId = _config.clientId) !== null && _config$clientId !== void 0 ? _config$clientId : tryOrUndefined(() => process.env.KEYSTATIC_GITHUB_CLIENT_ID),
    clientSecret: (_config$clientSecret = _config.clientSecret) !== null && _config$clientSecret !== void 0 ? _config$clientSecret : tryOrUndefined(() => process.env.KEYSTATIC_GITHUB_CLIENT_SECRET),
    secret: (_config$secret = _config.secret) !== null && _config$secret !== void 0 ? _config$secret : tryOrUndefined(() => process.env.KEYSTATIC_SECRET),
    config: _config.config
  };
  const getParams = (req) => {
    let url2;
    try {
      url2 = new URL(req.url);
    } catch (err) {
      throw new Error(`Found incomplete URL in Keystatic API route URL handler${""}`);
    }
    return url2.pathname.replace(/^\/api\/keystatic\/?/, "").split("/").map((x) => decodeURIComponent(x)).filter(Boolean);
  };
  if (_config2.config.storage.kind === "local") {
    const handler = localModeApiHandler(_config2.config, _config.localBaseDirectory);
    return (req) => {
      const params = getParams(req);
      return handler(req, params);
    };
  }
  if (_config2.config.storage.kind === "cloud") {
    return async function keystaticAPIRoute() {
      return {
        status: 404,
        body: "Not Found"
      };
    };
  }
  if (!_config2.clientId || !_config2.clientSecret || !_config2.secret) {
    {
      const missingKeys = ["clientId", "clientSecret", "secret"].filter((x) => !_config2[x]);
      throw new Error(`Missing required config in Keystatic API setup when using the 'github' storage mode:
${missingKeys.map((key) => `- ${key} (can be provided via ${keyToEnvVar[key]} env var)`).join("\n")}

If you've created your GitHub app locally, make sure to copy the environment variables from your local env file to your deployed environment`);
    }
  }
  const config2 = {
    clientId: _config2.clientId,
    clientSecret: _config2.clientSecret,
    secret: _config2.secret,
    config: _config2.config
  };
  return async function keystaticAPIRoute(req) {
    const params = getParams(req);
    const joined = params.join("/");
    if (joined === "github/oauth/callback") {
      return githubOauthCallback(req, config2);
    }
    if (joined === "github/login") {
      return githubLogin(req, config2);
    }
    if (joined === "github/refresh-token") {
      return githubRefreshToken(req, config2);
    }
    if (joined === "github/repo-not-found") {
      return githubRepoNotFound(req, config2);
    }
    if (joined === "github/logout") {
      var _req$headers$get;
      const cookies = distExports.parse((_req$headers$get = req.headers.get("cookie")) !== null && _req$headers$get !== void 0 ? _req$headers$get : "");
      const access_token = cookies["keystatic-gh-access-token"];
      if (access_token) {
        await fetch(`https://api.github.com/applications/${config2.clientId}/token`, {
          method: "DELETE",
          headers: {
            Authorization: `Basic ${btoa(config2.clientId + ":" + config2.clientSecret)}`
          },
          body: JSON.stringify({
            access_token
          })
        });
      }
      return redirect("/keystatic", [["Set-Cookie", immediatelyExpiringCookie("keystatic-gh-access-token")], ["Set-Cookie", immediatelyExpiringCookie("keystatic-gh-refresh-token")]]);
    }
    if (joined === "github/created-app") {
      return {
        status: 404,
        body: "It looks like you just tried to create a GitHub App for Keystatic but there is already a GitHub App configured for Keystatic.\n\nYou may be here because you started creating a GitHub App but then started the process again elsewhere and completed it there. You should likely go back to Keystatic and sign in with GitHub to continue."
      };
    }
    return {
      status: 404,
      body: "Not Found"
    };
  };
}
const tokenDataResultType = type({
  access_token: string(),
  expires_in: number$1(),
  refresh_token: string(),
  refresh_token_expires_in: number$1(),
  scope: string(),
  token_type: literal("bearer")
});
async function githubOauthCallback(req, config2) {
  var _req$headers$get2;
  const searchParams = new URL(req.url, "http://localhost").searchParams;
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  if (typeof errorDescription === "string") {
    return {
      status: 400,
      body: `An error occurred when trying to authenticate with GitHub:
${errorDescription}${error === "redirect_uri_mismatch" ? `

If you were trying to sign in locally and recently upgraded Keystatic from @keystatic/core@0.0.69 or below, you need to add \`http://127.0.0.1/api/keystatic/github/oauth/callback\` as a callback URL in your GitHub app.` : ""}`
    };
  }
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  if (typeof code !== "string") {
    return {
      status: 400,
      body: "Bad Request"
    };
  }
  const cookies = distExports.parse((_req$headers$get2 = req.headers.get("cookie")) !== null && _req$headers$get2 !== void 0 ? _req$headers$get2 : "");
  const fromCookie = state ? cookies["ks-" + state] : void 0;
  const from = typeof fromCookie === "string" && keystaticRouteRegex.test(fromCookie) ? fromCookie : void 0;
  const url2 = new URL("https://github.com/login/oauth/access_token");
  url2.searchParams.set("client_id", config2.clientId);
  url2.searchParams.set("client_secret", config2.clientSecret);
  url2.searchParams.set("code", code);
  const tokenRes = await fetch(url2, {
    method: "POST",
    headers: {
      Accept: "application/json"
    }
  });
  if (!tokenRes.ok) {
    return {
      status: 401,
      body: "Authorization failed"
    };
  }
  const _tokenData = await tokenRes.json();
  let tokenData;
  try {
    tokenData = tokenDataResultType.create(_tokenData);
  } catch {
    return {
      status: 401,
      body: "Authorization failed"
    };
  }
  const headers = await getTokenCookies(tokenData, config2);
  if (state === "close") {
    return {
      headers: [...headers, ["Content-Type", "text/html"]],
      body: "<script>localStorage.setItem('ks-refetch-installations', 'true');window.close();<\/script>",
      status: 200
    };
  }
  return redirect(`/keystatic${from ? `/${from}` : ""}`, headers);
}
async function getTokenCookies(tokenData, config2) {
  const headers = [["Set-Cookie", distExports.serialize("keystatic-gh-access-token", tokenData.access_token, {
    sameSite: "lax",
    secure: true,
    maxAge: tokenData.expires_in,
    expires: new Date(Date.now() + tokenData.expires_in * 1e3),
    path: "/"
  })], ["Set-Cookie", distExports.serialize("keystatic-gh-refresh-token", await encryptValue(tokenData.refresh_token, config2.secret), {
    sameSite: "lax",
    secure: true,
    httpOnly: true,
    maxAge: tokenData.refresh_token_expires_in,
    expires: new Date(Date.now() + tokenData.refresh_token_expires_in * 100),
    path: "/"
  })]];
  return headers;
}
async function getRefreshToken(req, config2) {
  const cookies = distExports.parse(req.headers.get("cookie") || "");
  const refreshTokenCookie = cookies["keystatic-gh-refresh-token"];
  if (!refreshTokenCookie) return;
  let refreshToken;
  try {
    refreshToken = await decryptValue(refreshTokenCookie, config2.secret);
  } catch {
    return;
  }
  return refreshToken;
}
async function githubRefreshToken(req, config2) {
  const headers = await refreshGitHubAuth(req, config2);
  if (!headers) {
    return {
      status: 401,
      body: "Authorization failed"
    };
  }
  return {
    status: 200,
    headers,
    body: ""
  };
}
async function refreshGitHubAuth(req, config2) {
  const refreshToken = await getRefreshToken(req, config2);
  if (!refreshToken) {
    return;
  }
  const url2 = new URL("https://github.com/login/oauth/access_token");
  url2.searchParams.set("client_id", config2.clientId);
  url2.searchParams.set("client_secret", config2.clientSecret);
  url2.searchParams.set("grant_type", "refresh_token");
  url2.searchParams.set("refresh_token", refreshToken);
  const tokenRes = await fetch(url2, {
    method: "POST",
    headers: {
      Accept: "application/json"
    }
  });
  if (!tokenRes.ok) {
    return;
  }
  const _tokenData = await tokenRes.json();
  let tokenData;
  try {
    tokenData = tokenDataResultType.create(_tokenData);
  } catch {
    return;
  }
  return getTokenCookies(tokenData, config2);
}
async function githubRepoNotFound(req, config2) {
  const headers = await refreshGitHubAuth(req, config2);
  if (headers) {
    return redirect("/keystatic/repo-not-found", headers);
  }
  return githubLogin(req, config2);
}
async function githubLogin(req, config2) {
  const reqUrl = new URL(req.url);
  const rawFrom = reqUrl.searchParams.get("from");
  const from = typeof rawFrom === "string" && keystaticRouteRegex.test(rawFrom) ? rawFrom : "/";
  const state = bytesToHex(webcrypto.getRandomValues(new Uint8Array(10)));
  const url2 = new URL("https://github.com/login/oauth/authorize");
  url2.searchParams.set("client_id", config2.clientId);
  url2.searchParams.set("redirect_uri", `${reqUrl.origin}/api/keystatic/github/oauth/callback`);
  if (from === "/") {
    return redirect(url2.toString());
  }
  url2.searchParams.set("state", state);
  return redirect(url2.toString(), [["Set-Cookie", distExports.serialize("ks-" + state, from, {
    sameSite: "lax",
    secure: true,
    // 1 day
    maxAge: 60 * 60 * 24,
    expires: new Date(Date.now() + 60 * 60 * 24 * 1e3),
    path: "/",
    httpOnly: true
  })]]);
}
function immediatelyExpiringCookie(name) {
  return distExports.serialize(name, "", {
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: /* @__PURE__ */ new Date()
  });
}
function validateInteger(validation, value, label) {
  if (value !== null && (typeof value !== "number" || !Number.isInteger(value))) {
    return `${label} must be a whole number`;
  }
  if (validation !== null && validation !== void 0 && validation.isRequired && value === null) {
    return `${label} is required`;
  }
  if (value !== null) {
    if ((validation === null || validation === void 0 ? void 0 : validation.min) !== void 0 && value < validation.min) {
      return `${label} must be at least ${validation.min}`;
    }
    if ((validation === null || validation === void 0 ? void 0 : validation.max) !== void 0 && value > validation.max) {
      return `${label} must be at most ${validation.max}`;
    }
  }
}
function integer({
  label,
  defaultValue,
  validation,
  description
}) {
  return basicFormFieldWithSimpleReaderParse({
    label,
    Input(props) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(IntegerFieldInput, {
        label,
        description,
        validation,
        ...props
      });
    },
    defaultValue() {
      return defaultValue !== null && defaultValue !== void 0 ? defaultValue : null;
    },
    parse(value) {
      if (value === void 0) {
        return null;
      }
      if (typeof value === "number") {
        return value;
      }
      throw new FieldDataError("Must be a number");
    },
    validate(value) {
      const message = validateInteger(validation, value, label);
      if (message !== void 0) {
        throw new FieldDataError(message);
      }
      assertRequired(value, validation, label);
      return value;
    },
    serialize(value) {
      return {
        value: value === null ? void 0 : value
      };
    }
  });
}
function config(config2) {
  return config2;
}
function collection(collection2) {
  return collection2;
}
function singleton(collection2) {
  return collection2;
}
function array(element, opts) {
  var _opts$label;
  return {
    kind: "array",
    element,
    label: (_opts$label = opts === null || opts === void 0 ? void 0 : opts.label) !== null && _opts$label !== void 0 ? _opts$label : "Items",
    description: opts === null || opts === void 0 ? void 0 : opts.description,
    itemLabel: opts === null || opts === void 0 ? void 0 : opts.itemLabel,
    asChildTag: opts === null || opts === void 0 ? void 0 : opts.asChildTag,
    slugField: opts === null || opts === void 0 ? void 0 : opts.slugField,
    validation: opts === null || opts === void 0 ? void 0 : opts.validation
  };
}
function select({
  label,
  options,
  defaultValue,
  description
}) {
  const optionValuesSet = new Set(options.map((x) => x.value));
  if (!optionValuesSet.has(defaultValue)) {
    throw new Error(`A defaultValue of ${defaultValue} was provided to a select field but it does not match the value of one of the options provided`);
  }
  const field = basicFormFieldWithSimpleReaderParse({
    label,
    Input(props) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SelectFieldInput, {
        label,
        options,
        description,
        ...props
      });
    },
    defaultValue() {
      return defaultValue;
    },
    parse(value) {
      if (value === void 0) {
        return defaultValue;
      }
      if (typeof value !== "string") {
        throw new FieldDataError("Must be a string");
      }
      if (!optionValuesSet.has(value)) {
        throw new FieldDataError("Must be a valid option");
      }
      return value;
    },
    validate(value) {
      return value;
    },
    serialize(value) {
      return {
        value
      };
    }
  });
  return {
    ...field,
    options
  };
}
function conditional(discriminant, values) {
  return {
    kind: "conditional",
    discriminant,
    values
  };
}
function blocks(blocks2, opts) {
  const entries = Object.entries(blocks2);
  if (!entries.length) {
    throw new Error("fields.blocks must have at least one entry");
  }
  const select$1 = select({
    label: "Kind",
    defaultValue: entries[0][0],
    options: Object.entries(blocks2).map(([key, {
      label
    }]) => ({
      label,
      value: key
    }))
  });
  const element = conditional(select$1, Object.fromEntries(entries.map(([key, {
    schema
  }]) => [key, schema])));
  return {
    ...array(element, {
      label: opts.label,
      description: opts.description,
      validation: opts.validation,
      itemLabel(props) {
        const kind = props.discriminant;
        const block = blocks2[kind];
        if (!block.itemLabel) return block.label;
        return block.itemLabel(props.value);
      }
    }),
    Input: BlocksFieldInput
  };
}
function checkbox({
  label,
  defaultValue = false,
  description
}) {
  return basicFormFieldWithSimpleReaderParse({
    label,
    Input(props) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CheckboxFieldInput, {
        ...props,
        label,
        description
      });
    },
    defaultValue() {
      return defaultValue;
    },
    parse(value) {
      if (value === void 0) return defaultValue;
      if (typeof value !== "boolean") {
        throw new FieldDataError("Must be a boolean");
      }
      return value;
    },
    validate(value) {
      return value;
    },
    serialize(value) {
      return {
        value
      };
    }
  });
}
function child(options) {
  return {
    kind: "child",
    options: options.kind === "block" ? {
      ...options,
      dividers: options.dividers,
      formatting: options.formatting === "inherit" ? {
        blockTypes: "inherit",
        headingLevels: "inherit",
        inlineMarks: "inherit",
        listTypes: "inherit",
        alignment: "inherit",
        softBreaks: "inherit"
      } : options.formatting,
      links: options.links,
      images: options.images,
      tables: options.tables,
      componentBlocks: options.componentBlocks
    } : {
      kind: "inline",
      placeholder: options.placeholder,
      formatting: options.formatting === "inherit" ? {
        inlineMarks: "inherit",
        softBreaks: "inherit"
      } : options.formatting,
      links: options.links
    }
  };
}
function cloudImage({
  label,
  description,
  validation
}) {
  return {
    ...object({
      src: text({
        label: "URL",
        validation: {
          length: {
            min: validation !== null && validation !== void 0 && validation.isRequired ? 1 : 0
          }
        }
      }),
      alt: text({
        label: "Alt text"
      }),
      height: integer({
        label: "Height"
      }),
      width: integer({
        label: "Width"
      })
    }, {
      label,
      description
    }),
    Input(props) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CloudImageFieldInput, {
        ...props,
        isRequired: validation === null || validation === void 0 ? void 0 : validation.isRequired
      });
    }
  };
}
function validateDate(validation, value, label) {
  if (value !== null && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return `${label} is not a valid date`;
  }
  if (validation !== null && validation !== void 0 && validation.isRequired && value === null) {
    return `${label} is required`;
  }
  if ((validation !== null && validation !== void 0 && validation.min || validation !== null && validation !== void 0 && validation.max) && value !== null) {
    const date2 = new Date(value);
    if ((validation === null || validation === void 0 ? void 0 : validation.min) !== void 0) {
      const min = new Date(validation.min);
      if (date2 < min) {
        return `${label} must be after ${min.toLocaleDateString()}`;
      }
    }
    if ((validation === null || validation === void 0 ? void 0 : validation.max) !== void 0) {
      const max = new Date(validation.max);
      if (date2 > max) {
        return `${label} must be no later than ${max.toLocaleDateString()}`;
      }
    }
  }
}
function date({
  label,
  defaultValue,
  validation,
  description
}) {
  return basicFormFieldWithSimpleReaderParse({
    label,
    Input(props) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(DateFieldInput, {
        validation,
        label,
        description,
        ...props
      });
    },
    defaultValue() {
      if (defaultValue === void 0) {
        return null;
      }
      if (typeof defaultValue === "string") {
        return defaultValue;
      }
      const today = /* @__PURE__ */ new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    parse(value) {
      if (value === void 0) {
        return null;
      }
      if (value instanceof Date) {
        const year = value.getUTCFullYear();
        const month = String(value.getUTCMonth() + 1).padStart(2, "0");
        const day = String(value.getUTCDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }
      if (typeof value !== "string") {
        throw new FieldDataError("Must be a string");
      }
      return value;
    },
    serialize(value) {
      if (value === null) return {
        value: void 0
      };
      const date2 = new Date(value);
      date2.toISOString = () => value;
      date2.toString = () => value;
      return {
        value: date2
      };
    },
    validate(value) {
      const message = validateDate(validation, value, label);
      if (message !== void 0) {
        throw new FieldDataError(message);
      }
      assertRequired(value, validation, label);
      return value;
    }
  });
}
function validateDatetime(validation, value, label) {
  if (value !== null && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    return `${label} is not a valid datetime`;
  }
  if (validation !== null && validation !== void 0 && validation.isRequired && value === null) {
    return `${label} is required`;
  }
  if ((validation !== null && validation !== void 0 && validation.min || validation !== null && validation !== void 0 && validation.max) && value !== null) {
    const datetime2 = new Date(value);
    if ((validation === null || validation === void 0 ? void 0 : validation.min) !== void 0) {
      const min = new Date(validation.min);
      if (datetime2 < min) {
        return `${label} must be after ${min.toISOString()}`;
      }
    }
    if ((validation === null || validation === void 0 ? void 0 : validation.max) !== void 0) {
      const max = new Date(validation.max);
      if (datetime2 > max) {
        return `${label} must be no later than ${max.toISOString()}`;
      }
    }
  }
}
function datetime({
  label,
  defaultValue,
  validation,
  description
}) {
  return basicFormFieldWithSimpleReaderParse({
    label,
    Input(props) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(DatetimeFieldInput, {
        validation,
        label,
        description,
        ...props
      });
    },
    defaultValue() {
      if (defaultValue === void 0) {
        return null;
      }
      if (typeof defaultValue === "string") {
        return defaultValue;
      }
      if (defaultValue.kind === "now") {
        const now = /* @__PURE__ */ new Date();
        return new Date(now.getTime() - now.getTimezoneOffset() * 60 * 1e3).toISOString().slice(0, -8);
      }
      return null;
    },
    parse(value) {
      if (value === void 0) {
        return null;
      }
      if (value instanceof Date) {
        return value.toISOString().slice(0, -8);
      }
      if (typeof value !== "string") {
        throw new FieldDataError("Must be a string or date");
      }
      return value;
    },
    serialize(value) {
      if (value === null) return {
        value: void 0
      };
      const date2 = /* @__PURE__ */ new Date(value + "Z");
      date2.toJSON = () => date2.toISOString().slice(0, -8);
      date2.toString = () => date2.toISOString().slice(0, -8);
      return {
        value: date2
      };
    },
    validate(value) {
      const message = validateDatetime(validation, value, label);
      if (message !== void 0) {
        throw new FieldDataError(message);
      }
      assertRequired(value, validation, label);
      return value;
    }
  });
}
function empty() {
  return basicFormFieldWithSimpleReaderParse({
    Input() {
      return null;
    },
    defaultValue() {
      return null;
    },
    parse() {
      return null;
    },
    serialize() {
      return {
        value: void 0
      };
    },
    validate(value) {
      return value;
    },
    label: "Empty"
  });
}
function emptyDocument() {
  return {
    kind: "form",
    formKind: "content",
    Input() {
      return null;
    },
    defaultValue() {
      return null;
    },
    parse() {
      return null;
    },
    contentExtension: ".mdoc",
    serialize() {
      return {
        value: void 0,
        content: new Uint8Array(),
        external: /* @__PURE__ */ new Map(),
        other: /* @__PURE__ */ new Map()
      };
    },
    validate(value) {
      return value;
    },
    reader: {
      parse() {
        return null;
      }
    }
  };
}
function emptyContent(opts) {
  return {
    kind: "form",
    formKind: "content",
    Input() {
      return null;
    },
    defaultValue() {
      return null;
    },
    parse() {
      return null;
    },
    contentExtension: `.${opts.extension}`,
    serialize() {
      return {
        value: void 0,
        content: new Uint8Array(),
        external: /* @__PURE__ */ new Map(),
        other: /* @__PURE__ */ new Map()
      };
    },
    validate(value) {
      return value;
    },
    reader: {
      parse() {
        return null;
      }
    }
  };
}
function file({
  label,
  directory,
  validation,
  description,
  publicPath,
  transformFilename
}) {
  return {
    kind: "form",
    formKind: "asset",
    label,
    Input(props) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(FileFieldInput, {
        label,
        description,
        validation,
        transformFilename,
        ...props
      });
    },
    defaultValue() {
      return null;
    },
    filename(value, args) {
      if (typeof value === "string") {
        return value.slice(getSrcPrefix(publicPath, args.slug).length);
      }
      return void 0;
    },
    parse(value, args) {
      var _value$match$, _value$match;
      if (value === void 0) {
        return null;
      }
      if (typeof value !== "string") {
        throw new FieldDataError("Must be a string");
      }
      if (args.asset === void 0) {
        return null;
      }
      return {
        data: args.asset,
        filename: value.slice(getSrcPrefix(publicPath, args.slug).length),
        extension: (_value$match$ = (_value$match = value.match(/\.([^.]+$)/)) === null || _value$match === void 0 ? void 0 : _value$match[1]) !== null && _value$match$ !== void 0 ? _value$match$ : ""
      };
    },
    validate(value) {
      assertRequired(value, validation, label);
      return value;
    },
    serialize(value, args) {
      if (value === null) {
        return {
          value: void 0,
          asset: void 0
        };
      }
      const filename = args.suggestedFilenamePrefix ? args.suggestedFilenamePrefix + "." + value.extension : value.filename;
      return {
        value: `${getSrcPrefix(publicPath, args.slug)}${filename}`,
        asset: {
          filename,
          content: value.data
        }
      };
    },
    directory: directory ? fixPath(directory) : void 0,
    reader: {
      parse(value) {
        if (typeof value !== "string" && value !== void 0) {
          throw new FieldDataError("Must be a string");
        }
        const val = value === void 0 ? null : value;
        assertRequired(val, validation, label);
        return val;
      }
    }
  };
}
function image({
  label,
  directory,
  validation,
  description,
  publicPath,
  transformFilename
}) {
  return {
    kind: "form",
    formKind: "asset",
    label,
    Input(props) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(ImageFieldInput, {
        label,
        description,
        validation,
        transformFilename,
        ...props
      });
    },
    defaultValue() {
      return null;
    },
    filename(value, args) {
      if (typeof value === "string") {
        return value.slice(getSrcPrefix(publicPath, args.slug).length);
      }
      return void 0;
    },
    parse(value, args) {
      var _value$match$, _value$match;
      if (value === void 0) {
        return null;
      }
      if (typeof value !== "string") {
        throw new FieldDataError("Must be a string");
      }
      if (args.asset === void 0) {
        return null;
      }
      return {
        data: args.asset,
        filename: value.slice(getSrcPrefix(publicPath, args.slug).length),
        extension: (_value$match$ = (_value$match = value.match(/\.([^.]+$)/)) === null || _value$match === void 0 ? void 0 : _value$match[1]) !== null && _value$match$ !== void 0 ? _value$match$ : ""
      };
    },
    validate(value) {
      assertRequired(value, validation, label);
      return value;
    },
    serialize(value, args) {
      if (value === null) {
        return {
          value: void 0,
          asset: void 0
        };
      }
      const filename = args.suggestedFilenamePrefix ? args.suggestedFilenamePrefix + "." + value.extension : value.filename;
      return {
        value: `${getSrcPrefix(publicPath, args.slug)}${filename}`,
        asset: {
          filename,
          content: value.data
        }
      };
    },
    directory: directory ? fixPath(directory) : void 0,
    reader: {
      parse(value) {
        if (typeof value !== "string" && value !== void 0) {
          throw new FieldDataError("Must be a string");
        }
        const val = value === void 0 ? null : value;
        assertRequired(val, validation, label);
        return val;
      }
    }
  };
}
function pluralize(count, options) {
  const {
    singular,
    plural = singular + "s",
    inclusive = true
  } = options;
  const variant = count === 1 ? singular : plural;
  return inclusive ? `${count} ${variant}` : variant;
}
function validateMultiRelationshipLength(validation, value) {
  var _validation$length$mi, _validation$length, _validation$length$ma, _validation$length2;
  const minLength = (_validation$length$mi = validation === null || validation === void 0 || (_validation$length = validation.length) === null || _validation$length === void 0 ? void 0 : _validation$length.min) !== null && _validation$length$mi !== void 0 ? _validation$length$mi : 0;
  if (value.length < minLength) {
    return `Must have at least ${pluralize(minLength, {
      singular: "item"
    })}.`;
  }
  const maxLength = (_validation$length$ma = validation === null || validation === void 0 || (_validation$length2 = validation.length) === null || _validation$length2 === void 0 ? void 0 : _validation$length2.max) !== null && _validation$length$ma !== void 0 ? _validation$length$ma : Infinity;
  if (value.length > maxLength) {
    return `Must have at most ${pluralize(maxLength, {
      singular: "item"
    })}.`;
  }
}
function multiRelationship({
  label,
  collection: collection2,
  validation,
  description
}) {
  return basicFormFieldWithSimpleReaderParse({
    label,
    Input(props) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(MultiRelationshipInput, {
        label,
        collection: collection2,
        description,
        validation,
        ...props
      });
    },
    defaultValue() {
      return [];
    },
    parse(value) {
      if (value === void 0) {
        return [];
      }
      if (!Array.isArray(value) || !value.every(emery_cjsExports.isString)) {
        throw new FieldDataError("Must be an array of strings");
      }
      return value;
    },
    validate(value) {
      const error = validateMultiRelationshipLength(validation, value);
      if (error) {
        throw new FieldDataError(error);
      }
      return value;
    },
    serialize(value) {
      return {
        value
      };
    }
  });
}
function multiselect({
  label,
  options,
  defaultValue = [],
  description
}) {
  const valuesToOption = new Map(options.map((x) => [x.value, x]));
  const field = basicFormFieldWithSimpleReaderParse({
    label,
    Input(props) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(MultiselectFieldInput, {
        label,
        description,
        options,
        ...props
      });
    },
    defaultValue() {
      return defaultValue;
    },
    parse(value) {
      if (value === void 0) {
        return [];
      }
      if (!Array.isArray(value)) {
        throw new FieldDataError("Must be an array of options");
      }
      if (!value.every((x) => typeof x === "string" && valuesToOption.has(x))) {
        throw new FieldDataError(`Must be an array with one of ${options.map((x) => x.value).join(", ")}`);
      }
      return value;
    },
    validate(value) {
      return value;
    },
    serialize(value) {
      return {
        value
      };
    }
  });
  return {
    ...field,
    options
  };
}
function validateNumber(validation, value, step, label) {
  if (value !== null && typeof value !== "number") {
    return `${label} must be a number`;
  }
  if (validation !== null && validation !== void 0 && validation.isRequired && value === null) {
    return `${label} is required`;
  }
  if (value !== null) {
    if ((validation === null || validation === void 0 ? void 0 : validation.min) !== void 0 && value < validation.min) {
      return `${label} must be at least ${validation.min}`;
    }
    if ((validation === null || validation === void 0 ? void 0 : validation.max) !== void 0 && value > validation.max) {
      return `${label} must be at most ${validation.max}`;
    }
    if (step !== void 0 && (validation === null || validation === void 0 ? void 0 : validation.validateStep) !== void 0 && !isAtStep(value, step)) {
      return `${label} must be a multiple of ${step}`;
    }
  }
}
function decimalPlaces(value) {
  const stringified = value.toString();
  const indexOfDecimal = stringified.indexOf(".");
  if (indexOfDecimal === -1) {
    const indexOfE = stringified.indexOf("e-");
    return indexOfE === -1 ? 0 : parseInt(stringified.slice(indexOfE + 2));
  }
  return stringified.length - indexOfDecimal - 1;
}
function isAtStep(value, step) {
  const dc = Math.max(decimalPlaces(step), decimalPlaces(value));
  const base = Math.pow(10, dc);
  return value * base % (step * base) === 0;
}
function number({
  label,
  defaultValue,
  step,
  validation,
  description
}) {
  return basicFormFieldWithSimpleReaderParse({
    label,
    Input(props) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(NumberFieldInput, {
        label,
        description,
        validation,
        step,
        ...props
      });
    },
    defaultValue() {
      return defaultValue !== null && defaultValue !== void 0 ? defaultValue : null;
    },
    parse(value) {
      if (value === void 0) {
        return null;
      }
      if (typeof value === "number") {
        return value;
      }
      throw new FieldDataError("Must be a number");
    },
    validate(value) {
      const message = validateNumber(validation, value, step, label);
      if (message !== void 0) {
        throw new FieldDataError(message);
      }
      assertRequired(value, validation, label);
      return value;
    },
    serialize(value) {
      return {
        value: value === null ? void 0 : value
      };
    }
  });
}
function pathReference({
  label,
  pattern,
  validation,
  description
}) {
  return basicFormFieldWithSimpleReaderParse({
    label,
    Input(props) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(PathReferenceInput, {
        label,
        pattern,
        description,
        validation,
        ...props
      });
    },
    defaultValue() {
      return null;
    },
    parse(value) {
      if (value === void 0) {
        return null;
      }
      if (typeof value !== "string") {
        throw new FieldDataError("Must be a string");
      }
      return value;
    },
    validate(value) {
      assertRequired(value, validation, label);
      return value;
    },
    serialize(value) {
      return {
        value: value === null ? void 0 : value
      };
    }
  });
}
function relationship({
  label,
  collection: collection2,
  validation,
  description
}) {
  return basicFormFieldWithSimpleReaderParse({
    label,
    Input(props) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(RelationshipInput, {
        label,
        collection: collection2,
        description,
        validation,
        ...props
      });
    },
    defaultValue() {
      return null;
    },
    parse(value) {
      if (value === void 0) {
        return null;
      }
      if (typeof value !== "string") {
        throw new FieldDataError("Must be a string");
      }
      return value;
    },
    validate(value) {
      assertRequired(value, validation, label);
      return value;
    },
    serialize(value) {
      return {
        value: value === null ? void 0 : value
      };
    }
  });
}
function parseSlugFieldAsNormalField(value) {
  if (value === void 0) {
    return {
      name: "",
      slug: ""
    };
  }
  if (typeof value !== "object") {
    throw new FieldDataError("Must be an object");
  }
  if (Object.keys(value).length !== 2) {
    throw new FieldDataError("Unexpected keys");
  }
  if (!("name" in value) || !("slug" in value)) {
    throw new FieldDataError("Missing name or slug");
  }
  if (typeof value.name !== "string") {
    throw new FieldDataError("name must be a string");
  }
  if (typeof value.slug !== "string") {
    throw new FieldDataError("slug must be a string");
  }
  return {
    name: value.name,
    slug: value.slug
  };
}
function parseAsSlugField(value, slug2) {
  if (value === void 0) {
    return {
      name: "",
      slug: slug2
    };
  }
  if (typeof value !== "string") {
    throw new FieldDataError("Must be a string");
  }
  return {
    name: value,
    slug: slug2
  };
}
function slug(_args) {
  var _args$name$validation, _args$name$validation2, _args$name$validation3, _args$name$validation4, _args$name$validation5, _args$slug;
  const args = {
    ..._args,
    name: {
      ..._args.name,
      validation: {
        pattern: (_args$name$validation = _args.name.validation) === null || _args$name$validation === void 0 ? void 0 : _args$name$validation.pattern,
        length: {
          min: Math.max((_args$name$validation2 = _args.name.validation) !== null && _args$name$validation2 !== void 0 && _args$name$validation2.isRequired ? 1 : 0, (_args$name$validation3 = (_args$name$validation4 = _args.name.validation) === null || _args$name$validation4 === void 0 || (_args$name$validation4 = _args$name$validation4.length) === null || _args$name$validation4 === void 0 ? void 0 : _args$name$validation4.min) !== null && _args$name$validation3 !== void 0 ? _args$name$validation3 : 0),
          max: (_args$name$validation5 = _args.name.validation) === null || _args$name$validation5 === void 0 || (_args$name$validation5 = _args$name$validation5.length) === null || _args$name$validation5 === void 0 ? void 0 : _args$name$validation5.max
        }
      }
    }
  };
  const naiveGenerateSlug = ((_args$slug = args.slug) === null || _args$slug === void 0 ? void 0 : _args$slug.generate) || slugify;
  let _defaultValue;
  function defaultValue() {
    if (!_defaultValue) {
      var _args$name$defaultVal, _args$name$defaultVal2;
      _defaultValue = {
        name: (_args$name$defaultVal = args.name.defaultValue) !== null && _args$name$defaultVal !== void 0 ? _args$name$defaultVal : "",
        slug: naiveGenerateSlug((_args$name$defaultVal2 = args.name.defaultValue) !== null && _args$name$defaultVal2 !== void 0 ? _args$name$defaultVal2 : "")
      };
    }
    return _defaultValue;
  }
  function validate(value, {
    slugField
  } = {
    slugField: void 0
  }) {
    var _args$name$validation6, _args$name$validation7, _args$name$validation8, _args$name$validation9, _args$name$validation10, _args$slug$validation, _args$slug2, _args$slug$validation2, _args$slug3, _args$slug$label, _args$slug4, _args$slug5;
    const nameMessage = validateText(value.name, (_args$name$validation6 = (_args$name$validation7 = args.name.validation) === null || _args$name$validation7 === void 0 || (_args$name$validation7 = _args$name$validation7.length) === null || _args$name$validation7 === void 0 ? void 0 : _args$name$validation7.min) !== null && _args$name$validation6 !== void 0 ? _args$name$validation6 : 0, (_args$name$validation8 = (_args$name$validation9 = args.name.validation) === null || _args$name$validation9 === void 0 || (_args$name$validation9 = _args$name$validation9.length) === null || _args$name$validation9 === void 0 ? void 0 : _args$name$validation9.max) !== null && _args$name$validation8 !== void 0 ? _args$name$validation8 : Infinity, args.name.label, void 0, (_args$name$validation10 = args.name.validation) === null || _args$name$validation10 === void 0 ? void 0 : _args$name$validation10.pattern);
    if (nameMessage !== void 0) {
      throw new FieldDataError(nameMessage);
    }
    const slugMessage = validateText(value.slug, (_args$slug$validation = (_args$slug2 = args.slug) === null || _args$slug2 === void 0 || (_args$slug2 = _args$slug2.validation) === null || _args$slug2 === void 0 || (_args$slug2 = _args$slug2.length) === null || _args$slug2 === void 0 ? void 0 : _args$slug2.min) !== null && _args$slug$validation !== void 0 ? _args$slug$validation : 1, (_args$slug$validation2 = (_args$slug3 = args.slug) === null || _args$slug3 === void 0 || (_args$slug3 = _args$slug3.validation) === null || _args$slug3 === void 0 || (_args$slug3 = _args$slug3.length) === null || _args$slug3 === void 0 ? void 0 : _args$slug3.max) !== null && _args$slug$validation2 !== void 0 ? _args$slug$validation2 : Infinity, (_args$slug$label = (_args$slug4 = args.slug) === null || _args$slug4 === void 0 ? void 0 : _args$slug4.label) !== null && _args$slug$label !== void 0 ? _args$slug$label : "Slug", slugField ? slugField : {
      slugs: emptySet2,
      glob: "*"
    }, (_args$slug5 = args.slug) === null || _args$slug5 === void 0 || (_args$slug5 = _args$slug5.validation) === null || _args$slug5 === void 0 ? void 0 : _args$slug5.pattern);
    if (slugMessage !== void 0) {
      throw new FieldDataError(slugMessage);
    }
    return value;
  }
  const emptySet2 = /* @__PURE__ */ new Set();
  return {
    kind: "form",
    formKind: "slug",
    label: args.name.label,
    Input(props) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SlugFieldInput, {
        args,
        naiveGenerateSlug,
        defaultValue: defaultValue(),
        ...props
      });
    },
    defaultValue,
    parse(value, args2) {
      if ((args2 === null || args2 === void 0 ? void 0 : args2.slug) !== void 0) {
        return parseAsSlugField(value, args2.slug);
      }
      return parseSlugFieldAsNormalField(value);
    },
    validate,
    serialize(value) {
      return {
        value
      };
    },
    serializeWithSlug(value) {
      return {
        value: value.name,
        slug: value.slug
      };
    },
    reader: {
      parse(value) {
        const parsed = parseSlugFieldAsNormalField(value);
        return validate(parsed);
      },
      parseWithSlug(value, args2) {
        return validate(parseAsSlugField(value, args2.slug), {
          slugField: {
            glob: args2.glob,
            slugs: emptySet2
          }
        }).name;
      }
    }
  };
}
function isValidURL(url2) {
  return url2 === distExports$1.sanitizeUrl(url2);
}
function validateUrl(validation, value, label) {
  if (value !== null && (typeof value !== "string" || !isValidURL(value))) {
    return `${label} is not a valid URL`;
  }
  if (validation !== null && validation !== void 0 && validation.isRequired && value === null) {
    return `${label} is required`;
  }
}
function url({
  label,
  defaultValue,
  validation,
  description
}) {
  return basicFormFieldWithSimpleReaderParse({
    label,
    Input(props) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(UrlFieldInput, {
        label,
        description,
        validation,
        ...props
      });
    },
    defaultValue() {
      return defaultValue || null;
    },
    parse(value) {
      if (value === void 0) {
        return null;
      }
      if (typeof value !== "string") {
        throw new FieldDataError("Must be a string");
      }
      return value === "" ? null : value;
    },
    validate(value) {
      const message = validateUrl(validation, value, label);
      if (message !== void 0) {
        throw new FieldDataError(message);
      }
      assertRequired(value, validation, label);
      return value;
    },
    serialize(value) {
      return {
        value: value === null ? void 0 : value
      };
    }
  });
}
function ignored() {
  return {
    kind: "form",
    Input() {
      return null;
    },
    defaultValue() {
      return {
        value: void 0
      };
    },
    parse(value) {
      return {
        value
      };
    },
    serialize(value) {
      return value;
    },
    validate(value) {
      return value;
    },
    label: "Ignored",
    reader: {
      parse(value) {
        return value;
      }
    }
  };
}
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  array,
  blocks,
  checkbox,
  child,
  cloudImage,
  conditional,
  date,
  datetime,
  document,
  empty,
  emptyDocument,
  emptyContent,
  file,
  image,
  integer,
  multiRelationship,
  multiselect,
  number,
  object,
  pathReference,
  relationship,
  select,
  slug,
  text,
  url,
  ignored,
  mdx,
  markdoc
});
function assertValidRepoConfig(repo) {
  if (typeof repo === "string") {
    if (!repo.includes("/")) {
      throw new Error(`Invalid repo config: ${repo}. It must be in the form owner/name`);
    }
  }
  if (typeof repo === "object") {
    if (!repo.owner && !repo.name) {
      throw new Error(`Invalid repo config: owner and name are missing`);
    }
    if (!repo.owner) {
      throw new Error(`Invalid repo config: owner is missing`);
    }
    if (!repo.name) {
      throw new Error(`Invalid repo config: name is missing`);
    }
  }
}
function Keystatic(props) {
  if (props.config.storage.kind === "github") {
    assertValidRepoConfig(props.config.storage.repo);
  }
  return null;
}
export {
  Keystatic as K,
  collection as a,
  config as c,
  index as i,
  makeGenericAPIRouteHandler as m,
  singleton as s
};
