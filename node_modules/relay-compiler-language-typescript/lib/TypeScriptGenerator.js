"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transforms = exports.generate = void 0;
var relay_compiler_1 = require("relay-compiler");
var FlattenTransform = require("relay-compiler/lib/transforms/FlattenTransform");
var MaskTransform = require("relay-compiler/lib/transforms/MaskTransform");
var MatchTransform = require("relay-compiler/lib/transforms/MatchTransform");
var RefetchableFragmentTransform = require("relay-compiler/lib/transforms/RefetchableFragmentTransform");
var RelayDirectiveTransform = require("relay-compiler/lib/transforms/RelayDirectiveTransform");
var ts = require("typescript");
var TypeScriptTypeTransformers_1 = require("./TypeScriptTypeTransformers");
var REF_TYPE = " $refType";
var FRAGMENT_REFS = " $fragmentRefs";
var DATA_REF = " $data";
var FRAGMENT_REFS_TYPE_NAME = "FragmentRefs";
var DIRECTIVE_NAME = "raw_response_type";
var generate = function (schema, node, options) {
    var ast = aggregateRuntimeImports(relay_compiler_1.IRVisitor.visit(node, createVisitor(schema, options)));
    var printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
    var resultFile = ts.createSourceFile("graphql-def.ts", "", ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
    var fullProgramAst = ts.factory.updateSourceFile(resultFile, ast);
    return printer.printNode(ts.EmitHint.SourceFile, fullProgramAst, resultFile);
};
exports.generate = generate;
function aggregateRuntimeImports(ast) {
    var importNodes = ast.filter(function (declaration) {
        return ts.isImportDeclaration(declaration);
    });
    var runtimeImports = importNodes.filter(function (importDeclaration) {
        return importDeclaration.moduleSpecifier.text ===
            "relay-runtime";
    });
    if (runtimeImports.length > 1) {
        var namedImports_1 = [];
        runtimeImports.map(function (node) {
            node.importClause.namedBindings.elements.map(function (element) {
                namedImports_1.push(element.name.text);
            });
        });
        var importSpecifiers_1 = [];
        namedImports_1.map(function (namedImport) {
            var specifier = ts.factory.createImportSpecifier(undefined, ts.factory.createIdentifier(namedImport));
            importSpecifiers_1.push(specifier);
        });
        var namedBindings = ts.createNamedImports(importSpecifiers_1);
        var aggregatedRuntimeImportDeclaration = ts.createImportDeclaration(undefined, undefined, ts.factory.createImportClause(false, undefined, namedBindings), ts.factory.createStringLiteral("relay-runtime"));
        var aggregatedRuntimeImportAST = ast.reduce(function (prev, curr) {
            if (!ts.isImportDeclaration(curr))
                prev.push(curr);
            return prev;
        }, [aggregatedRuntimeImportDeclaration]);
        return aggregatedRuntimeImportAST;
    }
    else {
        return ast;
    }
}
function nullThrows(obj) {
    if (obj == null) {
        throw new Error("Obj is null");
    }
    return obj;
}
function makeProp(schema, selection, state, unmasked, concreteType) {
    var value = selection.value;
    var key = selection.key, schemaName = selection.schemaName, conditional = selection.conditional, nodeType = selection.nodeType, nodeSelections = selection.nodeSelections;
    if (schemaName === "__typename" && concreteType) {
        value = ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(concreteType));
    }
    else if (nodeType) {
        value = TypeScriptTypeTransformers_1.transformScalarType(schema, nodeType, state, selectionsToAST(schema, [Array.from(nullThrows(nodeSelections).values())], state, unmasked));
    }
    var typeProperty = objectTypeProperty(key, value, {
        optional: conditional,
    });
    return typeProperty;
}
var isTypenameSelection = function (selection) {
    return selection.schemaName === "__typename";
};
var hasTypenameSelection = function (selections) {
    return selections.some(isTypenameSelection);
};
var onlySelectsTypename = function (selections) {
    return selections.every(isTypenameSelection);
};
function selectionsToAST(schema, selections, state, unmasked, fragmentTypeName) {
    var baseFields = new Map();
    var byConcreteType = {};
    flattenArray(selections).forEach(function (selection) {
        var concreteType = selection.concreteType;
        if (concreteType) {
            byConcreteType[concreteType] = byConcreteType[concreteType] || [];
            byConcreteType[concreteType].push(selection);
        }
        else {
            var previousSel = baseFields.get(selection.key);
            baseFields.set(selection.key, previousSel ? mergeSelection(selection, previousSel) : selection);
        }
    });
    var types = [];
    if (Object.keys(byConcreteType).length > 0 &&
        onlySelectsTypename(Array.from(baseFields.values())) &&
        (hasTypenameSelection(Array.from(baseFields.values())) ||
            Object.keys(byConcreteType).every(function (type) {
                return hasTypenameSelection(byConcreteType[type]);
            }))) {
        var typenameAliases_1 = new Set();
        var _loop_1 = function (concreteType) {
            types.push(groupRefs(__spreadArray(__spreadArray([], __read(Array.from(baseFields.values()))), __read(byConcreteType[concreteType]))).map(function (selection) {
                if (selection.schemaName === "__typename") {
                    typenameAliases_1.add(selection.key);
                }
                return makeProp(schema, selection, state, unmasked, concreteType);
            }));
        };
        for (var concreteType in byConcreteType) {
            _loop_1(concreteType);
        }
        // It might be some other type then the listed concrete types. Ideally, we
        // would set the type to diff(string, set of listed concrete types), but
        // this doesn't exist in Flow at the time.
        types.push(Array.from(typenameAliases_1).map(function (typenameAlias) {
            var otherProp = objectTypeProperty(typenameAlias, ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral("%other")));
            var otherPropWithComment = ts.addSyntheticLeadingComment(otherProp, ts.SyntaxKind.MultiLineCommentTrivia, "This will never be '%other', but we need some\n" +
                "value in case none of the concrete values match.", true);
            return otherPropWithComment;
        }));
    }
    else {
        var selectionMap = selectionsToMap(Array.from(baseFields.values()));
        for (var concreteType in byConcreteType) {
            selectionMap = mergeSelections(selectionMap, selectionsToMap(byConcreteType[concreteType].map(function (sel) { return (__assign(__assign({}, sel), { conditional: true })); })));
        }
        var selectionMapValues = groupRefs(Array.from(selectionMap.values())).map(function (sel) {
            return isTypenameSelection(sel) && sel.concreteType
                ? makeProp(schema, __assign(__assign({}, sel), { conditional: false }), state, unmasked, sel.concreteType)
                : makeProp(schema, sel, state, unmasked);
        });
        types.push(selectionMapValues);
    }
    var typeElements = types.map(function (props) {
        if (fragmentTypeName) {
            props.push(objectTypeProperty(REF_TYPE, ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(fragmentTypeName))));
        }
        return unmasked
            ? ts.factory.createTypeLiteralNode(props)
            : exactObjectTypeAnnotation(props);
    });
    if (typeElements.length === 1) {
        return typeElements[0];
    }
    return ts.factory.createUnionTypeNode(typeElements);
}
// We don't have exact object types in typescript.
function exactObjectTypeAnnotation(properties) {
    return ts.factory.createTypeLiteralNode(properties);
}
var idRegex = /^[$a-zA-Z_][$a-z0-9A-Z_]*$/;
function objectTypeProperty(propertyName, type, options) {
    if (options === void 0) { options = {}; }
    var optional = options.optional, _a = options.readonly, readonly = _a === void 0 ? true : _a;
    var modifiers = readonly
        ? [ts.factory.createToken(ts.SyntaxKind.ReadonlyKeyword)]
        : undefined;
    return ts.factory.createPropertySignature(modifiers, idRegex.test(propertyName)
        ? ts.factory.createIdentifier(propertyName)
        : ts.factory.createStringLiteral(propertyName), optional ? ts.factory.createToken(ts.SyntaxKind.QuestionToken) : undefined, type);
}
function mergeSelection(a, b, shouldSetConditional) {
    if (shouldSetConditional === void 0) { shouldSetConditional = true; }
    if (!a) {
        if (shouldSetConditional) {
            return __assign(__assign({}, b), { conditional: true });
        }
        return b;
    }
    return __assign(__assign({}, a), { nodeSelections: a.nodeSelections
            ? mergeSelections(a.nodeSelections, nullThrows(b.nodeSelections), shouldSetConditional)
            : null, conditional: a.conditional && b.conditional });
}
function mergeSelections(a, b, shouldSetConditional) {
    var e_1, _a, e_2, _b;
    if (shouldSetConditional === void 0) { shouldSetConditional = true; }
    var merged = new Map();
    try {
        for (var _c = __values(Array.from(a.entries())), _d = _c.next(); !_d.done; _d = _c.next()) {
            var _e = __read(_d.value, 2), key = _e[0], value = _e[1];
            merged.set(key, value);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        }
        finally { if (e_1) throw e_1.error; }
    }
    try {
        for (var _f = __values(Array.from(b.entries())), _g = _f.next(); !_g.done; _g = _f.next()) {
            var _h = __read(_g.value, 2), key = _h[0], value = _h[1];
            merged.set(key, mergeSelection(a.get(key), value, shouldSetConditional));
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return merged;
}
function isPlural(node) {
    return Boolean(node.metadata && node.metadata.plural);
}
function exportType(name, type) {
    return ts.factory.createTypeAliasDeclaration(undefined, [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)], ts.factory.createIdentifier(name), undefined, type);
}
function importTypes(names, fromModule) {
    return (names &&
        ts.factory.createImportDeclaration(undefined, undefined, ts.factory.createImportClause(false, undefined, ts.factory.createNamedImports(names.map(function (name) {
            return ts.factory.createImportSpecifier(undefined, ts.factory.createIdentifier(name));
        }))), ts.factory.createStringLiteral(fromModule)));
}
function createVisitor(schema, options) {
    var state = {
        customScalars: options.customScalars,
        enumsHasteModule: options.enumsHasteModule,
        existingFragmentNames: options.existingFragmentNames,
        generatedFragments: new Set(),
        generatedInputObjectTypes: {},
        optionalInputFields: options.optionalInputFields,
        usedEnums: {},
        usedFragments: new Set(),
        useHaste: options.useHaste,
        useSingleArtifactDirectory: options.useSingleArtifactDirectory,
        noFutureProofEnums: options.noFutureProofEnums,
        matchFields: new Map(),
        runtimeImports: new Set(),
    };
    return {
        leave: {
            Root: function (node) {
                var e_3, _a;
                var inputVariablesType = generateInputVariablesType(schema, node, state);
                var inputObjectTypes = generateInputObjectTypes(state);
                var responseType = exportType(node.name + "Response", selectionsToAST(schema, 
                /* $FlowFixMe: selections have already been transformed */
                node.selections, state, false));
                var operationTypes = [
                    objectTypeProperty("response", ts.factory.createTypeReferenceNode(responseType.name, undefined)),
                    objectTypeProperty("variables", ts.factory.createTypeReferenceNode(inputVariablesType.name, undefined)),
                ];
                // Generate raw response type
                var rawResponseType;
                var normalizationIR = options.normalizationIR;
                if (normalizationIR &&
                    node.directives.some(function (d) { return d.name === DIRECTIVE_NAME; })) {
                    rawResponseType = relay_compiler_1.IRVisitor.visit(normalizationIR, createRawResponseTypeVisitor(schema, state));
                }
                var nodes = [];
                if (state.runtimeImports.size) {
                    nodes.push(importTypes(Array.from(state.runtimeImports).sort(), "relay-runtime"));
                }
                nodes.push.apply(nodes, __spreadArray(__spreadArray(__spreadArray(__spreadArray([], __read(getFragmentRefsTypeImport(state))), __read(getEnumDefinitions(schema, state))), __read(inputObjectTypes)), [inputVariablesType,
                    responseType]));
                if (rawResponseType) {
                    try {
                        for (var _b = __values(state.matchFields), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var _d = __read(_c.value, 2), key = _d[0], ast = _d[1];
                            nodes.push(exportType(key, ast));
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                    operationTypes.push(objectTypeProperty("rawResponse", ts.factory.createTypeReferenceNode(node.name + "RawResponse", undefined)));
                    nodes.push(rawResponseType);
                }
                nodes.push(exportType(node.name, exactObjectTypeAnnotation(operationTypes)));
                return nodes;
            },
            Fragment: function (node) {
                var flattenedSelections = flattenArray(
                /* $FlowFixMe: selections have already been transformed */
                node.selections);
                var numConcreteSelections = flattenedSelections.filter(function (s) { return s.concreteType; }).length;
                var selections = flattenedSelections.map(function (selection) {
                    if (numConcreteSelections <= 1 &&
                        isTypenameSelection(selection) &&
                        !schema.isAbstractType(node.type)) {
                        return [
                            __assign(__assign({}, selection), { concreteType: schema.getTypeString(node.type) }),
                        ];
                    }
                    return [selection];
                });
                state.generatedFragments.add(node.name);
                var dataTypeName = getDataTypeName(node.name);
                var dataType = ts.factory.createTypeReferenceNode(node.name, undefined);
                var refTypeName = getRefTypeName(node.name);
                var refTypeDataProperty = objectTypeProperty(DATA_REF, ts.factory.createTypeReferenceNode(dataTypeName, undefined), { optional: true });
                var refTypeFragmentRefProperty = objectTypeProperty(FRAGMENT_REFS, ts.factory.createTypeReferenceNode(FRAGMENT_REFS_TYPE_NAME, [
                    ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(node.name)),
                ]));
                var isPluralFragment = isPlural(node);
                var refType = exactObjectTypeAnnotation([
                    refTypeDataProperty,
                    refTypeFragmentRefProperty,
                ]);
                var unmasked = node.metadata != null && node.metadata.mask === false;
                var baseType = selectionsToAST(schema, selections, state, unmasked, unmasked ? undefined : node.name);
                var type = isPlural(node)
                    ? ts.factory.createTypeReferenceNode(ts.factory.createIdentifier("ReadonlyArray"), [baseType])
                    : baseType;
                state.runtimeImports.add("FragmentRefs");
                return __spreadArray(__spreadArray([
                    importTypes(Array.from(state.runtimeImports).sort(), "relay-runtime")
                ], __read(getEnumDefinitions(schema, state))), [
                    exportType(node.name, type),
                    exportType(dataTypeName, dataType),
                    exportType(refTypeName, isPluralFragment
                        ? ts.factory.createTypeReferenceNode(ts.factory.createIdentifier("ReadonlyArray"), [refType])
                        : refType),
                ]);
            },
            InlineFragment: function (node) {
                return flattenArray(
                /* $FlowFixMe: selections have already been transformed */
                node.selections).map(function (typeSelection) {
                    return schema.isAbstractType(node.typeCondition)
                        ? __assign(__assign({}, typeSelection), { conditional: true }) : __assign(__assign({}, typeSelection), { concreteType: schema.getTypeString(node.typeCondition) });
                });
            },
            Condition: function (node) {
                return flattenArray(
                /* $FlowFixMe: selections have already been transformed */
                node.selections).map(function (selection) {
                    return __assign(__assign({}, selection), { conditional: true });
                });
            },
            // TODO: Why not inline it like others?
            ScalarField: function (node) {
                return visitScalarField(schema, node, state);
            },
            LinkedField: visitLinkedField,
            ModuleImport: function (node) {
                return [
                    {
                        key: "__fragmentPropName",
                        conditional: true,
                        value: TypeScriptTypeTransformers_1.transformScalarType(schema, schema.expectStringType(), state),
                    },
                    {
                        key: "__module_component",
                        conditional: true,
                        value: TypeScriptTypeTransformers_1.transformScalarType(schema, schema.expectStringType(), state),
                    },
                    {
                        key: "__fragments_" + node.name,
                        ref: node.name,
                    },
                ];
            },
            FragmentSpread: function (node) {
                state.usedFragments.add(node.name);
                return [
                    {
                        key: "__fragments_" + node.name,
                        ref: node.name,
                    },
                ];
            },
        },
    };
}
function visitScalarField(schema, node, state) {
    return [
        {
            key: node.alias || node.name,
            schemaName: node.name,
            value: TypeScriptTypeTransformers_1.transformScalarType(schema, node.type, state),
        },
    ];
}
function visitLinkedField(node) {
    return [
        {
            key: node.alias || node.name,
            schemaName: node.name,
            nodeType: node.type,
            nodeSelections: selectionsToMap(flattenArray(
            /* $FlowFixMe: selections have already been transformed */
            node.selections), 
            /*
             * append concreteType to key so overlapping fields with different
             * concreteTypes don't get overwritten by each other
             */
            true),
        },
    ];
}
function makeRawResponseProp(schema, _a, state, concreteType) {
    var key = _a.key, schemaName = _a.schemaName, value = _a.value, conditional = _a.conditional, nodeType = _a.nodeType, nodeSelections = _a.nodeSelections, kind = _a.kind;
    if (kind === "ModuleImport") {
        // TODO: In flow one can extend an object type with spread, with TS we need an intersection (&)
        // return ts.createSpread(ts.createIdentifier(key));
        throw new Error("relay-compiler-language-typescript does not support @module yet");
    }
    if (schemaName === "__typename" && concreteType) {
        value = ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(concreteType));
    }
    else if (nodeType) {
        value = TypeScriptTypeTransformers_1.transformScalarType(schema, nodeType, state, selectionsToRawResponseBabel(schema, [Array.from(nullThrows(nodeSelections).values())], state, schema.isAbstractType(nodeType) || schema.isWrapper(nodeType)
            ? null
            : schema.getTypeString(nodeType)));
    }
    var typeProperty = objectTypeProperty(key, value, {
        optional: conditional,
    });
    return typeProperty;
}
function selectionsToMap(selections, appendType) {
    var map = new Map();
    selections.forEach(function (selection) {
        var key = appendType && selection.concreteType
            ? selection.key + "::" + selection.concreteType
            : selection.key;
        var previousSel = map.get(key);
        map.set(key, previousSel ? mergeSelection(previousSel, selection) : selection);
    });
    return map;
}
// Transform the codegen IR selections into TS types
function selectionsToRawResponseBabel(schema, selections, state, nodeTypeName) {
    var baseFields = [];
    var byConcreteType = {};
    flattenArray(selections).forEach(function (selection) {
        var concreteType = selection.concreteType;
        if (concreteType) {
            byConcreteType[concreteType] = byConcreteType[concreteType] || [];
            byConcreteType[concreteType].push(selection);
        }
        else {
            baseFields.push(selection);
        }
    });
    var types = [];
    if (Object.keys(byConcreteType).length) {
        var baseFieldsMap = selectionsToMap(baseFields);
        var _loop_2 = function (concreteType) {
            var mergedSelections = Array.from(mergeSelections(baseFieldsMap, selectionsToMap(byConcreteType[concreteType]), false).values());
            types.push(exactObjectTypeAnnotation(mergedSelections.map(function (selection) {
                return makeRawResponseProp(schema, selection, state, concreteType);
            })));
            appendLocal3DPayload(types, mergedSelections, schema, state, concreteType);
        };
        for (var concreteType in byConcreteType) {
            _loop_2(concreteType);
        }
    }
    if (baseFields.length > 0) {
        types.push(exactObjectTypeAnnotation(baseFields.map(function (selection) {
            return makeRawResponseProp(schema, selection, state, nodeTypeName);
        })));
        appendLocal3DPayload(types, baseFields, schema, state, nodeTypeName);
    }
    return ts.factory.createUnionTypeNode(types);
}
function appendLocal3DPayload(types, selections, schema, state, currentType) {
    var moduleImport = selections.find(function (sel) { return sel.kind === "ModuleImport"; });
    if (moduleImport) {
        // Generate an extra opaque type for client 3D fields
        state.runtimeImports.add("Local3DPayload");
        types.push(ts.factory.createTypeReferenceNode(ts.factory.createIdentifier("Local3DPayload"), [
            stringLiteralTypeAnnotation(moduleImport.documentName),
            exactObjectTypeAnnotation(selections
                .filter(function (sel) { return sel.schemaName !== "js"; })
                .map(function (selection) {
                return makeRawResponseProp(schema, selection, state, currentType);
            })),
        ]));
    }
}
// Visitor for generating raw response type
function createRawResponseTypeVisitor(schema, state) {
    return {
        leave: {
            Root: function (node) {
                return exportType(node.name + "RawResponse", selectionsToRawResponseBabel(schema, 
                /* $FlowFixMe: selections have already been transformed */
                node.selections, state, null));
            },
            InlineFragment: function (node) {
                var typeCondition = node.typeCondition;
                return flattenArray(
                /* $FlowFixMe: selections have already been transformed */
                node.selections).map(function (typeSelection) {
                    return schema.isAbstractType(typeCondition)
                        ? typeSelection
                        : __assign(__assign({}, typeSelection), { concreteType: schema.getTypeString(typeCondition) });
                });
            },
            ScalarField: function (node) {
                return visitScalarField(schema, node, state);
            },
            ClientExtension: function (node) {
                return flattenArray(
                /* $FlowFixMe: selections have already been transformed */
                node.selections).map(function (sel) { return (__assign(__assign({}, sel), { conditional: true })); });
            },
            LinkedField: visitLinkedField,
            Condition: function (node) {
                return flattenArray(
                /* $FlowFixMe: selections have already been transformed */
                node.selections);
            },
            Defer: function (node) {
                return flattenArray(
                /* $FlowFixMe: selections have already been transformed */
                node.selections);
            },
            Stream: function (node) {
                return flattenArray(
                /* $FlowFixMe: selections have already been transformed */
                node.selections);
            },
            ModuleImport: function (node) {
                return visitRawResponseModuleImport(schema, node, state);
            },
            FragmentSpread: function (_node) {
                throw new Error("A fragment spread is found when traversing the AST, " +
                    "make sure you are passing the codegen IR");
            },
        },
    };
}
// Dedupe the generated type of module selections to reduce file size
function visitRawResponseModuleImport(schema, node, state) {
    var selections = node.selections, key = node.name;
    var moduleSelections = selections
        .filter(function (sel) { return sel.length && sel[0].schemaName === "js"; })
        .map(function (arr) { return arr[0]; });
    if (!state.matchFields.has(key)) {
        var ast = selectionsToRawResponseBabel(schema, node.selections.filter(function (sel) { return sel.length > 1 || sel[0].schemaName !== "js"; }), state, null);
        state.matchFields.set(key, ast);
    }
    return __spreadArray(__spreadArray([], __read(moduleSelections)), [
        {
            key: key,
            kind: "ModuleImport",
            documentName: node.documentName,
        },
    ]);
}
function flattenArray(arrayOfArrays) {
    var result = [];
    arrayOfArrays.forEach(function (array) { return result.push.apply(result, __spreadArray([], __read(array))); });
    return result;
}
function generateInputObjectTypes(state) {
    return Object.keys(state.generatedInputObjectTypes).map(function (typeIdentifier) {
        var inputObjectType = state.generatedInputObjectTypes[typeIdentifier];
        if (inputObjectType === "pending") {
            throw new Error("TypeScriptGenerator: Expected input object type to have been" +
                " defined before calling `generateInputObjectTypes`");
        }
        else {
            return exportType(typeIdentifier, inputObjectType);
        }
    });
}
function generateInputVariablesType(schema, node, state) {
    return exportType(node.name + "Variables", exactObjectTypeAnnotation(node.argumentDefinitions.map(function (arg) {
        return objectTypeProperty(arg.name, TypeScriptTypeTransformers_1.transformInputType(schema, arg.type, state), { readonly: false, optional: !schema.isNonNull(arg.type) });
    })));
}
function groupRefs(props) {
    var result = [];
    var refs = [];
    props.forEach(function (prop) {
        if (prop.ref) {
            refs.push(prop.ref);
        }
        else {
            result.push(prop);
        }
    });
    if (refs.length > 0) {
        var refTypes = ts.factory.createUnionTypeNode(refs.map(function (ref) {
            return ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(ref));
        }));
        result.push({
            key: FRAGMENT_REFS,
            conditional: false,
            value: ts.factory.createTypeReferenceNode(FRAGMENT_REFS_TYPE_NAME, [
                refTypes,
            ]),
        });
    }
    return result;
}
function getFragmentRefsTypeImport(state) {
    if (state.usedFragments.size > 0) {
        return [
            ts.factory.createImportDeclaration(undefined, undefined, ts.factory.createImportClause(false, undefined, ts.factory.createNamedImports([
                ts.factory.createImportSpecifier(undefined, ts.factory.createIdentifier("FragmentRefs")),
            ])), ts.factory.createStringLiteral("relay-runtime")),
        ];
    }
    return [];
}
function getEnumDefinitions(schema, _a) {
    var enumsHasteModule = _a.enumsHasteModule, usedEnums = _a.usedEnums, noFutureProofEnums = _a.noFutureProofEnums;
    var enumNames = Object.keys(usedEnums).sort();
    if (enumNames.length === 0) {
        return [];
    }
    if (typeof enumsHasteModule === "string") {
        return [importTypes(enumNames, enumsHasteModule)];
    }
    if (typeof enumsHasteModule === "function") {
        return enumNames.map(function (enumName) {
            return importTypes([enumName], enumsHasteModule(enumName));
        });
    }
    return enumNames.map(function (name) {
        var values = __spreadArray([], __read(schema.getEnumValues(usedEnums[name])));
        values.sort();
        if (!noFutureProofEnums) {
            values.push("%future added value");
        }
        return exportType(name, ts.factory.createUnionTypeNode(values.map(function (value) { return stringLiteralTypeAnnotation(value); })));
    });
}
function stringLiteralTypeAnnotation(name) {
    return ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(name));
}
function getRefTypeName(name) {
    return name + "$key";
}
function getDataTypeName(name) {
    return name + "$data";
}
// Should match FLOW_TRANSFORMS array
// https://github.com/facebook/relay/blob/v10.0.0/packages/relay-compiler/language/javascript/RelayFlowGenerator.js#L982
exports.transforms = [
    RelayDirectiveTransform.transform,
    MaskTransform.transform,
    MatchTransform.transform,
    FlattenTransform.transformWithOptions({}),
    RefetchableFragmentTransform.transform,
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHlwZVNjcmlwdEdlbmVyYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9UeXBlU2NyaXB0R2VuZXJhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpREFVd0I7QUFFeEIsaUZBQW1GO0FBQ25GLDJFQUE2RTtBQUM3RSw2RUFBK0U7QUFDL0UseUdBQTJHO0FBQzNHLCtGQUFpRztBQUNqRywrQkFBaUM7QUFDakMsMkVBSXNDO0FBaUJ0QyxJQUFNLFFBQVEsR0FBRyxXQUFXLENBQUM7QUFDN0IsSUFBTSxhQUFhLEdBQUcsZ0JBQWdCLENBQUM7QUFDdkMsSUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDO0FBQzFCLElBQU0sdUJBQXVCLEdBQUcsY0FBYyxDQUFDO0FBQy9DLElBQU0sY0FBYyxHQUFHLG1CQUFtQixDQUFDO0FBRXBDLElBQU0sUUFBUSxHQUE4QixVQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTztJQUN2RSxJQUFNLEdBQUcsR0FBbUIsdUJBQXVCLENBQ2pELDBCQUFTLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQ3RELENBQUM7SUFFRixJQUFNLE9BQU8sR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztJQUV2RSxJQUFNLFVBQVUsR0FBRyxFQUFFLENBQUMsZ0JBQWdCLENBQ3BDLGdCQUFnQixFQUNoQixFQUFFLEVBQ0YsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQ3RCLEtBQUssRUFDTCxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FDakIsQ0FBQztJQUVGLElBQU0sY0FBYyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxF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