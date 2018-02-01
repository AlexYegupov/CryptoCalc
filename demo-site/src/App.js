import React from 'react';
//import PropTypes from 'prop-types';
import logo from './logo.svg';
import './App.css';
import math from 'mathjs'
import { prepareAndParse } from './demo/calculator2'
import { formatAnswerExpression } from './demo/common'

import Helmet from 'react-helmet'
//import nearley from 'nearley'
//import grammar from './demo/grammar2'

// const moo = require('moo')
import { highlightLexer } from './demo/test_moo'
/*eslint no-use-before-define: ["error", { "variables": false }]*/




const B = true

function getTextNodeAtPosition(root, index) {
  //let lastNode = null;

  const treeWalker = document.createTreeWalker(
    root, NodeFilter.SHOW_TEXT, function next(elem) {
      if (index > elem.textContent.length) {
        index -= elem.textContent.length
        //lastNode = elem;
        return NodeFilter.FILTER_REJECT
      }
      return NodeFilter.FILTER_ACCEPT
    })
  const c = treeWalker.nextNode();
  return {
    node: c || root,
    position: c ? index: 0
  }
}

function saveCaretPosition(context) {
  const selection = window.getSelection()
  let range = selection.getRangeAt(0)
  range.setStart(context, 0)
  const len = range.toString().length

  return function restore() {
    const pos = getTextNodeAtPosition(context, len)
    selection.removeAllRanges()
    range = new Range()
    range.setStart(pos.node ,pos.position)
    selection.addRange(range)
  }
}

/* 
 * function reactReplace(s, oldStr, fun) {
 *   let l = s.split(oldStr);
 *   if (l.length > 1) {
 *     l = l.reduce( (o, v, i) => {
 *       o.push(v);
 *       if (i < l.length - 1) o.push(fun(v));
 *       return o
 *     }, [])
 *   }
 *   return l
 * }
 * */

class App extends React.Component {
  static _defaultState = {
    lastExpression: '',
    placeholderInput: true,
    expression: null, // succesful expression
    result: null,     // succesful result
    error: null,

    inputs: [], // input lines
    //parsedInputs: [], // parsed input lines
    expressions: [],
    results: [],   // calculated results of inputs

    e1: 'e1',
    e1HTML: '33 + 22',
    e2: '10 + 5',
    r1: 'r1',
    r1HTML: 'r1HTML',
    r2: '15'
  }

  constructor(props) {
    super(props)
    this.state = App._defaultState
    //this.parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart) //.feed(txt);
  }

  //state = App._defaultState

  formatResult0 = () => {
    let { result } = this.state
    if (result instanceof math.type.Unit) {
      //console.log('redult.toNumber:', result.clone().toNumber())
      //console.log('result:', result.clone())
      result = result.clone().toString()
    }
    return result
  }

  formatResult = (result) => {
    if (result instanceof math.type.Unit) {
      //console.log('redult.toNumber:', result.clone().toNumber())
      //console.log('result:', result.clone())
      result = result.clone().format({notation: 'fixed', precision: 10}) //.toString()
    }
    return result
  }

  expressionChanged = (event) => {
    if (B) return

    const lastExpression = event.target.value

    if (lastExpression === '') {
      this.setState(App._defaultState)
      return
    }

    let newState = { lastExpression }

    try {
      const parser = prepareAndParse(lastExpression, 'verbose')
      console.log('parser:', parser)
      newState = {...newState,
        expression: formatAnswerExpression(parser.lexer.buffer),
        result: parser && parser.results[0],
        error: null
      }
    } catch(e) {
      let error = `${e}`
      newState = {...newState, error}
    }

    this.setState( newState )
  }

  // componentWillUpdate(nextProps, nextState) {
  //   if (this.state.expression !== nextState.expression) {
  //     componentWillUpdate(nextProps, nextState) {
  //   }
  // }


  render0() {
    const { result, expression } = this.state
    return (
      <div className="App">

        <Helmet>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0 maximum-scale=1.0, user-scalable=0" />
          <title>Cripto Calc</title>
          <link rel="stylesheet" href="css/light.css" />
          {/*<link rel="stylesheet" href="dark.css">*/}
          <link rel="stylesheet" href="css/fonts.css" />
        </Helmet>

        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Calculator demo 2018-01-22_18:38</h1>
        </header>
        <p className="center">
          <input placeholder="2 + 2" onChange={this.expressionChanged} autoFocus
                 value={this.state.lastExpression} />
          <br />
          { result
            && [
              <span className="successful-expression">{ expression }</span>,
              <span> = { this.formatResult0() }</span>
            ]
          }
        </p>
        <p className="center error">{ this.state.error }</p>
        <pre>{info}</pre>
      </div>
    )
  }

