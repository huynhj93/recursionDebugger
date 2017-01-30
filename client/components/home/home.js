import React  from 'react';
import CodeMirror from 'react-codemirror';
import mode from '../../../node_modules/codemirror/mode/javascript/javascript.js';
import recast from 'recast';
import parseFunc from '../../../lib/parseFunction';
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
		this.getRecursionCallLine = this.getRecursionCallLine.bind(this);
		this.getFunctionDeclaration = this.getFunctionDeclaration.bind(this);
	};

	componentWillMount(){
		// var s = "function test(){  alert(1); }";

		// //"Register" the function
		// eval(s);

		//Call the function
		// test();
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

	transformCode (e) {
		e.preventDefault();
		const zeroShiftF = this.state.fLineNum - 1;
		const zeroShiftC = this.state.cLineNum - 1;
		const fDeclaration = this.state.codeArr[zeroShiftF];
		const fDeclarationArr = fDeclaration.split('');
		fDeclarationArr.pop();
		fDeclarationArr.pop();
		const stackParam = ', stack){';
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
		var stringTransform = transformCCode.join('');
		//using eval did not work for some reason
		// eval(stringTransform);
		var newCode = document.createElement('script');
		newCode.text = stringTransform;
		document.getElementsByTagName('head')[0].appendChild(newCode);
		console.log(factorial(5));
		this.setState({codeArr: newCodeArr});
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
					<input onChange={this.getRecursionCallLine} type='text' placeholder='What line do you call recursion on?' required></input>
					<button type='submit'>Submit</button>
				</form>
			</div>

		)
	}
}

export default Home;