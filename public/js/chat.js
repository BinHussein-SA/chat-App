const socket = io()

//Elements :
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//Templates :
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options : 
const { username, room } = Qs.parse(location.search , {ignoreQueryPrefix : true})


const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight
    const scrolltop = $messages.scrollTop // no need for this

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }

    // Just to see what each represent
    // console.log('$newMessage ' + $newMessage);
    // console.log('newMessageStyles ' + newMessageStyles);
    // console.log('newMessageMargin ' + newMessageMargin);
    // console.log('newMessageHeight ' + newMessageHeight);
    // console.log('visibleHeight ' + visibleHeight);
    // console.log('scrolltop ' + scrolltop);
    // console.log('containerHeight ' + containerHeight);
    // console.log('scrollOffset ' + scrollOffset);
}


socket.on('message', (msg) => {
    console.log(msg.text)
    const html = Mustache.render(messageTemplate, {
        message : msg.text,
        userName : msg.userName,
        createdAt : moment(msg.createdAt).format('h:mm a'),
        
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage',(msg)=>{
    console.log(msg);
    const html = Mustache.render(locationTemplate, {
        url : msg.url,
        userName : msg.userName,
        createdAt : moment(msg.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({room, users})=>{
    const html = Mustache.render(sidebarTemplate , {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e)=>{
    $messageFormButton.setAttribute('disabled', 'disabled')
    e.preventDefault()
    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (msgCallback)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        console.log('Message has delevire .. ' + msgCallback );
    })
})

$locationButton.addEventListener('click', ()=>{
    if (!navigator.geolocation){
        return alert('Your browser does not support geolocation')
    }
    $locationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        const lat  = position.coords.latitude
        const lon =  position.coords.longitude 

        socket.emit('sendLocation', {lat , lon }, ()=>{
            $locationButton.removeAttribute('disabled')
            console.log('Location shared');
        })
    })

})


socket.emit('join', {username, room}, (errorCallback)=>{
    if(errorCallback){
        alert(error)
        location.href = '/'
    }
})

// socket.on('countUpdated', (count)=>{
//     console.log('the count has been updated ' + count);
// })
// document.querySelector('#increment').addEventListener('click', ()=>{
//     console.log('Clicked');
//     socket.emit('increment')
// })
