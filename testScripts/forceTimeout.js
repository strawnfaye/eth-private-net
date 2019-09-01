/**
 * Custom function to allow thread to wait for a given number
 * of milliseconds before executing the next line of code.
 * @param {*} milliseconds the amount of time for the process
 * to timeout, in milliseconds.
 */
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if (new Date().getTime() - start > milliseconds) {
      break;
    }
  }
}
