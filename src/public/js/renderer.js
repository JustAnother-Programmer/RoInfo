const groupAddButton = document.getElementById('groupAdd')
const searchButton = document.getElementById('lookupButton')

groupAddButton.addEventListener('click', () => {
    const div = document.getElementById('groupIds')
    const num = div.childElementCount
    const newInput = document.createElement('input')
    newInput.id = `groupId${num + 1}`
    newInput.type = 'number'

    div.appendChild(newInput)
})

searchButton.addEventListener('click', () => {
    const groupIds = document.getElementById('groupIds')
    var ids = []

    for (let i = 0; i < groupIds.childElementCount; i++) {
        var element = groupIds.children.item(i)

        ids.push(element.value)
    }

    window.api.sendToMain(ids)

    window.api.recieveFromMain((data, args) => {
        // TODO: Do stuff here based on the response
    })
})