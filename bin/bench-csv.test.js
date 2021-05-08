const path = require("path");
const childProcess = require("child_process");

// const cli = require('./bench-csv')
const cliPath = path.resolve(__dirname, "./bench-csv.js");

const pathToTest = path.resolve(__dirname, "../examples/random.js");

const run = (cmd) => childProcess.execSync(cmd);

describe("cli", () => {
  it("can be invoked as a command", () => {
    const result = run(`node --expose-gc ${cliPath} ${pathToTest}`);
    expect(result).toBeTruthy();
  });
});
