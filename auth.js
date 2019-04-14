const group = require('./group');
// 往权限树里加用户，往菜单树里加权限
let groupType = '__auth__';
let auth = {};

auth.creat = function (userid, label, toNodeCode) {
  return new Promise(resolve => {
    group.creat(userid, groupType, label, toNodeCode)
      .then(res => {
        resolve(res);
      });
  });
};

auth.modify = function (userid, nodeCode, label) {
  return new Promise(resolve => {
    group.modify(userid, groupType, nodeCode, label)
      .then(res => {
        resolve(res);
      });
  });
};

auth.del = function (userid, nodeCode) {
  return new Promise(resolve => {
    group.del(userid, groupType, nodeCode)
      .then(res => {
        resolve(res);
      });
  });
};

auth.recover = function (userid, nodeCode) {
  return new Promise(resolve => {
    group.recover(userid, groupType, nodeCode)
      .then(res => {
        resolve(res);
      });
  });
};

auth.move = function (userid, nodeCode, toNodeCode, way) {
  return new Promise(resolve => {
    group.move(userid, groupType, nodeCode, toNodeCode, way)
      .then(res => {
        resolve(res);
      });
  });
};

auth.copy = function (userid, nodeCode, toNodeCode, way) {
  return new Promise(resolve => {
    group.copy(userid, groupType, nodeCode, toNodeCode, way)
      .then(res => {
        resolve(res);
      });
  });
};

auth.authsIncludeUser = function(userid){
  return new Promise(resolve => {
    group.groupsIncludeUser(userid, groupType)
      .then(res => {
        resolve(res);
      });
  });
};

module.exports = auth;