  test = () => {
    const textHolder = document.getElementById('textHolder')

    const restore = saveCaretPosition(textHolder)
    let text = textHolder.textContent
    text = text.replace(/[0-9]+/g, '<span class="hl-number">$&</span>')
    text = text.replace(/EQ/g, `<br />\n=15`)
    textHolder.innerHTML = text

    restore()
  }

  onInput2 = (event) => {
    const expressionHolder = document.getElementById('expressionHolder')

    const restore = saveCaretPosition(document.getElementById('textHolder'))
    const text = expressionHolder.textContent


    console.log(text, this.renderEHTML(text))

    this.setState( {
      e1: text,
      e1HTML: this.renderEHTML(text),
      r1: '=10',
      r1HTML: this.renderRHTML(text),
    }, restore)

    /* text = text.replace(/[0-9]+/g, '<span class="hl-number">$&</span>')
     * text = text.replace(/EQ/g, `<br />\n=15`)
     * textHolder.innerHTML = text*/

    //restore()
  }

  renderEHTML(e) {
    //let html = e
    //html = html.replace(/[0-9]+/g, '<span class="hl-number">$&</span>')
    //return html
    return <div>{e}<span className="hl-number">+</span>22</div>
  }

  renderRHTML(e) {
    //let html = e
    //html = html.replace(/[0-9]+/g, '<span class="hl-number">$&</span>')
    //return html
    return <div>=<span className="hl-blue">r of: {e}</span></div>
  }

  renderE(e) {
    return this.state.e1HTML
  }

  renderR() {
    return <div contentEditable={false}>=<span>{this.state.e1HTML}</span></div>
  }

  onInput = () => {
    const textholder = document.getElementById('textholder')
    const inputs = textholder.innerText.split('\n')

    // const inputs = [...document.getElementById('inputList').getElementsByTagName('li')]
    //   .map(x => x.textContent)

    const results = []
    const expressions = []
    inputs.forEach(
      input => {
        try {
          console.log('p&p', input)
          const parser = prepareAndParse(input, 'verbose')
          expressions.push(formatAnswerExpression(parser.lexer.buffer))
          results.push(parser && parser.results[0])
        } catch(e) {
          console.log('Error:', e)
          //let error = `${e}`
          //newState = {...newState, error}
          expressions.push(null)
          results.push(null)  //`error: ${e}`
        }
      }
    )

    console.log('Inputs: ', inputs)
    console.log('Results: ', results)
    this.setState( {inputs, expressions, results, placeholderInput: false} )
  }

  componentDidUpdate(prevProps, prevState) {
    //console.log('updated. Inputs:', this.state.inputs)
    
  }

  componentDidMount() {
    // make here to surpress react warning (1)
    //if (B) document.getElementById('inputList').setAttribute('contenteditable', true)
  }


  renderHighlighted(exp) {
    /* return [
     *   <span className="orange-color">aaa</span>,
     *   'bbb',
     *   'ccc'
     * ]*/

    console.log('renderHighlighted', `"${exp}"`)

    highlightLexer.reset(exp)
    let r = []
    let item;

    try {
      while (true) {
        item = highlightLexer.next()
        if (!item) break;

        //if (!item) console.log('NOOOOOOOOOOOOO')
        console.log('-', item.value)
        //r.push(item.value)

        switch (item.type) {
            /* case 'WS':        NOTE: for HIGHLIGHT need just render space
             * case 'semicolon':
             *   break;*/
          case 'comment':
            r.push(<span className="grey-color">{item.value}</span>)
            break;
          case 'plus':
          case 'minus':
          case 'mul':
          case 'divide':
          case 'exp':
          case 'convert':
          case 'mod':
          case 'leftShift':
          case 'rightShift':
            r.push(<span className="orange-color">{item.value}</span>)
            break;
          case 'currency':
            r.push(<span className="blue-color">{item.value}</span>)
            break;
          case 'variable':
            r.push(<span className="violet-color">{item.value}</span>)
            break;
          default:
            r.push(<span>{item.value}</span>)
            //r.push(' ') // add breakable space between highlighted parts
        }
      }

      //return r
    } catch(e) {
      // in case of parsing error just return parsed text (TODO: process parsing error ONLY)
      console.log('Parsing error', e)
      //return r //exp
      r = exp  // don't highlight unparsed expression
    }

    console.log('returning:', r)
    return r

    /* let r;
     * //return exp.split('+'), <mark>+</mark>)
     * //return exp
     * r = reactReplace(exp, '+', v => (<span className="hl-plus">+</span>))
     * //exp = reactReplace(exp, '$', v => (<span className="blue-color">$</span>))



     * return r*/
  }

