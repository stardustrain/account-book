import { Schema, TypeID } from "relay-compiler";
import { TypeGeneratorOptions } from "relay-compiler/lib/language/RelayLanguagePluginInterface";
import * as ts from "typescript";
export declare type ScalarTypeMapping = {
    [type: string]: string;
};
export declare type State = {
    generatedFragments: Set<string>;
    generatedInputObjectTypes: {
        [name: string]: ts.TypeNode | "pending";
    };
    matchFields: Map<string, ts.TypeNode>;
    runtimeImports: Set<string>;
    usedEnums: {
        [name: string]: TypeID;
    };
    usedFragments: Set<string>;
} & TypeGeneratorOptions;
export declare function transformScalarType(schema: Schema, type: TypeID, state: State, objectProps?: ts.TypeNode): ts.TypeNode;
export declare function transformInputType(schema: Schema, type: TypeID, state: State): ts.TypeNode;
