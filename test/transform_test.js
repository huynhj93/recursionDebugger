import {expect} from 'chai';
import assert from 'assert';
import transform from '../lib/transform.js';
import recast from 'recast';
import types, {namedTypes as n, builders as b} from 'ast-types';
// import pretty from 'jsonpretty';
var pretty = require('js-object-pretty-print').pretty;

// import {namedTypes as n} from 'ast-types';
// import {builders as n} from 'ast-types;'
describe('Transform', () => {
	it('should be a function', () => {
		expect(transform).to.be.instanceof(Function);
	});
	it('should traverse the code properly', () => {
		var code = [
		    "function add(a, b) {",
		    "  return a +",
		    "    // Weird formatting, huh?",
		    "    b;",
		    "}"
		].join("\n");
		var partialFunExpr = { type: "FunctionExpression" };
		console.log('can get field Names!');
		console.log(types.getFieldNames(partialFunExpr,"type"));
		assert(true);
	});
	it('should pass all the tests from the ast-types git hub page', () => {
		var fooId = b.identifier("foo");
		console.log('------------');
		console.log(pretty(fooId));
		var ifFoo = b.ifStatement(fooId, b.blockStatement([
		    b.expressionStatement(b.callExpression(fooId, []))
		]));
		console.log('------');
		console.log(pretty(ifFoo));
		assert.ok(n.IfStatement.check(ifFoo));
		assert.ok(n.Statement.check(ifFoo));
		assert.ok(n.Node.check(ifFoo));

		assert.ok(n.BlockStatement.check(ifFoo.consequent));
		assert.strictEqual(
		    ifFoo.consequent.body[0].expression.arguments.length,
		    0);

		assert.strictEqual(ifFoo.test, fooId);
		assert.ok(n.Expression.check(ifFoo.test));
		assert.ok(n.Identifier.check(ifFoo.test));
		assert.ok(!n.Statement.check(ifFoo.test));
	});
	it('should parse a function', () => {
		var code = [
		    "function add(a, b) {",
		    "  return a +",
		    "    // Weird formatting, huh?",
		    "    b;",
		    "}"
		].join("\n");
		var ast = recast.parse(code);
		var output = recast.prettyPrint(ast, {tabWidth: 2}).code;
		// console.log(output);
		console.log(pretty(ast));
		assert(true);
	});
	it('should convert a function called recurse to have a stack argument', () => {
		var code = [
			'function factorial(num){',
			'	function recurse(num){',
			'		if (num === 1) {',
			'			return 1',
			'		}',
			'		var save = num * recurse(num-1)',
			'		return save',
			'	}',
			'	return recurse(num)',
			'}'
		].join('\n');
		var astCode = recast.parse(code);
		console.log(pretty(astCode));

		// console.log(code);
		console.log('=====================================');
		//wanted something like a queue and a stack property on the state
		var expected = [
			// 'var scope = {stack: []}',
			'function factorial(num){',
			'	function recurse(num,stack,scope){',
			'		scope.stack.push({num:num, stack: stack})',
			'		if (num === 1) {',
			'			return 1',
			'		}',
			'		stack++',
			'		var save = num * recurse(num-1,stack)',
			'		stack--',
			'		return save',
			'	}',
			'	return recurse(num,0,scope)',
			'}'
		].join('\n');
		var astExpected = recast.parse(expected);
		console.log(pretty(astExpected));	
		// console.log(expected);
	});
})
