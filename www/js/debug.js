

window.addEventListener('error', (function (event) {
  let errors = [];

  return function (event) {
    var dbg = document.getElementById('error');
    if (!dbg) {
      dbg = document.createElement('pre');
      dbg.setAttribute('id', 'error');
      this.document.body.appendChild(dbg);
    }

    let { filename, lineno, colno, message } = event;

    errors.push(`${filename}:${lineno},${colno} ${message}`);

    dbg.innerText = errors.join(String.fromCharCode(10));
  }
})());
