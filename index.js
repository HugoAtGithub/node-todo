const logger = require('./logger')
const db = require("./db.js");
const inquirer = require("inquirer");

module.exports._init = async () => {
  await db.read()
}

module.exports.showAll = async () => {
  const list = await db.read()
  await showAllAndInquire(list);
}
module.exports.create = async (title) => {
  logger.debug('create')
  const list = await db.read()
  logger.debug(JSON.stringify(list))
  list.push({title, done: false})
  logger.debug(JSON.stringify(list))
  return await db.write(list)
}

module.exports.clear = async () => {
  return await db.write([])
}

async function showAllAndInquire(list) {
  const choices = makeShowAllChoices(list);
  inquirer.prompt({
    type: 'list', name: 'index', message: '选择要操作的任务', choices
  }).then(answer => {
    const index = parseInt(answer.index)
    if (index >= 0) {
      askForAction(list, index);
    } else if (index === -2) {
      askForCreateTask(list)
    }
  })
}

function makeShowAllChoices(list) {
  return [{name: '退出', value: '-1'}].concat(
    list.map((item, index) => {
      return {
        name: `${doneMark(item)} ${index + 1} - ${item.title}`,
        value: index.toString()
      }
    }), {name: '+ 创建任务', value: '-2'});
}

function doneMark(todo) {
  return todo.done ? '[x]' : '[_]'
}

function askForAction(list, index) {
  const actions = {markAsDone, markUndone, updateTitle, remove, goBack}
  inquirer.prompt({
    type: 'list', name: 'action', message: '选择操作', choices: [
      {value: 'goBack', name: '返回'},
      {value: 'markAsDone', name: '已完成'},
      {value: 'markUndone', name: '未完成'},
      {value: 'updateTitle', name: '改标题'},
      {value: 'remove', name: '删除'},
    ]
  }).then(answer => {
    const action = actions[answer.action]
    action && action(list, index)
  })
}

async function markAsDone(list, index) {
  list[index].done = true
  await db.write(list)
}

async function markUndone(list, index) {
  list[index].done = false
  await db.write(list)
}

async function updateTitle(list, index) {
  inquirer.prompt({
    type: 'input',
    name: 'title',
    message: '新的标题',
    default: list[index].title
  }).then(answer => {
    list[index].title = answer.title
    db.write(list)
  })
}

async function remove(list, index) {
  list.splice(index, 1)
  await db.write(list)
}

async function goBack(list) {
  await showAllAndInquire(list)
}

async function askForCreateTask(list) {
  inquirer.prompt({
    type: 'input', name: 'title',
    message: '输入任务标题',
  }).then(answer => {
    list.push({
      title: answer.title,
      done: false
    })
    db.write(list)
  })
}