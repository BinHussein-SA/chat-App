// create these function : 
// addUser, removieUser, getUser, getUserInRoom

const users = []

const addUser = ({ id, username, room})=>{
    // Clean the data: 
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    // Validate the data
    if(!username || !room){
        return {
            error : 'username and romm required'
        }
    }
    // Check for existing user
    const existingUser = users.find((user)=>{
        return user.username === username  && user.room === room 
    })
    // Validate username
    if(existingUser){
        return {
            error : 'user and room are requierd'
        }
    }
    // Store user
    const user = {id,username,room}
    users.push(user)
    return { user }   
}

// removeUser:
const removeUser = (id)=>{
    const index = users.findIndex((user)=>{
        return user.id === id 
        })
        if(index !== -1 ){
            return users.splice(index)[0] // users.splice return an array that include the removed item
        }
}

// getUser:
const getUser = (id)=>{
//using find() -- users.find return the find match  
    const existingUser = users.find((user)=>{
        return user.id === id
    }) 
    if(!existingUser){
        return {
            error : 'invalid user'
        }
    }
    return existingUser 
//using findIndex() -- users.findIndex return 0 or 1 if condition true , -1 if false
//     const index = users.findIndex((user)=>{
//         return id === user.id
//     })
//     if(index !== -1){
//         return users.splice(index)[0]
//     }
//     else {
//         return { error : 'no user with this id'}
//     }

 }

 // getUserInRoom :
const getUserInRoom = (room)=>{
    const currentUser = users.filter((user)=>{
        return user.room === room
    }) 
    if(!currentUser){
        return {error : 'no users in this room'}
    }
    return currentUser
}


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}






/// ------- TESTING : ------- \\\

// addUser test :
// addUSer({
//     id : 16,
//     username : 'zack',
//     room : 'jeddah'
// })
// addUSer({
//     id : 27,
//     username : 'moha',
//     room : 'jeddah'
// })
// addUSer({
//     id : 29,
//     username : 'Ali',
//     room : 'riyadh'
// })



//test addUSer
// console.log(users);

//test removeUser: 
// const removedUser = removeUser(16)
// console.log(removedUser);
// console.log(users);

//test getUser  :
// const user = getUser(16)
// console.log(user);

//test getUserInRoom : 
// const userInRoom = getUserInRoom('riyadh')
// console.log(userInRoom)
