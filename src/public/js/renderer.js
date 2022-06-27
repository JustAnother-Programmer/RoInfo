const groupAddButton = document.getElementById('groupAdd')
const groupRemoveButton = document.getElementById('groupRemove')
const searchButton = document.getElementById('lookupButton')

groupAddButton.addEventListener('click', () => {
    const div = document.getElementById('groupIds')
    const num = div.childElementCount
    const newInput = document.createElement('input')
    newInput.id = `groupId${num + 1}`
    newInput.type = 'number'

    div.appendChild(newInput)
})

groupRemoveButton.addEventListener('click', () => {
    const div = document.getElementById('groupIds')

    if (div.childElementCount === 1) return

    div.removeChild(div.lastChild)
})

searchButton.addEventListener('click', () => {
    const errorText = document.getElementById('errorText')
    const resultText = document.getElementById('resultText')
    errorText.innerText = ""
    resultText.innerText = ""

    const groupIds = document.getElementById('groupIds')
    const username = document.getElementById('username').value
    var ids = []

    if (username === "") {
        errorText.innerText = "A Username must be provided before conducting a search!"
        return
    }

    for (let i = 0; i < groupIds.childElementCount; i++) {
        var element = groupIds.children.item(i)

        if (element.value === "") continue

        ids.push(element.value)
    }

    var dataPacket = {
        username,
        ids
    }

    window.api.sendToMain(JSON.stringify(dataPacket))

    window.api.recieveFromMain((data, args) => {
        const resultText = document.getElementById('resultText')

        if (args.success === false) {
            resultText.innerText = args.error
            return
        }

        var data = args.data

        resultText.innerText = `Number of groups searched: ${data.numChecked}\nUser In: ${data.userIn}\nNot in: ${data.notInGroups}`

        console.log(data)
    })
})