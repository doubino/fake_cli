#!/usr/bin/env node
 // 声明一下是可以当脚本运行的node文件

// 引入命令插件
const program = require('commander');
// 从github下载的插件
const download = require('download-git-repo');
// 模版引擎
const handleBars = require('handlebars');
// 命令行交互
const inquirer = require('inquirer');
// 引用原生的fs模块
const fs = require('fs');
// loading美化效果
const ora = require('ora');
// 视觉优化  修改输出的文字颜色
const chalk = require('chalk');
// 添加图标 成功 失败 info 警告
const logSymbols = require('log-symbols');
// loading插件的实力对象
const spinner = ora('正在下载模板...');
// 模版的列表
const templateList = {
    "vue_common": {
        url: "git@github.com:doubino/vue_com_tem.git",
        desc: "基于vue cli3的通用模版",
        downLoadUrl: 'http://github.com:doubino/vue_com_tem#master'
    }
}
// 版本号
program.version('0.1.0');
// 创建项目模板
program
    .command('create <template> <project>')
    .description('创建项目')
    .action((templateName, projectName) => {
        spinner.start();
        const {
            downLoadUrl
        } = templateList[templateName];
        // 参数1 下载地址
        // 参数2 项目名称
        download(downLoadUrl, projectName, {
            clone: true
        }, (err) => {
            if (err) {
                // 失败效果
                spinner.fail(chalk.red(err));
            } else {
                // 成功效果
                spinner.succeed(chalk.green('初始化模板成功'));
                inquirer.prompt([{
                    type: 'input',
                    name: 'author',
                    message: '请输入作者名称'
                }]).then((answer) => {
                    // 文件的路径
                    const packagePath = `${projectName}/package.json`;
                    // 读取package文件
                    const packageStr = fs.readFileSync(packagePath,'utf8');
                    // 解析替换package文件预留的字段
                    const packageResult = handleBars.compile(packageStr)(answer);
                    // 充血package文件
                    fs.writeFileSync(packagePath, packageResult);
                })
            }
        })
    });
// 模板列表
program
    .command('list')
    .description('模板列表')
    .action(() => {
        for (const key in templateList) {
            if (templateList.hasOwnProperty(key)) {
                console.log(`${key} ${templateList[key].desc}`)
            }
        }
    });
// process.argv是原生获取的命令参数
program.parse(process.argv);