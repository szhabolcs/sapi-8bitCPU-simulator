class Assembler {
    static assemble(code){
      let labels = [];
    //   let memoryOps = [];
    //   let memoryData = [];
    let asm = [];
    let asmIndex = 0;
  
      let lines = code.split('\n').filter(line => line.trim()); //filter out empty lines
      
      /*if(lines.length > 16) {
        throw `Error: Not enough memory for this code! (${lines.length} lines)`;
      }*/
  
      //find labels
      let finalCode=""

      lines.forEach((line, index) => {
        let [opCode, operand, data] = line.split(/, |,| |:/).map(line => {
            line.replace("(","");
            line.replace(")","");
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
        let restOfString = Assembler.makeOperand(opCode, operand, data);
        //console.log(restOfString,"\n");
       if(restOfString.length===1){
        finalCode =finalCode+" "+firstChar[0]+restOfString;
       }
       else{
        finalCode =finalCode+" "+firstChar[0]+restOfString[0]+restOfString.substring(restOfString.indexOf(" "));
       } 
        //console.log(restOfString," ",restOfString.substring(restOfString.indexOf(" ")));

      });
    
      return finalCode;
     
    }

    static makeOperand(opCode, operand, data){
        if(operand=='R0' && data=='R0'){
          return '0';
        }
        else if(operand=='R0' && data=='R1'){
          return '1';
        }
        else if(operand=='R0' && data=='R2'){
          return '2';
        }
        else if(operand=='R0' && data=='R3'){
          return '3';
        }
        else if(operand=='R1' && data=='R0'){
          return '4';
        }
        else if(operand=='R1' && data=='R1'){
          return '5';
        }
        else if(operand=='R1' && data=='R2'){
          return '6';
        }
        else if(operand=='R1' && data=='R3'){
          return '7';
        }
        else if(operand=='R2' && data=='R0'){
          return '8';
        }
        else if(operand=='R2' && data=='R1'){
          return '9';
        }
        else if(operand=='R2' && data=='R2'){
          return 'a';
        }
        else if(operand=='R2' && data=='R3'){
          return 'b';
        }
        else if(operand=='R3' && data=='R0'){
          return 'c';
        }
        else if(operand=='R3' && data=='R1'){
          return 'd';
        }
        else if(operand=='R3' && data=='R2'){
          return 'e';
        }
        else if(operand=='R3' && data=='R3'){
          return 'f';
        }
        else{
          if(operand=='R0'){
            return '0 '+data.slice(-2);
          }
          else if(operand == 'R1'){
            return'4 '+data.slice(-2);
          }
          else if(operand == 'R2'){
            return'8 '+data.slice(-2);
          }
          else if(operand == 'R3'){
            return'c '+data.slice(-2);
          }
          else{
            console.log(opCode,"\n",operand,"\n",data,"\n");
            return Assembler.hex(InstructionMap[operand], "start")+" "+Assembler.hex(Assembler.asmIndex, "start"); 
          }
        }
        asmIndex+=1;
    }






    /**
     * Converts DEC to HEX
     * @param {Number} value Value to convert
     * @param {String} pad Text padding. Default "start"
     */
    static hex(value, pad = "start") {
        if(value!==undefined)return pad === "start" ? value.toString(16).padStart(2, '0') : value.toString(16).padEnd(2, '0');
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


function compile(testCode) {
    return "Compiled: " + Assembler.assemble(testCode) ;
}


let testCode = 'LI R2, 0x09\nLI R3, 0x07\nADD R3, R2\n';
//let testCode = 'LI R2, 0x09\nLI R3, 0x07\nADD R3, R2\nend:JMP end';
//e8 09 ec 07 2e f0 05
console.log(compile(testCode));