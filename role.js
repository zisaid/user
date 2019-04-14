module.exports = {
  administrator: 99, // 超级管理员，小于100
  systemAdmin: 199, // 系统管理员，小于200
  admin: 299, // 管理员，小于300
  systemUser: 0x400, //1024(10) 系统用户，可以是收费用户
  //00XX XXXX XXXX XXXX XXXX X1XX XXXX XXXX
  //共32位，有3位做为标志位，还有29位可以对应29个功能点权限
  registeredUser: 0x7fffffff
};
