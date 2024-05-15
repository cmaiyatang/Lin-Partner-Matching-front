
const setArrayTags = async (userList)=>{
    if (userList) {
        userList.value.forEach(user =>{
            if(user.tags){
                user.tags = JSON.parse(user.tags)
            }
        })
    }
}
export default setArrayTags;
