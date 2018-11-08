fetch('http://octo.octo:1983/index.pl?query=status')
  .then((r) => {
    test = await = r.json();
    alert(JSON.stringify(test));
  })
  .catch((e) => {
    alert(e);
  })