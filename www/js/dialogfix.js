function dialogFix(dialog) {
  function showModal() {
    dialog.setAttribute('open', 'open');
    let buttons = dialog.querySelectorAll('button');

    Array.from(buttons).forEach((button) => {
        button.addEventListener('click', function (event) {
        event.preventDefault();

        event.target.removeEventListener(event.type, arguments.callee);

        dialog.returnValue = button.value;

        if (dialog.onclose) {
          dialog.onclose({
            target: dialog
          });
        }

        dialog.style.display = 'none';
      })
    });
  }

  if ('showModal' in dialog) {
    // dialog.style.display = "block";        
  } else {
    Object.assign(dialog, {
      showModal
    });
  }

  return dialog;
}