  render() {
    const { inputs, expressions, results } = this.state
    console.log('r:', inputs, expressions, results)
    return (
      <div>
        <Helmet>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0 maximum-scale=1.0, user-scalable=0" />
          <title>Cripto Calc</title>
          <link rel="stylesheet" href="css/light.css" />
          {/*<link rel="stylesheet" href="dark.css">*/}
            <link rel="stylesheet" href="css/fonts.css" />
        </Helmet>

        <header>
          <div className="container">
            <a className="logo light" href="#">
              <img src="img/logo-light.svg" alt="logo" />cryptocalc
            </a>
            <a className="logo dark" href="#">
              <img src="img/logo-dark.svg" alt="logo" />cryptocalc
            </a>
            <ul className="menu">
              <li><a href="#">Calculator</a></li>
              <li><a href="#">Docs</a></li>
            </ul>
          </div>
        </header>

        <section className="change">
          <div className="container">
            <div className="switch">
              <img src="img/light-icon.svg" alt="light" className="light" />
              <img src="img/sun.svg" alt="light" className="dark" />
              <div>
                <input type="checkbox" className="checkbox" id="checkbox" />
                <label for="checkbox"></label>
              </div>
              <img src="img/dark-icon.svg" alt="dark" className="change-img-light" />
              <img src="img/dark-icon-change.svg" alt="dark" className="change-img-dark" />
            </div>
            <div className="total"><span>Tolal:</span><span>€ 1,000,000,00</span></div>
            <div className="holder">
              <span className="plus-black"><img src="img/plus.svg" alt="plus" /></span>
              <span className="plus-white"><img src="img/plus-white.svg" alt="plus" /></span>
              <span className="open-search black"><img src="img/burger.svg" alt="burger" /></span>
              <span className="open-search white"><img src="img/burger-white.svg" alt="burger" /></span>
              <form className="search-form">
                <input type="text" value="text" />
                <ul>
                  <li>Summary</li>
                  <li>1 add 1 <span></span></li>
                  <li>Sample</li>
                </ul>
              </form>
            </div>
          </div>
        </section>

        <div className="container">
          <div className="autodraw">
            <div className="highlights">
              { inputs.map(inp => <div>{this.renderHighlighted(inp)}</div>) }
            </div>
            <div className="results" >
              { results.map( (r,i) => (r && [
                  <span className="parsedExpression">{ expressions[i] }</span>,
                  <div className="res">= {this.formatResult(r)}</div>,
                  <br /> ])) }
            </div>
          </div>
          <div id="textholder-keeper">
            { this.state.placeholderInput && <div className="textholder-placeholder">2+2</div> }
            <div id="textholder" contentEditable onInput={this.onInput}
                 onFocus={() => this.setState({placeholderInput: null})} >
            </div>
          </div>
        </div>

        <br />
        <hr />
        <pre>{info}</pre>
      </div>
    )
  }
  
}

