import Index from "../pages/Index.vue";
import Search from "../pages/Search/SearchPage.vue"
import UserEdit from "../pages/User/UserEditPage.vue";
import SearchResult from "../pages/Search/SearchResultPage.vue";
import UserLogin from "../pages/User/UserLoginPage.vue";
import TeamAddPage from "../pages/Team/TeamAddPage.vue";
import TeamUpdatePage from "../pages/Team/TeamUpdatePage.vue";
import myTeam from "../pages/Team/myTeam.vue";
import myJoinTeam from "../pages/Team/myJoinTeam.vue";
import FriendPage from "../pages/Friends/FriendPage.vue";
import ChatPage from "../components/ChatPage.vue";
import UserPageNew from "../pages/User/UserPageNew.vue";
import TeamPage from "../pages/Team/TeamPage.vue";
import showUserPage from "../pages/User/showUserPage.vue";
import TeamChatPage from "../pages/Chat/TeamChatPage.vue";


const routes = [
    {path: '/', component: Index},
    {path: '/team', title: '队伍列表', component: TeamPage},
    {path: '/team/add', title: '建立小队', component: TeamAddPage},
    {path: '/team/update', title: '修改小队信息', component: TeamUpdatePage},
    {path: '/team/myTeam', title: '我的小队', component: myTeam},
    {path: '/team/myJoinTeam', title: '我加入的小队', component: myJoinTeam},
    {path: '/user', title: '用户主页', component: UserPageNew},
    {path: '/search', title: '找伙伴', component: Search},
    {path: '/user/edit', title: '更新资料', component: UserEdit},
    {path: '/search/searchResult', title: '搜索伙伴结果', component: SearchResult},
    {path: '/user/login', title: '登录', component: UserLogin},
    {path: '/friend', title: '伙伴页面', component: FriendPage},
    {path: '/chat', title: '聊天页面', component: ChatPage},
    {path: '/showUser', title: '聊天页面', component: showUserPage},
    {path: '/teamChat', title: '队伍聊天界面', component: TeamChatPage,props:true},

]

export default routes