"use strict";

export class Assembler {
  constructor() {
    this.memAddress = 0;
    this.labels = {};
  }

  getMemAddress() {
    return this.memAddress;
  }
  setMemAddress(value) {
    this.memAddress = value;
  }
  incrementMemAddress(byValue = 1) {
    this.memAddress += byValue;
  }

  getLabel(key) {
    return this.labels[key];
  }

  setLabel(key, value) {
    this.labels[key] = value;
  }

  assemble(code) {
    this.setMemAddress(0);
    code = code.replace(/:/g, "\n");
    let lines = code.split('\n').filter(line => line.trim()); //filter out empty lines
    let finalCode = "v2.0 raw\n";

    lines.forEach(line => {
      line = line.split(/;|#/)[0];
      line = line.trim();
      if (line.length === 0) return;  // skip lines with only comments

      let [opCode, operand, data] = line.split(/, |,| |:/).map(line => {
        line = line.replace("(", "");
        line = line.replace(")", "");
        return line;
      });

      let firstChar = Assembler.hex(InstructionMap[opCode], "end");
      // this.incrementMemAddress();
      let restOfString = this.makeOperand(opCode, operand, data);
      //console.log(restOfString,"\n");

      if (operand === undefined && data === undefined) return;

      if (restOfString !== undefined && restOfString.length === 1) {  // one byte
        finalCode += firstChar[0] + restOfString + " ";
        this.incrementMemAddress();
      }
      else {
        if (restOfString !== undefined && firstChar !== undefined) {  // two bytes
          finalCode += firstChar[0] + restOfString[0] + restOfString.substring(restOfString.indexOf(" ")) + " ";
          this.incrementMemAddress(2);
        }
        else if (opCode === "JMP") { // two bytes, JMP
          finalCode += firstChar[0] + "0 " + Assembler.hex(this.getLabel(operand)) + " ";
          this.incrementMemAddress(2);
        }
        else {  // two bytes, JNE, JEQ...
          finalCode += firstChar[0]+(operand[1]*4).toString(16)+ " " + Assembler.hex(this.getLabel(data)) + " ";
          // added the second bit to jump opcode for example jne - 9 and R3 - c ==> 9c
          this.incrementMemAddress(2);
        }
      }
      //console.log(restOfString," ",restOfString.substring(restOfString.indexOf(" ")));

    });

    return finalCode.slice(0,-1);   // remove last appended space
  }

  makeOperand(opCode, operand, data) {
    // this.incrementMemAddress();
    if (data !== undefined && data[0] == 'R') {
      return (((operand[1]) & 0b11) << 2 | ((((data[1]) & 0b11) << 0) & 0xff)).toString(16);
    }
    else {
      if (!isNaN(parseInt(data))) {
        return (operand[1] * 4).toString(16) + ' ' + data.slice(-2);
      }
      else {
        // this.incrementMemAddress(-1);
        if (data === undefined)
          this.setLabel(opCode, this.getMemAddress());
        else
          this.setLabel(opCode, this.getMemAddress());
          //at this section the label is the opcode not the data
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


