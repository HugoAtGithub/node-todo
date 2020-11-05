#! /usr/bin/env node
const {program} = require('commander');
const pkg = require('./package.json')
const api = require('./index')
const logger = require('./logger')
// -v
program.version(pkg.version)
// 其他选项
program
  .option('-v, --verbose', 'output extra logs')
// 子命令
program
  .command('ls')
  .description('list all todo')
  .action(api.showAll)
program.command('add <task...>')
  .description('add a todo')
  .action((task) => {
    logger.debug(`add ${task}`)
    const sentence = task.join(' ')
    api.create(sentence).then(() => {
      console.log('添加成功')
    }, () => {
      console.log('添加失败')
    })
  })
program.command('clear')
  .description('clear all todos')
  .action(api.clear)

if (process.argv.length < 3) {
  // 直接执行 node cli.js 时，就 showAll
  void api.showAll()
} else {
  // 解析命令行参数
  program.parse(process.argv)
}
