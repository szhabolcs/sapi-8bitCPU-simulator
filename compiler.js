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

        console.log(Assembler.hex(InstructionMap[opCode], "end"), operand, data);
        let temp = Assembler.hex(InstructionMap[opCode], "end");
        let temp1 = Assembler.makeOperand(opCode, operand, data);
        temp[1] = temp1;

      });

      return;

      lines.forEach((line, lineNumber) => {
        const regex = /^([.A-Za-z0-9]*:)?\s*([A-Za-z]*)?\s*([.A-Za-z0-9]*)?\s?$/g;
        
    
        //sum errors idk how to fix bc js

        const [fullMatch, label, op, operand] = regex.exec(line);
  

        if(label) {
          const strippedLabel = label.toLowerCase().replace(':', '');
          labels.push({name: strippedLabel, lineNumber: lineNumber});
        }
      });
  
      //create opcodes
      lines.forEach((line, lineNumber) => {
        const regex = /^([.A-Za-z0-9]*:)?\s*([A-Za-z]*)?\s*([.A-Za-z0-9]*)?\s?$/g;
        const [fullMatch, label, op, operand] = regex.exec(line);
  
        if(op) {
          if(InstructionMap[op] || InstructionMap[op] === 0 || op.toLowerCase() === 'db') {
            memoryOps[lineNumber] = InstructionMap[op];
          } else {
            throw `Error: Unknown opcode: ${op} (line ${lineNumber + 1})`;
          }
        } else {
          throw `Error: No opcode (line ${lineNumber + 1})`;
        }
      });
  
      //create data and replace labels
      lines.forEach((line, lineNumber) => {
        const regex = /^([.A-Za-z0-9]*:)?\s*([A-Za-z]*)?\s*([.A-Za-z0-9]*)?\s?$/g;
        const [fullMatch, label, op, operand] = regex.exec(line);
  
        if(operand) {
          if(parseInt(operand) >= 0) {
            memoryData[lineNumber] = parseInt(operand);
          } else {
            const addressFromLabel = labels.filter(label => {
              return label.name === operand.toLowerCase();
            })[0];
  
            if(addressFromLabel) {
              memoryData[lineNumber] = addressFromLabel.lineNumber;
            } else {
              throw `Error: Unknown label: ${operand} (line ${lineNumber + 1})`
            }
          }
        }
      });
  
      let memory = [];
      //combine memory and data operands
      for(let i = 0; i < 16; i++) {
        if(memoryOps[i]) {
          memory[i] = memoryOps[i] << 4;
        } else {
          memory[i] = 0;
        }
        if(memoryData[i]) {
          memory[i] |= memoryData[i];
        }
      }
  
      return memory;
    }

    /**
     * Converts DEC to HEX
     * @param {Number} value Value to convert
     * @param {String} pad Text padding. Default "start"
     */
    static hex(value, pad = "start") {
        return pad === "start" ? value.toString(16).padStart(2, '0') : value.toString(16).padEnd(2, '0');
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


let testCode = 'LI R2, 0x09\nLI R3, 0x07\nADD R3, R2\nend:JMP end';
//e8 09 ec 07 2e f0 05
console.log(compile(testCode));