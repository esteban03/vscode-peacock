//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';
import * as vscode from 'vscode';
import {
  extSuffix,
  Commands,
  Settings,
  ColorSettings,
  BuiltInColors
} from '../enums';
import {
  changeColorToVueGreenHandler,
  readConfiguration,
  readWorkspaceConfiguration
} from '../color-handlers';

interface ICommand {
  title: string;
  command: string;
  category: string;
}

interface IConfiguration {
  type: string;
  title: string;
  properties: any;
}

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as vscode from 'vscode';
// import * as myExtension from '../extension';

// Defines a Mocha test suite to group tests of similar kind together
suite('Extension Basic Tests', function() {
  let extension: vscode.Extension<any>;

  setup(function(done) {
    const ext = vscode.extensions.getExtension('johnpapa.vscode-peacock');
    if (!ext) {
      throw new Error('Extension was not found.');
    }
    if (ext) {
      extension = ext;
    }
    done();
  });

  test('Extension loads in VSCode and is active', function(done) {
    // Hopefully a 200ms timeout will allow the extension to activate within Windows
    // otherwise we get a false result.
    setTimeout(function() {
      assert.equal(extension.isActive, true);
      done();
    }, 200);
  });

  test('constants.Commands exist in package.json', function() {
    const commandCollection: ICommand[] =
      extension.packageJSON.contributes.commands;
    for (let command in Commands) {
      const result = commandCollection.some(
        c => c.command === Commands[command]
      );
      assert.ok(result);
    }
  });

  test('constants.Settings exist in package.json', function() {
    const config: IConfiguration =
      extension.packageJSON.contributes.configuration;
    const properties = Object.keys(config.properties);
    for (let setting in Settings) {
      const result = properties.some(
        property => property === `${extSuffix}.${Settings[setting]}`
      );
      assert.ok(result);
    }
  });

  test('package.json commands registered in extension', function(done) {
    const commandStrings: string[] = extension.packageJSON.contributes.commands.map(
      (c: ICommand) => c.command
    );

    vscode.commands.getCommands(true).then((allCommands: string[]) => {
      const commands: string[] = allCommands.filter(c =>
        c.startsWith(`${extSuffix}.`)
      );
      commands.forEach(command => {
        const result = commandStrings.some(c => c === command);
        assert.ok(result);
      });
      done();
    });
  });

  test('set to vue green works', function() {
    let config = vscode.workspace.getConfiguration('debug.console');
    // assert.ok(config.fontSize === 12);

    // changeColorToVueGreenHandler();
    let config2 = vscode.workspace.getConfiguration('workbench');
    let config3 = vscode.workspace.getConfiguration(
      'workbench.colorCustomizations'
    );
    let config4 = vscode.workspace.getConfiguration(
      'workbench.colorCustomizations.titleBar'
    );
    let config5 = vscode.workspace.getConfiguration(
      'workbench.colorCustomizations.titleBar.activeBackground'
    );
    let config6 = readWorkspaceConfiguration<string>(ColorSettings.titleBar_activeBackground);

    //colorCustomizations
    const v = config2.get('titleBar.activeBackground');
    assert.ok(v === '#f0000f');

    // const result = readWorkspaceConfiguration(
    //   ColorSettings.titleBar_activeBackground
    // );
    // assert.ok(result === BuiltInColors.Vue);
  });

  // // Defines a Mocha unit test
  // test('Something 1', function() {
  //   assert.equal(-1, [1, 2, 3].indexOf(5));
  //   assert.equal(-1, [1, 2, 3].indexOf(0));
  // });
});
