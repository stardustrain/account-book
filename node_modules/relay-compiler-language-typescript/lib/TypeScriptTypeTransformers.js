"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformInputType = exports.transformScalarType = void 0;
var ts = require("typescript");
function getInputObjectTypeIdentifier(schema, typeID) {
    return schema.getTypeString(typeID);
}
function transformScalarType(schema, type, state, objectProps) {
    if (schema.isNonNull(type)) {
        return transformNonNullableScalarType(schema, schema.getNullableType(type), state, objectProps);
    }
    else {
        return ts.factory.createUnionTypeNode([
            transformNonNullableScalarType(schema, type, state, objectProps),
            ts.factory.createLiteralTypeNode(ts.factory.createToken(ts.SyntaxKind.NullKeyword)),
        ]);
    }
}
exports.transformScalarType = transformScalarType;
function transformNonNullableScalarType(schema, type, state, objectProps) {
    if (schema.isList(type)) {
        return ts.factory.createTypeReferenceNode(ts.factory.createIdentifier("ReadonlyArray"), [
            transformScalarType(schema, schema.getListItemType(type), state, objectProps),
        ]);
    }
    else if (schema.isObject(type) ||
        schema.isUnion(type) ||
        schema.isInterface(type)) {
        return objectProps;
    }
    else if (schema.isScalar(type)) {
        return transformGraphQLScalarType(schema.getTypeString(type), state);
    }
    else if (schema.isEnum(type)) {
        return transformGraphQLEnumType(schema, schema.assertEnumType(type), state);
    }
    else {
        throw new Error("Could not convert from GraphQL type " + type.toString());
    }
}
function transformGraphQLScalarType(typeName, state) {
    var customType = state.customScalars[typeName];
    switch (customType || typeName) {
        case "ID":
        case "String":
        case "Url":
            return ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
        case "Float":
        case "Int":
            return ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
        case "Boolean":
            return ts.factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);
        default:
            return customType
                ? ts.factory.createTypeReferenceNode(customType, undefined)
                : ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword);
    }
}
function transformGraphQLEnumType(schema, type, state) {
    state.usedEnums[schema.getTypeString(type)] = type;
    return ts.factory.createTypeReferenceNode(ts.factory.createIdentifier(schema.getTypeString(type)), []);
}
function transformInputType(schema, type, state) {
    if (schema.isNonNull(type)) {
        return transformNonNullableInputType(schema, schema.getNullableType(type), state);
    }
    else {
        return ts.factory.createUnionTypeNode([
            transformNonNullableInputType(schema, type, state),
            ts.factory.createLiteralTypeNode(ts.factory.createToken(ts.SyntaxKind.NullKeyword)),
        ]);
    }
}
exports.transformInputType = transformInputType;
function transformNonNullableInputType(schema, type, state) {
    if (schema.isList(type)) {
        return ts.factory.createTypeReferenceNode(ts.factory.createIdentifier("Array"), [transformInputType(schema, schema.getListItemType(type), state)]);
    }
    else if (schema.isScalar(type)) {
        return transformGraphQLScalarType(schema.getTypeString(type), state);
    }
    else if (schema.isEnum(type)) {
        return transformGraphQLEnumType(schema, schema.assertEnumType(type), state);
    }
    else if (schema.isInputObject(type)) {
        var typeIdentifier = getInputObjectTypeIdentifier(schema, type);
        if (state.generatedInputObjectTypes[typeIdentifier]) {
            return ts.factory.createTypeReferenceNode(ts.factory.createIdentifier(typeIdentifier), []);
        }
        state.generatedInputObjectTypes[typeIdentifier] = "pending";
        var fields = schema.getFields(schema.assertInputObjectType(type));
        var props = fields.map(function (fieldID) {
            var fieldType = schema.getFieldType(fieldID);
            var fieldName = schema.getFieldName(fieldID);
            var property = ts.factory.createPropertySignature(undefined, ts.factory.createIdentifier(fieldName), state.optionalInputFields.indexOf(fieldName) >= 0 ||
                !schema.isNonNull(fieldType)
                ? ts.factory.createToken(ts.SyntaxKind.QuestionToken)
                : undefined, transformInputType(schema, fieldType, state));
            return property;
        });
        state.generatedInputObjectTypes[typeIdentifier] = ts.factory.createTypeLiteralNode(props);
        return ts.factory.createTypeReferenceNode(ts.factory.createIdentifier(typeIdentifier), []);
    }
    else {
        throw new Error("Could not convert from GraphQL type " + type.toString());
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHlwZVNjcmlwdFR5cGVUcmFuc2Zvcm1lcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvVHlwZVNjcmlwdFR5cGVUcmFuc2Zvcm1lcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsK0JBQWlDO0FBaUJqQyxTQUFTLDRCQUE0QixDQUFDLE1BQWMsRUFBRSxNQUFjO0lBQ2xFLE9BQU8sTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN0QyxDQUFDO0FBRUQsU0FBZ0IsbUJBQW1CLENBQ2pDLE1BQWMsRUFDZCxJQUFZLEVBQ1osS0FBWSxFQUNaLFdBQXlCO0lBRXpCLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUMxQixPQUFPLDhCQUE4QixDQUNuQyxNQUFNLEVBQ04sTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFDNUIsS0FBSyxFQUNMLFdBQVcsQ0FDWixDQUFDO0tBQ0g7U0FBTTtRQUNMLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQztZQUNwQyw4QkFBOEIsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxXQUFXLENBQUM7WUFDaEUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FDOUIsRUFBRSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FDbEQ7U0FDRixDQUFDLENBQUM7S0FDSjtBQUNILENBQUM7QUFyQkQsa0RBcUJDO0FBRUQsU0FBUyw4QkFBOEIsQ0FDckMsTUFBYyxFQUNkLElBQVksRUFDWixLQUFZLEVBQ1osV0FBeUI7SUFFekIsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ3ZCLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FDdkMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENB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