import myAxios from "../plugins/myAxios.ts";

const getCurrentUser = async () => {
    const res = await myAxios.get('/user/currentUser/')
    return res?.data
}

export default  getCurrentUser;