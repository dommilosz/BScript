const boilerPlate =
    `
const print = (x)=>console.log(x??"");
const abs = Math.abs;
const bin = (x)=>"0b"+x.toString(2);
const hex = (x)=>"0x"+x.toString(16);
const oct = (x)=>"0o"+x.toString(8);
const chr = (x)=>String.fromCharCode(x);
const floor = Math.floor;
const round = Math.round;
const divmod = (x,y)=>[floor(x/y), x%y];
const input = prompt;
const len = (x)=>x.length;
const max = (arr)=>Math.max(...arr);
const min =  (arr)=>Math.min(...arr);
const sum = (arr) => arr.reduce((a,b)=>a+b);
const int = parseInt;
const reverse = (arr)=>arr.reverse();
const all = (arr)=>arr.every((el)=>!!el);
const any = (arr)=>arr.some((el)=>!!el);
    `.trim()+"\n\n"

function transpile(code, verbose) {
    code = code.replace(/\/\*(?:.|\s)*\*\/|\/\/.*|(?:"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|`(?:\\.|[^`])*?`)|(#)/g, function (match, group1, group2, group3) {
        if (group1 === undefined) {
            return match;
        }
        return "//";
    });
    code = code.replace(/(?:\/\*(?:.|\s)*\*\/|\/\/.*|"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|`(?:\\.|[^`])*?`)|(?:[0-9]*\.[0-9]*[e|E]\+[0-9]*)|(([0-9]+)([a-zA-Z][a-zA-Z0-9]*))/g, function (match, group1, group2, group3) {
        if (group1 === undefined) {
            return match;
        }
        return `(${group2}*${group3})`;
    });
    code = code.replace(/\/\*(?:.|\s)*\*\/|\/\/[^!].*|(?:"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|`(?:\\.|[^`])*?`)|\/\/!(.*)/g, function (match, group1, group2) {
        if (group1 === undefined) {
            return match;
        }
        return `;print("${group1.replaceAll(`"`,`\\"`)}");`;
    });
    if (!verbose) return code;
    if(verbose >= 1){
        code = `//BOILERPLATE\n${boilerPlate}\n//CODE_START\n${code}`
    }
    return code;
}
