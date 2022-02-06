class Assembler {
  constructor(){
    this.memAddress = 0;
    this.labels = {};
  }

  getMemAddress(){
    return this.memAddress;
  }
  setMemAddress(value){
    this.memAddress = value;
  }
  incrementMemAddress(byValue = 1){
    this.memAddress += byValue;
  }

  getLabel(key){
    return this.labels[key];
  }

  setLabel(key, value){
    this.labels[key] = value;
  }

  assemble(code) {
    this.setMemAddress(0);
    code = code.replace(":", "\n");
    let lines = code.split('\n').filter(line => line.trim()); //filter out empty lines
    let finalCode = ""

    lines.forEach(line => {
      line = line.split(/;|#/)[0];
      line = line.trim();
      if (line.length === 0) return;  // skip lines with only comments

      let [opCode, operand, data] = line.split(/, |,| |:/).map(line => {
        line = line.replace("(", "");
        line = line.replace(")", "");
        return line;
      });

      // LI R2, 0x09  egyszeru, 2*4 az operand
      // MOV R1, R2   == 66 ,mert 6/4 = 1  es 6 % 4 = 2 
      // op = LI
      // operand = R2
      // data = 0x09

      //console.log(Assembler.hex(InstructionMap[opCode], "end"), operand, data);
      //console.log(InstructionMap[opCode], operand, data);


      let firstChar = Assembler.hex(InstructionMap[opCode], "end");
      // this.incrementMemAddress();
      let restOfString = this.makeOperand(opCode, operand, data);
      //console.log(restOfString,"\n");

      if(operand === undefined && data === undefined) return;

      if (restOfString !== undefined && restOfString.length === 1) {  // one byte
        finalCode += firstChar[0] + restOfString + " ";
        this.incrementMemAddress();
      }
      else {
        if (restOfString !== undefined && firstChar !== undefined) {  // two bytes
          finalCode += firstChar[0] + restOfString[0] + restOfString.substring(restOfString.indexOf(" ")) + " ";
          this.incrementMemAddress(2);
        }
        else if (opCode === "JMP"){ // two bytes, JMP
            finalCode += firstChar[0] + "0 " + Assembler.hex(this.getLabel(operand)) + " ";
            this.incrementMemAddress(2);
        }
        else {  // two bytes, JNE, JEQ...
          finalCode += firstChar[0] + "0 " + Assembler.hex(this.getLabel(data)) + " ";
          this.incrementMemAddress(2);
        }
      }
      //console.log(restOfString," ",restOfString.substring(restOfString.indexOf(" ")));

    });

    return finalCode;

  }

  makeOperand(opCode, operand, data) {
    // this.incrementMemAddress();
    if(data!== undefined && data[0] == 'R'){
      return (((operand[1]) & 0b11) << 2 | ((((data[1]) & 0b11) << 0) & 0xff)).toString(16);
    }
    else{
      if(!isNaN(parseInt(data))){
          return (operand[1]*4).toString(16) +' '+ data.slice(-2);
      }
      else {
        // this.incrementMemAddress(-1);
        if (data === undefined )
          this.setLabel(opCode, this.getMemAddress());
        else
          this.setLabel(data, this.getMemAddress());
      }

    }

  }

  /**
   * Converts DEC to HEX
   * @param {Number} value Value to convert
   * @param {String} pad Text padding. Default "start"
   */
  static hex(value, pad = "start") {
    if (value !== undefined) return pad === "start" ? value.toString(16).padStart(2, '0') : value.toString(16).padEnd(2, '0');
  }
}

const InstructionMap = {
  "AND": 0x00,
  "OR": 0x01,
  "ADD": 0x02,
  "SUB": 0x03,
  "LW": 0x04,
  "SW": 0x05,
  "MOV": 0x06,
  "INP": 0x07,
  "JEQ": 0x08,
  "JNE": 0x09,
  "JGT": 0xa,
  "JLT": 0xb,
  "LW": 0xc,
  "SW": 0xd,
  "LI": 0xe,
  "JMP": 0xf,
}

//export { Assembler };


// function compile(testCode) {
//   return "Compiled: " + Assembler.assemble(testCode);
// }


//let testCode = 'LI R2, 0x09\nLI R3, 0x07\nADD R3, R2\n';
// let testCode = 'LI R2, 0x09\nLI R3, 0x07\nADD R3, R2\nend:JMP end';

const assembler = new Assembler();

// console.log(assembler.assemble(`JEQ R1, 0x69`));

//e0 01 e4 01 6d 68 29 61 66 6e f0 05 f0 0c

/*console.log(assembler.assemble(`
# Fib code
LI R0, 0x01   ; R0 = 1
LI R1, 0x01
MOV R3, R1

loop:
   MOV R2, R0
   ADD R2, R1
   MOV R0, R1
   MOV R1, R2
   MOV R3, R2
   JMP loop
end:
   JMP end
`));
*/
//e8 09 ec 07 2e f0 05
// console.log(assembler.assemble(`
// LI R2, 0x09
// LI R3, 0x07
// ADD R3, R2
// end:JMP end
// `));

/*
console.log(assembler.assemble(`
;   Loads 1...n in mem[0x20]...mem[0x2+n]

    LI R0, 0x08     ; n = 8
    LI R1, 0x01     ; tmp = 1
    LI R2, 0x20     ; mem_i
    LI R3, 0x01     ; i

main:
    
    SW R3, (R2)     ; mem[mem_i] = i
    ADD R2, R1      ; mem_i++
    ADD R3, R1      ; i++

    SUB R0, R1      ; n -= tmp
    JNE R0, main    ; if (n) main

end:
    JMP end
`));*/

function assembleCode(){
  let input =document.getElementById("asm-input").value;
  document.getElementById('asm-output').innerHTML = "v2.0 raw\n"+assembler.assemble(input);
}
