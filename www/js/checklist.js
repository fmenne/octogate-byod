var CheckList = {};

(function (_cl) {
  const E_TASK_TYPE = {
    'OPTIONAL': 'OPTIONAL',
    'REQUIRED': 'REQUIRED',
    'OPTIONAL_HIDDEN': 'OPTIONAL_HIDDEN',
    'REQUIRED_HIDDEN': 'REQUIRED_HIDDEN'
  }

  var tasks = [];
  var running = false;

  function addTask (name, type, label, callback) {
    if (running) {
      return false;
    }

    tasks.push({
      name,
      type,
      label,
      _callback: callback
    });
  }

  function getTaskList (list) {
    //<ul class="checklist"></ul>
    if (!list) {
      list = document.createElement('ul');
      list.classList.add('checklist');
    }

    tasks = tasks.map(task => {
      //<li class="check-entry check-entry--active">
      var entry = document.createElement('li');
      entry.classList.add('check-entry');
      entry.classList.add('check-entry--waiting');

      var icon = document.createElement('i');
      icon.classList.add('fa');

      var label = document.createTextNode(` ${task.label}`);

      entry.appendChild(icon);
      entry.appendChild(label);

      if (task.type === E_TASK_TYPE.REQUIRED ||
        task.type === E_TASK_TYPE.OPTIONAL
      ) {
        list.appendChild(entry);
      }

      return Object.assign({}, task, { _node: entry });
    });

    return list;
  }

  function* getTask () {
    for (var i = 0; i < tasks.length; ++i) {
      let task = tasks[i];
      let currentNode = task._node;
      currentNode.classList.remove('check-entry--waiting');
      currentNode.classList.add('check-entry--active');

      let result = (yield task._callback);

      if (result === undefined) {
        result = { result: true, value: undefined };
      } else {
        result = { result: !!result.result, value: result.value };
      }

      tasks[i].result = result.result;
      tasks[i].resultValue = result.value;

      currentNode.classList.remove('check-entry--active');
      if (result.result) {
        currentNode.classList.add('check-entry--done-success');
      } else {
        currentNode.classList.add('check-entry--done-failed');

        if (task.type === E_TASK_TYPE.REQUIRED || task.type === E_TASK_TYPE.REQUIRED_HIDDEN) {
          break;
        }
      }
    }

    running = false;
  }

  function run () {
    running = true;

    var it = getTask();
    var cv = it.next();
    var resolver = null;

    var promise = new Promise((resolve) => {
      resolver = resolve;
    });

    function handleNext (result, value) {
      cv = it.next({ result, value });
      if (!cv.done) {
        cv.value(handleNext, getResults());
      } else {
        resolver(getResults());
      }
    }

    if (!cv.done) {
      cv.value(handleNext, getResults());
    }

    return promise;
  }

  function getResults () {
    var result = {};

    tasks.forEach(task => {
      let keys = Object.keys(task).filter(key => key.indexOf('_') !== 0);
      let taskInfo = {};
      keys.forEach(key => taskInfo[key] = task[key]);

      result[taskInfo.name] = taskInfo;
    });

    return result;
  }

  Object.assign(_cl, {
    addTask,
    getTaskList,
    getResults,
    run,
    E_TASK_TYPE
  });

})(CheckList);
