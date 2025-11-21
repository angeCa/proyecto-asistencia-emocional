async function postUser_Group(nuevoUsuario) {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/user_group/',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoUsuario)
        })
        const usuarios = await response.json()
        return usuarios
    } catch (error) {
        console.error("Hay un error al obtener los grupos",error)
        throw error
    }
}

async function getUser_Group(nuevoUsuario) {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/user_group/',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoUsuario)
        })
        const usuarios = await response.json()
        return usuarios
    } catch (error) {
        console.error("Hay un error al obtener los grupos",error)
        throw error
    }
}
export default { postUser_Group, getUser_Group}