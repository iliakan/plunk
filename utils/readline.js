/**
 * DISCLAIMER: Had to implement custom TTY reading,
 * because both node-read and node-prompt had bugs on Windows-8.1
 * E.g. every input letter was double-printed
 * (and I really need starred * input for passwords)
 *
 */

function readLine(options, callback) {
  line = "";

  setup();

  //process.openStdin();
  process.stdout.write(options.query);

  function onReadable() {
    char = process.stdin.read();
    if (char == null) return;
    char = char + "";
    switch (char) {
      case "\n":
      case "\r":
      case "\u0004":
        process.stdout.write("\n");
        tearDown();
        callback(null, line);
        break;
      default:
        process.stdout.write(options.hidden ? '*' : char);
        line += char;
        break;
    }
  }

  function onClose() {
    console.log("CLOSE");
    tearDown();
    callback(new Error("End of input"));
  }

  function setup() {
    process.on('SIGINT', onClose);
    process.stdin.on("readable", onReadable);
    process.stdin.on("close", onClose);
    process.stdin.setRawMode(true);
  }

  function tearDown() {
    process.stdin.setRawMode(false);
    process.removeListener("SIGINT", onClose);
    process.stdin.removeListener("readable", onReadable);
    process.stdin.removeListener("close", onClose);
  }


}

readLine({ query: "password : ", hidden: true }, function(err, password) {
  console.log("Your password : " + password);
});