const info = `
Implemented:
  - math calculations
  - unit calculations (including same-type mixed dimensions, scales)
  - implicit number-> unit conversion (Example: "1 + 2 USD" -> "3 USD")
  - currensy calculations (including mixed) (rates are just fixed for demo purpoces)
  - unit and money conversions (see examples below)
  - %-based expressions
  - math scales
  - money and units scales
  - multiline input

Not implemented yet:
  - refreshing currency rates
  - pixel-perfect markup
  - top menu
  - summarizes, average
  - variables, prev
  - expression and answer visual formatting



Expression examples:

123
3 + 2

1 + 2 * 3
1 + (2^3) - 2 * 3

11 mod 4
4 + 10 mod 4 * 2

2 ^ 3
(2 ^ 3)

2(3)
(2)3
(2)(3)
2(3)4

(2 + 3) *4

5(2 + 3)*4
5*(2 + 3)4
2*(3)*4

2*(3)
(2)*3
(2)*(3)

(2 + 3)*4
5*(2 + 3)*4

e
pi
pi + 1
1 + pi

(3)7
(1+7)3
8(3)
(3)(4)

3(5-2)4
(3-1) (8/4 + 1)
(3-1)(8/4 + 1)
3+ (7-4) 2
2 (3 + 4)
7 2
2 + 3 (2+4) / 2
1 + 3(5 + 4 - 6 / 3) / 2 * 4 - 3

3.139 * 1
pi (7 - 5) - pi
pi(7 - 5)pi/(pi*pi) - 2

2^3
2^3^2
(2^3)^2
2*3^2*3
2 * 3 ^ 2 * 3
2 * pi ^ 2 * 3
// exponent + braces
2^2(3)
(3)2^2
(2)pi^2(3)
4^-2



// word-described math expressions
3 + 2

1 and 2 multiplied by 3
(1 and 2) multiplied by 3
1 with 62 without 2 times 3
4 mul 2 + 3 ^ 2
18 divide by 2 multiplied by 2 ^ 2

// spaceless operations
18divided by2plus2


// bitwise shift
3 << 4
99 >> 4
3 << 4 << 2
3 << (4 << 2)
3 << 4 + 1 << 2
3 << 4 + 9 >> 2

// standard functions
sqrt(81)

sin(2 pi)
tan(3 pi)
ln(e^5)


// unary "+" and "-"
-5
-5+8
-5+8
-1 - -1
-sin(-pi/2)
-(-1)
-(-2 - -1)

//consts
pi + e

// floats
12.95 + 3.10

// units
10 cm
-10 cm

3 cm + 2 cm
3 km + 2m + 1  mm

3 km - 500 m

8m / 2
(5+3)km

4 kg  2
4 kg (1 - 0.5) + 100g


69 cm * 3 / 2 + 2km


3(4kg - 2000 gram / 2) /2

// negative units
-2 m - (-3m)


(3+5) 2 kg * 2

// mixed subunits
1 meter 20 cm
-1 meter 20 cm

1 meter 20 cm * 2
1 meter 20 cm + 2m 50 cm * 3

1 kg 300 gram / -2

1 m 70 cm + 1 ft

0.1km 11m 11 cm + 0.5 * 2 km 2 mm






//money
10 USD
10 usd

10 Euro
€ 10
Eur10
eUro10

// different writing forms
12.34 ₴
12.34₴
₴12.34
₴ 12.34
uAh12.34
uAh 12.34
12.34uAh
12.34 uAh
₴ 12.34 uaH
₴12.34uaH


2.5 $
$ 2.5
2.5 ₴
₴ 2.5
UAH 2.5


-10 USD

3 USD + 2 USD

$8 / 2
(5+3)$

-2.5 USD + $3.1 +(1/2)usd

4 UAH  2


// negative units
-2 UAH - (-3UAH)


(3+5) 2 Euro * 2

1 UAH * pi


// mixed currencies
1 USD + 1 TENDOLL
1 TENDOLL + 1 USD
1 UAH + 1 USD + 1 EUR
(1 USD)2 + 1 EUR
1 USD + 1 EUR


// rates checks
//console.log(rcd:
$1 CAD
$1 CAD + 1 EUR 

// % operations
//TODO


// Tests from Specification
8 times 9
1 meter 20 cm
6(3)
$30 CAD + 5 USD - 7EUR

// unit conversion
1 kg to gram
0.4 + 0.6 inch to cm
4.5 kg to gram
3(4km - 2000 m / 2) /200 to dm
1 yard into cm
'2 * 2 ft as mm
0 degC to K

// money conversion
1 USD to UAH
0.4 + 0.6 EUR in USD0.4 + 0.6 EUR in USD
110 USD into EUR

// percentage
$10 - 40%
20% of $10
5% on $30
6% off 40 EUR
$50 as a % of $100
$70 as a % on $20
$20 as a % off $70
5% of what is 6 EUR
5% on what is 6 EUR
5% off what is 6 EUR

5% of 500

4k
-1000 + 4.5k + 1000
1.5thousand
5M
6 billion
1k-4M

2k K
$2k
2M eur
2k mm + 2m
$2.2k in ZEUR
`

export default App;
