import {User} from "./User";

const team = {
    id: Number,
    teamName: String,
    description: String,
    password: String,
    userId:Number,
    maxNum: Number,
    status: Number,
    expireTime: Date,
    createTime: Date,
    updateTime: Date,
    createUser:User,
    hasJoin:Boolean,
    hasJoinNum:Number,
}

export default team

export class Team {
}