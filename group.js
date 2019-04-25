const role = require('./role');

let group = {};
let code = null;
let mongodb = null;
let db = 'helena';

group.init = function (userDb, mongoServer, codeServer) {
  db = userDb;
  mongodb = mongoServer;
  code = codeServer;
};

group.crate = function (userid, groupType, label, toNodeCode) {
  return new Promise(resolve => {
    code.onReady('group_' + groupType)
      .then(() => {
        let res = code.addSubtree('group' + groupType, [label], toNodeCode, 0);
        group.userJoinOrUpdate(userid, groupType, res[0][0], role.administrator);
        resolve(res[0][0]);
      });
  });
};

group.modify = function (userid, groupType, nodeCode, label) {
  return new Promise(resolve => {
    group.userGroupAuth(userid, groupType, nodeCode)
      .then(auth => {
        if (auth <= role.admin) {
          code.onReady('group_' + groupType)
            .then(() => {
              code.modifyLabel('group' + groupType, nodeCode, label);
              resolve(true);
            });
        } else {
          resolve(false);
        }
      });
  });
};

group.moreInfoJson = function(userid, groupType, nodeCode, moreInfoJson){
  return new Promise(resolve => {
    group.userGroupAuth(userid, groupType, nodeCode)
      .then(auth => {
        if (auth <= role.admin) {
          code.onReady('group_' + groupType)
            .then(() => {
              code.modifyMoreInfoJson('group' + groupType, nodeCode, moreInfoJson);
              resolve(true);
            });
        } else {
          resolve(false);
        }
      });
  });
};

group.del = function (userid, groupType, nodeCode) {
  return new Promise(resolve => {
    group.userGroupAuth(userid, groupType, nodeCode)
      .then(auth => {
        if (auth <= role.admin) {
          code.onReady('group_' + groupType)
            .then(() => {
              code.changeSubtreeDisabledValue('group' + groupType, nodeCode, true);
              resolve(true);
            });
        } else {
          resolve(false);
        }
      });
  });
};

group.recover = function (userid, groupType, nodeCode) {
  return new Promise(resolve => {
    group.userGroupAuth(userid, groupType, nodeCode)
      .then(auth => {
        if (auth <= role.admin) {
          code.onReady('group_' + groupType)
            .then(() => {
              code.changeSubtreeDisabledValue('group' + groupType, nodeCode, false);
              resolve(true);
            });
        } else {
          resolve(false);
        }
      });
  });
};

group.move = function (userid, groupType, nodeCode, toNodeCode, way) {
  return new Promise(resolve => {
    group.userGroupAuth(userid, groupType, nodeCode)
      .then(auth => {
        if (auth <= role.admin) {
          code.onReady('group_' + groupType)
            .then(() => {
              code.moveSubtree('group' + groupType, nodeCode, toNodeCode, way);
              resolve(true);
            });
        } else {
          resolve(false);
        }
      });
  });
};

group.copy = function (userid, groupType, nodeCode, toNodeCode, way) {
  return new Promise(resolve => {
    group.userGroupAuth(userid, groupType, nodeCode)
      .then(auth => {
        if (auth <= role.admin) {
          code.onReady('group_' + groupType)
            .then(() => {
              code.copySubtree('group' + groupType, nodeCode, toNodeCode, way);
              resolve(true);
            });
        } else {
          resolve(false);
        }
      });
  });
};

group.userJoinOrUpdate = function (userid, groupType, nodeCode, role) {
  return new Promise((resolve, reject) => {
    mongodb.update(db, 'group_' + groupType, {userid, c: nodeCode}, {role})
      .then(() => {
        resolve(true);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

group.userLeft = function (userid, groupType, nodeCode) {
  //TODO 涉及到唯一一个管理员离开的问题
  return new Promise((resolve, reject) => {
    mongodb.del(db, 'group_' + groupType, {userid, c: nodeCode})
      .then(() => {
        resolve(true);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

group.groupsIncludeUser = function (userid, groupType) {
  return new Promise((resolve, reject) => {
    mongodb.read(db, 'group_' + groupType, {userid})
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

group.groupsIncludeUserIsSystemAdmin = function(userid, groupType) {
  return new Promise((resolve, reject) => {
    mongodb.read(db, 'group_' + groupType, {userid})
      .then((res) => {
        code.onReady('group_' + groupType)
          .then(() => {
            res.forEach(single => {
              single.c = code.code2codes('group_' + groupType, single.c);
            });
            res.sort((article1, article2) => {
              return code.sort('group_' + groupType, article1.c, article2.c);
            });
            let result = {label: userid.toString(), id: 0, fid: -1, disabled: false, children: []};
            let inIt = function(nodeCode, tree){
              let isIn = (tree.id === nodeCode);
              if(!isIn){
                for(let i = 0; i < tree.children.length; i++){
                  isIn = inIt(nodeCode, tree.children[i]);
                  if(isIn) break;
                }
              }
              return isIn;
            };
            res.forEach(single => {
              if(single.role <= role.systemAdmin){
                let nodeCode = single.c[single.c.length - 1];
                if(!inIt(nodeCode, result)){
                  result.children.push(code.getSubtree('group_' + groupType, nodeCode));
                }
              }
            });
            resolve(result);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

group.usersInGroup = function (userid, groupType, nodeCode) {
  return new Promise((resolve, reject) => {
    mongodb.read(db, 'group_' + groupType, {c: nodeCode})
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

group.userGroupAuth = function (userid, groupType, nodeCode) {
  return new Promise((resolve, reject) => {
    group.groupsIncludeUser(userid, groupType)
      .then(res => {
        let auth = 9999999999;
        code.onReady('group_' + groupType)
          .then(() => {
            let codes = code.code2codes('group_' + groupType, nodeCode);
            res.forEach(single => {
              if (codes.indexOf(single.c) > -1) {
                if (single.role < auth) auth = single.role;
              }
            });
            resolve(auth);
          });
      })
      .catch(err => {
        reject(err);
      });
  });
};

module.exports = group;
