import React  from 'react';
import CodeMirror from 'react-codemirror';
// have to deploy to see if this works 
import mode from '../../../node_modules/codemirror/mode/javascript/javascript.js';
import recast from 'recast';
class Home extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			code: '',
			fLineNum: null,
			cLineNum: null,
			transformCode: '',
		};
		this.logState = this.logState.bind(this);
		this.updateCode = this.updateCode.bind(this);
		this.transformCode = this.transformCode.bind(this);
		this.getRecursionInvokedLine = this.getRecursionInvokedLine.bind(this);
		this.getRecursionCallLine = this.getRecursionCallLine.bind(this);
		this.getFunctionDeclaration = this.getFunctionDeclaration.bind(this);
	};

	logState () {
		console.log('this is state', this.state);
	};

	updateCode (newCode) {
		//In Chrome, the newLine char is an arrow
		this.setState({code: newCode});
		const ast = recast.parse(newCode);
		const output = recast.print(ast).code;
		const codeArr = output.split('\n');
		this.setState({codeArr: codeArr});
	};
	//function declaration line number
	getFunctionDeclaration (event) {
		this.setState({fLineNum: Number(event.target.value)});
	}; 
	//call line number
	getRecursionCallLine (event) {
		this.setState({cLineNum: Number(event.target.value)});
	};
	getRecursionInvokedLine (event) {
		this.setState({iLineNum: Number(event.target.value)});
	};
	getWhiteSpace (string) {
		var res = '';
		for (var i = 0; i < string.length; i++) {
			if (string[i] === ' ') {
				res+= string[i]
			} else {
				break;
			}
		}
		return res;
	};

	getParams (arr) {
		const res = [];
		for (let i = arr.length - 1; i >= 0; i--) {
			if (arr[i] === '(') {
				break;
			}
			res.push(arr[i])
		}
		const revArr = [];
		for (let i = res.length - 1; i >= 0; i--) {
			revArr.push(res[i]);
		}
		const params = [];
		var param = '';
		for (let i = 0; i < revArr.length; i++) {
			if (revArr[i] === ',') {
				params.push(param);
				param = '';
			} else if (i === revArr.length -1) {
				param += revArr[i];
				params.push(param);
			} else if (revArr[i] === ' ') {
				continue;
			} else {
				param += revArr[i];
			}
		}
 		return params;
	};

	transformCode (e) {
		e.preventDefault();
		const zeroShiftF = this.state.fLineNum - 1;
		const zeroShiftC = this.state.cLineNum - 1;
		const fDeclaration = this.state.codeArr[zeroShiftF];
		const fDeclarationArr = fDeclaration.split('');
		while (fDeclarationArr[fDeclarationArr.length - 1] === '{' || fDeclarationArr[fDeclarationArr.length - 1] === ')' || fDeclarationArr[fDeclarationArr.length - 1] === ' ') {
			fDeclarationArr.pop();
		}
		console.log(fDeclarationArr.join(''));
		const params = this.getParams(fDeclarationArr);
		console.log('params is:', params);
		const stackParam = ', stack, state){';
		const stackArr = stackParam.split('');
		const transformFDeclaration = fDeclarationArr.concat(stackArr);
		const newCodeArr = this.state.codeArr;
		newCodeArr[zeroShiftF] = transformFDeclaration.join('');
		const incrementStackSans = 'stack++;';
		const decrementStackSans = 'stack--;';
		const cDeclaration = this.state.codeArr[zeroShiftC];
		const whiteSpace = this.getWhiteSpace(cDeclaration);
		const incrementStack = whiteSpace + incrementStackSans;
		const decrementStack = whiteSpace + decrementStackSans;
		const beforeRecurseCall = newCodeArr.slice(0,zeroShiftC);
		beforeRecurseCall.push(incrementStack);
		const afterRecurseCall = this.state.codeArr.slice(zeroShiftC);
		afterRecurseCall.splice(1, 0, decrementStack);
		const transformCCode = beforeRecurseCall.concat(afterRecurseCall);
		const stringCTranform = transformCCode.join('');
		const beforeRecurseDeclaration = transformCCode.slice(0, zeroShiftF + 1);
		const afterRecurseDeclaration = transformCCode.slice(zeroShiftF + 1);
		console.log(beforeRecurseDeclaration);
		console.log(afterRecurseDeclaration);
		const stackInsert = whiteSpace + 'var callStack = {};';
		const stackDefine1 = whiteSpace + 'for (var q = 0; q < arguments.length; q++) {';
		const stackDefine2 = whiteSpace + '	callStack[arguments[q]] = arguments[q];';
		const stackDefine3 = whiteSpace + '}';
		const stackDefine4 = whiteSpace + 'callStack["stack"] = stack;';
		const pushStack = whiteSpace + 'state.callStack.push(callStack);';
		console.log(stackInsert);
		console.log(stackDefine1);
		console.log(pushStack);
		beforeRecurseDeclaration.push(stackInsert);
		beforeRecurseDeclaration.push(stackDefine1);
		beforeRecurseDeclaration.push(stackDefine2);
		beforeRecurseDeclaration.push(stackDefine3);
		beforeRecurseDeclaration.push(stackDefine4);
		beforeRecurseDeclaration.push(pushStack);
		console.log(beforeRecurseDeclaration);
		const finalTransform = beforeRecurseDeclaration.concat(afterRecurseDeclaration);
		console.log(finalTransform.join('\n'));
		// beforeRecurseDeclaration.push(whiteSpace + 'state.callStack.push(params[i])');
		//using eval did not work for some reason
		// eval(stringCTranform);
		const newCode = document.createElement('script');
		newCode.text = stringCTranform;
		document.getElementsByTagName('head')[0].appendChild(newCode);
		console.log(factorial(5));
		this.setState({codeArr: transformCCode});
	};

	render () {
		const options = {
			mode: 'javascript',
			lineNumbers: true
		};
		return (
			<div onClick={this.logState}>
				<CodeMirror value={this.state.code} onChange={this.updateCode} options={options} />
				<form onSubmit={this.transformCode}>
					<input onChange={this.getFunctionDeclaration} type='text' placeholder='What line do you declare your function recurse?' required></input>
					<input onChange={this.getRecursionCallLine} type='text' placeholder='What line in your recursion function do you call recurse on?' required></input>
					<input onChange={this.getRecursionInvokedLine} type='text' placeholder='What line do you initiate your recurse function?' required></input>
					<button type='submit'>Submit</button>
				</form>
			</div>

		)
	}
}

export default Home;