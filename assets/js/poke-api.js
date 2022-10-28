const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) { // Convertendo o modelo do PokeApi para o nosso modelo
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name
    
    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon;    
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json()) // transformando a lista em uma nova lista de Promises dos detalhes dos pokemons(em json), ou seja, da nova requisição.
        .then((convertPokeApiDetailToPokemon))
}

pokeApi.getPokemons = (offset = 0, limit = 10) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    
    return fetch(url) // buscando lista de pokemons no servidor
        .then((response) => response.json()) // convertendo a lista para json
        .then((jsonBody) => jsonBody.results) // pegando a lista(os pokemons) do json
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail)) // Convertendo a lista de pokemons em uma lista de novas requisições de detalhes         
        .then((detailRequests) => Promise.all(detailRequests)) // esperando a lista ser resolvida
        .then((pokemonsDetails) => pokemonsDetails) // retornando a lista de detalhes dos pokemons PRONTA
}   

