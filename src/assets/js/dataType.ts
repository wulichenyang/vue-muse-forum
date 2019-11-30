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

export interface DateType {
  createdAt?: Date,
  updatedAt?: Date,
}

export interface UserBrief {
  // 用户id 唯一
  _id: string,
  // 用户昵称 唯一
  nickname: string,
  // 用户头像路径
  avatar: string,
}

export interface FansInfo extends UserBrief {
  // 用户简介
  brief: string,
}

export interface UserFansBrief {
  // 登录用户是否关注该用户
  ifFollow?: boolean,
  // 粉丝信息或被关注者信息
  user: FansInfo
}


export interface OtherUserDetail extends UserBrief {
  // 用户性别
  gender: Gender,
  // 用户简介
  brief: string,

  // 用户发帖数
  postCount: number,
  // 评论数
  commentCount: number,
  // 用户粉丝数
  fansCount: number,
  // 用户获赞数量
  likeCount: number,

  // 关注数
  followPeopleCount: number,
  followCategoryCount: number,
  followPostCount: number,

  // 收藏数
  collectPostCount: number,

  // 是否关注
  ifFollow?: boolean,

}

export interface UserDetail extends OtherUserDetail {
  // 用户手机账户
  phone?: string,
  // 用户邮箱账户
  email?: string,
  // 用户真实姓名
  realname: string,
  // 用户角色
  role: Role,
  // 用户出生日期
  birth: Date,

  // 关注的人
  followPeople?: string[],
  // 关注的文章类别ids
  followCategory?: string[],
  // 关注的文章ids
  followPost?: string[],

  // 收藏的文章ids
  collectPost?: string[],

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

export interface CategoryBrief {
  // 文章分类id 唯一
  _id: string,
  // 文章分类名
  name: string,
}

export interface CategoryDetail extends CategoryBrief, DateType {
  avatar: string,
  background: string,
  brief: string,
  description: string,
  followCount: number,
  postCount: number,
  sort: number,
}


export interface CategoryHeaderDetail {
  _id: string;
  name: string;
  brief: string;
  avatar: string;
  followCount: number;
  postCount: number;
  ifFollow?: boolean; 
}

export type PostState = 'published' | 'draft'
export type CommentState = PostState
export type ReplyState = PostState

export interface PostBrief extends DateType {
  _id: string,
  author: UserBrief, // populate 生成
  category: CategoryBrief, // populate 生成
  title: string,
  // 文章里第一张图片（或为空）
  firstPic: string | null,
  // 截取的部分内容
  content: string,
  viewCount: number,
  likeCount: number,
  commentCount: number,
  ifLike?: boolean,
}

export interface PostInfoInComment {
  _id: string,
  title: string,
}

// 服务端返回的postDetail，需要提取commentids处理
export interface PostDetailCommon extends PostBrief {
  content: string,
  followCount: number,
  state: PostState,
}

export interface PostRawDetail extends PostDetailCommon {
  // comment
  comment: Array<CommentRawDetail>, // populate 生成 在module/comment下索引
}

export interface PostDetail extends PostDetailCommon {
  // commentIds
  comment: string[], // populate 生成 在module/comment下索引
}

export interface CommentDetailCommon extends DateType {
  _id: string,
  postId: string | PostInfoInComment,
  author: UserBrief, // populate 生成
  content: string,
  likeCount: number,
  state: CommentState,
  ifLike?: boolean,
}

// 服务端返回的postDetail，需要提取commentids处理
export interface CommentRawDetail extends CommentDetailCommon {
  // replyIds
  reply: Array<ReplyDetail>, // populate 生成 在module/reply下索引
}

export interface CommentDetail extends CommentDetailCommon {
  // replyIds
  reply: string[], // populate 生成 在module/reply下索引
}

export interface ReplyDetail extends DateType {
  _id: string,
  commentId: string,
  from: UserBrief, // populate 生成
  to: UserBrief, // populate 生成
  content: string,
  likeCount: number,
  state: ReplyState,
  ifLike?: boolean,
}