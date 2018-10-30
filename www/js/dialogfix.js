function dialogFix(dialog) {
  function showModal() {
    dialog.style.display = "block";

    let buttons = dialog.querySelectorAll('button');

    Array.from(buttons).forEach((button) => {
  //      console.log(button.value);
      button.addEventListener('click', function (event) {
        event.preventDefault();

        event.target.removeEventListener(event.type, arguments.callee);

        dialog.returnValue = button.value;

        if (dialog.onclose) {
          dialog.onclose({
            target: dialog
          });
        }
      })
    });
  }

  if ('showModal' in dialog) {
    dialog.style.display = "block";        
  } else {
    Object.assign(dialog, {
      showModal
    });
  }

  return dialog;
}