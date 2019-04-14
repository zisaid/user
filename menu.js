const group = require('./group');
const auth = require('./auth');
const role = require('./role');

// 往菜单树里加权限，往权限树里加用户
let groupType = '__menu__';
let menuUser = '__administrator__';
let menu = {};

menu.creat = function (label, toNodeCode) {
  return new Promise(resolve => {
    group.creat(menuUser, groupType, label, toNodeCode)
      .then(res => {
        resolve(res);
      });
  });
};

menu.modify = function (nodeCode, label) {
  return new Promise(resolve => {
    group.modify(menuUser, groupType, nodeCode, label)
      .then(res => {
        resolve(res);
      });
  });
};

menu.setRouter = function(nodeCode, router) {
  return new Promise(resolve => {
    group.moreInfoJson(menuUser, groupType, nodeCode, JSON.stringify({router}))
      .then(res => {
        resolve(res);
      });
  });
};

menu.del = function (nodeCode) {
  return new Promise(resolve => {
    group.del(menuUser, groupType, nodeCode)
      .then(res => {
        resolve(res);
      });
  });
};

menu.recover = function (nodeCode) {
  return new Promise(resolve => {
    group.recover(menuUser, groupType, nodeCode)
      .then(res => {
        resolve(res);
      });
  });
};

menu.move = function (nodeCode, toNodeCode, way) {
  return new Promise(resolve => {
    group.move(menuUser, groupType, nodeCode, toNodeCode, way)
      .then(res => {
        resolve(res);
      });
  });
};

menu.copy = function (nodeCode, toNodeCode, way) {
  return new Promise(resolve => {
    group.copy(menuUser, groupType, nodeCode, toNodeCode, way)
      .then(res => {
        resolve(res);
      });
  });
};

menu.getMenu = function (userid){
  return new Promise(resolve => {
    auth.authsIncludeUser(userid)
      .then(res => {
        let menus = [];
        res.forEach(single => {

          ([single.c, single.role]);
        });
      });
  });
};
module.exports = menu;
