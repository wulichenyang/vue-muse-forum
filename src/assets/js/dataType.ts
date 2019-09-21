// User Detail
export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

export enum Gender {
  WOMAN = 0,
  MAN = 1,
  SECRET = 2,
}

export interface UserDetail {
  // 用户id 唯一
  _id: string,
  // 用户手机账户
  phone?: string,
  // 用户邮箱账户
  email?: string,
  // 用户昵称 唯一
  nickname: string,
  // 用户真实姓名
  realname: string,
  // 用户角色
  role: Role,
  // 用户性别
  gender: Gender,
  // 用户出生日期
  birth: Date,
  // 用户头像路径
  avatar: string,
  // 用户简介
  brief: string,
  // 用户发帖数
  postCount: number,
  // 用户粉丝数
  fansCount: number,
  // 用户获赞数量
  likeCount: number,

  // 关注的人
  followPeople?: string[],
  followPeopleCount: number,

  // 关注的文章类别ids
  followCategory?: string[],
  followCategoryCount: number,

  // 关注的文章ids
  followPost?: string[],
  followPostCount: number,

  // 收藏的文章ids
  collectPost?: string[],
  collectPostCount: number,

  // 最近一次查询Notice消息的日期
  lastFindNoticeAt?: Date,
  // 记录最早一条未读私信的日期
  unReadMessageAt?: Date,
  // 最近一次查询自己关注的feed的日期，用于有新的feed，与它比较是否有新的feed，显示小红点
  lastFindFeedAt?: Date,
  // 最近一次查询自己关注文章的日期
  lastFindFollowAt?: Date,

  // 创建日期
  createAt?: Date,
}

export enum SignType {
  SIGNUP = 'signup',
  SIGNIN = 'signin',
}

export interface CategoryDetail {
  _id: string,
  name: string,
  avatar: string,
  background: string,
  brief: string,
  description: string,
  followCount: number,
  postCount: number,
  sort: number,
  createdAt: Date,
  updatedAt: Date,
}