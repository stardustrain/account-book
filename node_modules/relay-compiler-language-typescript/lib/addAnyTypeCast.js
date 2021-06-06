"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
function addAsAnyToObjectLiterals(oldSource) {
    function transformer(context) {
        return function transform(rootNode) {
            function visit(node) {
                if (node.kind === ts.SyntaxKind.ObjectLiteralExpression) {
                    return ts.factory.createAsExpression(node, ts.factory.createTypeReferenceNode("any", []));
                }
                return ts.visitEachChild(node, visit, context);
            }
            return ts.visitNode(rootNode, visit);
        };
    }
    var source = ts.createSourceFile("", oldSource, ts.ScriptTarget.ES2015, true, ts.ScriptKind.TS);
    var result = ts.transform(source, [transformer]);
    var printer = ts.createPrinter({
        newLine: ts.NewLineKind.LineFeed,
    });
    return printer.printFile(result.transformed[0]);
}
exports.default = addAsAnyToObjectLiterals;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkQW55VHlwZUNhc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYWRkQW55VHlwZUNhc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBaUM7QUFFakMsU0FBd0Isd0JBQXdCLENBQUMsU0FBaUI7SUFDaEUsU0FBUyxXQUFXLENBQW9CLE9BQWlDO1FBQ3ZFLE9BQU8sU0FBUyxTQUFTLENBQUMsUUFBVztZQUNuQyxTQUFTLEtBQUssQ0FBQyxJQUFhO2dCQUMxQixJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyx1QkFBdUIsRUFBRTtvQkFDdkQsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUNsQyxJQUFxQixFQUNyQixFQUFFLENBQUMsT0FBTyxDQUFDLHVCQUF1QixDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FDOUMsQ0FBQztpQkFDSDtnQkFDRCxPQUFPLEVBQUUsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNqRCxDQUFDO1lBQ0QsT0FBTyxFQUFFLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN2QyxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQsSUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixDQUNoQyxFQUFFLEVBQ0YsU0FBUyxFQUNULEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUN0QixJQUFJLEVBQ0osRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQ2pCLENBQUM7SUFFRixJQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFFbkQsSUFBTSxPQUFPLEdBQWUsRUFBRSxDQUFDLGFBQWEsQ0FBQztRQUMzQyxPQUFPLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxRQUFRO0tBQ2pDLENBQUMsQ0FBQztJQUNILE9BQU8sT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBa0IsQ0FBQyxDQUFDO0FBQ25FLENBQUM7QUE5QkQsMkNBOEJDIn0=